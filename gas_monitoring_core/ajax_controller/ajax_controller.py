import json

from django.db.models import Sum
from django.http import JsonResponse

from location_management.models import GasUsage, District, City
from user_management.models import Customers


def get_customers_count(request):
    if request.method == 'GET':
        # Count the total number of customers
        customers_count = Customers.objects.count()

        # Return the count as a JSON response
        return JsonResponse({'count': customers_count}, status=200)

def get_usage_percentage(request):
    # Load the request body
    body = json.loads(request.body)
    district_id = body.get('district_id')

    # Get the district object and primary key
    district = District.objects.get(district_code=district_id)
    district_pk = district.pk

    # Get all customers in the district
    all_customers = Customers.objects.filter(district_ref_id=district_pk)

    # Retrieve cities associated with the district
    cities_data = City.objects.filter(district_ref_id=district.pk).values('cites')

    # Prepare results
    results = []

    # Count the total number of customers
    total_customers = all_customers.count()

    for city_entry in cities_data:
        for city in city_entry['cites']:
            city_code = city['code']
            city_name = city['city']

            gas_usage_count = GasUsage.objects.filter(city_code=city_code)

            count_10_capacity = gas_usage_count.filter(capacity=10).count()
            count_100_capacity = gas_usage_count.filter(capacity=100).count()

            percentage_10_capacity = (count_10_capacity / total_customers * 100) if total_customers > 0 else 0
            percentage_100_capacity = (count_100_capacity / total_customers * 100) if total_customers > 0 else 0

            # Append the results as a dictionary
            results.append({
                'city': city_name,
                'percentage_10_capacity': round(percentage_10_capacity, 2),
                'percentage_100_capacity': round(percentage_100_capacity, 2),
            })

    # Return the results as an array of dictionaries
    return JsonResponse({
        'results': results,
        'title': f'Gas Usage Percentage in {district.district}',
    })



def get_capacity_count(request):
    gas_usage_count = GasUsage.objects.all()

    count_10_capacity = gas_usage_count.filter(capacity=10).count()
    count_100_capacity = gas_usage_count.filter(capacity=100).count()

    return JsonResponse({
        'low_capacity': count_10_capacity,
        'high_capacity': count_100_capacity,
    })

