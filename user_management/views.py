import json

from bson import ObjectId
from django.contrib import admin
from django.http import JsonResponse
from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.hashers import make_password
from django.contrib import messages
from django.urls import reverse
from django.core.exceptions import PermissionDenied

from location_management.models import City, District
from user_management.form import CustomersForm
from user_management.models import Customers


def index(request):
    if not request.user.has_perm('user_management.view_farmers'):
        raise PermissionDenied()

    breadcrumb = []
    context = {
        'available_apps': admin.site.get_app_list(request),
        'breadcrumbs': breadcrumb,
        'get_service_centers_url': reverse('get_service_centers'),
        'delete_farmer_url': reverse('delete_farmer'),
        'all_farmers': Customers.objects.all(),
        'all_districts': District.objects.all(),
    }

    return render(request, 'admin/all_users.html', context)


def create(request):
    if not request.user.has_perm('user_management.add_farmers'):
        raise PermissionDenied()

    breadcrumb = []
    user_form = None
    context = {
        'available_apps': admin.site.get_app_list(request),
        'breadcrumbs': breadcrumb,
        'get_service_centers_url': reverse('get_service_centers'),
        'all_districts': District.objects.all(),
        'user_form': user_form,
        'selected_district': '',
        'selected_center': ''
    }

    if request.method == 'POST':
        updated_post = request.POST.copy()
        user_form = CustomersForm(updated_post)
        if user_form.is_valid():
            instance = user_form.save(commit=True)
            instance.district_ref = District.objects.get(pk=ObjectId(request.POST.get('district')))
            instance.city_ref = City.objects.get(district_ref_id=ObjectId(request.POST.get('district')))
            instance.save()
            messages.success(request, 'Customers registered successfully!')
            return redirect(reverse('all_users'))
        else:
            context['user_form'] = user_form
            context['selected_district'] = ObjectId(request.POST.get('district'))
            context['selected_center'] = request.POST.get('center_name')
    return render(request, 'admin/add_users.html', context)


def edit(request, farmer_id):
    if not request.user.has_perm('user_management.add_farmers'):
        raise PermissionDenied()

    farmer_data = Customers.objects.get(pk=ObjectId(farmer_id))
    breadcrumb = []
    user_form = None
    context = {
        'available_apps': admin.site.get_app_list(request),
        'breadcrumbs': breadcrumb,
        'get_service_centers_url': reverse('get_service_centers'),
        'all_districts': District.objects.all(),
        'user_form': user_form,
        'selected_district': '',
        'selected_center': '',
        'farmer_data': farmer_data
    }

    if request.method == 'POST':
        updated_post = request.POST.copy()
        if request.POST.get('password') == '':
            updated_post['password'] = farmer_data.password
        else:
            updated_post['password'] = make_password(updated_post.get('password'))


        user_form = CustomersForm(updated_post, instance=farmer_data)
        if user_form.is_valid():
            instance = user_form.save(commit=True)
            instance.district_ref = District.objects.get(pk=ObjectId(request.POST.get('district')))
            instance.center_ref = City.objects.get(district_ref_id=ObjectId(request.POST.get('district')))
            instance.save()
            messages.success(request, 'Farmer registered successfully!')
            return redirect(reverse('all_users'))
        else:
            context['user_form'] = user_form
            context['selected_district'] = ObjectId(request.POST.get('district'))
            context['selected_center'] = request.POST.get('center_name')
    return render(request, 'admin/edit_users.html', context)


def delete(request):
    if request.user.has_perm('user_management.delete_farmers'):
        farmer = get_object_or_404(Customers, pk=ObjectId(json.loads(request.body).get('id')))
        farmer.delete()
        messages.success(request, 'Farmer removed successfully!')
        return JsonResponse({'success': True}, status=200)
    else:
        raise PermissionDenied()