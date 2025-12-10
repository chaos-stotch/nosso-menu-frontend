import React from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme/theme';
import RestaurantPage from './pages/RestaurantPage/RestaurantPage';
import { DeliveryProvider } from './contexts/DeliveryContext';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <DeliveryProvider>
        <RestaurantPage />
      </DeliveryProvider>
    </ThemeProvider>
  );
}

export default App;
