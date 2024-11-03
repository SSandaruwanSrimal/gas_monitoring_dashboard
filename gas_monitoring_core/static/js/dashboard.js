$(document).ready(function(){
        // Make the AJAX call to get the customer count
        $('#loader').show();
        $('#sidebar-overlay').show();


        $.ajax({
            url: '/dashboard/customers/count/',  // The URL to call the view
            type: 'GET',
            headers: {
                'X-CSRFToken': getCSRFToken()
            },
            success: function(response) {
                let totalCount = response.count;

                // Get the current count (starting from 0)
                let currentCount = 0;

                // Increment the displayed count gradually
                let incrementSpeed = 50;  // Speed of increment (milliseconds)

                let incrementCounter = setInterval(function() {
                    // Increment the count and update the h3 text
                    if (currentCount < totalCount) {
                        currentCount++;
                        $('#userCount').text(currentCount);
                    } else {
                        // Clear the interval when done
                        clearInterval(incrementCounter);
                    }
                }, incrementSpeed);
            },
            error: function(xhr, status, error) {
                console.log("An error occurred: " + error);
            }
        });

        getCount();

        const defaultDistrictId = 'LKA2470';
            if (defaultDistrictId) {
                handleDistrictClick({ currentTarget: { getAttribute: () => defaultDistrictId } });
            }
});

function getCount() {
        $.ajax({
            url: '/dashboard/usage/count/',
            type: 'GET',
            headers: {
                'X-CSRFToken': getCSRFToken()
            },
            success: function(response) {
                 var low_capacity = response.low_capacity;
                 var high_capacity = response.high_capacity;

                 $('#10COUNT').text(low_capacity);
                 $('#100COUNT').text(high_capacity);
            },
            error: function(xhr, status, error) {
                console.log("An error occurred: " + error);
                $('#loader').hide();
                $('#sidebar-overlay').hide();

            }
        });
}


function handleDistrictClick(event) {
    $('#loader').show();
    $('#sidebar-overlay').show();
    const districtId = event.currentTarget.getAttribute('data-id');

    $.ajax({
        url: '/dashboard/usage/percentage/',
        headers: {
            'X-CSRFToken': getCSRFToken()
        },
        type: 'POST',
        data: JSON.stringify({ district_id: districtId }),
        success: function(response) {

            const result = response.results;
            const chartContainer = $('.chart-container'); // Assuming this is the container for your chart

            // Clear previous data
            chartContainer.empty();

            // Create legend
            chartContainer.append(`
                <div style="text-align: center; margin-bottom: 15px;"><h2 id="char-title" style="font-size: xx-large !important;">${response.title}</h2><a href="/summary/index" style="color: blue;">see more</a></div>
                <div class="legend">
                    <span class="first-pref">Low(Below to 10% Capacity)</span>
                    <span class="next-pref">High(100% Capacity)</span>
                </div>
            `);


            if (result.length === 0) {
            chartContainer.append('<div class="no-data-message" style="text-align: center; margin-top: 20px;">No data for this selected district.</div>');
            $('#loader').hide();
            $('#sidebar-overlay').hide();
            return; // Exit the function if there are no results
        }

            // Iterate over results to create bar charts
            result.forEach(item => {
                const cityName = item.city;
                const percentage10 = item.percentage_10_capacity;
                const percentage100 = item.percentage_100_capacity;

                // Calculate total width (assuming the total is 100%)
                const totalPercentage = percentage10 + percentage100;
                const width10 = (percentage10 / totalPercentage) * 100;
                const width100 = (percentage100 / totalPercentage) * 100;

                // Append bar chart for each city
                chartContainer.append(`
                    <div class="bar-chart-row">
                        <div class="label">${cityName}</div>
                        <div class="bar" style="width: ${totalPercentage}%;">
                            <div class="next-pref-bar" style="width: ${width100}%;"></div>
                            <span class="percentage"></span>
                        </div>
                    </div>
                `);
            });

            $('#loader').hide();
            $('#sidebar-overlay').hide();
        },
        error: function(xhr, status, error) {
            $('#loader').hide();
            $('#sidebar-overlay').hide();
            console.error('AJAX Error:', status, error);
        }
    });
}


function getCSRFToken() {
            let cookieValue = null;
            let cookies = document.cookie.split(';');
            for (let i = 0; i < cookies.length; i++) {
                let cookie = cookies[i].trim();
                if (cookie.startsWith('csrftoken=')) {
                    cookieValue = cookie.substring('csrftoken='.length);
                    break;
                }
            }
            return cookieValue;
}