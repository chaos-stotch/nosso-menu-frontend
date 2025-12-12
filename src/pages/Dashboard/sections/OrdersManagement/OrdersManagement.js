import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
  Stack,
  Divider,
  Avatar,
  IconButton,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import {
  Refresh as RefreshIcon,
  Visibility as VisibilityIcon,
  LocalShipping as LocalShippingIcon,
  Store as StoreIcon,
  AccessTime as AccessTimeIcon,
  ExpandMore as ExpandMoreIcon,
  Today as TodayIcon,
  History as HistoryIcon,
  Fastfood as FastfoodIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../../../utils/mockData';
import api from '../../../../services/api';
import { useAuth } from '../../../../contexts/AuthContext';

const ORDER_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING_PAYMENT]: 'Aguardando Pagamento',
  [ORDER_STATUS.CONFIRMED]: 'Confirmado',
  [ORDER_STATUS.PREPARING]: 'Em Preparação',
  [ORDER_STATUS.READY]: 'Pronto',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Saiu para Entrega',
  [ORDER_STATUS.DELIVERED]: 'Entregue',
  [ORDER_STATUS.CANCELLED]: 'Cancelado',
};

const STATUS_COLORS = {
  [ORDER_STATUS.PENDING_PAYMENT]: 'warning',
  [ORDER_STATUS.CONFIRMED]: 'info',
  [ORDER_STATUS.PREPARING]: 'primary',
  [ORDER_STATUS.READY]: 'success',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'secondary',
  [ORDER_STATUS.DELIVERED]: 'success',
  [ORDER_STATUS.CANCELLED]: 'error',
};

const STATUS_OPTIONS = [
  { value: ORDER_STATUS.CONFIRMED, label: 'Confirmar Pedido' },
  { value: ORDER_STATUS.PREPARING, label: 'Em Preparação' },
  { value: ORDER_STATUS.READY, label: 'Pronto' },
  { value: ORDER_STATUS.OUT_FOR_DELIVERY, label: 'Saiu para Entrega' },
  { value: ORDER_STATUS.DELIVERED, label: 'Entregue' },
  { value: ORDER_STATUS.CANCELLED, label: 'Cancelar' },
];

