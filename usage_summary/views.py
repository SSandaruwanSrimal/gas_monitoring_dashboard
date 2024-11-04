from django.contrib import admin
from django.shortcuts import render
from django.urls import reverse
from django.core.exceptions import PermissionDenied

from location_management.models import City, District, GasUsage
from user_management.models import Customers


def index(request):
    if not request.user.has_perm('user_management.view_farmers'):
        raise PermissionDenied()


    results = []

    all_usage = GasUsage.objects.all()

    for item in all_usage:
        cleaned_username = item.username.replace(" ","")
        district_ref = District.objects.get(pk=Customers.objects.get(username=cleaned_username).district_ref_id)

        results.append({

            'first_name': Customers.objects.get(username=cleaned_username).first_name,
            'last_name': Customers.objects.get(username=cleaned_username).last_name,
            'district': District.objects.get(pk=Customers.objects.get(username=cleaned_username).district_ref_id).district,
            'city': get_city_name(item, district_ref),
            'percentage': item.capacity,
        })


    breadcrumb = []
    context = {
        'available_apps': admin.site.get_app_list(request),
        'breadcrumbs': breadcrumb,
        'all_usage_data': results
    }

    return render(request, 'all_summary.html', context)



def get_city_name(item, district_ref):

    city_code = item.city_code
    district_ref_id = district_ref.pk

    cities_data = City.objects.filter(district_ref_id=district_ref_id).values('cites')
    city_name = ''
    for city_entry in cities_data:
        for city in city_entry['cites']:
            if city['code'] == city_code:
                city_name = city['city']

    return city_name


