import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression
import pickle

# Load the dataset
df = pd.read_csv('retail_store_inventory.csv')

# Step 1: Data Cleaning
# Handle missing values
df.fillna({
    'Inventory Level': df['Inventory Level'].mean(),
    'Units Sold': df['Units Sold'].mean(),
    'Units Ordered': df['Units Ordered'].mean(),
    'Demand Forecast': df['Demand Forecast'].mean(),
    'Price': df['Price'].mean(),
    'Discount': 0,
    'Competitor Pricing': df['Competitor Pricing'].mean()
}, inplace=True)

# Convert categorical columns to numerical (one-hot encoding)
categorical_cols = ['Store ID', 'Product ID', 'Category', 'Region', 'Weather Condition', 'Holiday/Promotion', 'Seasonality']
df = pd.get_dummies(df, columns=categorical_cols, drop_first=True)

# Convert Date to numerical features
df['Date'] = pd.to_datetime(df['Date'])
df['Day'] = df['Date'].dt.day
df['Month'] = df['Date'].dt.month
df['Year'] = df['Date'].dt.year
df.drop('Date', axis=1, inplace=True)

# Step 2: Define Features (X) and Target (y)
X = df.drop('Units Sold', axis=1)  # Features
y = df['Units Sold']               # Target

# Step 3: Split the Data
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 4: Scale Numerical Features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Step 5: Train Linear Regression Model
model = LinearRegression()
model.fit(X_train_scaled, y_train)

# Step 6: Evaluate Model
train_score = model.score(X_train_scaled, y_train)
test_score = model.score(X_test_scaled, y_test)
print(f"Training R² Score: {train_score}")
print(f"Testing R² Score: {test_score}")

# Step 7: Save Model, Scaler, and Column Names
with open('model.pkl', 'wb') as f:
    pickle.dump(model, f)
with open('scaler.pkl', 'wb') as f:
    pickle.dump(scaler, f)
with open('columns.pkl', 'wb') as f:
    pickle.dump(X.columns.tolist(), f)  # Save feature column names for API