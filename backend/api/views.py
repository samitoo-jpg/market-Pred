# import pickle
# import numpy as np
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from rest_framework import status

# class PredictUnitsSold(APIView):
#     def post(self, request):
#         # Load model and scaler
#         with open('../model.pkl', 'rb') as f:
#             model = pickle.load(f)
#         with open('../scaler.pkl', 'rb') as f:
#             scaler = pickle.load(f)

#         # Get input data from request
#         data = request.data
#         features = np.array([[
#             data['Store ID'], data['Product ID'], data['Inventory Level'],
#             data['Units Ordered'], data['Demand Forecast'], data['Price'],
#             data['Discount'], data['Competitor Pricing'], data['Day'],
#             data['Month'], data['Year']
#             # Add dummy variables for categorical features as needed
#         ]])

#         # Scale features and predict
#         features_scaled = scaler.transform(features)
#         prediction = model.predict(features_scaled)[0]

#         return Response({'predicted_units_sold': prediction}, status=status.HTTP_200_OK)
    
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
import pickle
import numpy as np
import pandas as pd

class PredictUnitsSold(APIView):
    def post(self, request):
        with open('../model.pkl', 'rb') as f:
            model = pickle.load(f)
        with open('../scaler.pkl', 'rb') as f:
            scaler = pickle.load(f)
        with open('../columns.pkl', 'rb') as f:
            columns = pickle.load(f)

        data = request.data
        input_df = pd.DataFrame(np.zeros((1, len(columns))), columns=columns)

        input_df['Inventory Level'] = float(data.get('Inventory Level', 0))
        input_df['Units Ordered'] = float(data.get('Units Ordered', 0))
        input_df['Demand Forecast'] = float(data.get('Demand Forecast', 0))
        input_df['Price'] = float(data.get('Price', 0))
        input_df['Discount'] = float(data.get('Discount', 0))
        input_df['Competitor Pricing'] = float(data.get('Competitor Pricing', 0))
        input_df['Day'] = float(data.get('Day', 1))
        input_df['Month'] = float(data.get('Month', 1))
        input_df['Year'] = float(data.get('Year', 2025))

        store_id = data.get('Store ID', '')
        product_id = data.get('Product ID', '')
        if store_id and f'Store ID_{store_id}' in columns:
            input_df[f'Store ID_{store_id}'] = 1
        if product_id and f'Product ID_{product_id}' in columns:
            input_df[f'Product ID_{product_id}'] = 1

        features_scaled = scaler.transform(input_df)
        prediction = model.predict(features_scaled)[0]

        return Response({'predicted_units_sold': prediction}, status=status.HTTP_200_OK)