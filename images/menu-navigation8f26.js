var App = App || {};

App.MenuNavigation = (function ($) {


    function init() {
        $(".image-link").on("click", function () {
            $('#imagepreview').attr('src', $(this).attr('data-image')); // here asign the image to the modal when the user click the enlarge link
            $('#imagemodal').modal('show'); // imagemodal is the id attribute assigned to the bootstrap modal, then i use the show function
        });

        $("#modal-close-button").on("click", function () {
            $('#imagemodal').modal('hide'); // imagemodal is the id attribute assigned to the bootstrap modal, then i use the show function
            $('#imagepreview').attr('src', "");
        });

        var sections = $('section');

        $('#menu-navigation li').click(function () {
            $('#menu-navigation li').removeClass('selected');
            $(this).addClass('selected');
        });

        if (location.hash != "") {
            $(location.hash).show(); //Show tab content
            $('#menu-navigation > li:has(a[href="' + location.hash + '"])').click(); //LINE CHANGED
        } else {
            $("#menu-navigation > li:first").click(); //LINE CHANGED
        }

        $(window).on('scroll', function () {
            var cur_pos = $(this).scrollTop();

            sections.each(function () {
                var top = $(this).offset().top - 137,
                    bottom = top + $(this).outerHeight();

                if (cur_pos >= top && cur_pos <= bottom) {
                    $('#menu-navigation').find('li').removeClass('selected');
                    sections.removeClass('selected');

                    $(this).addClass('selected');

                    $('#menu-navigation').find('a[href="#' + $(this).attr('id') + '"]').parent().addClass('selected');
                }
            });
        });

        $('#menu-navigation').find('a').on('click', function () {
            var $el = $(this)
              , id = $el.attr('href');

            if (history.pushState) {
                history.pushState(null, null, id);
            }
            else {
                location.hash = id;
            }

            $('html, body').animate({
                scrollTop: $(id).offset().top - 107
            }, 500);

            return false;
        });
    }

    return {
        init: init
    };

})(jQuery);

$(function () {
    App.MenuNavigation.init();
});



