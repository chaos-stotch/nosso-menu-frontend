import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
} from '@mui/material';
import {
  TrendingUp as TrendingUpIcon,
  AttachMoney as AttachMoneyIcon,
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Store as StoreIcon,
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../../../utils/mockData';
import api from '../../../../services/api';
import { useAuth } from '../../../../contexts/AuthContext';

const PERIODS = {
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
  YEAR: 'year',
  ALL: 'all',
};

const PERIOD_LABELS = {
  [PERIODS.TODAY]: 'Hoje',
  [PERIODS.WEEK]: 'Últimos 7 dias',
  [PERIODS.MONTH]: 'Último mês',
  [PERIODS.YEAR]: 'Último ano',
  [PERIODS.ALL]: 'Todo período',
};

const COLORS = ['#dc2626', '#1a1a1a', '#4caf50', '#ffd700', '#2196f3', '#9c27b0'];

const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary', trend }) => (
  <Card
    component={motion.div}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    sx={{
      height: '100%',
      background: `linear-gradient(135deg, ${color === 'primary' ? '#1a1a1a' : color === 'secondary' ? '#dc2626' : color === 'success' ? '#4caf50' : '#ffd700'} 0%, ${color === 'primary' ? '#3a3a3a' : color === 'secondary' ? '#b91c1c' : color === 'success' ? '#388e3c' : '#ccac00'} 100%)`,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Avatar
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            width: 56,
            height: 56,
          }}
        >
          <Icon sx={{ fontSize: 32 }} />
        </Avatar>
        {trend && (
          <Chip
            label={trend > 0 ? `+${trend}%` : `${trend}%`}
            size="small"
            sx={{
              backgroundColor: trend > 0 ? 'rgba(76, 175, 80, 0.3)' : 'rgba(244, 67, 54, 0.3)',
              color: 'white',
              fontWeight: 600,
            }}
          />
        )}
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mt: 0.5 }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const RevenueAnalytics = () => {
  const { restaurant } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(PERIODS.MONTH);

  useEffect(() => {
    if (restaurant) {
      loadOrders();
    }
  }, [restaurant]);

  const loadOrders = async () => {
    if (!restaurant) return;

    try {
      setLoading(true);
      const data = await api.getOrders(restaurant.id);
      setOrders(data || []);
    } catch (err) {
      console.error('Error loading orders:', err);
    } finally {
      setLoading(false);
    }
  };

  // Filtrar pedidos por período
  const filteredOrders = useMemo(() => {
    if (!orders.length) return [];

    const now = new Date();
    const filterDate = new Date();

    switch (period) {
      case PERIODS.TODAY:
        filterDate.setHours(0, 0, 0, 0);
        break;
      case PERIODS.WEEK:
        filterDate.setDate(now.getDate() - 7);
        break;
      case PERIODS.MONTH:
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case PERIODS.YEAR:
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return orders;
    }

    return orders.filter((order) => {
      const orderDate = new Date(order.createdAt || order.created_at);
      return orderDate >= filterDate && order.status !== 'cancelled';
    });
  }, [orders, period]);

  // Calcular métricas principais
  const metrics = useMemo(() => {
    const totalRevenue = filteredOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const totalOrders = filteredOrders.length;
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const deliveryOrders = filteredOrders.filter(
      (o) => (o.deliveryType || o.delivery_type) === 'delivery'
    ).length;
    const pickupOrders = totalOrders - deliveryOrders;
    const platformFees = filteredOrders.reduce(
      (sum, order) => sum + (order.platformFee || order.platform_fee || 0),
      0
    );
    const netRevenue = totalRevenue - platformFees;

    return {
      totalRevenue,
      totalOrders,
      averageOrderValue,
      deliveryOrders,
      pickupOrders,
      platformFees,
      netRevenue,
    };
  }, [filteredOrders]);

  // Dados para gráfico de linha (faturamento ao longo do tempo)
  const revenueChartData = useMemo(() => {
    const dataMap = new Map();
    const now = new Date();

    // Inicializar todos os períodos com 0
    const days = period === PERIODS.TODAY ? 24 : period === PERIODS.WEEK ? 7 : period === PERIODS.MONTH ? 30 : 12;
    const isHourly = period === PERIODS.TODAY;
    const isDaily = period === PERIODS.WEEK || period === PERIODS.MONTH;
    const isMonthly = period === PERIODS.YEAR;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      if (isHourly) {
        date.setHours(date.getHours() - i, 0, 0, 0);
        dataMap.set(date.getHours() + ':00', 0);
      } else if (isDaily) {
        date.setDate(date.getDate() - i);
        const key = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        dataMap.set(key, 0);
      } else if (isMonthly) {
        date.setMonth(date.getMonth() - i);
        const key = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
        dataMap.set(key, 0);
      }
    }

    // Preencher com dados reais
    filteredOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt || order.created_at);
      let key;

      if (isHourly) {
        key = orderDate.getHours() + ':00';
      } else if (isDaily) {
        key = orderDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      } else if (isMonthly) {
        key = orderDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      }

      if (key && dataMap.has(key)) {
        dataMap.set(key, dataMap.get(key) + (order.total || 0));
      }
    });

    return Array.from(dataMap.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredOrders, period]);

  // Dados para gráfico de barras (pedidos por dia)
  const ordersChartData = useMemo(() => {
    const dataMap = new Map();
    const now = new Date();
    const days = period === PERIODS.TODAY ? 24 : period === PERIODS.WEEK ? 7 : period === PERIODS.MONTH ? 30 : 12;
    const isHourly = period === PERIODS.TODAY;
    const isDaily = period === PERIODS.WEEK || period === PERIODS.MONTH;
    const isMonthly = period === PERIODS.YEAR;

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(now);
      if (isHourly) {
        date.setHours(date.getHours() - i, 0, 0, 0);
        dataMap.set(date.getHours() + ':00', 0);
      } else if (isDaily) {
        date.setDate(date.getDate() - i);
        const key = date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
        dataMap.set(key, 0);
      } else if (isMonthly) {
        date.setMonth(date.getMonth() - i);
        const key = date.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
        dataMap.set(key, 0);
      }
    }

    filteredOrders.forEach((order) => {
      const orderDate = new Date(order.createdAt || order.created_at);
      let key;

      if (isHourly) {
        key = orderDate.getHours() + ':00';
      } else if (isDaily) {
        key = orderDate.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
      } else if (isMonthly) {
        key = orderDate.toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
      }

      if (key && dataMap.has(key)) {
        dataMap.set(key, dataMap.get(key) + 1);
      }
    });

    return Array.from(dataMap.entries()).map(([name, value]) => ({ name, value }));
  }, [filteredOrders, period]);

  // Dados para gráfico de pizza (métodos de pagamento)
  const paymentMethodData = useMemo(() => {
    const methods = {};
    filteredOrders.forEach((order) => {
      const method = order.paymentMethod || order.payment_method || 'pix';
      methods[method] = (methods[method] || 0) + 1;
    });

    return Object.entries(methods).map(([name, value]) => ({
      name: name === 'pix' ? 'PIX' : name === 'on_delivery' ? 'Na Entrega' : name,
      value,
    }));
  }, [filteredOrders]);

  // Dados para gráfico de pizza (tipo de entrega)
  const deliveryTypeData = useMemo(() => {
    const delivery = filteredOrders.filter(
      (o) => (o.deliveryType || o.delivery_type) === 'delivery'
    ).length;
    const pickup = filteredOrders.length - delivery;

    return [
      { name: 'Entrega', value: delivery },
      { name: 'Retirada', value: pickup },
    ];
  }, [filteredOrders]);

  // Top produtos vendidos
  const topProducts = useMemo(() => {
    const productMap = new Map();

    filteredOrders.forEach((order) => {
      (order.items || []).forEach((item) => {
        const productName = item.product?.name || item.productName || item.product_name || 'Produto';
        const quantity = item.quantity || 1;
        const total = (item.unitPrice || item.unit_price || 0) * quantity;

        if (productMap.has(productName)) {
          const existing = productMap.get(productName);
          productMap.set(productName, {
            name: productName,
            quantity: existing.quantity + quantity,
            revenue: existing.revenue + total,
          });
        } else {
          productMap.set(productName, {
            name: productName,
            quantity,
            revenue: total,
          });
        }
      });
    });

    return Array.from(productMap.values())
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);
  }, [filteredOrders]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', sm: 'row' },
          justifyContent: 'space-between', 
          alignItems: { xs: 'flex-start', sm: 'center' },
          mb: 4,
          gap: { xs: 2, sm: 0 },
        }}
      >
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 1,
              color: 'text.primary',
              fontSize: { xs: '1.5rem', sm: '2rem' },
            }}
          >
            Faturamento e Análises
          </Typography>
          <Typography 
            variant="body1" 
            sx={{ 
              color: 'text.secondary',
              fontSize: { xs: '0.875rem', sm: '1rem' },
            }}
          >
            Acompanhe suas vendas e métricas de faturamento
          </Typography>
        </Box>
        <FormControl 
          sx={{ 
            minWidth: { xs: '100%', sm: 200 },
            maxWidth: { xs: '100%', sm: 'none' },
          }}
        >
          <InputLabel>Período</InputLabel>
          <Select
            value={period}
            label="Período"
            onChange={(e) => setPeriod(e.target.value)}
          >
            {Object.entries(PERIOD_LABELS).map(([key, label]) => (
              <MenuItem key={key} value={key}>
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Cards de Métricas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={AttachMoneyIcon}
            title="Faturamento Total"
            value={formatCurrency(metrics.totalRevenue)}
            subtitle={`${metrics.totalOrders} pedidos`}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={TrendingUpIcon}
            title="Receita Líquida"
            value={formatCurrency(metrics.netRevenue)}
            subtitle={`Após taxas: ${formatCurrency(metrics.platformFees)}`}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={ShoppingCartIcon}
            title="Ticket Médio"
            value={formatCurrency(metrics.averageOrderValue)}
            subtitle={`${metrics.totalOrders} pedidos`}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={LocalShippingIcon}
            title="Pedidos"
            value={metrics.totalOrders}
            subtitle={`${metrics.deliveryOrders} entrega, ${metrics.pickupOrders} retirada`}
            color="#ffd700"
          />
        </Grid>
      </Grid>

      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfico de Faturamento */}
        <Grid item xs={12} md={8}>
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ p: 3, height: '100%' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Faturamento ao Longo do Tempo
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={revenueChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(value)} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#dc2626"
                  strokeWidth={3}
                  name="Faturamento"
                  dot={{ fill: '#dc2626', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfico de Métodos de Pagamento */}
        <Grid item xs={12} md={4}>
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ p: 3, height: '100%' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Métodos de Pagamento
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={paymentMethodData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {paymentMethodData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfico de Pedidos */}
        <Grid item xs={12} md={8}>
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ p: 3, height: '100%' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Quantidade de Pedidos
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={ordersChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#1a1a1a" name="Pedidos" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfico de Tipo de Entrega */}
        <Grid item xs={12} md={4}>
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ p: 3, height: '100%' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Tipo de Entrega
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={deliveryTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {deliveryTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Top Produtos */}
      <Paper
        component={motion.div}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ p: 3 }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
          Top Produtos Vendidos
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: 'action.hover' }}>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Produto</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Quantidade
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>
                  Faturamento
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {topProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Nenhum produto vendido no período selecionado
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                topProducts.map((product, index) => (
                  <TableRow
                    key={product.name}
                    sx={{
                      '&:hover': {
                        backgroundColor: 'action.hover',
                      },
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        #{index + 1}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {product.name}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body2">{product.quantity} unidades</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Typography variant="body1" sx={{ fontWeight: 600, color: 'secondary.main' }}>
                        {formatCurrency(product.revenue)}
                      </Typography>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default RevenueAnalytics;
