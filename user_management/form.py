from django import forms

from user_management.models import Customers


class CustomersForm(forms.ModelForm):
    class Meta:
        model = Customers
        fields = '__all__'
        required = {'updated_at': False}

    def __init__(self, *args, **kwargs):
        self.request = kwargs.pop('request', None)
        super(CustomersForm, self).__init__(*args, **kwargs)

    def clean(self):
        cleaned_data = super(CustomersForm, self).clean()
        instance = getattr(self, 'instance', None)
        username = self.cleaned_data.get('username')

        if username:
            try:
                existing_endpoint = Customers.objects.get(username=username)
                if not instance or instance.pk != existing_endpoint.pk:
                    self.add_error('username', "Username already exists.")
            except Customers.DoesNotExist:
                pass

        return cleaned_data
