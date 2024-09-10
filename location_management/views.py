from bson import ObjectId
from django.contrib import admin
from django.shortcuts import render, get_object_or_404, redirect

from django.contrib import messages
from django.urls import reverse
from django.core.exceptions import PermissionDenied

from location_management.form import ServiceCentersForm
from location_management.models import City, District


# Create your views here.

def index(request):
    if not request.user.has_perm('location_management.view_servicecenters'):
        raise PermissionDenied()

    breadcrumb = []
    context = {
        'available_apps': admin.site.get_app_list(request),
        'breadcrumbs': breadcrumb,
        'get_service_centers_url': reverse('get_service_centers'),
        'all_districts': District.objects.all()
    }

    if request.method == 'POST':

        try:
            exists_data = City.objects.get(district_ref=ObjectId(request.POST.get('district')))
            service_centers_form = ServiceCentersForm(request.POST, instance=exists_data)
            success_message = 'Service Centers updated successfully!'

        except City.DoesNotExist:
            service_centers_form = ServiceCentersForm(request.POST)
            success_message = 'Service Centers added successfully!'

        if service_centers_form.is_valid():
            instance = service_centers_form.save(commit=True)
            instance.district_ref = District.objects.get(pk=ObjectId(request.POST.get('district')))
            service_centers_form.save()
            messages.success(request, success_message)

    return render(request, 'location_management.html', context)



