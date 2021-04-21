var App = App || {};

App.Feedback = (function ($) {

    function maskInputs() {

        $('#PhoneNo').mask("(999) 999-9999");

        $("#Zip").mask("99999?-9999");
    }
    
    function is_uiwebview(){
        var result = /(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/i.test(navigator.userAgent);
        return result;
        //return navigator.userAgent.toLowerCase().match(/\(ip.*applewebkit(?!.*(version|crios)).*mobile(\/[a-z0-9]+)?$/)
    }


    function removeElementsIfFramed() {
        var isWebView = is_uiwebview();
        console.log(isWebView);
        if (isWebView) {
            var elements = document.getElementsByClassName("remove-if-framed");
            for(var i=0; i < elements.length; i++) {
                elements[i].remove();
            }
        }
    } 

    function initLocationPicker() {

        $('button.feedback-btn').on('click', function (event) {

            var locationInputHasValue = $("#location-zip").val().length > 0;
            var storeInputHasValue = $("#NearestStore").val().length > 0;

            if (locationInputHasValue && !storeInputHasValue) {
                $('#selectedStore').html('<span style="color:#934019">Please click <b>Go </b>button to select your closest location</span>');
                event.preventDefault();
            }
        });

        $("#IsRewardsInquery").click(function () {

            var attachmentFeedback = $("#attachmentFeedback");

            if ($("#IsRewardsInquery").is(':checked'))
                attachmentFeedback.slideDown("fast");
            else {
                attachmentFeedback.slideUp("fast");
            }
        });

        $("#IsLocationInquery").click(function () {

            var locationFeedback = $("#locationFeedback");

            if ($("#IsLocationInquery").is(':checked'))
                locationFeedback.slideDown("fast");
            else {
                locationFeedback.slideUp("fast");
                $('#location-zip').val('');
                $('#myStore').html('');
            }
        });

        $('.modal').on("click", ".btnMystore", function () {
            
            var currentStoreNameAddress = $(this).val().split(',');
            $('.modal').modal('hide');
            $('#selectedStore').text("Selected location is : " + currentStoreNameAddress[0]);
            $('#NearestStore').val(currentStoreNameAddress[0]);
            $('#NearestStoreNo').val(currentStoreNameAddress[1]);
        });

        $('#location-zip').keypress(function (e) {  
            if (e.which == 13) {
                $('#goZip').trigger("click");
            }
        });
 
        $('#goZip').on('click', function (event) {
            event.preventDefault();

            var address = $("#location-zip").val();

            var geocoder = new google.maps.Geocoder();

            geocoder.geocode({ 'address': address }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var result;

                    if (results[0].types[0] === 'administrative_area_level_1') {
                        result = { state: results[0].address_components[0].short_name };
                    } else {
                        var geocoords = results[0].geometry.location;
                        result = { lat: geocoords.lat(), lng: geocoords.lng() };
                    }

                    var nearestStoreList = $("#NearStoresInfo");
                    nearestStoreList.html('');

                    $('.modal').modal('show');

                    $.ajax({
                        type: "GET",
                        url: '/api/Location/near',
                        data: result,
                        success: function (partialView) {
                            nearestStoreList.html(partialView);
                        },
                        error: function (jqXHR, error, errorThrown) {
                            if (jqXHR.status && jqXHR.status == 400) {
                                alert(jqXHR.responseText);
                            }
                        }
                    });
                }
            });

        });
    }

    function initFileUpload() {
        $(document).on('change', ':file', function () {
            var input = $(this),
                numFiles = input.get(0).files ? input.get(0).files.length : 1,
                label = input.val().replace(/\\/g, 'index.html').replace(/.*\//, '');
            $("#file-name").html(label);
        });
    }

    function init() {

        removeElementsIfFramed();

        maskInputs();

        initLocationPicker(); 

        initFileUpload();
    }

    return {
        init: init
    };

})(jQuery);

$(function () {
    App.Feedback.init();
});

