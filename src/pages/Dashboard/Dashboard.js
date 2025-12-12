import React, { useState, useEffect } from 'react';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardSidebar from '../../components/DashboardSidebar/DashboardSidebar';
import DashboardHeader from '../../components/DashboardHeader/DashboardHeader';
import RestaurantManagement from './sections/RestaurantManagement/RestaurantManagement';
import CategoriesManagement from './sections/CategoriesManagement/CategoriesManagement';
import ProductsManagement from './sections/ProductsManagement/ProductsManagement';
import PromotionsManagement from './sections/PromotionsManagement/PromotionsManagement';
import OrdersManagement from './sections/OrdersManagement/OrdersManagement';
import DashboardOverview from './sections/DashboardOverview/DashboardOverview';
import RevenueAnalytics from './sections/RevenueAnalytics/RevenueAnalytics';

const Dashboard = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [sidebarOpen, setSidebarOpen] = useState(!isMobile);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(!isMobile);
  }, [isMobile]);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <DashboardSidebar 
        open={sidebarOpen} 
        mobileOpen={mobileOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
        onMobileClose={() => setMobileOpen(false)}
        onMobileOpen={() => setMobileOpen(true)}
        isMobile={isMobile}
      />
      
      <Box
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          width: { xs: '100%', md: `calc(100% - ${sidebarOpen ? 280 : 80}px)` },
          marginLeft: { xs: 0, md: sidebarOpen ? '280px' : '80px' },
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <DashboardHeader onMenuClick={handleDrawerToggle} />
        
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: { xs: 2, sm: 3, md: 4 },
            width: '100%',
            overflow: 'auto',
          }}
        >
          <Container maxWidth="xl" sx={{ px: { xs: 0, sm: 2 } }}>
            <Routes>
              <Route index element={<DashboardOverview />} />
              <Route path="orders" element={<OrdersManagement />} />
              <Route path="revenue" element={<RevenueAnalytics />} />
              <Route path="restaurant" element={<RestaurantManagement />} />
              <Route path="categories" element={<CategoriesManagement />} />
              <Route path="products" element={<ProductsManagement />} />
              <Route path="promotions" element={<PromotionsManagement />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Container>
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
