from django.urls import path

from usage_summary.views import index

urlpatterns = [

    path('index', index, name='all_summary'),

]