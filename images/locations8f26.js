var App = App || {};

App.location = App.location || {};
App.location.search = {};

App.location.search.browserApi = function () {

    function geocode(success, error) {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {

                var coordinates = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                success(coordinates);

            },
            error,
            { maximumAge: 600000, timeout: 5000, enableHighAccuracy: true });
        }
    }

    return {
        geocode: geocode
    };
}();

App.location.search.googleApi = function () {

    function geocode(address, geoSuccess, stateSuccess, err) {

        var stateList = ["al", "ak", "az", "ar", "ca", "co", "ct", "de", "fl", "ga", "hi", "id",
            "il", "in", "ia", "ks", "ky", "la", "me", "md", "ma", "mi", "mn", "ms", "mo", "mt",
            "ne", "nv", "nh", "nj", "nm", "ny", "nc", "nd", "oh", "ok", "or", "pa", "ri", "sc", "sd",
            "tn", "tx", "ut", "vt", "va", "wa", "wv", "wi", "wy", "dc"];

        var query = address.toLowerCase();

        if (stateList.indexOf(query) !== -1) {
            stateSuccess(query);
            return;
        }
        else {
            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({ 'address': address }, function (results, status) {

                if (status == google.maps.GeocoderStatus.OK) {
                    var result = results[0].geometry.location;
                    geoSuccess({ lat: result.lat(), lng: result.lng() });
                } else {
                    err();
                }
            });
        }
    }

    return {
        geocode: geocode
    };
}();

App.location.search.controller = function () {

    var resultsUrl = ((typeof App.rootUrl == 'undefined') ? '' : App.rootUrl);


    function onGeoSuccess(coordinates) {

        resultsUrl += "locations/nearby?lat={lat}&lng={lng}&geocode=true";

        window.location.href = resultsUrl
            .replace("{lat}", coordinates.lat)
            .replace("{lng}", coordinates.lng);
    }

    function onStateSuccess(state) {

        resultsUrl += "locations/state/{state}";

        window.location.href = resultsUrl
            .replace("{state}", state);
    }

    function onGeoError(err) {
        console.log("error");
    }

    function navigateToNearbyLocation(address, onGeoSuccess, onGeoError) {

        // if no input, navigate user to locations page
        if (address === "")
            window.location.assign("/locations");            
        else 
            App.location.search.googleApi.geocode(address, onGeoSuccess, onStateSuccess, onGeoError);
    }

    function init() {

        $('.geo-locate-me').on('click', function (e) {

            e.preventDefault();

            App.location.search.browserApi.geocode(onGeoSuccess, onGeoError);

            return false;
        });

        $('a.locations-all-state').on('click', function (e) {

            var bookmark = $(this).attr("data-bookmark");

            $('body, html').animate({
                'scrollTop': $("div[data-bookmark='" + bookmark + "']:visible:first").offset().top - 110 // Header is 95px thus we must offset
            }, 2000);
        });

        $('.locations-search-button').on('click', function (e) {

            e.preventDefault();

            var address = $("input.location-finder-input:visible:first").val();

            navigateToNearbyLocation(address, onGeoSuccess, onGeoError);
        });

        $('.locations-find-button').on('click', function (e) {

            e.preventDefault();

            var address = $("#address").val();

            navigateToNearbyLocation(address, onGeoSuccess, onGeoError);
        });

        $('input.location-finder-input').keypress(function (e) {

            if (e.which == 13) {
                var address = $(this).val();
                navigateToNearbyLocation(address, onGeoSuccess, onGeoError);
            }
        });

        $('input.location-finder-input').keyup(function (e) {

            var freeSweetSlider = $(".free-sweet-slider");

            if ($(this).val() === "poweredby") {

                freeSweetSlider.addClass("poweredby");
                freeSweetSlider.children().hide();
            } else if (freeSweetSlider.hasClass("poweredby")) {

                freeSweetSlider.removeClass("poweredby");
                freeSweetSlider.children().show();
            }
            
            if ($(this).val() === "goober" && window.location.pathname === "/franchise") {

                freeSweetSlider.addClass("goober");
                freeSweetSlider.children().hide();
            } else if (freeSweetSlider.hasClass("goober")) {

                freeSweetSlider.removeClass("goober");
                freeSweetSlider.children().show();
            }

            if ($(this).val() === "swirl") {
                App.swirl.init();
            } else {
                App.swirl.destroy();
            }


            if ($(this).val() === "confetti") {
                
            } else {

            }

        });

        $('.locations-search-button-form').on('click', function (e) {

            e.preventDefault();

            var address = $('#address').val();

            // if no input, navigate user to locations page
            if (address === "")
                window.location.assign("/locations");
            else
                App.location.search.googleApi.geocode(address, onGeoSuccess, onStateSuccess, onGeoError);

            return false;
        });

        $('#search-form').on('submit', function (e) {

            e.preventDefault();

            var address = $('#address').val();

            // if no input, navigate user to locations page
            if (address === "")
                window.location.assign("/locations");
            else
                App.location.search.googleApi.geocode(address, onGeoSuccess, onStateSuccess, onGeoError); 

            return false;
        });

        $('.top').on('click', function (e) {

            e.preventDefault();

            $('body, html').animate({
                'scrollTop': 0
            }, 500);

            return false;
        });
    }

    return {
        init: init
    };
}();

