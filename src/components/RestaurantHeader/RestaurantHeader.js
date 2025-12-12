import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Chip,
  Stack,
  Avatar,
  Paper,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Star,
  AccessTime,
  LocalShipping,
  Phone,
  LocationOn,
  Celebration,
  Store,
  TrackChanges as TrackChangesIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate, useParams } from 'react-router-dom';
import { formatCurrency } from '../../utils/mockData';
import { useDelivery } from '../../contexts/DeliveryContext';
import { useOrder } from '../../contexts/OrderContext';

const RestaurantHeader = ({ restaurant, onStartOrder }) => {
  const { deliveryType, handleDeliveryTypeChange } = useDelivery();
  const { currentOrder } = useOrder();
  const navigate = useNavigate();
  const { slug } = useParams();

  // Verificar se restaurant existe
  if (!restaurant) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        overflow: 'hidden',
        mb: 4,
      }}
    >
      {/* Cover Image */}
      <Box
        component={motion.div}
        initial={{ scale: 1.1, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        sx={{
          position: 'relative',
          width: '100%',
          height: { xs: '280px', sm: '300px', md: '450px' },
          backgroundImage: `url(${restaurant.coverImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.6) 100%)',
          },
        }}
      >
        <Container
          maxWidth="lg"
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            pb: { xs: 2, sm: 3, md: 4 },
            pt: { xs: 3, sm: 3, md: 4 },
            px: { xs: 2, sm: 3 },
          }}
        >
          {/* Order Tracking Button */}
            {currentOrder && (
              <Box
                sx={{
                  position: 'absolute',
                  top: { xs: 16, sm: 24 },
                  right: { xs: 16, sm: 24 },
                  zIndex: 10,
                }}
              >
                <Button
                  component={motion.button}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => slug ? navigate(`/${slug}/order-tracking`) : navigate('/order-tracking')}
                  variant="contained"
                  startIcon={<TrackChangesIcon />}
                  sx={{
                    backgroundColor: 'rgba(255, 107, 25, 0.9)',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 107, 25, 1)',
                    },
                    boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  Acompanhar Pedido
                </Button>
              </Box>
            )}
          <Grid container spacing={{ xs: 2, sm: 3 }} alignItems={{ xs: 'center', sm: 'flex-end' }}>
            {/* Logo */}
            <Grid item xs={12} sm="auto" sx={{ display: { xs: 'flex', sm: 'block' }, justifyContent: { xs: 'center', sm: 'flex-start' }, order: { xs: 1, sm: 1 } }}>
              <Avatar
                component={motion.div}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                src={restaurant.logo}
                alt={restaurant.name}
                sx={(theme) => ({
                  width: { xs: 70, sm: 100, md: 120 },
                  height: { xs: 70, sm: 100, md: 120 },
                  border: { xs: '3px solid white', sm: '4px solid white' },
                  boxShadow: `0px 8px 24px ${theme.palette.shadowColors.dark}`,
                  position: 'relative',
                  zIndex: 1,
                })}
              />
            </Grid>

            {/* Restaurant Info */}
            <Grid item xs={12} sm sx={{ order: { xs: 2, sm: 2 } }}>
              <Stack spacing={{ xs: 1, sm: 2 }} sx={{ textAlign: { xs: 'center', sm: 'left' } }}>
                <Box>
                  <Typography
                    component={motion.h1}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    variant="h3"
                    sx={(theme) => ({
                      color: 'white',
                      fontWeight: 800,
                      mb: { xs: 0.5, sm: 1 },
                      textShadow: `0px 2px 8px ${theme.palette.shadowColors.dark}`,
                      fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                      lineHeight: { xs: 1.3, sm: 1.3 },
                    })}
                  >
                    {restaurant.name}
                  </Typography>
                  <Typography
                    component={motion.p}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    variant="body1"
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      mb: { xs: 1, sm: 2 },
                      fontSize: { xs: '0.875rem', sm: '1rem' },
                    }}
                  >
                    {restaurant.category}
                  </Typography>
                </Box>

                <Stack
                  direction={{ xs: 'row', sm: 'row' }}
                  spacing={{ xs: 1, sm: 2 }}
                  flexWrap="wrap"
                  justifyContent={{ xs: 'center', sm: 'flex-start' }}
                  component={motion.div}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                >
                  <Chip
                    icon={<Star sx={{ color: '#ffd700 !important', fontSize: { xs: '18px !important', sm: '20px !important' } }} />}
                    label={`${restaurant.rating} (${restaurant.totalReviews})`}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.9rem' },
                      height: { xs: 28, sm: 32 },
                      '& .MuiChip-label': {
                        px: { xs: 1, sm: 1.5 },
                      },
                    }}
                  />
                  <Chip
                    icon={<AccessTime sx={{ fontSize: { xs: '18px !important', sm: '20px !important' } }} />}
                    label={restaurant.deliveryTime}
                    sx={{
                      backgroundColor: 'rgba(255,255,255,0.95)',
                      fontWeight: 600,
                      fontSize: { xs: '0.75rem', sm: '0.9rem' },
                      height: { xs: 28, sm: 32 },
                      '& .MuiChip-label': {
                        px: { xs: 1, sm: 1.5 },
                      },
                    }}
                  />
                </Stack>
              </Stack>
            </Grid>

            {/* CTA Button */}
            <Grid item xs={12} sm="auto" sx={{ display: { xs: 'flex', sm: 'block' }, justifyContent: { xs: 'center', sm: 'flex-start' }, order: { xs: 3, sm: 3 } }}>
              <Button
                component={motion.button}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.4, delay: 0.6, type: 'spring' }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variant="contained"
                color="secondary"
                size="large"
                onClick={onStartOrder}
                sx={(theme) => ({
                  minWidth: { xs: '100%', sm: 180, md: 200 },
                  py: { xs: 1.25, sm: 1.5 },
                  fontSize: { xs: '0.95rem', sm: '1.1rem' },
                  fontWeight: 700,
                  boxShadow: `0px 4px 16px ${theme.palette.shadowColors.secondary}`,
                })}
              >
                Iniciar Pedido
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Info Bar - Minimalista */}
      <Container maxWidth="lg" sx={{ mt: { xs: 2, sm: 3 }, position: 'relative', zIndex: 1, px: { xs: 2, sm: 3 } }}>
        <Box
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.7 }}
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: 2,
            border: '1px solid',
            borderColor: 'divider',
            boxShadow: '0px 2px 8px rgba(0,0,0,0.04)',
            overflow: 'hidden',
          }}
        >
          {/* Primeira linha: Toggle e informações principais */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: { xs: 2, sm: 3, md: 4 },
              alignItems: 'center',
              justifyContent: { xs: 'center', sm: 'flex-start' },
              py: { xs: 2, sm: 2.5 },
              px: { xs: 2, sm: 3 },
            }}
          >
            {/* Toggle Entrega/Retirada */}
            <ToggleButtonGroup
              value={deliveryType}
              exclusive
              onChange={(e, newValue) => handleDeliveryTypeChange(newValue)}
              size="small"
              sx={{
                '& .MuiToggleButton-root': {
                  px: { xs: 1.5, sm: 2 },
                  py: 0.75,
                  textTransform: 'none',
                  fontSize: { xs: '0.75rem', sm: '0.875rem' },
                  fontWeight: 600,
                  border: '1px solid',
                  borderColor: 'divider',
                  '&.Mui-selected': {
                    backgroundColor: 'secondary.main',
                color: 'white',
                    '&:hover': {
                      backgroundColor: 'secondary.dark',
                    },
                  },
                },
              }}
            >
              <ToggleButton value="delivery">
                <LocalShipping sx={{ fontSize: { xs: 16, sm: 18 }, mr: 0.5 }} />
                Entrega
              </ToggleButton>
              <ToggleButton value="pickup">
                <Store sx={{ fontSize: { xs: 16, sm: 18 }, mr: 0.5 }} />
                Retirada
              </ToggleButton>
            </ToggleButtonGroup>

            {deliveryType === 'delivery' && (
              <>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                  <LocalShipping sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, fontWeight: 500 }}>
                {formatCurrency(restaurant.deliveryFee)}
              </Typography>
                </Stack>

                <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                  <AccessTime sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, fontWeight: 500 }}>
                    {restaurant.deliveryTime}
                  </Typography>
                </Stack>
              </>
            )}

            {deliveryType === 'pickup' && (
              <Stack direction="row" spacing={1} alignItems="center" sx={{ color: 'text.secondary' }}>
                <AccessTime sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
                <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, fontWeight: 500 }}>
                  15-20 min
              </Typography>
              </Stack>
            )}

            <Stack 
              direction="row" 
              spacing={1} 
              alignItems="center" 
              sx={{
                color: 'text.secondary',
                display: { xs: 'none', lg: 'flex' },
              }}
            >
              <Phone sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, fontWeight: 500 }}>
                {restaurant.phone}
              </Typography>
            </Stack>
          </Box>

          {/* Segunda linha: Endereço completo */}
          <Box
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              py: { xs: 1.5, sm: 2 },
              px: { xs: 2, sm: 3 },
            }}
          >
            <Stack 
              direction="row" 
              spacing={1} 
              alignItems="center" 
              sx={{
                color: 'text.secondary',
                justifyContent: { xs: 'center', sm: 'flex-start' },
              }}
            >
              <LocationOn sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary', flexShrink: 0 }} />
              <Typography 
                variant="body2" 
                sx={{ 
                  fontSize: { xs: '0.8rem', sm: '0.875rem' }, 
                  fontWeight: 500,
                  textAlign: { xs: 'center', sm: 'left' },
                }}
              >
                {restaurant.address}
              </Typography>
            </Stack>
          </Box>

          {/* Telefone no mobile */}
          <Box
            sx={{
              borderTop: '1px solid',
              borderColor: 'divider',
              py: { xs: 1.5, sm: 2 },
              px: { xs: 2, sm: 3 },
              display: { xs: 'block', lg: 'none' },
            }}
          >
            <Stack 
              direction="row" 
              spacing={1} 
              alignItems="center" 
              sx={{
                color: 'text.secondary',
                justifyContent: 'center',
              }}
            >
              <Phone sx={{ fontSize: { xs: 18, sm: 20 }, color: 'text.secondary' }} />
              <Typography variant="body2" sx={{ fontSize: { xs: '0.8rem', sm: '0.875rem' }, fontWeight: 500 }}>
                {restaurant.phone}
              </Typography>
            </Stack>
          </Box>
        </Box>

        {/* Promotions */}
        {restaurant.promotions && restaurant.promotions.length > 0 && (
          <Box sx={{ mt: { xs: 2, sm: 3 } }}>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={{ xs: 1.5, sm: 2 }}
              component={motion.div}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 1.1 }}
            >
              {restaurant.promotions.map((promo) => (
                <Paper
                  key={promo.id}
                  elevation={2}
                  sx={{
                    p: { xs: 1.5, sm: 2 },
                    flex: 1,
                    backgroundColor: 'background.paper',
                    border: '2px solid',
                    borderColor: 'secondary.main',
                  }}
                >
                  <Typography variant="h6" sx={{ fontWeight: 700, color: '#1a1a1a', mb: 0.5, display: 'flex', alignItems: 'center', gap: 1, fontSize: { xs: '0.95rem', sm: '1.125rem' } }}>
                    <Celebration sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} />
                    {promo.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#666', fontSize: { xs: '0.8rem', sm: '0.875rem' } }}>
                    {promo.description}
                  </Typography>
                </Paper>
              ))}
            </Stack>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default RestaurantHeader;
