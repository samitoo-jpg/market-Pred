from django.db import models

class PredictionResult(models.Model):
    store_id = models.IntegerField()
    product_id = models.IntegerField()
    category = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    date = models.DateField()
    predicted_sales = models.FloatField()
    actual_sales = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['-date', 'store_id', 'product_id']
    
    def __str__(self):
        return f"Store {self.store_id}, Product {self.product_id}, Date: {self.date}"

class MarketData(models.Model):
    date = models.DateField()
    store_id = models.IntegerField()
    product_id = models.IntegerField()
    category = models.CharField(max_length=100)
    region = models.CharField(max_length=100)
    inventory_level = models.FloatField()
    units_sold = models.FloatField()
    units_ordered = models.FloatField()
    demand_forecast = models.FloatField()
    price = models.FloatField()
    discount = models.FloatField()
    weather_condition = models.CharField(max_length=100)
    holiday_promotion = models.CharField(max_length=100)
    competitor_pricing = models.FloatField()
    seasonality = models.CharField(max_length=100)
    
    class Meta:
        ordering = ['-date', 'store_id', 'product_id']
    
    def __str__(self):
        return f"Store {self.store_id}, Product {self.product_id}, Date: {self.date}"
