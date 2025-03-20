import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import PredictSales from './pages/PredictSales';
import GoodsVsSeasons from './pages/GoodsVsSeasons';
// import SeasonalAnalysis from './pages/SeasonalAnalysis';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/predict" element={<PredictSales />} />
            <Route path="/goods-vs-seasons" element={<GoodsVsSeasons />} />
            {/* <Route path="/seasonal-analysis" element={<SeasonalAnalysis />} /> */}
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>
  );
}

export default App;