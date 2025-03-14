import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  Card, 
  CardContent, 
  CardHeader,
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
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';
import axios from 'axios';

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/stats/');
        setStats(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchStats();
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

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Market Analysis Dashboard
          </Typography>
          <Typography variant="body1">
            Real-time insights into market trends, inventory levels, and sales predictions.
          </Typography>
        </Paper>
      </Grid>

      {/* Stats Cards */}
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardHeader title="Predictions" />
          <CardContent>
            <Typography variant="h3">{stats?.prediction_count || 0}</Typography>
            <Typography variant="body2" color="textSecondary">
              Total predictions made
            </Typography>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6} lg={3}>
        <Card>
          <CardHeader title="Avg. Predicted Sales" />
          <CardContent>
            <Typography variant="h3">{stats?.avg_predicted_sales?.toFixed(2) || 0}</Typography>
            <Typography variant="body2" color="textSecondary">
              Units per prediction
            </Typography>
          </CardContent>
        </Card>
      </Grid>

      {/* Charts */}
      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Top Categories by Sales
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={stats?.top_categories || []}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_sales" fill="#8884d8" name="Total Sales" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>

      <Grid item xs={12} md={6}>
        <Paper sx={{ p: 2, height: 400 }}>
          <Typography variant="h6" gutterBottom>
            Top Regions by Sales
          </Typography>
          <ResponsiveContainer width="100%" height="90%">
            <BarChart
              data={stats?.top_regions || []}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="region" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total_sales" fill="#82ca9d" name="Total Sales" />
            </BarChart>
          </ResponsiveContainer>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default Dashboard;