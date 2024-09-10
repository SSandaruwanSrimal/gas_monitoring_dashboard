from django.urls import path

from location_management.ajax_controller.ajax_controller import get_service_centers
from user_management.views import index, create, delete, edit

urlpatterns = [

    # feature urls
    path('index', index, name='all_users'),
    path('create', create, name='create_user'),
    path('edit/<slug:farmer_id>/', edit, name='edit_user'),
    path('get-service-centers', get_service_centers, name='get_service_centers'),
    path('delete-farmer', delete, name='delete_farmer'),

]