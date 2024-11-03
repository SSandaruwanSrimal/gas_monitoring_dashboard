from django.urls import path

from gas_monitoring_core.ajax_controller.ajax_controller import get_customers_count, get_usage_percentage, \
    get_capacity_count

urlpatterns = [
    path('customers/count/', get_customers_count, name='customers_count'),
    path('usage/percentage/', get_usage_percentage, name='get_usage_percentage'),
    path('usage/count/', get_capacity_count, name='get_capacity_count'),
]