const OrdersManagement = () => {
  const { restaurant } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    if (restaurant) {
      loadOrders();
      // Atualizar a cada 5 segundos
      const interval = setInterval(loadOrders, 5000);
      return () => clearInterval(interval);
    }
  }, [restaurant]);

  // Abrir pedido quando orderId estiver na URL
  useEffect(() => {
    const orderId = searchParams.get('orderId');
    if (orderId && orders.length > 0 && !openDialog && !selectedOrder) {
      const order = orders.find(o => o.id === orderId);
      if (order) {
        setSelectedOrder(order);
        setOpenDialog(true);
        // Remover orderId da URL após abrir
        const newSearchParams = new URLSearchParams(searchParams);
        newSearchParams.delete('orderId');
        setSearchParams(newSearchParams, { replace: true });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orders.length]);

  const loadOrders = async () => {
    if (!restaurant) return;
    
    try {
      const data = await api.getOrders(restaurant.id);
      // Ordenar por data (mais recentes primeiro)
      const sortedOrders = (data || []).sort((a, b) => {
        return new Date(b.createdAt || b.created_at) - new Date(a.createdAt || a.created_at);
      });
      setOrders(sortedOrders);
      setError(null);
    } catch (err) {
      console.error('Error loading orders:', err);
      if (loading) {
        setError('Erro ao carregar pedidos. Verifique se o backend está rodando.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdating(true);
      setError(null);
      
      await api.updateOrder(orderId, { status: newStatus });
      
      // Atualizar lista
      await loadOrders();
    } catch (err) {
      console.error('Error updating order:', err);
      setError(err.message || 'Erro ao atualizar status do pedido');
    } finally {
      setUpdating(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
    // Remover orderId da URL ao fechar
    if (searchParams.get('orderId')) {
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete('orderId');
      setSearchParams(newSearchParams, { replace: true });
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDateOnly = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const isToday = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isActiveOrder = (status) => {
    return status !== ORDER_STATUS.DELIVERED && status !== ORDER_STATUS.CANCELLED;
  };

  // Agrupar pedidos por data
  const groupedOrders = useMemo(() => {
    const active = [];
    const today = [];
    const history = {};

    orders.forEach((order) => {
      const orderDate = order.createdAt || order.created_at;
      const dateKey = orderDate ? new Date(orderDate).toDateString() : 'Sem data';

      if (isActiveOrder(order.status)) {
        active.push(order);
      } else if (isToday(orderDate)) {
        today.push(order);
      } else {
        if (!history[dateKey]) {
          history[dateKey] = [];
        }
        history[dateKey].push(order);
      }
    });

    // Ordenar histórico por data (mais recente primeiro)
    const sortedHistory = Object.entries(history).sort((a, b) => {
      return new Date(b[0]) - new Date(a[0]);
    });

    return { active, today, history: sortedHistory };
  }, [orders]);

  const getStatusOptions = (currentStatus) => {
    // Filtrar opções baseado no status atual
    if (currentStatus === ORDER_STATUS.PENDING_PAYMENT) {
      return STATUS_OPTIONS.filter(s => 
        s.value === ORDER_STATUS.CONFIRMED || s.value === ORDER_STATUS.CANCELLED
      );
    }
    if (currentStatus === ORDER_STATUS.CONFIRMED) {
      return STATUS_OPTIONS.filter(s => 
        s.value === ORDER_STATUS.PREPARING || s.value === ORDER_STATUS.CANCELLED
      );
    }
    if (currentStatus === ORDER_STATUS.PREPARING) {
      return STATUS_OPTIONS.filter(s => 
        s.value === ORDER_STATUS.READY || s.value === ORDER_STATUS.CANCELLED
      );
    }
    if (currentStatus === ORDER_STATUS.READY) {
      return STATUS_OPTIONS.filter(s => 
        s.value === ORDER_STATUS.OUT_FOR_DELIVERY || 
        s.value === ORDER_STATUS.DELIVERED ||
        s.value === ORDER_STATUS.CANCELLED
      );
    }
    if (currentStatus === ORDER_STATUS.OUT_FOR_DELIVERY) {
      return STATUS_OPTIONS.filter(s => 
        s.value === ORDER_STATUS.DELIVERED
      );
    }
    return [];
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }}>
          Pedidos
        </Typography>
        <Button
          variant="outlined"
          startIcon={<RefreshIcon />}
          onClick={loadOrders}
          disabled={updating}
        >
          Atualizar
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ overflow: 'hidden' }}
      >
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          sx={{ borderBottom: 1, borderColor: 'divider' }}
        >
          <Tab
            icon={<AccessTimeIcon />}
            iconPosition="start"
            label={`Ativos (${groupedOrders.active.length})`}
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<TodayIcon />}
            iconPosition="start"
            label={`Hoje (${groupedOrders.today.length})`}
            sx={{ fontWeight: 600 }}
          />
          <Tab
            icon={<HistoryIcon />}
            iconPosition="start"
            label={`Histórico (${groupedOrders.history.reduce((sum, [, orders]) => sum + orders.length, 0)})`}
            sx={{ fontWeight: 600 }}
          />
        </Tabs>

        {/* Pedidos Ativos */}
        {tabValue === 0 && (
          <Box sx={{ p: 3 }}>
            {groupedOrders.active.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Nenhum pedido ativo no momento
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Data</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Itens</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedOrders.active.map((order) => {
                  const statusOptions = getStatusOptions(order.status);
                  const itemsCount = order.items?.length || 0;
                  
                  return (
                    <TableRow
                      key={order.id}
                      sx={{
                        '&:hover': {
                          backgroundColor: 'action.hover',
                        },
                      }}
                    >
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          #{order.id.slice(-8)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {formatDate(order.createdAt || order.created_at)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {order.customerName || order.customer_name || 'Cliente'}
                        </Typography>
                        {order.customerPhone && (
                          <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                            {order.customerPhone || order.customer_phone}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        {order.deliveryType === 'delivery' || order.delivery_type === 'delivery' ? (
                          <Chip
                            icon={<LocalShippingIcon />}
                            label="Entrega"
                            size="small"
                            color="primary"
                            variant="outlined"
                          />
                        ) : (
                          <Chip
                            icon={<StoreIcon />}
                            label="Retirada"
                            size="small"
                            color="secondary"
                            variant="outlined"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">
                          {itemsCount} {itemsCount === 1 ? 'item' : 'itens'}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {formatCurrency(order.total)}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={ORDER_STATUS_LABELS[order.status] || order.status}
                          color={STATUS_COLORS[order.status] || 'default'}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      </TableCell>
                      <TableCell>
                        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                          {statusOptions.length > 0 && (
                            <FormControl size="small" sx={{ minWidth: 150 }}>
                              <Select
                                value={order.status}
                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                disabled={updating}
                                sx={{ fontSize: '0.875rem' }}
                              >
                                <MenuItem value={order.status} disabled>
                                  {ORDER_STATUS_LABELS[order.status]}
                                </MenuItem>
                                {statusOptions.map((option) => (
                                  <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          )}
                          <IconButton
                            size="small"
                            onClick={() => handleViewOrder(order)}
                            color="primary"
                          >
                            <VisibilityIcon />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {/* Pedidos de Hoje */}
        {tabValue === 1 && (
          <Box sx={{ p: 3 }}>
            {groupedOrders.today.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Nenhum pedido finalizado hoje
                </Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Hora</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Itens</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Ações</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {groupedOrders.today.map((order) => {
                      const itemsCount = order.items?.length || 0;
                      
                      return (
                        <TableRow
                          key={order.id}
                          sx={{
                            '&:hover': {
                              backgroundColor: 'action.hover',
                            },
                          }}
                        >
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              #{order.id.slice(-8)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {new Date(order.createdAt || order.created_at).toLocaleTimeString('pt-BR', {
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {order.customerName || order.customer_name || 'Cliente'}
                            </Typography>
                            {order.customerPhone && (
                              <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
                                {order.customerPhone || order.customer_phone}
                              </Typography>
                            )}
                          </TableCell>
                          <TableCell>
                            {order.deliveryType === 'delivery' || order.delivery_type === 'delivery' ? (
                              <Chip
                                icon={<LocalShippingIcon />}
                                label="Entrega"
                                size="small"
                                color="primary"
                                variant="outlined"
                              />
                            ) : (
                              <Chip
                                icon={<StoreIcon />}
                                label="Retirada"
                                size="small"
                                color="secondary"
                                variant="outlined"
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2">
                              {itemsCount} {itemsCount === 1 ? 'item' : 'itens'}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {formatCurrency(order.total)}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={ORDER_STATUS_LABELS[order.status] || order.status}
                              color={STATUS_COLORS[order.status] || 'default'}
                              size="small"
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <IconButton
                              size="small"
                              onClick={() => handleViewOrder(order)}
                              color="primary"
                            >
                              <VisibilityIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Box>
        )}

        {/* Histórico */}
        {tabValue === 2 && (
          <Box sx={{ p: 3 }}>
            {groupedOrders.history.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Typography variant="body1" sx={{ color: 'text.secondary' }}>
                  Nenhum pedido no histórico
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2}>
                {groupedOrders.history.map(([dateKey, dateOrders]) => (
                  <Accordion key={dateKey} defaultExpanded={false}>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      sx={{
                        backgroundColor: 'action.hover',
                        '&:hover': {
                          backgroundColor: 'action.selected',
                        },
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, flex: 1 }}>
                          {formatDateOnly(dateOrders[0].createdAt || dateOrders[0].created_at)}
                        </Typography>
                        <Chip
                          label={`${dateOrders.length} ${dateOrders.length === 1 ? 'pedido' : 'pedidos'}`}
                          size="small"
                          color="primary"
                          variant="outlined"
                        />
                        <Typography variant="body2" sx={{ color: 'text.secondary', minWidth: 120, textAlign: 'right' }}>
                          Total: {formatCurrency(
                            dateOrders.reduce((sum, order) => sum + (order.total || 0), 0)
                          )}
                        </Typography>
                      </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                      <TableContainer>
                        <Table size="small">
                          <TableHead>
                            <TableRow>
                              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Hora</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Cliente</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Tipo</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Itens</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                              <TableCell sx={{ fontWeight: 700 }}>Ações</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {dateOrders.map((order) => {
                              const itemsCount = order.items?.length || 0;
                              
                              return (
                                <TableRow
                                  key={order.id}
                                  sx={{
                                    '&:hover': {
                                      backgroundColor: 'action.hover',
                                    },
                                  }}
                                >
                                  <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      #{order.id.slice(-8)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {new Date(order.createdAt || order.created_at).toLocaleTimeString('pt-BR', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                      })}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {order.customerName || order.customer_name || 'Cliente'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    {order.deliveryType === 'delivery' || order.delivery_type === 'delivery' ? (
                                      <Chip
                                        icon={<LocalShippingIcon />}
                                        label="Entrega"
                                        size="small"
                                        color="primary"
                                        variant="outlined"
                                      />
                                    ) : (
                                      <Chip
                                        icon={<StoreIcon />}
                                        label="Retirada"
                                        size="small"
                                        color="secondary"
                                        variant="outlined"
                                      />
                                    )}
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2">
                                      {itemsCount} {itemsCount === 1 ? 'item' : 'itens'}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                      {formatCurrency(order.total)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={ORDER_STATUS_LABELS[order.status] || order.status}
                                      color={STATUS_COLORS[order.status] || 'default'}
                                      size="small"
                                      sx={{ fontWeight: 600 }}
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <IconButton
                                      size="small"
                                      onClick={() => handleViewOrder(order)}
                                      color="primary"
                                    >
                                      <VisibilityIcon />
                                    </IconButton>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </AccordionDetails>
                  </Accordion>
                ))}
              </Stack>
            )}
          </Box>
        )}
      </Paper>

      {/* Dialog de Detalhes do Pedido */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
        }}
      >
        {selectedOrder && (
          <>
            <DialogTitle sx={{ fontWeight: 700 }}>
              Pedido #{selectedOrder.id.slice(-8)}
            </DialogTitle>
            <DialogContent>
              <Grid container spacing={3} sx={{ mt: 1 }}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Data
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatDate(selectedOrder.createdAt || selectedOrder.created_at)}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Status
                  </Typography>
                  <Chip
                    label={ORDER_STATUS_LABELS[selectedOrder.status] || selectedOrder.status}
                    color={STATUS_COLORS[selectedOrder.status] || 'default'}
                    sx={{ fontWeight: 600 }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Cliente
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {selectedOrder.customerName || selectedOrder.customer_name || 'Cliente'}
                  </Typography>
                  {selectedOrder.customerPhone && (
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      {selectedOrder.customerPhone || selectedOrder.customer_phone}
                    </Typography>
                  )}
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Tipo
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {(selectedOrder.deliveryType || selectedOrder.delivery_type) === 'delivery' ? (
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
                {(selectedOrder.deliveryType === 'delivery' || selectedOrder.delivery_type === 'delivery') && 
                 selectedOrder.deliveryAddress && (
                  <Grid item xs={12}>
                    <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                      Endereço de Entrega
                    </Typography>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {selectedOrder.deliveryAddress?.street || selectedOrder.delivery_address?.street}, {' '}
                      {selectedOrder.deliveryAddress?.number || selectedOrder.delivery_address?.number}
                      {selectedOrder.deliveryAddress?.complement && 
                        ` - ${selectedOrder.deliveryAddress.complement}`}
                      <br />
                      {selectedOrder.deliveryAddress?.neighborhood || selectedOrder.delivery_address?.neighborhood}
                      {selectedOrder.deliveryAddress?.city && 
                        ` - ${selectedOrder.deliveryAddress.city}`}
                    </Typography>
                  </Grid>
                )}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                    Itens do Pedido
                  </Typography>
                  <Stack spacing={2}>
                    {(selectedOrder.items || []).map((item, index) => {
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
                        <Box key={index} sx={{ display: 'flex', gap: 2 }}>
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
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Método de Pagamento
                  </Typography>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {(selectedOrder.paymentMethod || selectedOrder.payment_method) === 'pix' ? 'PIX' : 'Pagar na Hora'}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    Valor Total
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                    {formatCurrency(selectedOrder.total)}
                  </Typography>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
              <Button onClick={handleCloseDialog}>Fechar</Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default OrdersManagement;

