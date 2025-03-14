from rest_framework import serializers
from .models import PredictionResult, MarketData

class PredictionResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = PredictionResult
        fields = '__all__'

class MarketDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketData
        fields = '__all__'

class PredictionRequestSerializer(serializers.Serializer):
    store_id = serializers.IntegerField()
    product_id = serializers.IntegerField()
    category = serializers.CharField()
    region = serializers.CharField()
    date = serializers.DateField(format='%Y-%m-%d')
    inventory_level = serializers.FloatField()
    units_ordered = serializers.FloatField()
    demand_forecast = serializers.FloatField()
    price = serializers.FloatField()
    discount = serializers.FloatField()
    weather_condition = serializers.CharField()
    holiday_promotion = serializers.CharField()
    competitor_pricing = serializers.FloatField()
    seasonality = serializers.CharField()