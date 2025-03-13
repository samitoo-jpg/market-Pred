from django.urls import path
from .views import PredictUnitsSold

urlpatterns = [
    path('predict/', PredictUnitsSold.as_view(), name='predict'),
]