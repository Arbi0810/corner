var App = App || {};

App.global = function () {
    function init() {

        // Free Sweet Animations
        var timer;

        // Keyboard Events
        $(".free-sweet-slider a").focus(function (event) {

            $(".free-sweet-slider").addClass("free-sweet-slider-up");
        });

        $(".free-sweet-slider a").blur(function (event) {

            initTimer();
        });

        // Mobile Touch Event
        $(".get-free-sweet").on("touchstart", function (event) {

            event.preventDefault();

            if ($(".free-sweet-slider").hasClass("free-sweet-slider-up"))
                $(".free-sweet-slider").removeClass("free-sweet-slider-up");
            else
                $(".free-sweet-slider").addClass("free-sweet-slider-up");
        });

        $(".get-free-sweet").mouseenter(function () {

            clearTimeout(timer);
            $(".free-sweet-slider").addClass("free-sweet-slider-up");
        });

        $(".free-sweet-slider").mouseenter(function () {

            clearTimeout(timer);
        });

        $(".get-free-sweet, .free-sweet-slider").mouseleave(function () {

            initTimer();
        });

        window.onscroll = function () {

            $(".free-sweet-slider").removeClass("free-sweet-slider-up");
        };

        function initTimer() {

            timer = setTimeout(function () {
                $(".free-sweet-slider").removeClass("free-sweet-slider-up");
            }, 500);
        }

        // Remove cafe cookie
        document.cookie = "index-2.html";

        $(document).on('invalid-form.validate', 'form', function () {
            var button = $(this).find('button[type="submit"]');
            setTimeout(function () {
                button.removeAttr('disabled');
            }, 1);
        });
        $(document).on('submit', 'form', function () {
            var button = $(this).find('button[type="submit"]');
            setTimeout(function () {
                button.attr('disabled', 'disabled');
            }, 0);
        });
    }
    return {
        init: init
    };
}();

