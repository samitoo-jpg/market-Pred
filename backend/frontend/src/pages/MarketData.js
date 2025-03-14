import React, { useState, useEffect } from 'react';
import { 
  Grid, 
  Paper, 
  Typography, 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  TextField,
  Box,
  Button
} from '@mui/material';
import axios from 'axios';

function MarketData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/market-data/');
        setData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load market data');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
    setPage(0);
  };

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

  // Filter data based on search term
  const filteredData = data.filter(item => 
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.region.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.product_id.toString().includes(searchTerm)
  );

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Market Data
          </Typography>
          <Typography variant="body1">
            View and analyze historical market data
          </Typography>
        </Paper>
      </Grid>

      <Grid item xs={12}>
        <Paper sx={{ p: 2 }}>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <TextField
              label="Search"
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search by category, region, or product ID"
              sx={{ width: 300 }}
            />
            <Button variant="contained" color="primary">
              Export Data
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Date</TableCell>
                  <TableCell>Store ID</TableCell>
                  <TableCell>Product ID</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Region</TableCell>
                  <TableCell>Inventory Level</TableCell>
                  <TableCell>Units Sold</TableCell>
                  <TableCell>Price</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredData
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((row) => (
                    <TableRow key={`${row.id}-${row.product_id}`}>
                      <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
                      <TableCell>{row.store_id}</TableCell>
                      <TableCell>{row.product_id}</TableCell>
                      <TableCell>{row.category}</TableCell>
                      <TableCell>{row.region}</TableCell>
                      <TableCell>{row.inventory_level}</TableCell>
                      <TableCell>{row.units_sold}</TableCell>
                      <TableCell>${row.price.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25, 50]}
            component="div"
            count={filteredData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}

export default MarketData;