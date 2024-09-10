import json
from django.conf import settings
from django import forms

from location_management.models import City


class ServiceCentersForm(forms.ModelForm):
    """
    Form for the ServiceCenters model.
    """

    class Meta:
        model = City
        fields = '__all__'
        required = {'updated_at': False}


    def clean_cites(self):

        service_cites_str = self.cleaned_data.get('cites', '[]')
        if service_cites_str is None:
            service_cites_str = '[]'
        try:
            cites = json.loads(service_cites_str)
        except json.JSONDecodeError:
            raise forms.ValidationError("Invalid JSON for service_centers")
        return cites
