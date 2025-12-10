import React from 'react';
import {
  Box,
  Container,
  Typography,
  Stack,
  Divider,
  Link,
  Grid,
  IconButton,
  Paper,
} from '@mui/material';
import {
  Instagram,
  Facebook,
  Phone,
  LocationOn,
  AccessTime,
  Favorite,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Footer = ({ restaurant }) => {
  const dayNames = {
    monday: 'Segunda',
    tuesday: 'Terça',
    wednesday: 'Quarta',
    thursday: 'Quinta',
    friday: 'Sexta',
    saturday: 'Sábado',
    sunday: 'Domingo',
  };

  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
        pt: { xs: 6, sm: 8 },
        pb: { xs: 4, sm: 5 },
        mt: { xs: 6, sm: 8 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 4, sm: 5, md: 6 }}>
          {/* Restaurant Info */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Typography 
                variant="h5" 
                sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  color: 'text.primary',
                  fontSize: { xs: '1.25rem', sm: '1.5rem' },
                }}
              >
                {restaurant.name}
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: 'text.secondary', 
                  mb: 3, 
                  lineHeight: 1.8,
                  fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                }}
              >
                {restaurant.description}
              </Typography>
              <Stack spacing={2}>
                <Stack direction="row" spacing={1.5} alignItems="flex-start">
                  <LocationOn sx={{ fontSize: 20, color: 'text.secondary', mt: 0.25, flexShrink: 0 }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.primary',
                      fontWeight: 500,
                      fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                    }}
                  >
                    {restaurant.address}
                  </Typography>
                </Stack>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Phone sx={{ fontSize: 20, color: 'text.secondary', flexShrink: 0 }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: 'text.primary',
                      fontWeight: 500,
                      fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                    }}
                  >
                    {restaurant.phone}
                  </Typography>
                </Stack>
              </Stack>
            </motion.div>
          </Grid>

          {/* Horário de Funcionamento */}
          <Grid item xs={12} sm={6} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: 'text.primary',
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                }}
              >
                Horário de Funcionamento
                    </Typography>
              <Stack spacing={1.5}>
                    {Object.entries(restaurant.openingHours).map(([day, hours]) => (
                  <Stack 
                    key={day}
                    direction="row" 
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      py: 0.5,
                    }}
                  >
                      <Typography
                      variant="body2"
                        sx={{
                        color: 'text.secondary',
                        fontWeight: 500,
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                          textTransform: 'capitalize',
                        }}
                      >
                      {dayNames[day]}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{
                        color: 'text.primary',
                        fontWeight: 600,
                        fontSize: { xs: '0.875rem', sm: '0.9375rem' },
                      }}
                    >
                      {hours}
                      </Typography>
                  </Stack>
                    ))}
              </Stack>
            </motion.div>
          </Grid>

          {/* Social Media & Brand */}
          <Grid item xs={12} md={4}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  color: 'text.primary',
                  fontSize: { xs: '1rem', sm: '1.125rem' },
                }}
              >
                Redes Sociais
              </Typography>
              <Stack direction="row" spacing={1.5} sx={{ mb: 4 }}>
                {restaurant.socialMedia?.instagram && (
                  <IconButton
                    component={motion.button}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={`https://instagram.com/${restaurant.socialMedia.instagram.replace('@', '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'secondary.main',
                        color: 'white',
                        borderColor: 'secondary.main',
                      },
                    }}
                  >
                    <Instagram />
                  </IconButton>
                )}
                {restaurant.socialMedia?.facebook && (
                  <IconButton
                    component={motion.button}
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    href={`https://facebook.com/${restaurant.socialMedia.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      backgroundColor: 'background.default',
                      border: '1px solid',
                      borderColor: 'divider',
                      color: 'text.primary',
                      '&:hover': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        borderColor: 'primary.main',
                      },
                    }}
                  >
                    <Facebook />
                  </IconButton>
                )}
              </Stack>

              <Paper
                elevation={0}
                sx={{
                  backgroundColor: 'background.default',
                  borderRadius: 2,
                  p: 2.5,
                  border: '1px solid',
                  borderColor: 'divider',
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    fontWeight: 800, 
                    mb: 0.5,
                    color: 'text.primary',
                    fontSize: { xs: '1rem', sm: '1.125rem' },
                  }}
                >
                  Nosso Menu
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: 'text.secondary', 
                    mb: 1.5,
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                  }}
                >
                  O melhor sistema de cardápio digital premium
                </Typography>
                <Link
                  href="https://nossomenu.com.br"
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'secondary.main',
                    textDecoration: 'none',
                    fontWeight: 600,
                    fontSize: { xs: '0.8125rem', sm: '0.875rem' },
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  nossomenu.com.br
                </Link>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        <Divider sx={{ my: { xs: 4, sm: 5 }, borderColor: 'divider' }} />

        <Box 
          sx={{ 
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography 
            variant="body2" 
            sx={{ 
              color: 'text.secondary',
              fontSize: { xs: '0.8125rem', sm: '0.875rem' },
            }}
          >
            © {new Date().getFullYear()} {restaurant.name}. Todos os direitos reservados.
          </Typography>
          <Typography 
            variant="caption" 
            component="div"
            sx={{ 
              color: 'text.secondary',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 0.5,
              fontSize: { xs: '0.75rem', sm: '0.8125rem' },
            }}
          >
            Desenvolvido com
            <Box
              component={motion.span}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatDelay: 2 }}
              sx={{ display: 'inline-flex', alignItems: 'center' }}
            >
              <Favorite sx={{ fontSize: 14, color: '#f44336' }} />
            </Box>
            por Nosso Menu
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
