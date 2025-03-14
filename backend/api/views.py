from rest_framework import viewsets, status
from rest_framework.decorators import api_view, action
from rest_framework.response import Response
from .models import PredictionResult, MarketData
from .serializers import PredictionResultSerializer, MarketDataSerializer, PredictionRequestSerializer
import joblib
import pandas as pd
import numpy as np
from datetime import datetime
import os
import json

# Load the model and preprocessor
MODEL_PATH = '../models/best_model.pkl'
PREPROCESSOR_PATH = '../models/preprocessor.pkl'

def load_model():
    try:
        model = joblib.load(MODEL_PATH)
        preprocessor = joblib.load(PREPROCESSOR_PATH)
        return model, preprocessor
    except Exception as e:
        print(f"Error loading model or preprocessor: {e}")
        return None, None

class PredictionResultViewSet(viewsets.ModelViewSet):
    queryset = PredictionResult.objects.all()
    serializer_class = PredictionResultSerializer

class MarketDataViewSet(viewsets.ModelViewSet):
    queryset = MarketData.objects.all()
    serializer_class = MarketDataSerializer

@api_view(['POST'])
def predict_sales(request):
    serializer = PredictionRequestSerializer(data=request.data)
    
    if serializer.is_valid():
        model, preprocessor = load_model()
        
        if model is None or preprocessor is None:
            return Response({"error": "Model or preprocessor not available"}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Prepare data for prediction
        input_data = pd.DataFrame([serializer.validated_data])
        
        # Convert date to datetime and extract features
        input_data['Date'] = pd.to_datetime(input_data['date'])
        input_data['Year'] = input_data['Date'].dt.year
        input_data['Month'] = input_data['Date'].dt.month
        input_data['Day'] = input_data['Date'].dt.day
        input_data['DayOfWeek'] = input_data['Date'].dt.dayofweek
        
        # Drop unnecessary columns
        if 'date' in input_data.columns:
            input_data = input_data.drop(['date'], axis=1)
        if 'Date' in input_data.columns:
            input_data = input_data.drop(['Date'], axis=1)
        
        # Rename columns to match training data
        column_mapping = {
            'store_id': 'Store ID',
            'product_id': 'Product ID',
            'category': 'Category',
            'region': 'Region',
            'inventory_level': 'Inventory Level',
            'units_ordered': 'Units Ordered',
            'demand_forecast': 'Demand Forecast',
            'price': 'Price',
            'discount': 'Discount',
            'weather_condition': 'Weather Condition',
            'holiday_promotion': 'Holiday/Promotion',
            'competitor_pricing': 'Competitor Pricing',
            'seasonality': 'Seasonality'
        }
        input_data = input_data.rename(columns=column_mapping)
        
        # Make prediction
        try:
            processed_data = preprocessor.transform(input_data)
            prediction = model.predict(processed_data)
            
            # Save prediction to database
            prediction_result = PredictionResult(
                store_id=serializer.validated_data['store_id'],
                product_id=serializer.validated_data['product_id'],
                category=serializer.validated_data['category'],
                region=serializer.validated_data['region'],
                date=serializer.validated_data['date'],
                predicted_sales=float(prediction[0]),
                actual_sales=None  # To be updated later when actual data is available
            )
            prediction_result.save()
            
            return Response({
                "predicted_sales": float(prediction[0]),
                "prediction_id": prediction_result.id
            })
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_stats(request):
    """
    Get overall statistics for the dashboard
    """
    try:
        # Get count of predictions
        prediction_count = PredictionResult.objects.count()
        
        # Get average predicted sales
        avg_predicted_sales = PredictionResult.objects.all().aggregate(
            avg_predicted=models.Avg('predicted_sales')
        )['avg_predicted'] or 0
        
        # Get top categories by predicted sales
        top_categories = list(PredictionResult.objects.values('category').annotate(
            total_sales=models.Sum('predicted_sales')
        ).order_by('-total_sales')[:5])
        
        # Get top regions by predicted sales
        top_regions = list(PredictionResult.objects.values('region').annotate(
            total_sales=models.Sum('predicted_sales')
        ).order_by('-total_sales')[:5])
        
        return Response({
            "prediction_count": prediction_count,
            "avg_predicted_sales": avg_predicted_sales,
            "top_categories": top_categories,
            "top_regions": top_regions
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)