import json

from bson import ObjectId
from django.http import JsonResponse

from location_management.models import City


def get_service_centers(request):
    try:
        data = json.loads(request.body)
        selected_district = data.get('selectedDistrict')
        cites = []
        try:

            center_data = City.objects.get(district_ref_id=ObjectId(selected_district))
            cites = center_data.cites
            pass

        except City.DoesNotExist:
            pass

        response_data = {
            'center_data': cites,
        }

        return JsonResponse(response_data, safe=False)

    except Exception as e:

        return JsonResponse({'errors': str(e)}, status=500)
