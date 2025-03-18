# prediction_api/management/commands/import_data.py
from django.core.management.base import BaseCommand
from prediction_api.model import MarketData
import pandas as pd
import numpy as np
from datetime import datetime

class Command(BaseCommand):
    help = 'Import market data from CSV file'

    def add_arguments(self, parser):
        parser.add_argument('file_path', type=str, help='Path to the CSV file')

    def handle(self, *args, **options):
        file_path = options['file_path']
        self.stdout.write(self.style.SUCCESS(f'Reading data from {file_path}'))
        
        try:
            # Read the CSV file
            df = pd.read_csv(file_path)
            
            # Convert date format
            df['Date'] = pd.to_datetime(df['Date'])
            
            # Count number of rows
            total_rows = len(df)
            self.stdout.write(self.style.SUCCESS(f'Found {total_rows} rows'))
            
            # Batch import to avoid memory issues
            batch_size = 1000
            for i in range(0, total_rows, batch_size):
                batch = df.iloc[i:min(i+batch_size, total_rows)]
                
                # Create MarketData objects
                market_data_objects = []
                for _, row in batch.iterrows():
                    market_data = MarketData(
                        date=row['Date'],
                        store_id=row['Store ID'],
                        product_id=row['Product ID'],
                        category=row['Category'],
                        region=row['Region'],
                        inventory_level=row['Inventory Level'],
                        units_sold=row['Units Sold'],
                        units_ordered=row['Units Ordered'],
                        demand_forecast=row['Demand Forecast'],
                        price=row['Price'],
                        discount=row['Discount'],
                        weather_condition=row['Weather Condition'],
                        holiday_promotion=row['Holiday/Promotion'],
                        competitor_pricing=row['Competitor Pricing'],
                        seasonality=row['Seasonality']
                    )
                    market_data_objects.append(market_data)
                
                # Bulk create
                MarketData.objects.bulk_create(market_data_objects)
                
                self.stdout.write(self.style.SUCCESS(f'Imported {min(i+batch_size, total_rows)} / {total_rows} rows'))
            
            self.stdout.write(self.style.SUCCESS('Data import completed successfully!'))
        
        except Exception as e:
            self.stdout.write(self.style.ERROR(f'Error importing data: {str(e)}'))