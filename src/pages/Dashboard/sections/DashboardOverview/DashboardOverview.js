import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  Avatar,
  Button,
} from '@mui/material';
import {
  Fastfood as FastfoodIcon,
  Category as CategoryIcon,
  LocalOffer as LocalOfferIcon,
  TrendingUp as TrendingUpIcon,
  Restaurant as RestaurantIcon,
  Link as LinkIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../../../utils/mockData';
import api from '../../../../services/api';
import { useAuth } from '../../../../contexts/AuthContext';

const StatCard = ({ icon: Icon, title, value, subtitle, color = 'primary' }) => (
  <Card
    component={motion.div}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    sx={{
      height: '100%',
      background: `linear-gradient(135deg, ${color === 'primary' ? '#1a1a1a' : color === 'secondary' ? '#ff6b19' : color === 'success' ? '#4caf50' : '#ffd700'} 0%, ${color === 'primary' ? '#3a3a3a' : color === 'secondary' ? '#e85b0e' : color === 'success' ? '#388e3c' : '#ccac00'} 100%)`,
      color: 'white',
      position: 'relative',
      overflow: 'hidden',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: -50,
        right: -50,
        width: 150,
        height: 150,
        borderRadius: '50%',
        background: 'rgba(255, 255, 255, 0.1)',
      },
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
      </Box>
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
        {value}
      </Typography>
      <Typography variant="body2" sx={{ opacity: 0.9, mb: 1 }}>
        {title}
      </Typography>
      {subtitle && (
        <Typography variant="caption" sx={{ opacity: 0.8 }}>
          {subtitle}
        </Typography>
      )}
    </CardContent>
  </Card>
);

const DashboardOverview = () => {
  const { restaurant } = useAuth();
  const [stats, setStats] = useState({
    products: [],
    categories: [],
    promotions: [],
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (restaurant) {
      loadStats();
    }
  }, [restaurant]);

  const loadStats = async () => {
    if (!restaurant) return;
    
    try {
      const [productsData, categoriesData, promotionsData] = await Promise.all([
        api.getProducts(restaurant.id),
        api.getCategories(restaurant.id),
        api.getPromotions(restaurant.id),
      ]);
      setStats({
        products: productsData || [],
        categories: categoriesData || [],
        promotions: promotionsData || [],
      });
    } catch (err) {
      console.error('Error loading stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const totalProducts = stats.products.length;
  const totalCategories = stats.categories.length;
  const totalPromotions = stats.promotions.length;
  const averagePrice = totalProducts > 0 
    ? stats.products.reduce((sum, p) => sum + (p.price || 0), 0) / totalProducts 
    : 0;

  const recommendedProducts = stats.products.filter(p => p.isRecommended).length;
  const bestSellers = stats.products.filter(p => p.isBestSeller).length;

  const getPublicUrl = () => {
    if (!restaurant?.slug) return '';
    return `${window.location.origin}/${restaurant.slug}`;
  };

  const handleCopyUrl = async () => {
    const url = getPublicUrl();
    if (url) {
      try {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Error copying URL:', err);
      }
    }
  };

  return (
    <Box>
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 800,
            mb: 1,
            color: 'text.primary',
          }}
        >
          Visão Geral
        </Typography>
        <Typography variant="body1" sx={{ color: 'text.secondary' }}>
          Gerencie seu restaurante e acompanhe as métricas principais
        </Typography>
      </Box>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={FastfoodIcon}
            title="Total de Produtos"
            value={totalProducts}
            subtitle={`${recommendedProducts} recomendados`}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={CategoryIcon}
            title="Categorias"
            value={totalCategories}
            subtitle="Ativas"
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={LocalOfferIcon}
            title="Promoções"
            value={totalPromotions}
            subtitle="Ativas"
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            icon={TrendingUpIcon}
            title="Preço Médio"
            value={formatCurrency(averagePrice)}
            subtitle={`${bestSellers} mais vendidos`}
            color="#ffd700"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper
            component={motion.div}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            sx={{ p: 3, height: '100%' }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Informações do Restaurante
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Avatar
                src={restaurant?.logo}
                alt={restaurant?.name}
                sx={{ width: 64, height: 64 }}
              >
                {restaurant?.name?.[0] || 'R'}
              </Avatar>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  {restaurant?.name || 'Meu Restaurante'}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {restaurant?.category || 'Restaurante'}
                </Typography>
              </Box>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {restaurant?.slug && (
                <Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                    URL Pública
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main', wordBreak: 'break-all' }}>
                      {getPublicUrl()}
                    </Typography>
                    <Button
                      size="small"
                      variant="outlined"
                      startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                      onClick={handleCopyUrl}
                      sx={{ minWidth: 'auto' }}
                    >
                      {copied ? 'Copiado!' : 'Copiar'}
                    </Button>
                  </Box>
                  <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}>
                    Compartilhe esta URL com seus clientes
                  </Typography>
                </Box>
              )}
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Endereço
                </Typography>
                <Typography variant="body2">{restaurant?.address || 'Não informado'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Telefone
                </Typography>
                <Typography variant="body2">{restaurant?.phone || 'Não informado'}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                  Avaliação
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    {restaurant?.rating || 0}
                  </Typography>
                  <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                    ({restaurant?.totalReviews || 0} avaliações)
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>

      </Grid>
    </Box>
  );
};

export default DashboardOverview;
