from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('locations/', include('location_management.urls')),
    path('users/', include('user_management.urls')),
    path('dashboard/', include('gas_monitoring_core.urls')),
    path('summary/', include('usage_summary.urls')),
    path('', admin.site.urls),
]