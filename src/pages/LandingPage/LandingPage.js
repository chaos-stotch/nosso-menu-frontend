import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Stack,
  Avatar,
  Paper,
  Divider,
  Chip,
  Rating,
} from '@mui/material';
import {
  Restaurant as RestaurantIcon,
  Speed as SpeedIcon,
  Payment as PaymentIcon,
  Smartphone as SmartphoneIcon,
  TrendingUp as TrendingUpIcon,
  Star as StarIcon,
  CheckCircle as CheckCircleIcon,
  ArrowForward as ArrowForwardIcon,
  People as PeopleIcon,
  LocalShipping as LocalShippingIcon,
  Security as SecurityIcon,
  Analytics as AnalyticsIcon,
  Support as SupportIcon,
  Verified as VerifiedIcon,
  Timer as TimerIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const LandingPage = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ restaurants: 0, orders: 0, revenue: 0 });

  // Animação de contador
  useEffect(() => {
    const animateCounter = (end, setter, duration = 2000) => {
      let start = 0;
      const increment = end / (duration / 16);
      const timer = setInterval(() => {
        start += increment;
        if (start >= end) {
          setter(end);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
    };

    animateCounter(500, (val) => setStats(prev => ({ ...prev, restaurants: val })));
    animateCounter(15000, (val) => setStats(prev => ({ ...prev, orders: val })));
    animateCounter(2500000, (val) => setStats(prev => ({ ...prev, revenue: val })));
  }, []);

  const features = [
    {
      icon: <RestaurantIcon sx={{ fontSize: 48 }} />,
      title: 'Cardápio Digital Profissional',
      description: 'Crie um cardápio online impressionante em minutos. Design moderno que converte visitantes em clientes.',
      color: '#dc2626',
    },
    {
      icon: <SmartphoneIcon sx={{ fontSize: 48 }} />,
      title: '100% Mobile-First',
      description: 'Seus clientes pedem pelo celular. Interface otimizada para aumentar conversões em dispositivos móveis.',
      color: '#4caf50',
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 48 }} />,
      title: 'Setup em 5 Minutos',
      description: 'Configure tudo sozinho, sem precisar de programador ou designer. Interface intuitiva e guiada.',
      color: '#2196f3',
    },
    {
      icon: <PaymentIcon sx={{ fontSize: 48 }} />,
      title: 'Pagamentos Automatizados',
      description: 'Aceite PIX, cartão e dinheiro. Receba na hora, sem complicação. Integração completa com Pagar.me.',
      color: '#9c27b0',
    },
    {
      icon: <AnalyticsIcon sx={{ fontSize: 48 }} />,
      title: 'Dashboard Completo',
      description: 'Acompanhe vendas, produtos mais vendidos, faturamento e muito mais. Tome decisões baseadas em dados.',
      color: '#ff9800',
    },
    {
      icon: <LocalShippingIcon sx={{ fontSize: 48 }} />,
      title: 'Gestão de Pedidos',
      description: 'Controle total sobre entregas e retiradas. Notificações em tempo real para você e seus clientes.',
      color: '#f44336',
    },
  ];

  const benefits = [
    '✅ Sem mensalidade - 100% gratuito para sempre',
    '✅ Taxa de apenas 2% (1% Pagar.me + 1% NossoMenu)',
    '✅ Sem limite de produtos, categorias ou pedidos',
    '✅ Suporte prioritário incluído',
    '✅ Atualizações e novas funcionalidades grátis',
    '✅ Sem necessidade de conhecimento técnico',
    '✅ Cancelamento a qualquer momento',
    '✅ Sem taxa de adesão ou setup',
  ];

  const testimonials = [
    {
      name: 'Maria Silva',
      restaurant: 'Pizzaria Bella',
      rating: 5,
      text: 'Aumentei minhas vendas em 40% no primeiro mês! A plataforma é super fácil de usar e os clientes adoram.',
      avatar: 'M',
    },
    {
      name: 'João Santos',
      restaurant: 'Hamburgueria Artesanal',
      rating: 5,
      text: 'Melhor investimento que fiz. Em uma semana já estava recebendo pedidos online. Recomendo demais!',
      avatar: 'J',
    },
    {
      name: 'Ana Costa',
      restaurant: 'Café & Cia',
      rating: 5,
      text: 'O dashboard me ajuda muito a entender o que vende mais. Consegui otimizar meu cardápio e aumentar o ticket médio.',
      avatar: 'A',
    },
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      {/* Hero Section - Melhorado */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #dc2626 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient 15s ease infinite',
          '@keyframes gradient': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          color: 'white',
          pt: { xs: 6, md: 10 },
          pb: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)',
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          {/* Social Proof Banner */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Chip
                icon={<VerifiedIcon />}
                label={`${stats.restaurants}+ Restaurantes já confiam no NossoMenu`}
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                  py: 2.5,
                  '& .MuiChip-icon': { color: 'white' },
                }}
              />
            </Box>
          </motion.div>

          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                    fontWeight: 900,
                    mb: 3,
                    lineHeight: 1.1,
                    textShadow: '0 2px 10px rgba(0,0,0,0.2)',
                  }}
                >
                  Aumente suas Vendas Online em{' '}
                  <Box component="span" sx={{ color: '#ffd700', display: 'inline-block' }}>
                    até 300%
                  </Box>
                </Typography>
                <Typography
                  variant="h5"
                  sx={{
                    mb: 4,
                    opacity: 0.95,
                    fontSize: { xs: '1.1rem', md: '1.35rem' },
                    lineHeight: 1.7,
                    fontWeight: 400,
                  }}
                >
                  A plataforma completa para restaurantes venderem online.
                  <br />
                  <Box component="span" sx={{ fontWeight: 700 }}>
                    Grátis para sempre
                  </Box>
                  {' '}com taxa de apenas{' '}
                  <Box component="span" sx={{ fontWeight: 700, color: '#ffd700' }}>
                    2%
                  </Box>
                  {' '}nos pagamentos.
                </Typography>

                {/* Stats */}
                <Grid container spacing={3} sx={{ mb: 4 }}>
                  <Grid item xs={4}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                        {stats.restaurants}+
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Restaurantes
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                        {stats.orders.toLocaleString()}+
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Pedidos
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box>
                      <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5 }}>
                        R$ {(stats.revenue / 1000000).toFixed(1)}M+
                      </Typography>
                      <Typography variant="body2" sx={{ opacity: 0.9 }}>
                        Faturados
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>

                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                    whileTap={{ scale: 0.95 }}
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/signup')}
                    sx={{
                      backgroundColor: 'white',
                      color: 'primary.main',
                      px: 5,
                      py: 2,
                      fontSize: '1.15rem',
                      fontWeight: 800,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                      '&:hover': {
                        backgroundColor: '#f5f5f5',
                        boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                      },
                    }}
                  >
                    Começar Grátis Agora
                    <ArrowForwardIcon sx={{ ml: 1 }} />
                  </Button>
                  <Button
                    component={motion.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    variant="outlined"
                    size="large"
                    onClick={() => navigate('/login')}
                    sx={{
                      borderColor: 'white',
                      borderWidth: 2,
                      color: 'white',
                      px: 5,
                      py: 2,
                      fontSize: '1.15rem',
                      fontWeight: 700,
                      borderRadius: 2,
                      textTransform: 'none',
                      '&:hover': {
                        borderColor: 'white',
                        backgroundColor: 'rgba(255, 255, 255, 0.15)',
                        borderWidth: 2,
                      },
                    }}
                  >
                    Ver Demo
                  </Button>
                </Stack>

                <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', gap: 2, flexWrap: 'wrap' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircleIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body2">Sem cartão de crédito</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircleIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body2">Setup em 5 minutos</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CheckCircleIcon sx={{ fontSize: 20 }} />
                    <Typography variant="body2">Suporte 24/7</Typography>
                  </Box>
                </Box>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={6}>
              <motion.div
                initial={{ opacity: 0, scale: 0.9, x: 50 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    borderRadius: 4,
                    overflow: 'hidden',
                    boxShadow: '0 25px 70px rgba(0,0,0,0.4)',
                    border: '3px solid rgba(255,255,255,0.2)',
                  }}
                >
                  <Box
                    component="img"
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80"
                    alt="Cardápio Digital"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      display: 'block',
                    }}
                  />
                </Box>
              </motion.div>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section - Melhorado */}
      <Container maxWidth="lg" sx={{ py: { xs: 10, md: 15 } }}>
        <Box sx={{ textAlign: 'center', mb: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Chip
              label="Funcionalidades"
              sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                mb: 2,
                px: 2,
                py: 3,
                fontSize: '0.9rem',
                fontWeight: 600,
              }}
            />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.25rem', md: '3rem' },
                fontWeight: 900,
                mb: 2,
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Tudo que você precisa para vender online
            </Typography>
            <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 700, mx: 'auto', lineHeight: 1.8 }}>
              Funcionalidades poderosas projetadas para aumentar suas vendas e simplificar sua operação
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <Card
                  sx={{
                    height: '100%',
                    p: 4,
                    textAlign: 'center',
                    border: '2px solid',
                    borderColor: 'divider',
                    borderRadius: 3,
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 4,
                      background: `linear-gradient(90deg, ${feature.color} 0%, ${feature.color}dd 100%)`,
                    },
                    '&:hover': {
                      boxShadow: '0 15px 40px rgba(0,0,0,0.1)',
                      transform: 'translateY(-8px)',
                      borderColor: feature.color,
                    },
                  }}
                >
                  <Avatar
                    sx={{
                      width: 90,
                      height: 90,
                      mx: 'auto',
                      mb: 3,
                      backgroundColor: `${feature.color}15`,
                      color: feature.color,
                    }}
                  >
                    {feature.icon}
                  </Avatar>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 2, fontSize: '1.35rem' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
                    {feature.description}
                  </Typography>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Testimonials Section - Novo */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          py: { xs: 10, md: 15 },
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2.25rem', md: '3rem' },
                  fontWeight: 900,
                  mb: 2,
                }}
              >
                O que nossos clientes dizem
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
                Mais de 500 restaurantes já aumentaram suas vendas com o NossoMenu
              </Typography>
            </motion.div>
          </Box>

          <Grid container spacing={4}>
            {testimonials.map((testimonial, index) => (
              <Grid item xs={12} md={4} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.15 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      p: 4,
                      borderRadius: 3,
                      border: '1px solid',
                      borderColor: 'divider',
                      '&:hover': {
                        boxShadow: 6,
                        transform: 'translateY(-4px)',
                        transition: 'all 0.3s ease',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                      <Avatar
                        sx={{
                          width: 60,
                          height: 60,
                          backgroundColor: 'primary.main',
                          mr: 2,
                          fontSize: '1.5rem',
                          fontWeight: 700,
                        }}
                      >
                        {testimonial.avatar}
                      </Avatar>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 700 }}>
                          {testimonial.name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                          {testimonial.restaurant}
                        </Typography>
                      </Box>
                    </Box>
                    <Rating value={testimonial.rating} readOnly sx={{ mb: 2 }} />
                    <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8, fontStyle: 'italic' }}>
                      "{testimonial.text}"
                    </Typography>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Pricing Section - Melhorado */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #f5f7fa 0%, #ffffff 100%)',
          py: { xs: 10, md: 15 },
        }}
      >
        <Container maxWidth="md">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Chip
                label="Preços"
                sx={{
                  backgroundColor: 'success.main',
                  color: 'white',
                  mb: 2,
                  px: 2,
                  py: 3,
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              />
              <Typography
                variant="h2"
                sx={{
                  fontSize: { xs: '2.25rem', md: '3rem' },
                  fontWeight: 900,
                  mb: 2,
                }}
              >
                Preço Justo e Transparente
              </Typography>
              <Typography variant="h6" sx={{ color: 'text.secondary' }}>
                Sem pegadinhas, sem surpresas. Você só paga quando vende.
              </Typography>
            </motion.div>
          </Box>

          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
            sx={{
              p: { xs: 5, md: 7 },
              textAlign: 'center',
              border: '3px solid',
              borderColor: 'primary.main',
              borderRadius: 4,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              '&::before': {
                content: '"POPULAR"',
                position: 'absolute',
                top: 20,
                right: -35,
                backgroundColor: 'primary.main',
                color: 'white',
                padding: '5px 40px',
                transform: 'rotate(45deg)',
                fontSize: '0.75rem',
                fontWeight: 800,
                letterSpacing: 1,
              },
            }}
          >
            <Box sx={{ mb: 3 }}>
              <Typography variant="h2" sx={{ fontWeight: 900, mb: 1, fontSize: { xs: '2.5rem', md: '3.5rem' } }}>
                Grátis para Sempre
              </Typography>
              <Typography variant="h5" sx={{ color: 'text.secondary', fontWeight: 400 }}>
                Sem mensalidade, sem taxa de adesão, sem pegadinhas
              </Typography>
            </Box>

            <Divider sx={{ my: 5 }} />

            <Box
              sx={{
                backgroundColor: 'primary.light',
                borderRadius: 3,
                p: 4,
                mb: 5,
                border: '2px dashed',
                borderColor: 'primary.main',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 2 }}>
                <AttachMoneyIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                <Typography variant="h3" sx={{ fontWeight: 900, color: 'primary.main' }}>
                  2%
                </Typography>
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                Taxa apenas nos pagamentos
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                1% Pagar.me + 1% NossoMenu = 2% total
              </Typography>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1, fontStyle: 'italic' }}>
                Você só paga quando recebe. Sem vendas, sem taxa.
              </Typography>
            </Box>

            <Stack spacing={2.5} sx={{ mb: 6, textAlign: 'left', maxWidth: 500, mx: 'auto' }}>
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                    <CheckCircleIcon sx={{ color: 'success.main', fontSize: 28, mt: 0.5, flexShrink: 0 }} />
                    <Typography variant="body1" sx={{ fontSize: '1.05rem', lineHeight: 1.7 }}>
                      {benefit.replace('✅ ', '')}
                    </Typography>
                  </Box>
                </motion.div>
              ))}
            </Stack>

            <Button
              component={motion.button}
              whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(220,38,38,0.4)' }}
              whileTap={{ scale: 0.95 }}
              variant="contained"
              size="large"
              onClick={() => navigate('/signup')}
              sx={{
                px: 8,
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 800,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: '0 8px 25px rgba(255,107,25,0.3)',
              }}
            >
              Começar Grátis Agora
              <ArrowForwardIcon sx={{ ml: 1, fontSize: 28 }} />
            </Button>

            <Typography variant="body2" sx={{ color: 'text.secondary', mt: 3 }}>
              ✨ Sem cartão de crédito necessário • ✨ Cancelamento a qualquer momento
            </Typography>
          </Paper>
        </Container>
      </Box>

      {/* CTA Final Section - Melhorado */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 50%, #dc2626 100%)',
          backgroundSize: '200% 200%',
          animation: 'gradient 15s ease infinite',
          '@keyframes gradient': {
            '0%': { backgroundPosition: '0% 50%' },
            '50%': { backgroundPosition: '100% 50%' },
            '100%': { backgroundPosition: '0% 50%' },
          },
          color: 'white',
          py: { xs: 10, md: 15 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <TimerIcon sx={{ fontSize: 60, mb: 3, opacity: 0.9 }} />
            <Typography
              variant="h2"
              sx={{
                fontSize: { xs: '2.25rem', md: '3.5rem' },
                fontWeight: 900,
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              Pronto para aumentar suas vendas?
            </Typography>
            <Typography variant="h5" sx={{ mb: 2, opacity: 0.95, fontWeight: 400 }}>
              Junte-se a mais de 500 restaurantes que já estão vendendo online
            </Typography>
            <Typography variant="h6" sx={{ mb: 5, opacity: 0.9, fontWeight: 300 }}>
              Crie sua conta grátis agora e tenha seu cardápio online em 5 minutos
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
              <Button
                component={motion.button}
                whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
                whileTap={{ scale: 0.95 }}
                variant="contained"
                size="large"
                onClick={() => navigate('/signup')}
                sx={{
                  backgroundColor: 'white',
                  color: 'primary.main',
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 800,
                  borderRadius: 2,
                  textTransform: 'none',
                  boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
                  '&:hover': {
                    backgroundColor: '#f5f5f5',
                    boxShadow: '0 12px 35px rgba(0,0,0,0.3)',
                  },
                }}
              >
                Criar Conta Grátis
                <ArrowForwardIcon sx={{ ml: 1, fontSize: 28 }} />
              </Button>
              <Button
                component={motion.button}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                variant="outlined"
                size="large"
                onClick={() => navigate('/login')}
                sx={{
                  borderColor: 'white',
                  borderWidth: 2,
                  color: 'white',
                  px: 6,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 700,
                  borderRadius: 2,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    borderWidth: 2,
                  },
                }}
              >
                Já tenho conta
              </Button>
            </Stack>
            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'center', gap: 4, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SecurityIcon sx={{ fontSize: 24 }} />
                <Typography variant="body2">100% Seguro</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <SupportIcon sx={{ fontSize: 24 }} />
                <Typography variant="body2">Suporte 24/7</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PeopleIcon sx={{ fontSize: 24 }} />
                <Typography variant="body2">500+ Clientes</Typography>
              </Box>
            </Box>
          </motion.div>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
