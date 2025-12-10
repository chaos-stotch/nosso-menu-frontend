import React, { useState } from 'react';
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Stack,
  Divider,
  Button,
  Paper,
  TextField,
  Chip,
  ToggleButton,
  ToggleButtonGroup,
} from '@mui/material';
import {
  Close,
  Add,
  Remove,
  Delete,
  ShoppingCart,
  LocalShipping,
  Discount,
  Store,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { formatCurrency } from '../../utils/mockData';
import { useDelivery } from '../../contexts/DeliveryContext';

const CartSidebar = ({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
  restaurant,
  onCheckout,
}) => {
  const { deliveryType, handleDeliveryTypeChange } = useDelivery();
  const [couponCode, setCouponCode] = useState('');
  const [discount, setDiscount] = useState(0);

  const subtotal = items.reduce(
    (sum, item) => {
      const optionsPrice = Object.values(item.options).reduce(
        (optSum, opt) => optSum + (opt.price || 0),
        0
      );
      return sum + (item.unitPrice + optionsPrice) * item.quantity;
    },
    0
  );

  const deliveryFee = deliveryType === 'delivery' ? (restaurant?.deliveryFee || 0) : 0;
  const total = subtotal + deliveryFee - discount;

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'DESCONTO10') {
      setDiscount(subtotal * 0.1);
    } else {
      setDiscount(0);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: '100%', sm: 420 },
          maxWidth: '100%',
        },
      }}
    >
      <Box
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: 'background.default',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            p: 3,
            backgroundColor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            position: 'sticky',
            top: 0,
            zIndex: 1,
          }}
        >
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Carrinho
            </Typography>
            <IconButton onClick={onClose}>
              <Close />
            </IconButton>
          </Stack>
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, mb: 2 }}>
            {items.length} {items.length === 1 ? 'item' : 'itens'}
          </Typography>
          
          {/* Toggle Entrega/Retirada */}
          <ToggleButtonGroup
            value={deliveryType}
            exclusive
            onChange={(e, newValue) => handleDeliveryTypeChange(newValue)}
            size="small"
            fullWidth
            sx={{
              '& .MuiToggleButton-root': {
                py: 1,
                textTransform: 'none',
                fontSize: '0.875rem',
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
              <LocalShipping sx={{ fontSize: 18, mr: 0.5 }} />
              Entrega
            </ToggleButton>
            <ToggleButton value="pickup">
              <Store sx={{ fontSize: 18, mr: 0.5 }} />
              Retirada
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        {/* Cart Items */}
        <Box
          sx={{
            flex: 1,
            overflowY: 'auto',
            p: 2,
          }}
        >
          {items.length === 0 ? (
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                textAlign: 'center',
                p: 4,
              }}
            >
              <ShoppingCart sx={{ fontSize: 64, color: 'grey.300', mb: 2 }} />
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Seu carrinho está vazio
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                Adicione itens deliciosos para começar seu pedido
              </Typography>
            </Box>
          ) : (
            <Stack spacing={2}>
              <AnimatePresence>
                {items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -50 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Paper
                      elevation={2}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                      }}
                    >
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={2}>
                          <Box
                            sx={{
                              width: 80,
                              height: 80,
                              borderRadius: 2,
                              overflow: 'hidden',
                              flexShrink: 0,
                              backgroundColor: 'grey.100',
                            }}
                          >
                            <Box
                              component="img"
                              src={item.product.image}
                              alt={item.product.name}
                              sx={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                              }}
                            />
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{
                                fontWeight: 700,
                                mb: 0.5,
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {item.product.name}
                            </Typography>
                            {Object.keys(item.options).length > 0 && (
                              <Stack spacing={0.5} sx={{ mb: 1 }}>
                                {Object.entries(item.options).map(([key, opt]) => (
                                  <Typography
                                    key={key}
                                    variant="caption"
                                    sx={{ color: 'text.secondary' }}
                                  >
                                    {opt.name}: {opt.choice}
                                  </Typography>
                                ))}
                              </Stack>
                            )}
                            <Typography
                              variant="h6"
                              sx={{
                                fontWeight: 800,
                                color: 'secondary.main',
                              }}
                            >
                              {formatCurrency(
                                (item.unitPrice +
                                  Object.values(item.options).reduce(
                                    (sum, opt) => sum + (opt.price || 0),
                                    0
                                  )) *
                                  item.quantity
                              )}
                            </Typography>
                          </Box>
                        </Stack>

                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="center"
                        >
                          <Stack direction="row" spacing={1} alignItems="center">
                            <IconButton
                              component={motion.button}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              size="small"
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity - 1)
                              }
                              sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              <Remove fontSize="small" />
                            </IconButton>
                            <Typography
                              variant="body1"
                              sx={{
                                minWidth: 32,
                                textAlign: 'center',
                                fontWeight: 700,
                              }}
                            >
                              {item.quantity}
                            </Typography>
                            <IconButton
                              component={motion.button}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              size="small"
                              onClick={() =>
                                onUpdateQuantity(item.id, item.quantity + 1)
                              }
                              sx={{
                                border: '1px solid',
                                borderColor: 'divider',
                              }}
                            >
                              <Add fontSize="small" />
                            </IconButton>
                          </Stack>
                          <IconButton
                            component={motion.button}
                            whileHover={{ scale: 1.1, rotate: 90 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onRemoveItem(item.id)}
                            color="error"
                            size="small"
                          >
                            <Delete />
                          </IconButton>
                        </Stack>
                      </Stack>
                    </Paper>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Stack>
          )}
        </Box>

        {/* Footer with Summary */}
        {items.length > 0 && (
          <Box
            sx={{
              p: 3,
              backgroundColor: 'background.paper',
              borderTop: '1px solid',
              borderColor: 'divider',
            }}
          >
            <Stack spacing={2}>
              {/* Coupon Code */}
              <Box>
                <Stack direction="row" spacing={1}>
                  <TextField
                    fullWidth
                    size="small"
                    placeholder="Cupom de desconto"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    InputProps={{
                      startAdornment: <Discount sx={{ mr: 1, color: 'text.secondary' }} />,
                    }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleApplyCoupon}
                    sx={{ whiteSpace: 'nowrap' }}
                  >
                    Aplicar
                  </Button>
                </Stack>
                {discount > 0 && (
                  <Chip
                    label={`Desconto: -${formatCurrency(discount)}`}
                    color="success"
                    size="small"
                    sx={{ mt: 1 }}
                  />
                )}
              </Box>

              <Divider />

              {/* Summary */}
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Subtotal
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(subtotal)}
                  </Typography>
                </Stack>
                {deliveryType === 'delivery' && (
                  <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <LocalShipping sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Taxa de entrega
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(deliveryFee)}
                    </Typography>
                  </Stack>
                )}
                {deliveryType === 'pickup' && (
                  <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" spacing={0.5} alignItems="center">
                      <Store sx={{ fontSize: 16, color: 'text.secondary' }} />
                      <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                        Retirada
                      </Typography>
                    </Stack>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      Grátis
                    </Typography>
                  </Stack>
                )}
                {discount > 0 && (
                  <Stack direction="row" justifyContent="space-between">
                    <Typography variant="body2" sx={{ color: 'success.main' }}>
                      Desconto
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'success.main' }}>
                      -{formatCurrency(discount)}
                    </Typography>
                  </Stack>
                )}
                <Divider sx={{ my: 1 }} />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                    {formatCurrency(total)}
                  </Typography>
                </Stack>
              </Stack>

              <Button
                component={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                onClick={onCheckout}
                disabled={total < (restaurant?.minOrder || 0)}
                sx={(theme) => ({
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  boxShadow: `0px 4px 16px ${theme.palette.shadowColors.secondary}`,
                })}
              >
                Finalizar Pedido
              </Button>
              {total < (restaurant?.minOrder || 0) && (
                <Typography variant="caption" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                  Pedido mínimo: {formatCurrency(restaurant?.minOrder || 0)}
                </Typography>
              )}
            </Stack>
          </Box>
        )}
      </Box>
    </Drawer>
  );
};

export default CartSidebar;
