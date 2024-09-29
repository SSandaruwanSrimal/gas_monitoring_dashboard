from djongo import models
from django.utils import timezone


class District(models.Model):
    _id = models.ObjectIdField(primary_key=True, db_column='_id')
    district = models.CharField(max_length=50, unique=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False, null=True, blank=True)
    updated_at = models.DateTimeField(default=timezone.now, editable=True, null=True, blank=True)

    def __str__(self):
        return self.district

    class Meta:
        db_table = 'districts'


class City(models.Model):
    _id = models.ObjectIdField(primary_key=True, db_column='_id')
    district_ref = models.ForeignKey(District,null=True,blank=True,on_delete=models.CASCADE)
    cites = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(default=timezone.now, editable=False, null=True, blank=True)
    updated_at = models.DateTimeField(default=timezone.now, editable=True, null=True, blank=True)

    def __str__(self):
        return self.district_ref

    class Meta:
        db_table = 'city'


class GasUsage(models.Model):
    _id = models.ObjectIdField(primary_key=True, db_column='_id')
    username = models.CharField(max_length=50, null=True, blank=True)
    capacity = models.IntegerField(default=100)
    is_gas_leak = models.BooleanField(default=True)

    def __str__(self):
        return self.username

    class Meta:
        db_table = 'gas_usage'
