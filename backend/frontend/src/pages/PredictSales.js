import React, { useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Box,
  Card,
  CardContent
} from '@mui/material';
import axios from 'axios';

function PredictSales() {
  const [formData, setFormData] = useState({
    store_id: '',
    product_id: '',
    category: '',
    region: '',
    date: '',
    inventory_level: '',
    units_ordered: '',
    demand_forecast: '',
    price: '',
    discount: '',
    weather_condition: '',
    holiday_promotion: '',
    competitor_pricing: '',
    seasonality: ''
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://localhost:8000/api/predict/', formData);
      setResult(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred');
      setLoading(false);
    }
  };

  const weatherOptions = ['Sunny', 'Rainy', 'Cloudy', 'Snowy'];
  const holidayOptions = ['yes(1)', 'false(0)'];
  const seasonalityOptions = ['Spring', 'Summer', 'Fall', 'Winter', "Autumn"];
  const categoryOptions = ['Electronics', 'Clothing', 'Toys', "Groceries", "Furniture"];
  const regionOptions = ['North', 'South', 'East', 'West'];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Predict Sales
          </Typography>
          <Typography variant="body1">
            Enter product and market details to predict sales units
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Store ID"
                  name="store_id"
                  value={formData.store_id}
                  onChange={(e) =>handleChange({ target: { name: 'store_id', value: parseInt(e.target.value) || '' } })}
                  fullWidth
                  required
                  type = "number"                  
                />
                
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Product ID"
                  name="product_id"
                  value={formData.product_id}
                  onChange={(e) => handleChange({ target: { name: 'product_id', value: parseInt(e.target.value) || '' } })}
                  fullWidth
                  required
                  type="number"                 
                />
                
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
                    {categoryOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Region</InputLabel>
                  <Select
                    name="region"
                    value={formData.region}
                    onChange={handleChange}
                  >
                    {regionOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Date"
                  name="date"
                  type="date"
                  value={formData.date}
                  onChange={handleChange}
                  fullWidth
                  required
                  InputLabelProps={{
                    shrink: true,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Inventory Level"
                  name="inventory_level"
                  value={formData.inventory_level}
                  onChange={handleChange}
                  fullWidth
                  required
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Units Ordered"
                  name="units_ordered"
                  value={formData.units_ordered}
                  onChange={handleChange}
                  fullWidth
                  required
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Demand Forecast"
                  name="demand_forecast"
                  value={formData.demand_forecast}
                  onChange={handleChange}
                  fullWidth
                  required
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  fullWidth
                  required
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Discount (%)"
                  name="discount"
                  value={formData.discount}
                  onChange={handleChange}
                  fullWidth
                  required
                  type="number"
                  inputProps={{ min: 0, max: 100, step: 0.1 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Weather Condition</InputLabel>
                  <Select
                    name="weather_condition"
                    value={formData.weather_condition}
                    onChange={handleChange}
                  >
                    {weatherOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Holiday/Promotion</InputLabel>
                  <Select
                    name="holiday_promotion"
                    value={formData.holiday_promotion}
                    onChange={handleChange}
                  >
                    {holidayOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Competitor Pricing"
                  name="competitor_pricing"
                  value={formData.competitor_pricing}
                  onChange={handleChange}
                  fullWidth
                  required
                  type="number"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Seasonality</InputLabel>
                  <Select
                    name="seasonality"
                    value={formData.seasonality}
                    onChange={handleChange}
                  >
                    {seasonalityOptions.map((option) => (
                      <MenuItem key={option} value={option}>{option}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Predict Sales'}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Prediction Results
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {result ? (
            <Card>
              <CardContent>
                <Typography variant="h4" component="div" gutterBottom>
                  {result.predicted_sales.toFixed(2)}
                </Typography>
                <Typography color="textSecondary">
                  Predicted Units to be Sold
                </Typography>
                <Typography variant="body2" sx={{ mt: 2 }}>
                  Prediction ID: {result.prediction_id}
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography color="textSecondary">
                Fill the form and submit to see prediction results
              </Typography>
            </Box>
          )}
        </Paper>
      </Grid>
    </Grid>
  );
}

export default PredictSales;