$(document).ready(function() {

    var is_active = false;
	var currentPk = '';
	var currentLocation = '';
	$('.delete-item').click(function() {
	    currentLocation = $(this).data('location');
		currentPk = $(this).data('pk');
		var status = 'Delete';
		var roleStatus = $(this).data('status');
		if(roleStatus == 'True') {
		    is_active = false;
		} else {
		    is_active = true;
		}
		$('#deleteModal').find('#target-action').text(status);
	});

	$('#confirm_delete_button').on('click', function() {
		deleteItem(currentPk, is_active, currentLocation);
	});
});

function deleteItem(currentPk, is_active, currentLocation) {

    var dataUrl = '';
    if(currentLocation == 'role') {
        dataUrl = $('#deleteRole').data('fetch-url');
    } else if(currentLocation == 'client') {
        dataUrl = $('#deleteClient').data('fetch-url');
    } else if(currentLocation == 'endpoint') {
        dataUrl = $('#deleteEndpoint').data('fetch-url');
    } else if(currentLocation == 'package') {
        dataUrl = $('#deletePackage').data('fetch-url');
    } else if(currentLocation == 'feature') {
        dataUrl = $('#deleteFeature').data('fetch-url');
    } else if(currentLocation == 'featureType') {
        dataUrl = $('#deleteFeatureType').data('fetch-url');
    } else if(currentLocation == 'profile') {
        dataUrl = $('#deleteProfile').data('fetch-url');
    }

    $('#loader').show();
	$('#sidebar-overlay').show();

	$.ajax({
		url: dataUrl,
		headers: {
			'X-CSRFToken': getCookie('csrftoken')
		},
		type: 'DELETE',
		data: JSON.stringify({
			'id': currentPk,
			'status': is_active
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

function getCookie(name) {
	let cookieValue = null;
	if (document.cookie && document.cookie !== '') {
		const cookies = document.cookie.split(';');
		for (let i = 0; i < cookies.length; i++) {
			const cookie = cookies[i].trim();
			if (cookie.startsWith(name + '=')) {
				cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
				break;
			}
		}
	}
	return cookieValue;
}