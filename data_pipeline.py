import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.linear_model import LinearRegression, Ridge, Lasso
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
import matplotlib.pyplot as plt
import seaborn as sns

# Load the dataset
print("Loading data...")
df = pd.read_csv('retail_store_inventory.csv')

# Step 1: Data Cleaning
print("Cleaning data...")
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
X = df.drop('Units Sold', axis=1)
y = df['Units Sold']

# Step 3: Split the Data
print("Splitting data...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Step 4: Scale Numerical Features
print("Applying preprocessing transformations...")
scaler = StandardScaler()
X_train_processed = scaler.fit_transform(X_train)
X_test_processed = scaler.transform(X_test)

# Save preprocessed data (optional, for consistency with the example)
joblib.dump((X_train, X_test, y_train, y_test), 'data/train_test_data.pkl')
joblib.dump(scaler, 'models/preprocessor.pkl')

# Step 5: Train Multiple Models and Compare
print("Training models...")
models = {
    'Linear Regression': LinearRegression(),
    'Ridge Regression': Ridge(alpha=1.0),
    'Lasso Regression': Lasso(alpha=0.1),
    'Random Forest': RandomForestRegressor(n_estimators=100, random_state=42),
    'Gradient Boosting': GradientBoostingRegressor(n_estimators=100, random_state=42)
}

results = {}

for name, model in models.items():
    print(f"Training {name}...")
    model.fit(X_train_processed, y_train)
    
    # Make predictions
    y_pred = model.predict(X_test_processed)
    
    # Calculate metrics
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    mae = mean_absolute_error(y_test, y_pred)
    r2 = r2_score(y_test, y_pred)
    
    results[name] = {
        'model': model,
        'mse': mse,
        'rmse': rmse,
        'mae': mae,
        'r2': r2
    }
    
    print(f"{name} - RMSE: {rmse:.2f}, MAE: {mae:.2f}, R²: {r2:.2f}")

# Step 6: Compare Models
print("\nModel comparison:")
results_df = pd.DataFrame({
    'Model': list(results.keys()),
    'RMSE': [results[m]['rmse'] for m in results],
    'MAE': [results[m]['mae'] for m in results],
    'R²': [results[m]['r2'] for m in results]
})
print(results_df)

# Plot model comparison
plt.figure(figsize=(12, 6))
sns.barplot(x='Model', y='R²', data=results_df)
plt.title('Model Comparison - R² Score')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('models/model_comparison_r2.png')

plt.figure(figsize=(12, 6))
sns.barplot(x='Model', y='RMSE', data=results_df)
plt.title('Model Comparison - RMSE')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('models/model_comparison_rmse.png')

# Step 7: Select and Save Best Model
best_model_name = results_df.loc[results_df['R²'].idxmax(), 'Model']
best_model = results[best_model_name]['model']
print(f"\nBest model: {best_model_name} with R² = {results[best_model_name]['r2']:.2f}")

joblib.dump(best_model, 'models/best_model.pkl')
print("Best model saved to models/best_model.pkl")

# Step 8: Save Preprocessor and Column Names
joblib.dump(scaler, 'models/preprocessor.pkl')  # Overwrites earlier save for consistency
joblib.dump(X.columns.tolist(), 'models/columns.pkl')

# Step 9: Create and Save Prediction Function
def predict_sales(data, preprocessor=scaler, model=best_model):
    """
    Make predictions using the trained model
    
    Parameters:
    data (pd.DataFrame): Input data with all required features
    preprocessor: The fitted preprocessor (scaler)
    model: The trained model
    
    Returns:
    np.array: Predictions
    """
    processed_data = preprocessor.transform(data)
    return model.predict(processed_data)

joblib.dump(predict_sales, 'models/predict_function.pkl')
print("Prediction function saved to models/predict_function.pkl")

# Step 10: Feature Importance (if applicable)
if hasattr(best_model, 'feature_importances_'):
    feature_names = X.columns.tolist()
    importances = best_model.feature_importances_
    
    # Top 20 features
    indices = np.argsort(importances)[-20:]
    
    plt.figure(figsize=(12, 10))
    plt.barh(range(len(indices)), importances[indices], align='center')
    plt.yticks(range(len(indices)), [feature_names[i] for i in indices])
    plt.xlabel('Feature Importance')
    plt.title('Top 20 Most Important Features')
    plt.tight_layout()
    plt.savefig('models/feature_importance.png')
    print("Feature importance plot saved to models/feature_importance.png")

print("\nModel training and evaluation completed!")