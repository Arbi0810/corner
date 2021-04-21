var App = App || {};

App.Donations = (function ($) {

    function maskInputs() {

        $('#PhoneNo').mask("(999) 999-9999");

        $('.mask-phone').mask("(999) 999-9999");

        $("#Zip").mask("99999?-9999");
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

            $('#NearestStore').val(currentStoreNameAddress[0] + " (" + currentStoreNameAddress[2] + " miles from event)");
            $('#NearestStoreNo').val(currentStoreNameAddress[1]);
        });

        $('#EventZip').keyup(function () {
            if ($(this).val() != '') {
                $('.geo-zip').prop('disabled', false);
            }
            else {
                $('.geo-zip').prop('disabled', true);
            }
        });

        $('.geo-zip').on('click', function (event) {
            event.preventDefault();

            var $zip = $(this).data('target');
            var address = $($zip).val();

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
                            nearestStoreList.html('<strong>' + partialView + '</strong>');
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

        maskInputs();

        initLocationPicker(); 

        initFileUpload();
    }

    return {
        init: init
    };

})(jQuery);

$(function () {
    App.Donations.init();
});

