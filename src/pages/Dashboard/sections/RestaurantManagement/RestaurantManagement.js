import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Avatar,
  Divider,
  Switch,
  FormControlLabel,
  Chip,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Save as SaveIcon,
  Image as ImageIcon,
  Phone as PhoneIcon,
  LocationOn as LocationOnIcon,
  ContentCopy as ContentCopyIcon,
  Check as CheckIcon,
  Link as LinkIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../../../../services/api';
import { useAuth } from '../../../../contexts/AuthContext';

const RestaurantManagement = () => {
  const { restaurant: authRestaurant, user, refreshRestaurant } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [uploadingCover, setUploadingCover] = useState(false);

  useEffect(() => {
    if (authRestaurant) {
      setRestaurant(authRestaurant);
      setLoading(false);
    } else if (user) {
      loadRestaurant();
    }
  }, [authRestaurant, user]);

  const loadRestaurant = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      const data = await api.getRestaurantByUserId(user.id);
      if (data) {
        setRestaurant(data);
        setError(null);
      }
    } catch (err) {
      console.error('Error loading restaurant:', err);
      setError('Erro ao carregar dados do restaurante. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field, value) => {
    setRestaurant((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleOpeningHoursChange = (day, value) => {
    setRestaurant((prev) => ({
      ...prev,
      openingHours: {
        ...prev.openingHours,
        [day]: value,
      },
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);
      
      const updateData = {
        id: restaurant.id,
        name: restaurant.name,
        slug: restaurant.slug,
        category: restaurant.category,
        description: restaurant.description,
        deliveryFee: restaurant.deliveryFee,
        minOrder: restaurant.minOrder,
        deliveryTime: restaurant.deliveryTime,
        priceRange: restaurant.priceRange,
        address: restaurant.address,
        phone: restaurant.phone,
        openingHours: restaurant.openingHours,
        coverImage: restaurant.coverImage,
        logo: restaurant.logo,
        primaryColor: restaurant.primaryColor || '#ff6b19',
      };

      const updated = await api.updateRestaurant(updateData);
      if (updated) {
        setRestaurant(updated);
        // Atualizar o restaurante no contexto de autenticação
        if (refreshRestaurant) {
          await refreshRestaurant();
        }
        alert('Informações salvas com sucesso!');
      }
    } catch (err) {
      console.error('Error saving restaurant:', err);
      setError(err.message || 'Erro ao salvar informações');
    } finally {
      setSaving(false);
    }
  };

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

  const handleImageUpload = async (file, type) => {
    try {
      if (type === 'logo') {
        setUploadingLogo(true);
      } else {
        setUploadingCover(true);
      }

      const folder = type === 'logo' ? 'logos' : 'covers';
      const imageUrl = await api.uploadImage(file, folder);
      
      // Atualizar o estado local
      handleChange(type === 'logo' ? 'logo' : 'coverImage', imageUrl);
      
      // Salvar automaticamente após o upload
      // IMPORTANTE: Manter todos os campos existentes para não sobrescrever outros dados
      if (restaurant?.id) {
        const updateData = {
          id: restaurant.id,
          name: restaurant.name,
          slug: restaurant.slug,
          category: restaurant.category,
          description: restaurant.description,
          deliveryFee: restaurant.deliveryFee,
          minOrder: restaurant.minOrder,
          deliveryTime: restaurant.deliveryTime,
          priceRange: restaurant.priceRange,
          address: restaurant.address,
          phone: restaurant.phone,
          openingHours: restaurant.openingHours,
          // Manter o logo existente se estiver atualizando a capa
          logo: type === 'logo' ? imageUrl : restaurant.logo,
          // Manter a capa existente se estiver atualizando o logo
          coverImage: type === 'cover' ? imageUrl : restaurant.coverImage,
        };
        
        try {
          await api.updateRestaurant(updateData);
          // Atualizar o restaurante no contexto
          if (refreshRestaurant) {
            await refreshRestaurant();
          }
          console.log(`${type === 'logo' ? 'Logo' : 'Imagem de capa'} salvo com sucesso!`);
        } catch (saveErr) {
          console.error('Erro ao salvar imagem no banco:', saveErr);
          // Não mostrar erro aqui, apenas logar, pois a imagem já foi enviada
        }
      }
      
      return imageUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Erro ao fazer upload da imagem');
      throw err;
    } finally {
      if (type === 'logo') {
        setUploadingLogo(false);
      } else {
        setUploadingCover(false);
      }
    }
  };

  const handleLogoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB');
        return;
      }
      handleImageUpload(file, 'logo');
    }
  };

  const handleCoverChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB');
        return;
      }
      handleImageUpload(file, 'cover');
    }
  };

  const days = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' },
  ];

  if (loading || !restaurant) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 400 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 1,
              color: 'text.primary',
            }}
          >
            Informações do Restaurante
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Gerencie as informações básicas do seu restaurante
          </Typography>
        </Box>
        <Button
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variant="contained"
          color="primary"
          size="large"
          startIcon={<SaveIcon />}
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            sx={{ p: 4 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Informações Básicas
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome do Restaurante"
                  value={restaurant.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="URL Personalizada (Slug)"
                  value={restaurant.slug || ''}
                  onChange={(e) => handleChange('slug', e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-'))}
                  variant="outlined"
                  helperText="Apenas letras minúsculas, números e hífens. Ex: meu-restaurante"
                  InputProps={{
                    startAdornment: (
                      <Box sx={{ mr: 1, color: 'text.secondary' }}>
                        {window.location.origin}/
                      </Box>
                    ),
                  }}
                />
                {restaurant.slug && (
                  <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1, border: '1px solid', borderColor: 'divider' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block', mb: 0.5 }}>
                          Sua URL pública:
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600, color: 'primary.main' }}>
                          {getPublicUrl()}
                        </Typography>
                      </Box>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={copied ? <CheckIcon /> : <ContentCopyIcon />}
                        onClick={handleCopyUrl}
                        sx={{ ml: 2 }}
                      >
                        {copied ? 'Copiado!' : 'Copiar'}
                      </Button>
                    </Box>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Categoria"
                  value={restaurant.category}
                  onChange={(e) => handleChange('category', e.target.value)}
                  variant="outlined"
                  placeholder="Ex: Pizzaria • Italiana"
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Descrição"
                  value={restaurant.description}
                  onChange={(e) => handleChange('description', e.target.value)}
                  variant="outlined"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Taxa de Entrega"
                  type="number"
                  value={restaurant.deliveryFee}
                  onChange={(e) => handleChange('deliveryFee', parseFloat(e.target.value))}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Pedido Mínimo"
                  type="number"
                  value={restaurant.minOrder}
                  onChange={(e) => handleChange('minOrder', parseFloat(e.target.value))}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Tempo de Entrega"
                  value={restaurant.deliveryTime}
                  onChange={(e) => handleChange('deliveryTime', e.target.value)}
                  variant="outlined"
                  placeholder="Ex: 30-45 min"
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Faixa de Preço"
                  value={restaurant.priceRange || ''}
                  onChange={(e) => handleChange('priceRange', e.target.value)}
                  variant="outlined"
                  placeholder="Ex: $$"
                />
              </Grid>

              <Grid item xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                  Cor do Tema
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
                  Personalize a cor do seu restaurante. Esta cor é usada em hover, destaques e elementos interativos.
                </Typography>
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Cor Primária"
                  type="color"
                  value={restaurant.primaryColor || '#ff6b19'}
                  onChange={(e) => handleChange('primaryColor', e.target.value)}
                  variant="outlined"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  InputProps={{
                    startAdornment: (
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1,
                          backgroundColor: restaurant.primaryColor || '#ff6b19',
                          border: '1px solid',
                          borderColor: 'divider',
                          mr: 1,
                        }}
                      />
                    ),
                  }}
                  helperText="Cor usada em hover e destaques"
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            sx={{ p: 4, mt: 3 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Contato
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Endereço"
                  value={restaurant.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <LocationOnIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Telefone"
                  value={restaurant.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                  }}
                />
              </Grid>
            </Grid>
          </Paper>

          <Paper
            component={motion.div}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            sx={{ p: 4, mt: 3 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Horários de Funcionamento
            </Typography>

            <Grid container spacing={2}>
              {days.map((day) => (
                <Grid item xs={12} sm={6} key={day.key}>
                  <TextField
                    fullWidth
                    label={day.label}
                    value={restaurant.openingHours[day.key]}
                    onChange={(e) => handleOpeningHoursChange(day.key, e.target.value)}
                    variant="outlined"
                    placeholder="Ex: 18:00 - 23:00"
                  />
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            sx={{ p: 4 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Imagens
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Logo do Restaurante
              </Typography>
              <Box
                component="label"
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  p: 3,
                  border: '2px dashed',
                  borderColor: 'divider',
                  borderRadius: 2,
                  cursor: 'pointer',
                  '&:hover': {
                    borderColor: 'primary.main',
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleLogoChange}
                  disabled={uploadingLogo}
                />
                {uploadingLogo ? (
                  <CircularProgress sx={{ mb: 2 }} />
                ) : (
                  <Avatar
                    src={restaurant.logo}
                    alt={restaurant.name}
                    sx={{ width: 120, height: 120, mb: 2 }}
                  >
                    {restaurant.name?.[0] || 'R'}
                  </Avatar>
                )}
                <Button
                  variant="outlined"
                  startIcon={<ImageIcon />}
                  size="small"
                  disabled={uploadingLogo}
                  component="span"
                >
                  {uploadingLogo ? 'Enviando...' : 'Alterar Logo'}
                </Button>
              </Box>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Box>
              <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                Imagem de Capa
              </Typography>
              <Box
                component="label"
                sx={{
                  width: '100%',
                  height: 200,
                  borderRadius: 2,
                  backgroundImage: `url(${restaurant.coverImage || 'https://via.placeholder.com/800x200'})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px dashed',
                  borderColor: 'divider',
                  cursor: 'pointer',
                  position: 'relative',
                  '&:hover': {
                    borderColor: 'primary.main',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.3)',
                      borderRadius: 2,
                    },
                  },
                }}
              >
                <input
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleCoverChange}
                  disabled={uploadingCover}
                />
                {uploadingCover ? (
                  <CircularProgress sx={{ color: 'white', zIndex: 1 }} />
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<ImageIcon />}
                    sx={{
                      backgroundColor: 'rgba(0, 0, 0, 0.6)',
                      zIndex: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      },
                    }}
                    component="span"
                    disabled={uploadingCover}
                  >
                    {uploadingCover ? 'Enviando...' : 'Alterar Capa'}
                  </Button>
                )}
              </Box>
            </Box>
          </Paper>

          <Paper
            component={motion.div}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            sx={{ p: 4, mt: 3 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
              Avaliações
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Typography variant="h4" sx={{ fontWeight: 800 }}>
                  {restaurant.rating}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  / 5.0
                </Typography>
              </Box>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {restaurant.totalReviews} avaliações
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RestaurantManagement;
