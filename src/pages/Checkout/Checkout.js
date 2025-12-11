import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  TextField,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  Divider,
  Stack,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  LocalShipping as LocalShippingIcon,
  Store as StoreIcon,
  CreditCard as CreditCardIcon,
  Money as MoneyIcon,
  QrCode as QrCodeIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useCartContext } from '../../contexts/CartContext';
import { useDelivery } from '../../contexts/DeliveryContext';
import { useOrder } from '../../contexts/OrderContext';
import useRestaurant from '../../hooks/useRestaurant';
import RestaurantThemeProvider from '../../components/RestaurantThemeProvider/RestaurantThemeProvider';
import { formatCurrency } from '../../utils/mockData';
import PixQRCode from '../../components/PixQRCode/PixQRCode';

const Checkout = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { items, getSubtotal, clearCart } = useCartContext();
  const { deliveryType } = useDelivery();
  const { restaurant, loading: restaurantLoading } = useRestaurant(slug);
  const { createOrder, markPaymentAsPaid, currentOrder } = useOrder();
  
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentSubMethod, setPaymentSubMethod] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState({
    street: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    zipCode: '',
    reference: '',
  });
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
  });
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [showPixQRCode, setShowPixQRCode] = useState(false);

  // Redirecionar se não tiver slug
  React.useEffect(() => {
    if (!slug) {
      navigate('/');
    }
  }, [slug, navigate]);

  // Redirecionar se não tiver itens no carrinho
  React.useEffect(() => {
    if (items.length === 0 && !orderPlaced) {
      if (slug) {
        navigate(`/${slug}`);
      } else {
        navigate('/');
      }
    }
  }, [items, orderPlaced, slug, navigate]);

  const subtotal = getSubtotal();
  const deliveryFee = deliveryType === 'delivery' ? (restaurant?.deliveryFee || 0) : 0;
  // Taxa de 5% apenas para pagamentos via PIX
  const platformFee = paymentMethod === 'pix' ? (subtotal + deliveryFee) * 0.05 : 0;
  const total = subtotal + deliveryFee + platformFee;

  // Mostrar loading enquanto carrega restaurante
  if (restaurantLoading || !restaurant) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  const handlePaymentMethodChange = (event) => {
    const method = event.target.value;
    setPaymentMethod(method);
    if (method === 'pix') {
      setPaymentSubMethod('');
    }
  };

  const handlePaymentSubMethodChange = (event) => {
    setPaymentSubMethod(event.target.value);
  };

  const handleAddressChange = (field, value) => {
    setDeliveryAddress((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const isFormValid = () => {
    if (!customerInfo.name || !customerInfo.phone) return false;
    if (deliveryType === 'delivery') {
      if (!deliveryAddress.street || !deliveryAddress.number || !deliveryAddress.neighborhood) {
        return false;
      }
    }
    if (!paymentMethod) return false;
    if (paymentMethod === 'on_delivery' && !paymentSubMethod) return false;
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!isFormValid()) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    if (!restaurant || !restaurant.id) {
      alert('Erro: Restaurante não encontrado. Por favor, recarregue a página.');
      return;
    }

    try {
      // Criar pedido
      const orderData = {
        items: [...items],
        customerInfo,
        deliveryType,
        deliveryAddress: deliveryType === 'delivery' ? deliveryAddress : null,
        paymentMethod,
        paymentSubMethod: paymentMethod === 'on_delivery' ? paymentSubMethod : null,
        subtotal,
        deliveryFee,
        platformFee,
        total,
        restaurant: {
          id: restaurant.id,
          name: restaurant.name,
          address: restaurant.address,
          phone: restaurant.phone,
        },
      };

      console.log('Criando pedido com dados:', {
        restaurantId: restaurant.id,
        customerName: customerInfo.name,
        itemsCount: items.length,
        total: total,
      });

      const order = await createOrder(orderData);

      // Se for PIX, mostrar QR code
      if (paymentMethod === 'pix') {
        setShowPixQRCode(true);
      } else {
        // Se não for PIX, pedido confirmado direto
        setOrderPlaced(true);
        setTimeout(() => {
          clearCart();
          if (slug) {
            navigate(`/${slug}/order-tracking`);
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      alert(`Erro ao criar pedido: ${error.message || 'Verifique se o backend está rodando e tente novamente.'}`);
    }
  };

  const handlePixPaymentConfirmed = async () => {
    if (currentOrder) {
      markPaymentAsPaid(currentOrder.id);
      setShowPixQRCode(false);
      setOrderPlaced(true);
      setTimeout(() => {
        clearCart();
        if (slug) {
          navigate(`/${slug}/order-tracking`);
        }
      }, 2000);
    }
  };

  // Mostrar QR Code PIX se necessário
  if (showPixQRCode && currentOrder) {
    return (
      <RestaurantThemeProvider restaurant={restaurant}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.default',
            p: 3,
          }}
        >
          <Container maxWidth="sm">
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => {
                setShowPixQRCode(false);
                setOrderPlaced(false);
              }}
              sx={{ mb: 3 }}
            >
              Voltar
            </Button>
            <PixQRCode
              amount={currentOrder.total}
              orderId={currentOrder.id}
              restaurant={restaurant}
              onPaymentConfirmed={handlePixPaymentConfirmed}
            />
          </Container>
        </Box>
      </RestaurantThemeProvider>
    );
  }

  if (orderPlaced) {
    return (
      <RestaurantThemeProvider restaurant={restaurant}>
        <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.default',
          p: 3,
        }}
      >
        <Paper
          component={motion.div}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          sx={{
            p: 6,
            textAlign: 'center',
            maxWidth: 500,
            width: '100%',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
          >
            <CheckCircleIcon
              sx={{
                fontSize: 80,
                color: 'success.main',
                mb: 3,
              }}
            />
          </motion.div>
          <Typography variant="h4" sx={{ fontWeight: 800, mb: 2 }}>
            Pedido Confirmado!
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary', mb: 4 }}>
            Seu pedido foi recebido com sucesso. Você receberá uma confirmação em breve.
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary' }}>
            Redirecionando para acompanhamento...
          </Typography>
        </Paper>
      </Box>
      </RestaurantThemeProvider>
    );
  }

  if (items.length === 0) {
    return (
      <RestaurantThemeProvider restaurant={restaurant}>
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'background.default',
          }}
        >
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Seu carrinho está vazio
            </Typography>
            <Button variant="contained" onClick={() => slug ? navigate(`/${slug}`) : navigate('/')}>
              Voltar para o cardápio
            </Button>
          </Paper>
        </Box>
      </RestaurantThemeProvider>
    );
  }

  return (
    <RestaurantThemeProvider restaurant={restaurant}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          py: 4,
        }}
      >
      <Container maxWidth="lg">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => slug ? navigate(`/${slug}`) : navigate('/')}
          sx={{ mb: 3 }}
        >
          Voltar
        </Button>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 4,
            color: 'text.primary',
          }}
        >
          Finalizar Pedido
        </Typography>

        <Grid container spacing={4}>
          {/* Formulário */}
          <Grid item xs={12} md={8}>
            <Stack spacing={3}>
              {/* Informações do Cliente */}
              <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                sx={{ p: 3 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Informações de Contato
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nome completo *"
                      value={customerInfo.name}
                      onChange={(e) => handleCustomerInfoChange('name', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Telefone *"
                      value={customerInfo.phone}
                      onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                      required
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="E-mail"
                      type="email"
                      value={customerInfo.email}
                      onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                    />
                  </Grid>
                </Grid>
              </Paper>

              {/* Endereço de Entrega */}
              {deliveryType === 'delivery' && (
                <Paper
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  sx={{ p: 3 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
                    <LocalShippingIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Endereço de Entrega
                    </Typography>
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={8}>
                      <TextField
                        fullWidth
                        label="Rua *"
                        value={deliveryAddress.street}
                        onChange={(e) => handleAddressChange('street', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="Número *"
                        value={deliveryAddress.number}
                        onChange={(e) => handleAddressChange('number', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Complemento"
                        value={deliveryAddress.complement}
                        onChange={(e) => handleAddressChange('complement', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="Bairro *"
                        value={deliveryAddress.neighborhood}
                        onChange={(e) => handleAddressChange('neighborhood', e.target.value)}
                        required
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        label="CEP"
                        value={deliveryAddress.zipCode}
                        onChange={(e) => handleAddressChange('zipCode', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label="Cidade"
                        value={deliveryAddress.city}
                        onChange={(e) => handleAddressChange('city', e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        multiline
                        rows={2}
                        label="Ponto de referência"
                        value={deliveryAddress.reference}
                        onChange={(e) => handleAddressChange('reference', e.target.value)}
                        placeholder="Ex: Próximo ao mercado, em frente à escola..."
                      />
                    </Grid>
                  </Grid>
                </Paper>
              )}

              {/* Tipo de Entrega */}
              {deliveryType === 'pickup' && (
                <Paper
                  component={motion.div}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  sx={{ p: 3 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <StoreIcon color="primary" />
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Retirada no Restaurante
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {restaurant?.address || 'Endereço do restaurante'}
                  </Typography>
                </Paper>
              )}

              {/* Método de Pagamento */}
              <Paper
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                sx={{ p: 3 }}
              >
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Método de Pagamento
                </Typography>

                <FormControl component="fieldset" fullWidth>
                  <RadioGroup
                    value={paymentMethod}
                    onChange={handlePaymentMethodChange}
                  >
                    {/* PIX */}
                    <Paper
                      component={motion.div}
                      whileHover={{ scale: 1.02 }}
                      sx={{
                        p: 2,
                        mb: 2,
                        border: paymentMethod === 'pix' ? '2px solid' : '1px solid',
                        borderColor: paymentMethod === 'pix' ? 'primary.main' : 'divider',
                        backgroundColor: paymentMethod === 'pix' ? 'action.selected' : 'transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => setPaymentMethod('pix')}
                    >
                      <FormControlLabel
                        value="pix"
                        control={<Radio />}
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, ml: 1 }}>
                            <Avatar
                              sx={{
                                backgroundColor: '#32BCAD',
                                width: 40,
                                height: 40,
                              }}
                            >
                              <QrCodeIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                PIX
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                Pagamento instantâneo
                              </Typography>
                            </Box>
                          </Box>
                        }
                        sx={{ m: 0, width: '100%' }}
                      />
                    </Paper>

                    {/* Pagar na Hora */}
                    <Paper
                      component={motion.div}
                      whileHover={{ scale: 1.02 }}
                      sx={{
                        p: 2,
                        border: paymentMethod === 'on_delivery' ? '2px solid' : '1px solid',
                        borderColor: paymentMethod === 'on_delivery' ? 'primary.main' : 'divider',
                        backgroundColor: paymentMethod === 'on_delivery' ? 'action.selected' : 'transparent',
                        cursor: 'pointer',
                      }}
                      onClick={() => setPaymentMethod('on_delivery')}
                    >
                      <FormControlLabel
                        value="on_delivery"
                        control={<Radio />}
                        label={
                          <Box sx={{ ml: 1 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: paymentMethod === 'on_delivery' ? 2 : 0 }}>
                              <Avatar
                                sx={{
                                  backgroundColor: 'secondary.main',
                                  width: 40,
                                  height: 40,
                                }}
                              >
                                <MoneyIcon />
                              </Avatar>
                              <Box>
                                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                  Pagar na Hora
                                </Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                  {deliveryType === 'delivery' ? 'Na entrega' : 'Na retirada'}
                                </Typography>
                              </Box>
                            </Box>
                            {paymentMethod === 'on_delivery' && (
                              <Box sx={{ ml: 7, mt: 2 }}>
                                <FormControl component="fieldset" fullWidth>
                                  <RadioGroup
                                    value={paymentSubMethod}
                                    onChange={handlePaymentSubMethodChange}
                                  >
                                    <FormControlLabel
                                      value="card"
                                      control={<Radio size="small" />}
                                      label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <CreditCardIcon fontSize="small" />
                                          <Typography variant="body2">Maquininha (Cartão)</Typography>
                                        </Box>
                                      }
                                    />
                                    <FormControlLabel
                                      value="cash"
                                      control={<Radio size="small" />}
                                      label={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                          <MoneyIcon fontSize="small" />
                                          <Typography variant="body2">Dinheiro</Typography>
                                        </Box>
                                      }
                                    />
                                  </RadioGroup>
                                </FormControl>
                              </Box>
                            )}
                          </Box>
                        }
                        sx={{ m: 0, width: '100%' }}
                      />
                    </Paper>
                  </RadioGroup>
                </FormControl>
              </Paper>
            </Stack>
          </Grid>

          {/* Resumo do Pedido */}
          <Grid item xs={12} md={4}>
            <Paper
              component={motion.div}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              sx={{
                p: 3,
                position: 'sticky',
                top: 24,
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                Resumo do Pedido
              </Typography>

              {/* Itens */}
              <Stack spacing={2} sx={{ mb: 3 }}>
                {items.map((item) => {
                  const optionsPrice = Object.values(item.options).reduce(
                    (sum, opt) => sum + (opt.price || 0),
                    0
                  );
                  const itemTotal = (item.unitPrice + optionsPrice) * item.quantity;

                  return (
                    <Box key={item.id}>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Avatar
                          src={item.product.image}
                          alt={item.product.name}
                          variant="rounded"
                          sx={{ width: 60, height: 60 }}
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {item.product.name}
                          </Typography>
                          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                            Qtd: {item.quantity}
                          </Typography>
                          {Object.keys(item.options).length > 0 && (
                            <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                              {Object.entries(item.options)
                                .map(([key, opt]) => `${opt.name}: ${opt.choice}`)
                                .join(', ')}
                            </Typography>
                          )}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(itemTotal)}
                        </Typography>
                      </Box>
                    </Box>
                  );
                })}
              </Stack>

              <Divider sx={{ my: 2 }} />

              {/* Totais */}
              <Stack spacing={1.5}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    Subtotal
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {formatCurrency(subtotal)}
                  </Typography>
                </Box>
                {deliveryType === 'delivery' && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Taxa de entrega
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(deliveryFee)}
                    </Typography>
                  </Box>
                )}
                {paymentMethod === 'pix' && platformFee > 0 && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Taxa de plataforma (5%)
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {formatCurrency(platformFee)}
                    </Typography>
                  </Box>
                )}
                <Divider />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>
                    Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                    {formatCurrency(total)}
                  </Typography>
                </Box>
              </Stack>

              <Button
                component={motion.button}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                variant="contained"
                color="secondary"
                size="large"
                fullWidth
                onClick={handlePlaceOrder}
                disabled={!isFormValid()}
                sx={{
                  mt: 3,
                  py: 1.5,
                  fontSize: '1.1rem',
                  fontWeight: 700,
                }}
              >
                Confirmar Pedido
              </Button>

              {!isFormValid() && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  Preencha todos os campos obrigatórios para continuar
                </Alert>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
    </RestaurantThemeProvider>
  );
};

export default Checkout;
