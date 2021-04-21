var App = App || {};

App.Menus = (function ($) {

    var setupSlideBar = function () {
        //stick in the fixed 100% height behind the navbar but don't wrap it
        $('#slide-nav.navbar-inverse').after($('<div class="inverse" id="navbar-height-col"></div>'));

        $('#slide-nav.navbar-default').after($('<div id="navbar-height-col"></div>'));

        // Enter your ids or classes
        var toggler = '.navbar-toggle';
        var pagewrapper = '#page-content';
        var navigationwrapper = '.navbar-header';
        var menuwidth = '100%'; // the menu inside the slide menu itself
        var slidewidth = '80%';
        var menuneg = '-100%';
        var slideneg = '-80%';


        $("#slide-nav").on("click", toggler, function (e) {

            var selected = $(this).hasClass('slide-active');

            $('#slidemenu').stop().animate({
                right: selected ? menuneg : '0px'
            });

            $('#navbar-height-col').stop().animate({
                right: selected ? slideneg : '0px'
            });

            $(pagewrapper).stop().animate({
                right: selected ? '0px' : slidewidth
            });

            $(navigationwrapper).stop().animate({
                right: selected ? '0px' : slidewidth
            });

            $(this).toggleClass('slide-active', !selected);
            $('#slidemenu').toggleClass('slide-active');

            $('#page-content, .navbar, body, .navbar-header').toggleClass('slide-active');
        });

        var selected = '#slidemenu, #page-content, body, .navbar, .navbar-header';

        $(window).on("resize", function () {

            if ($(window).width() >= 768 && $('.navbar-toggle').is(':hidden')) {
                $(selected).removeClass('slide-active');
            }
        });
    };

    function init() {
        setupSlideBar();
    }

    return {
        init: init
    };

})(jQuery);

$(function () {
    App.Menus.init();
});



