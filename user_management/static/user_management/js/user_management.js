$(document).ready(function() {
    if(page_type !== 'all') {
        if(selected_district !== "") {
            loadServiceCenters(selected_district)
        }
    }


    if(page_type == 'edit') {
        loadServiceCenters($('#districtSelector').val());
    }

    if(page_type == 'all') {
        $('#allUsersTable').DataTable();
    }


    $('#districtSelector').change(function() {
        var selectedDistrict = $(this).val();
        loadServiceCenters(selectedDistrict);
    });

    $('#save_user').click(function (event) {
        event.preventDefault(); // Prevent the form from submitting initially
        var save_status = true; // Initialize save_status to true

        var districtSelected = $('#districtSelector').val();
        var serviceCenterSelected = $('#serviceCenterSelector').val();

        // Validate district selection
        if (districtSelected == "") {
            alert("Please select a district.");
            save_status = false;
        }

        // Validate service center selection
        if (serviceCenterSelected == "") {
            alert("Please select a service center.");
            save_status = false;
        }

        // Only add the status input if all validations pass
        if (save_status) {
            $('#createUserForm').submit(); // Submit the form if all validations pass
        }
    });


    var currentPk = '';
    $('.delete-item').click(function() {
		currentPk = $(this).data('pk');
	});

    $('#confirm_delete_button').click(function (event) {
        event.preventDefault();
        deleteFarmer(currentPk)

    });

    $('#password, #confirm_pw').on('keyup', function() {
        var password = $('#password').val();
        var confirmPassword = $('#confirm_pw').val();

        if (password !== confirmPassword) {
            $('#password-error').show();
        } else {
            $('#password-error').hide();
        }
    });
});

function deleteFarmer(farmerId) {
    $('#loader').show();
	$('#sidebar-overlay').show();

	$.ajax({
		url: delete_farmer_url,
		headers: {
			'X-CSRFToken': csrf_token
		},
		type: 'DELETE',
		data: JSON.stringify({
			'id': farmerId
		}),
		contentType: false,
		processData: false,
		success: function(response) {
			$('#deleteModal').modal('hide');
			location.reload();
			$('#loader').hide();
			$('#sidebar-overlay').hide();

		},
		error: function(xhr, errmsg, err) {
			$('#loader').hide();
			$('#sidebar-overlay').hide();
			console.log("Error:", xhr.status + ": " + xhr.responseText);
		}
	});
}

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
            var $serviceCenterSelect = $('#serviceCenterSelector');
            $serviceCenterSelect.empty();
            response.center_data.forEach(function(center) {
                var option = $('<option></option>')
                    .attr('value', center.city)
                    .text(center.city);

                if (center.name === selected_center) {
                    option.attr('selected', 'selected');
                }
                $serviceCenterSelect.append(option);
            });
        },

        error: function(xhr, status, error) {
            $('#loader').hide();
            $('#sidebar-overlay').hide();
        }
    });
}