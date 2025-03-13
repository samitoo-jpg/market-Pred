// import React, { useState } from 'react';
// import axios from 'axios';
// import './App.css'; // Optional: for styling

// function App() {
//   // State to store form inputs
//   const [formData, setFormData] = useState({
//     storeId: '',
//     productId: '',
//     inventoryLevel: '',
//     unitsOrdered: '',
//     demandForecast: '',
//     price: '',
//     discount: '',
//     competitorPricing: '',
//     day: '',
//     month: '',
//     year: ''
//   });

//   // State to store the prediction result
//   const [prediction, setPrediction] = useState(null);
//   const [error, setError] = useState(null); // For error handling

//   // Handle input changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError(null); // Reset error state
//     setPrediction(null); // Reset prediction state

//     try {
//       const response = await axios.post('http://127.0.0.1:8000/api/predict/', {
//         'Store ID': formData.storeId || '',
//         'Product ID': formData.productId || '',
//         'Inventory Level': formData.inventoryLevel || 0,
//         'Units Ordered': formData.unitsOrdered || 0,
//         'Demand Forecast': formData.demandForecast || 0,
//         'Price': formData.price || 0,
//         'Discount': formData.discount || 0,
//         'Competitor Pricing': formData.competitorPricing || 0,
//         'Day': formData.day || 1,
//         'Month': formData.month || 1,
//         'Year': formData.year || 2025
//       });
//       setPrediction(response.data.predicted_units_sold);
//     } catch (err) {
//       setError('Failed to get prediction. Check the backend connection.');
//       console.error('Error:', err);
//     }
//   };

//   return (
//     <div className="app-container">
//       <h1>Market Cost Predictor</h1>
//       <form onSubmit={handleSubmit} className="predict-form">
//         <input
//           name="storeId"
//           placeholder="Store ID (e.g., S002)"
//           value={formData.storeId}
//           onChange={handleChange}
//         />
//         <input
//           name="productId"
//           placeholder="Product ID (e.g., P123)"
//           value={formData.productId}
//           onChange={handleChange}
//         />
//         <input
//           name="inventoryLevel"
//           type="number"
//           placeholder="Inventory Level"
//           value={formData.inventoryLevel}
//           onChange={handleChange}
//         />
//         <input
//           name="unitsOrdered"
//           type="number"
//           placeholder="Units Ordered"
//           value={formData.unitsOrdered}
//           onChange={handleChange}
//         />
//         <input
//           name="demandForecast"
//           type="number"
//           placeholder="Demand Forecast"
//           value={formData.demandForecast}
//           onChange={handleChange}
//         />
//         <input
//           name="price"
//           type="number"
//           step="0.01"
//           placeholder="Price"
//           value={formData.price}
//           onChange={handleChange}
//         />
//         <input
//           name="discount"
//           type="number"
//           step="0.01"
//           placeholder="Discount"
//           value={formData.discount}
//           onChange={handleChange}
//         />
//         <input
//           name="competitorPricing"
//           type="number"
//           step="0.01"
//           placeholder="Competitor Pricing"
//           value={formData.competitorPricing}
//           onChange={handleChange}
//         />
//         <input
//           name="day"
//           type="number"
//           min="1"
//           max="31"
//           placeholder="Day"
//           value={formData.day}
//           onChange={handleChange}
//         />
//         <input
//           name="month"
//           type="number"
//           min="1"
//           max="12"
//           placeholder="Month"
//           value={formData.month}
//           onChange={handleChange}
//         />
//         <input
//           name="year"
//           type="number"
//           placeholder="Year"
//           value={formData.year}
//           onChange={handleChange}
//         />
//         <button type="submit">Predict Units Sold</button>
//       </form>

//       {/* Display prediction or error */}
//       {prediction !== null && (
//         <h3>Predicted Units Sold: {prediction.toFixed(2)}</h3>
//       )}
//       {error && <p className="error">{error}</p>}
//     </div>
//   );
// }

// export default App;

import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [formData, setFormData] = useState({
    storeId: '',
    productId: '',
    inventoryLevel: '',
    unitsOrdered: '',
    demandForecast: '',
    price: '',
    discount: '',
    competitorPricing: '',
    day: '',
    month: '',
    year: ''
  });
  const [prediction, setPrediction] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setPrediction(null);

    const payload = {
      'Store ID': formData.storeId || '',
      'Product ID': formData.productId || '',
      'Inventory Level': formData.inventoryLevel || 0,
      'Units Ordered': formData.unitsOrdered || 0,
      'Demand Forecast': formData.demandForecast || 0,
      'Price': formData.price || 0,
      'Discount': formData.discount || 0,
      'Competitor Pricing': formData.competitorPricing || 0,
      'Day': formData.day || 1,
      'Month': formData.month || 1,
      'Year': formData.year || 2025
    };

    console.log('Sending payload:', payload); // Debug payload
    try {
      const response = await axios.post('http://127.0.0.1:8000/api/predict/', payload);
      console.log('Response:', response.data); // Debug response
      setPrediction(response.data.predicted_units_sold);
    } catch (err) {
      setError('Failed to get prediction. Check the backend connection.');
      console.error('Request failed:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <div className="app-container">
      <h1>Market Cost Predictor</h1>
      <form onSubmit={handleSubmit} className="predict-form">
        <input name="storeId" placeholder="Store ID (e.g., S002)" value={formData.storeId} onChange={handleChange} />
        <input name="productId" placeholder="Product ID (e.g., P123)" value={formData.productId} onChange={handleChange} />
        <input name="inventoryLevel" type="number" placeholder="Inventory Level" value={formData.inventoryLevel} onChange={handleChange} />
        <input name="unitsOrdered" type="number" placeholder="Units Ordered" value={formData.unitsOrdered} onChange={handleChange} />
        <input name="demandForecast" type="number" placeholder="Demand Forecast" value={formData.demandForecast} onChange={handleChange} />
        <input name="price" type="number" step="0.01" placeholder="Price" value={formData.price} onChange={handleChange} />
        <input name="discount" type="number" step="0.01" placeholder="Discount" value={formData.discount} onChange={handleChange} />
        <input name="competitorPricing" type="number" step="0.01" placeholder="Competitor Pricing" value={formData.competitorPricing} onChange={handleChange} />
        <input name="day" type="number" min="1" max="31" placeholder="Day" value={formData.day} onChange={handleChange} />
        <input name="month" type="number" min="1" max="12" placeholder="Month" value={formData.month} onChange={handleChange} />
        <input name="year" type="number" placeholder="Year" value={formData.year} onChange={handleChange} />
        <button type="submit">Predict Units Sold</button>
      </form>
      {prediction !== null && <h3>Predicted Units Sold: {prediction.toFixed(2)}</h3>}
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;