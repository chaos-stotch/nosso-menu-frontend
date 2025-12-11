import React, { useMemo } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import { createRestaurantTheme } from '../../utils/createTheme';

const RestaurantThemeProvider = ({ restaurant, children }) => {
  const theme = useMemo(() => {
    const primaryColor = restaurant?.primaryColor || '#ff6b19';
    return createRestaurantTheme(primaryColor);
  }, [restaurant?.primaryColor]);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
};

export default RestaurantThemeProvider;

