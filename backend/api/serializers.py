from rest_framework import serializers
from .models import PredictionResult

class PredictionResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictionResult
        fields = '__all__'

class PredictionRequestSerializer(serializers.Serializer):
    store_id = serializers.IntegerField()
    product_id = serializers.IntegerField()
    category = serializers.CharField(max_length=100)
    region = serializers.CharField(max_length=100)
    date = serializers.DateField()
    inventory_level = serializers.FloatField()
    units_ordered = serializers.FloatField()
    demand_forecast = serializers.FloatField()
    price = serializers.FloatField()
    discount = serializers.FloatField()
    weather_condition = serializers.CharField(max_length=100)
    holiday_promotion = serializers.CharField(max_length=100)
    competitor_pricing = serializers.FloatField()
    seasonality = serializers.CharField(max_length=100)