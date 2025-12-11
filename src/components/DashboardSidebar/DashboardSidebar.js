import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Divider,
  Avatar,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Dashboard as DashboardIcon,
  Restaurant as RestaurantIcon,
  Category as CategoryIcon,
  Fastfood as FastfoodIcon,
  LocalOffer as LocalOfferIcon,
  ShoppingCart as ShoppingCartIcon,
  Visibility as VisibilityIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { id: 'overview', label: 'Visão Geral', icon: DashboardIcon, path: '/dashboard' },
  { id: 'orders', label: 'Pedidos', icon: ShoppingCartIcon, path: '/dashboard/orders' },
  { id: 'restaurant', label: 'Restaurante', icon: RestaurantIcon, path: '/dashboard/restaurant' },
  { id: 'categories', label: 'Categorias', icon: CategoryIcon, path: '/dashboard/categories' },
  { id: 'products', label: 'Produtos', icon: FastfoodIcon, path: '/dashboard/products' },
  { id: 'promotions', label: 'Promoções', icon: LocalOfferIcon, path: '/dashboard/promotions' },
];

const DashboardSidebar = ({ open, onToggle, mobileOpen, onMobileClose, onMobileOpen, isMobile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { restaurant } = useAuth();
  const theme = useTheme();

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      onMobileClose();
    }
  };

  const handleMenuClick = () => {
    if (isMobile) {
      if (mobileOpen) {
        onMobileClose();
      } else {
        onMobileOpen();
      }
    } else {
      onToggle();
    }
  };

  const handleViewRestaurant = () => {
    if (restaurant?.slug) {
      window.open(`/${restaurant.slug}`, '_blank');
    } else {
      alert('Configure o slug do seu restaurante nas configurações para visualizar a página pública.');
    }
  };

  const drawerWidth = 280;
  const drawerWidthCollapsed = 80;
  const isDrawerOpen = isMobile ? true : open; // No mobile, sempre mostra expandido quando aberto

  const drawerContent = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isDrawerOpen ? 'space-between' : 'center',
          p: 2,
          minHeight: 64,
          borderBottom: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
          {isDrawerOpen && (
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: 'primary.main',
                fontSize: { xs: '1rem', sm: '1.25rem' },
              }}
            >
              Dashboard
            </Typography>
          )}
          <Tooltip title={isMobile ? (mobileOpen ? 'Fechar' : 'Abrir') : (isDrawerOpen ? 'Recolher' : 'Expandir')}>
            <Box
              component={motion.div}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleMenuClick}
              sx={{
                cursor: 'pointer',
                p: 1,
                borderRadius: 1,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
              }}
            >
              <MenuIcon />
            </Box>
          </Tooltip>
        </Box>
      </Box>

      <List sx={{ px: isDrawerOpen ? 2 : 1, py: 2, flex: 1, overflow: 'auto' }}>
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <ListItem key={item.id} disablePadding sx={{ mb: 1 }}>
              <Tooltip title={!isDrawerOpen && !isMobile ? item.label : ''} placement="right">
                <ListItemButton
                  component={motion.div}
                  whileHover={{ x: 4 }}
                  onClick={() => handleNavigation(item.path)}
                  sx={{
                    borderRadius: 2,
                    backgroundColor: isActive ? 'primary.main' : 'transparent',
                    color: isActive ? 'primary.contrastText' : 'text.primary',
                    '&:hover': {
                      backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                    },
                    py: 1.5,
                    px: isDrawerOpen ? 2 : 1.5,
                    justifyContent: isDrawerOpen ? 'flex-start' : 'center',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: isDrawerOpen ? 40 : 'auto',
                      color: isActive ? 'primary.contrastText' : 'text.primary',
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  {isDrawerOpen && (
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.95rem',
                      }}
                    />
                  )}
                </ListItemButton>
              </Tooltip>
            </ListItem>
          );
        })}
      </List>

      <Divider sx={{ mx: 2 }} />

      <Box sx={{ p: 2 }}>
        <Tooltip title={!isDrawerOpen && !isMobile ? 'Ver Restaurante' : ''} placement="right">
          <Box
            component={motion.div}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleViewRestaurant}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              p: 2,
              borderRadius: 2,
              backgroundColor: 'action.hover',
              cursor: 'pointer',
              '&:hover': {
                backgroundColor: 'action.selected',
              },
            }}
          >
            <Avatar
              src={restaurant?.logo}
              alt={restaurant?.name || 'Restaurante'}
              sx={{ width: isDrawerOpen ? 40 : 32, height: isDrawerOpen ? 40 : 32 }}
            >
              {restaurant?.name?.[0] || 'R'}
            </Avatar>
            {isDrawerOpen && (
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  Ver Restaurante
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                    display: 'block',
                  }}
                >
                  <VisibilityIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                  Visualizar
                </Typography>
              </Box>
            )}
          </Box>
        </Tooltip>
      </Box>
    </Box>
  );

  return (
    <>
      {/* Mobile drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileClose}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            borderRight: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* Desktop drawer */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          width: open ? drawerWidth : drawerWidthCollapsed,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? drawerWidth : drawerWidthCollapsed,
            boxSizing: 'border-box',
            borderRight: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            transition: theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default DashboardSidebar;
