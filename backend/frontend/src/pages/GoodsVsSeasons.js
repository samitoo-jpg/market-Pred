import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  CircularProgress 
} from '@mui/material';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer
} from 'recharts';
import axios from 'axios';

function GoodsVsSeasons() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/seasonal-analysis/');
        const transformedData = response.data.reduce((acc, item) => {
          const season = item.seasonality || 'Unknown';
          const existing = acc.find(d => d.seasonality === season);
          if (existing) {
            existing[item.category] = (existing[item.category] || 0) + (item.total_predicted_sales || item.avg_predicted_sales || 0);
          } else {
            acc.push({
              seasonality: season,
              [item.category]: item.total_predicted_sales || item.avg_predicted_sales || 0
            });
          }
          return acc;
        }, []);
        console.log('Transformed Data (GoodsVsSeasons):', transformedData);
        setData(transformedData);
        setLoading(false);
      } catch (err) {
        setError('Failed to load seasonal data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: '80vh' }}>
        <CircularProgress />
      </Grid>
    );
  }

  if (error) {
    return (
      <Grid container justifyContent="center" alignItems="center" style={{ height: '80vh' }}>
        <Typography color="error">{error}</Typography>
      </Grid>
    );
  }

  const categories = [...new Set(data.map(item => Object.keys(item)).flat().filter(key => key !== 'seasonality'))];

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Goods vs Seasons Analysis
          </Typography>
          <Typography variant="body1">
            Total predicted sales of specific goods across seasons
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Top Specific Goods vs Seasons
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="seasonality" label={{ value: 'Season', position: 'insideBottomRight', offset: -5 }} />
              <YAxis label={{ value: 'Total Predicted Sales', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend />
              {categories.map((category, index) => (
                <Bar 
                  key={category} 
                  dataKey={category} 
                  fill={`hsl(${index * 60}, 70%, 50%)`} 
                  name={category} 
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default GoodsVsSeasons;