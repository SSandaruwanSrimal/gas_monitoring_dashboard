from djongo import models
from django.utils import timezone

from location_management.models import District, City


class Customers(models.Model):
    _id = models.ObjectIdField(primary_key=True, db_column='_id')
    username = models.CharField(max_length=50, null=True, blank=True)
    first_name = models.CharField(max_length=50, null=True, blank=True)
    last_name = models.CharField(max_length=50, null=True, blank=True)
    address = models.CharField(max_length=100, null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    district_ref = models.ForeignKey(District, null=True, blank=True, on_delete=models.CASCADE)
    city_ref = models.ForeignKey(City, null=True, blank=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now, editable=False, null=True, blank=True)
    updated_at = models.DateTimeField(default=timezone.now, editable=True, null=True, blank=True)

    def __str__(self):
        return self.first_name

    class Meta:
        db_table = 'customers'