App.LocationMap = (function ($) {

    var _image;
    var _latitude;
    var _longitude;
    var _name;
    var _address;
    var _city;
    var _slug;
    var _map;
    var _infowindow;
    var _icon;
    var _zoom;

    function init(img, lat, lng, name, address, city, slug, zoom) {

        _image = img;
        _latitude = lat;
        _longitude = lng;
        _name = name;
        _address = address;
        _city = city;
        _slug = slug;
        _zoom = zoom;

        google.maps.event.addDomListener(window, 'load', initializeMap);
    }

    function initializeMap() {

        var latlng = new google.maps.LatLng(_latitude, _longitude);

        if (_zoom == null) _zoom = 16;

        var options = {
            zoom: _zoom,
            center: latlng,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
            //disableDefaultUI: true,
            //draggable: false,
            //zoomControl: false,
            scrollwheel: false,
            //disableDoubleClickZoom: true
        };

        jQuery('.map-canvas').each(function (index, $map) {

            _map = new google.maps.Map($map, options);

            _infowindow = new google.maps.InfoWindow();

            _icon = {
                url: _image,
                scaledSize: new google.maps.Size(30, 44), // scaled size
                origin: new google.maps.Point(0, 0), // origin
                anchor: new google.maps.Point(15, 44) // anchor
            };

            var marker = new google.maps.Marker({
                position: latlng,
                map: _map,
                //label: { text: 'A123' },
                icon: _icon
            });

            google.maps.event.addListener(marker, 'click', function () {
                _infowindow.setContent('<div><strong>' +
                    _name + '</strong><br>' +
                    _address + '<br>' +
                    _city + '<br>' +
                    (_slug != null ? '<a target="_self" href="' + _slug + '">More Details</a> </div>' : '') +
                    '<a target="_blank" href="http://maps.google.com/?q=' + _latitude + ',' + _longitude + '">Get Directions</a> </div>');
                _infowindow.open(_map, this);
            });

            var center;

            function calculateCenter() {
                center = _map.getCenter();
            }

            google.maps.event.addDomListener(_map, 'idle', function () {
                calculateCenter();
            });

            google.maps.event.addDomListener(window, 'resize', function () {
                _map.setCenter(center);
            });
        });
    };

    function addMarker(latitude, longitude, name, address, city, slug) {

        google.maps.event.addDomListener(window, 'load', function () {
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(latitude, longitude),
                icon: _icon
            });

            google.maps.event.addListener(marker, 'click', function () {
                _infowindow.setContent('<div><strong>' +
                    name + '</strong><br>' +
                    address + '<br>' +
                    city + '<br>' +
                    '<a target="_self" href="' + slug + '">More Details</a> </div>' +
                    '<a target="_blank" href="http://maps.google.com/?q=' + latitude + ',' + longitude + '">Get Directions</a> </div>');
                _infowindow.open(_map, this);
            });
        
            marker.setMap(_map);
        });
    }

    return {
        init: init,
        addMarker: addMarker
    };
})();

