from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'predictions', views.PredictionResultViewSet)
router.register(r'market-data', views.MarketDataViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('predict/', views.predict_sales, name='predict_sales'),
    path('stats/', views.get_stats, name='get_stats'),
]
