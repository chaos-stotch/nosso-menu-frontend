import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Box,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Badge,
  ListItemIcon,
  ListItemText,
  Typography as MuiTypography,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  AccountCircle as AccountCircleIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
  ShoppingCart as ShoppingCartIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useMediaQuery, useTheme } from '@mui/material';
import useNotifications from '../../hooks/useNotifications';

const DashboardHeader = ({ onMenuClick }) => {
  const { restaurant, user, logout } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = React.useState(null);
  
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
  } = useNotifications(restaurant?.id);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    handleMenuClose();
    await logout();
    navigate('/');
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    handleNotificationsClose();
    // Navegar para a página de pedidos com o orderId
    navigate(`/dashboard/orders?orderId=${notification.orderId}`);
  };

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora';
    if (diffMins < 60) return `${diffMins} min atrás`;
    if (diffHours < 24) return `${diffHours}h atrás`;
    if (diffDays < 7) return `${diffDays}d atrás`;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        color: 'text.primary',
        borderRadius: 0,
        borderBottomLeftRadius: { xs: 0, md: 20 },
      }}
    >
      <Toolbar sx={{ px: { xs: 1, sm: 2 } }}>
        {isMobile && onMenuClick && (
        <IconButton
          edge="start"
          color="inherit"
          aria-label="menu"
          onClick={onMenuClick}
            sx={{ mr: 1 }}
        >
          <MenuIcon />
        </IconButton>
        )}
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 700,
              color: 'text.primary',
              fontSize: { xs: '1rem', sm: '1.25rem' },
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {restaurant?.name || 'Meu Restaurante'}
          </Typography>
          <Typography
            variant="caption"
            sx={{
              color: 'text.secondary',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            Painel de Controle
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          <IconButton
            component={motion.button}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            color="inherit"
            size="small"
            onClick={handleNotificationsOpen}
            sx={{
              display: { xs: 'none', sm: 'flex' },
              backgroundColor: 'action.hover',
              '&:hover': {
                backgroundColor: 'action.selected',
              },
            }}
          >
            <Badge badgeContent={unreadCount} color="error">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={notificationsAnchorEl}
            open={Boolean(notificationsAnchorEl)}
            onClose={handleNotificationsClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: {
                width: 360,
                maxHeight: 500,
                mt: 1,
              },
            }}
          >
            <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid', borderColor: 'divider' }}>
              <MuiTypography variant="h6" sx={{ fontWeight: 700 }}>
                Notificações
              </MuiTypography>
              {unreadCount > 0 && (
                <MenuItem onClick={markAllAsRead} dense>
                  <MuiTypography variant="caption" sx={{ color: 'primary.main' }}>
                    Marcar todas como lidas
                  </MuiTypography>
                </MenuItem>
              )}
            </Box>
            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
              {notifications.length === 0 ? (
                <Box sx={{ p: 3, textAlign: 'center' }}>
                  <MuiTypography variant="body2" sx={{ color: 'text.secondary' }}>
                    Nenhuma notificação
                  </MuiTypography>
                </Box>
              ) : (
                notifications.map((notification) => (
                  <MenuItem
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      backgroundColor: notification.read ? 'transparent' : 'action.hover',
                      borderLeft: notification.read ? 'none' : '3px solid',
                      borderColor: 'primary.main',
                      py: 1.5,
                      px: 2,
                    }}
                  >
                    <ListItemIcon>
                      <ShoppingCartIcon sx={{ color: notification.read ? 'text.secondary' : 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <MuiTypography
                          variant="body2"
                          sx={{
                            fontWeight: notification.read ? 400 : 600,
                            color: notification.read ? 'text.secondary' : 'text.primary',
                          }}
                        >
                          {notification.title}
                        </MuiTypography>
                      }
                      secondary={
                        <Box>
                          <MuiTypography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                            {notification.message}
                          </MuiTypography>
                          <MuiTypography variant="caption" sx={{ color: 'text.secondary', fontSize: '0.7rem' }}>
                            {formatNotificationTime(notification.timestamp)}
                          </MuiTypography>
                        </Box>
                      }
                    />
                    {!notification.read && (
                      <Box
                        sx={{
                          width: 8,
                          height: 8,
                          borderRadius: '50%',
                          backgroundColor: 'primary.main',
                          ml: 1,
                        }}
                      />
                    )}
                  </MenuItem>
                ))
              )}
            </Box>
          </Menu>

          <IconButton
            onClick={handleMenuOpen}
            size="small"
            sx={{
              ml: { xs: 0, sm: 1 },
            }}
          >
            <Avatar
              src={restaurant?.logo}
              alt={user?.email || 'Admin'}
              sx={{ width: { xs: 32, sm: 40 }, height: { xs: 32, sm: 40 } }}
            >
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem onClick={handleMenuClose}>
              <AccountCircleIcon sx={{ mr: 2 }} />
              Meu Perfil
            </MenuItem>
            <MenuItem onClick={handleMenuClose}>
              <SettingsIcon sx={{ mr: 2 }} />
              Configurações
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <LogoutIcon sx={{ mr: 2 }} />
              Sair
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardHeader;
