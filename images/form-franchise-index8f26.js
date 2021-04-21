var App = App || {};

App.Franchise = (function ($) {

    function maskInputs() {

        $('#PhoneNumber').mask("(999) 999-9999");
    }

    function init() {

        maskInputs();
    }

    return {
        init: init
    };

})(jQuery);

$(function () {
    App.Franchise.init();
});