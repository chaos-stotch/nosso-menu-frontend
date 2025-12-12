import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Button,
  Stack,
  Divider,
  Chip,
  Avatar,
  Grid,
  Alert,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  CheckCircle as CheckCircleIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  LocalShipping as LocalShippingIcon,
  Store as StoreIcon,
  AccessTime as AccessTimeIcon,
  Fastfood as FastfoodIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useOrder, ORDER_STATUS, ORDER_STATUS_LABELS } from '../../contexts/OrderContext';
import { formatCurrency } from '../../utils/mockData';
import useRestaurant from '../../hooks/useRestaurant';
import RestaurantThemeProvider from '../../components/RestaurantThemeProvider/RestaurantThemeProvider';

const OrderTracking = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { currentOrder, ORDER_STATUS, ORDER_STATUS_LABELS, refreshOrder } = useOrder();
  const { restaurant } = useRestaurant(slug);

  useEffect(() => {
    if (!currentOrder) {
      if (slug) {
        navigate(`/${slug}`);
      } else {
        navigate('/');
      }
      return;
    }

    // Atualizar pedido a cada 3 segundos para ver mudanças em tempo real
    const interval = setInterval(async () => {
      if (currentOrder?.id && refreshOrder) {
        try {
          await refreshOrder(currentOrder.id);
        } catch (err) {
          console.error('Error refreshing order:', err);
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [currentOrder, navigate, refreshOrder, slug]);

  if (!currentOrder) {
    return null;
  }

  const getStatusSteps = () => {
    const isDelivery = currentOrder.deliveryType === 'delivery';
    
    const steps = [
      {
        status: ORDER_STATUS.PENDING_PAYMENT,
        label: 'Aguardando Pagamento',
        icon: <AccessTimeIcon />,
      },
      {
        status: ORDER_STATUS.CONFIRMED,
        label: 'Pedido Confirmado',
        icon: <CheckCircleIcon />,
      },
      {
        status: ORDER_STATUS.PREPARING,
        label: 'Em Preparação',
        icon: <AccessTimeIcon />,
      },
      {
        status: ORDER_STATUS.READY,
        label: isDelivery ? 'Pronto para Entrega' : 'Pronto para Retirada',
        icon: <CheckCircleIcon />,
      },
    ];

    if (isDelivery) {
      steps.push({
        status: ORDER_STATUS.OUT_FOR_DELIVERY,
        label: 'Saiu para Entrega',
        icon: <LocalShippingIcon />,
      });
    }

    steps.push({
      status: ORDER_STATUS.DELIVERED,
      label: isDelivery ? 'Entregue' : 'Retirado',
      icon: <CheckCircleIcon />,
    });

    return steps;
  };

  const steps = getStatusSteps();
  const currentStepIndex = steps.findIndex(
    (step) => step.status === currentOrder.status
  );
  const activeStep = currentStepIndex >= 0 ? currentStepIndex : 0;

  const getStatusColor = (status) => {
    if (status === ORDER_STATUS.DELIVERED) return 'success';
    if (status === ORDER_STATUS.CANCELLED) return 'error';
    if (status === ORDER_STATUS.PENDING_PAYMENT) return 'warning';
    return 'primary';
  };

  return (
    <RestaurantThemeProvider restaurant={restaurant}>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'background.default',
          py: 4,
        }}
      >
      <Container maxWidth="md">
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={() => slug ? navigate(`/${slug}`) : navigate('/')}
          sx={(theme) => ({ 
            mb: 3,
            '&:hover': {
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
            },
          })}
        >
          Voltar para o Cardápio
        </Button>

        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 4,
            color: 'text.primary',
          }}
        >
          Acompanhar Pedido
        </Typography>

        {/* Status Atual */}
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ p: 4, mb: 3 }}
        >
          <Stack spacing={3}>
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Pedido #{currentOrder.id}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                {ORDER_STATUS_LABELS[currentOrder.status]}
              </Typography>
              <Chip
                label={ORDER_STATUS_LABELS[currentOrder.status]}
                color={getStatusColor(currentOrder.status)}
                sx={{ fontWeight: 600 }}
              />
            </Box>

            <Divider />

            {/* Informações do Pedido */}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Data do Pedido
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {new Date(currentOrder.createdAt).toLocaleString('pt-BR')}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Tipo
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {currentOrder.deliveryType === 'delivery' ? (
                    <>
                      <LocalShippingIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} />
                      Entrega
                    </>
                  ) : (
                    <>
                      <StoreIcon sx={{ fontSize: 18, verticalAlign: 'middle', mr: 0.5 }} />
                      Retirada
                    </>
                  )}
                </Typography>
              </Grid>
              {currentOrder.deliveryType === 'delivery' && currentOrder.deliveryAddress && (
                <Grid item xs={12}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Endereço de Entrega
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {currentOrder.deliveryAddress.street}, {currentOrder.deliveryAddress.number}
                    {currentOrder.deliveryAddress.complement && ` - ${currentOrder.deliveryAddress.complement}`}
                    <br />
                    {currentOrder.deliveryAddress.neighborhood}
                    {currentOrder.deliveryAddress.city && ` - ${currentOrder.deliveryAddress.city}`}
                  </Typography>
                </Grid>
              )}
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Método de Pagamento
                </Typography>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  {currentOrder.paymentMethod === 'pix' ? 'PIX' : 'Pagar na Hora'}
                  {currentOrder.paymentSubMethod && ` (${currentOrder.paymentSubMethod === 'card' ? 'Cartão' : 'Dinheiro'})`}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                  Valor Total
                </Typography>
                <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                  {formatCurrency(currentOrder.total)}
                </Typography>
              </Grid>
            </Grid>
          </Stack>
        </Paper>

        {/* Timeline do Pedido */}
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          sx={{ p: 4 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Acompanhamento
          </Typography>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => {
              const isCompleted = index < activeStep;
              const isActive = index === activeStep;
              const isPending = index > activeStep;

              return (
                <Step key={step.status} completed={isCompleted} active={isActive}>
                  <StepLabel
                    StepIconComponent={() => (
                      <Avatar
                        sx={{
                          backgroundColor: isCompleted
                            ? 'success.main'
                            : isActive
                            ? 'primary.main'
                            : 'grey.300',
                          width: 40,
                          height: 40,
                        }}
                      >
                        {step.icon}
                      </Avatar>
                    )}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        fontWeight: isActive || isCompleted ? 700 : 400,
                        color: isPending ? 'text.secondary' : 'text.primary',
                      }}
                    >
                      {step.label}
                    </Typography>
                  </StepLabel>
                  {isActive && (() => {
                    let message = '';
                    if (step.status === ORDER_STATUS.PREPARING) {
                      message = 'Seu pedido está sendo preparado com carinho!';
                    } else if (step.status === ORDER_STATUS.READY && currentOrder.deliveryType === 'pickup') {
                      message = 'Seu pedido está pronto para retirada!';
                    } else if (step.status === ORDER_STATUS.OUT_FOR_DELIVERY) {
                      message = 'Seu pedido saiu para entrega. Em breve chegará!';
                    } else if (step.status === ORDER_STATUS.DELIVERED) {
                      message = 'Pedido entregue com sucesso! Obrigado pela preferência.';
                    }
                    
                    return message ? (
                    <StepContent>
                      <Alert severity="info" sx={{ mt: 1 }}>
                          {message}
                      </Alert>
                    </StepContent>
                    ) : null;
                  })()}
                </Step>
              );
            })}
          </Stepper>
        </Paper>

        {/* Itens do Pedido */}
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          sx={{ p: 4, mt: 3 }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
            Itens do Pedido
          </Typography>
          <Stack spacing={2}>
            {currentOrder.items.map((item, index) => {
              const optionsPrice = Object.values(item.options || {}).reduce(
                (sum, opt) => sum + (opt.price || 0),
                0
              );
              const unitPrice = item.unitPrice || item.unit_price || 0;
              const quantity = item.quantity || 1;
              const itemTotal = (unitPrice + optionsPrice) * quantity;
              
              // Compatibilidade: pode vir como item.product ou item.productName
              const productName = item.product?.name || item.productName || item.product_name || 'Produto';
              const productImage = item.product?.image || item.productImage || item.product_image;

              return (
                <Box key={item.id || index} sx={{ display: 'flex', gap: 2 }}>
                  <Avatar
                    src={productImage}
                    alt={productName}
                    variant="rounded"
                    sx={{ width: 60, height: 60 }}
                  >
                    <FastfoodIcon />
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {productName}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                      Qtd: {quantity}
                    </Typography>
                    {Object.keys(item.options || {}).length > 0 && (
                      <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                        {Object.entries(item.options)
                          .map(([key, opt]) => `${opt.name}: ${opt.choice}`)
                          .join(', ')}
                      </Typography>
                    )}
                  </Box>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency(itemTotal)}
                  </Typography>
                </Box>
              );
            })}
          </Stack>
        </Paper>
      </Container>
    </Box>
    </RestaurantThemeProvider>
  );
};

export default OrderTracking;