if ($("#canvas").length > 0) {
    !function(){function t(){var t=0,n=0;M=[],x=!1;for(var e=0;s>e;e++){n>=10&&(n=0,++t>=I.length&&(t=0)),n++;var o=I[t];M.push({x:Math.random()*h,y:Math.random()*w-w,r:i(10,30),d:Math.random()*s+10,color:o,tilt:Math.floor(10*Math.random())-10,tiltAngleIncremental:.07*Math.random()+.05,tiltAngle:0})}r()}function n(t){return m.beginPath(),m.lineWidth=t.r/2,m.strokeStyle=t.color,m.moveTo(t.x+t.tilt+t.r/4,t.y),m.lineTo(t.x+t.tilt,t.y+t.tilt+t.r/4),m.stroke()}function e(){m.clearRect(0,0,h,w);for(var t=[],e=0;s>e;e++)!function(e){t.push(n(M[e]))}(e);return o(),t}function i(t,n){return Math.floor(Math.random()*(n-t+1)+t)}function o(){var t=0;A+=.01,y+=.1;for(var n=0;s>n;n++){if(x)return;var e=M[n];e.tiltAngle+=e.tiltAngleIncremental,!v&&e.y<-15?e.y=w+100:e.y+=(Math.cos(A+e.d)+3+e.r/2)/2,e.x+=Math.sin(A),e.tilt=15*Math.sin(e.tiltAngle-n/3),e.y<=w&&t++,(e.x>h+20||e.x<-20||e.y>w)&&v&&(n%5>0||n%2==0?M[n]={x:Math.random()*h,y:-10,r:e.r,d:e.d,color:e.color,tilt:Math.floor(10*Math.random())-10,tiltAngle:e.tiltAngle,tiltAngleIncremental:e.tiltAngleIncremental}:Math.sin(A)>0?M[n]={x:-5,y:Math.random()*w,r:e.r,d:e.d,color:e.color,tilt:Math.floor(10*Math.random())-10,tiltAngleIncremental:e.tiltAngleIncremental}:M[n]={x:h+5,y:Math.random()*w,r:e.r,d:e.d,color:e.color,tilt:Math.floor(10*Math.random())-10,tiltAngleIncremental:e.tiltAngleIncremental})}0===t&&d()}function r(){h=window.innerWidth,w=window.innerHeight,u.width=h,u.height=w,function t(){return x?null:(g=requestAnimFrame(t),e())}()}function l(){clearTimeout(f),clearTimeout(g)}function a(){v=!1,l()}function d(){x=!0,void 0!=m&&m.clearRect(0,0,h,w)}function c(){l(),d(),f=setTimeout(function(){v=!0,x=!1,t()},100)}var u,m,h,w,f,g,s=150,M=[],A=0,y=0,v=!0,x=!0,I=["DodgerBlue","OliveDrab","Gold","pink","SlateBlue","lightblue","Violet","PaleGreen","SteelBlue","SandyBrown","Chocolate","Crimson"];$(window).resize(function(){u=document.getElementById("canvas"),h=window.innerWidth,w=window.innerHeight,u.width=h,u.height=w}),$(document).ready(function(){$("input.location-finder-input").keyup(function(t){"confetti"===$(this).val()?c():a()}),u=document.getElementById("canvas"),m=u.getContext("2d"),h=window.innerWidth,w=window.innerHeight,u.width=h,u.height=w}),window.requestAnimFrame=function(){return window.requestAnimationFrame||window.webkitRequestAnimationFrame||window.mozRequestAnimationFrame||window.oRequestAnimationFrame||window.msRequestAnimationFrame||function(t){return window.setTimeout(t,1e3/60)}}()}();
    App.swirl=function(){function t(){u=[];for(var t=0;v>t;t++){var i={position:{x:x,y:M},shift:{x:x,y:M},size:1,angle:0,speed:.01+.04*Math.random(),targetSize:1,fillColor:"#"+(4210752*Math.random()+11184810|0).toString(16),orbit:.5*w+.5*w*Math.random()};u.push(i)}}function e(t){x=t.clientX-.5*(window.innerWidth-p),M=t.clientY-.5*(window.innerHeight-f)}function n(t){z=!0}function o(t){z=!1}function s(t){1==t.touches.length&&(t.preventDefault(),x=t.touches[0].pageX-.5*(window.innerWidth-p),M=t.touches[0].pageY-.5*(window.innerHeight-f))}function a(t){1==t.touches.length&&(t.preventDefault(),x=t.touches[0].pageX-.5*(window.innerWidth-p),M=t.touches[0].pageY-.5*(window.innerHeight-f))}function r(){p=window.innerWidth,f=window.innerHeight,h.width=p,h.height=f,h.style.position="absolute",h.style.left=.5*(window.innerWidth-p)+"px",h.style.top=.5*(window.innerHeight-f)+"px"}function d(){for(z?g+=.02*(m-g):g-=.02*(g-y),g=Math.min(g,m),i=0,len=u.length;i<len;i++){var t=u[i],e={x:t.position.x,y:t.position.y};t.angle+=t.speed,t.shift.x+=(x-t.shift.x)*t.speed,t.shift.y+=(M-t.shift.y)*t.speed,t.position.x=t.shift.x+Math.cos(i+t.angle)*(t.orbit*g),t.position.y=t.shift.y+Math.sin(i+t.angle)*(t.orbit*g),t.position.x=Math.max(Math.min(t.position.x,p),0),t.position.y=Math.max(Math.min(t.position.y,f),0),t.size+=.05*(t.targetSize-t.size),Math.round(t.size)==Math.round(t.targetSize)&&(t.targetSize=1+7*Math.random()),l.beginPath(),l.fillStyle=t.fillColor,l.strokeStyle=t.fillColor,l.lineWidth=t.size,l.moveTo(e.x,e.y),l.lineTo(t.position.x,t.position.y),l.stroke(),l.arc(t.position.x,t.position.y,t.size/2,0,2*Math.PI,!0),l.fill()}}var h,l,u,c,p=900,f=600,w=110,g=1,y=1,m=1.5,v=25,x=window.innerWidth-p,M=window.innerHeight-f,z=!1;return{init:function(){(h=document.getElementById("canvas"))&&h.getContext&&(l=h.getContext("2d"),document.addEventListener("mousemove",e,!1),document.addEventListener("mousedown",n,!1),document.addEventListener("mouseup",o,!1),h.addEventListener("touchstart",s,!1),h.addEventListener("touchmove",a,!1),window.addEventListener("resize",r,!1),t(),r(),c=setInterval(d,1e3/60))},destroy:function(){u=[],clearInterval(p),"undefined"!=typeof l&&l.clearRect(0,0,l.canvas.width,l.canvas.height)}}}();
}	