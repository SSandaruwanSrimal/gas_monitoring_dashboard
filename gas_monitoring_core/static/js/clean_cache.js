function loadServiceCenters(selectedDistrict) {
    $('#loader').show();
    $('#sidebar-overlay').show();
    var dataToSend = {
        selectedDistrict: selectedDistrict,
    };

    $.ajax({
        url: get_service_centers_url,
        headers: {
            'X-CSRFToken': csrf_token
        },
        type: 'POST',
        data: JSON.stringify(dataToSend),
        contentType: 'application/json',
        processData: false,
        success: function(response) {
            $('#loader').hide();
            $('#sidebar-overlay').hide();

        },

        error: function(xhr, status, error) {
            $('#loader').hide();
            $('#sidebar-overlay').hide();
        }
    });
}