var App = App || {};

App.ScrollToTop = (function ($) {

    var setupScrollToTop = function () {
        $('.scroll-to-top').click(function (event) {
            $('html, body').animate({
                scrollTop: 0 
            }, 500);
            return true;
        });
    };

    function init() {
        setupScrollToTop();
    }

    return {
        init: init
    };

})(jQuery);

$(function () {
    App.ScrollToTop.init();
});
