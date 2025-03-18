from rest_framework import viewsets, status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import PredictionResult
from .serializers import PredictionResultSerializer, PredictionRequestSerializer
import joblib
import pandas as pd
from datetime import datetime

# Load the model, preprocessor, and columns
MODEL_PATH = '../models/best_model.pkl'
PREPROCESSOR_PATH = '../models/preprocessor.pkl'
COLUMNS_PATH = '../models/columns.pkl'

def load_model_and_preprocessor():
    try:
        model = joblib.load(MODEL_PATH)
        preprocessor = joblib.load(PREPROCESSOR_PATH)
        columns = joblib.load(COLUMNS_PATH)
        return model, preprocessor, columns
    except Exception as e:
        print(f"Error loading model, preprocessor, or columns: {e}")
        return None, None, None

class PredictionResultViewSet(viewsets.ModelViewSet):
    queryset = PredictionResult.objects.all()
    serializer_class = PredictionResultSerializer

@api_view(['POST'])
def predict_sales(request):
    serializer = PredictionRequestSerializer(data=request.data)
    
    if serializer.is_valid():
        model, preprocessor, expected_columns = load_model_and_preprocessor()
        
        if model is None or preprocessor is None or expected_columns is None:
            return Response({"error": "Model, preprocessor, or columns not available"}, 
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
        input_data = input_data.drop(['date', 'Date'], axis=1)
        
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
        
        # Perform one-hot encoding to match training data
        input_data_encoded = pd.get_dummies(input_data)
        
        # Ensure all expected columns are present
        for col in expected_columns:
            if col not in input_data_encoded.columns:
                input_data_encoded[col] = 0
        
        # Reorder columns to match training data
        input_data_encoded = input_data_encoded[expected_columns]
        
        # Make prediction
        try:
            processed_data = preprocessor.transform(input_data_encoded)
            prediction = model.predict(processed_data)
            
            # Save prediction to database
            prediction_result = PredictionResult(
                store_id=serializer.validated_data['store_id'],
                product_id=serializer.validated_data['product_id'],
                category=serializer.validated_data['category'],
                region=serializer.validated_data['region'],
                date=serializer.validated_data['date'],
                predicted_sales=float(prediction[0]),
                actual_sales=None
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
    try:
        from django.db import models as django_models
        prediction_count = PredictionResult.objects.count()
        avg_predicted_sales = PredictionResult.objects.all().aggregate(
            django_models.Avg('predicted_sales')
        )['predicted_sales__avg'] or 0
        
        top_categories = list(PredictionResult.objects.values('category').annotate(
            total_sales=django_models.Sum('predicted_sales')
        ).order_by('-total_sales')[:5])
        
        top_regions = list(PredictionResult.objects.values('region').annotate(
            total_sales=django_models.Sum('predicted_sales')
        ).order_by('-total_sales')[:5])
        
        return Response({
            "prediction_count": prediction_count,
            "avg_predicted_sales": avg_predicted_sales,
            "top_categories": top_categories,
            "top_regions": top_regions
        })
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)