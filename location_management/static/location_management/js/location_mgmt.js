$(document).ready(function() {
    addNewRow("serviceCenterTableBody", 'serviceCenterTable');
    $("#add-row-button").click(function() {
		addNewRow("serviceCenterTableBody", 'serviceCenterTable');
	});

	$("#serviceCenterTableBody").on("click", ".remove-feature", function() {
        $(this).closest("tr").remove();
    });

    $('#save_center').click(function (event) {
        event.preventDefault();
        if($('#districtSelector').val() == "") {
            alert("Please select a district.");
        } else {

            centerDataArray = createServiceCenterData();
            if (centerDataArray.length > 0) {
                $('<input>').attr({
                    type: 'hidden',
                    name: 'cites',
                    value: JSON.stringify(centerDataArray),
                }).appendTo($('#addServiceCenterForm'));

                var form = $('#addServiceCenterForm');
                form.submit();
            } else {
                alert("Please fill City data.");
            }
        }

    });


    $('#districtSelector').change(function() {
        var selectedDistrict = $(this).val();
        loadServiceCenters(selectedDistrict);
    });
});


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
            generateTable(response.center_data)

        },
        error: function(xhr, status, error) {
            $('#loader').hide();
            $('#sidebar-overlay').hide();
        }
    });
}

function addNewRow(tableBodyId, tableId) {
    var newRow = $("<tr>").addClass("draggable");
    var randomString = Math.random().toString(36).substring(2, 8).toUpperCase();

    newRow.append('<td><input type="text" value="' + randomString + '" class="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></td>');
    newRow.append('<td><input type="text" class="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"></td>');
    newRow.append('<td class="delete-icon-td"></td>');

    if ($("#" + tableBodyId + " tr").length > 0) {
        newRow.find('.delete-icon-td').append('<i class="fa-solid fa-trash-can cursor-pointer remove-feature"></i>');
    }


    $("#" + tableBodyId).append(newRow);
    $("#" + tableId).show();
    $('.feature-remove-btn').show();
}


function createServiceCenterData() {

	var dataArray = [];
	var uatEnvPackageFeatureTabledataArray = [];

    $('#serviceCenterTable tr').each(function() {
        var rowData = {};
        var code = $(this).find('td:eq(0) input[type="text"]').val();
        var city = $(this).find('td:eq(1) input[type="text"]').val();

        if (typeof code !== 'undefined' && code.trim() !== '' &&
            typeof city !== 'undefined' && city.trim() !== '') {
            rowData.code = code;
            rowData.city = city;
            dataArray.push(rowData);
        } else {
            dataArray = []
        }
    });

	return dataArray
}


function generateTable(dataArray) {
    $("#serviceCenterTableBody").empty(); // Clear existing rows

    if (dataArray.length === 0) {
        addNewRow("serviceCenterTableBody", 'serviceCenterTable');
    } else {
        dataArray.forEach(function(item) {
            var newRow = $("<tr>").addClass("draggable");

            newRow.append('<td><input type="text" class="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name="name" value="' + item.code + '"></td>');
            newRow.append('<td><input type="text" class="bg-white-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" name="contact" value="' + item.city + '"></td>');
            newRow.append('<td class="delete-icon-td"><i class="fa-solid fa-trash-can cursor-pointer remove-feature"></i></td>');

            $("#serviceCenterTableBody").append(newRow);
        });
    }
}