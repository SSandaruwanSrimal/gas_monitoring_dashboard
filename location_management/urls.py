from django.urls import path

from location_management.ajax_controller.ajax_controller import get_service_centers
from location_management.views import index

urlpatterns = [

    # feature urls
    path('index', index, name='manage_service_centers'),
    path('get-service-centers', get_service_centers, name='get_service_centers'),

]