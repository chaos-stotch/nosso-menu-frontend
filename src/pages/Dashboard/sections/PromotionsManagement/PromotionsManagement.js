import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalOffer as LocalOfferIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../../../../services/api';
import { useAuth } from '../../../../contexts/AuthContext';
import ConfirmDialog from '../../../../components/ConfirmDialog/ConfirmDialog';

const PromotionsManagement = () => {
  const { restaurant } = useAuth();
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  useEffect(() => {
    if (restaurant) {
      loadPromotions();
    }
  }, [restaurant]);

  const loadPromotions = async () => {
    if (!restaurant) return;
    
    try {
      setLoading(true);
      const data = await api.getPromotions(restaurant.id);
      setPromotions(data);
      setError(null);
    } catch (err) {
      console.error('Error loading promotions:', err);
      setError('Erro ao carregar promoções. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (promotion = null) => {
    if (promotion) {
      setEditingPromotion(promotion);
      setFormData({
        title: promotion.title,
        description: promotion.description,
      });
    } else {
      setEditingPromotion(null);
      setFormData({
        title: '',
        description: '',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingPromotion(null);
    setFormData({
      title: '',
      description: '',
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

    const promotionData = {
        title: formData.title,
        description: formData.description,
        restaurantId: restaurant?.id,
        isActive: true,
    };

    if (editingPromotion) {
        await api.updatePromotion(editingPromotion.id, promotionData);
    } else {
        await api.createPromotion(promotionData);
    }

      await loadPromotions();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving promotion:', err);
      setError(err.message || 'Erro ao salvar promoção');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteClick = (id) => {
    setDeleteConfirm({ open: true, id });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteConfirm.id) return;
    
      try {
        setError(null);
      await api.deletePromotion(deleteConfirm.id);
        await loadPromotions();
      } catch (err) {
        console.error('Error deleting promotion:', err);
        setError(err.message || 'Erro ao deletar promoção');
    } finally {
      setDeleteConfirm({ open: false, id: null });
    }
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
        <Box>
          <Typography
            variant="h4"
            sx={{
              fontWeight: 800,
              mb: 1,
              color: 'text.primary',
            }}
          >
            Promoções
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Gerencie as promoções e ofertas do seu restaurante
          </Typography>
        </Box>
        <Button
          component={motion.button}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Nova Promoção
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      {promotions.length === 0 ? (
        <Paper
          sx={{
            p: 8,
            textAlign: 'center',
            backgroundColor: 'action.hover',
          }}
        >
          <LocalOfferIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" sx={{ mb: 1, color: 'text.secondary' }}>
            Nenhuma promoção cadastrada
          </Typography>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 3 }}>
            Crie sua primeira promoção para atrair mais clientes
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
          >
            Criar Promoção
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {promotions.map((promotion) => (
            <Grid item xs={12} sm={6} md={4} key={promotion.id}>
              <Card
                component={motion.div}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -4 }}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
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
                <CardContent sx={{ flexGrow: 1, position: 'relative', zIndex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                    <LocalOfferIcon />
                    <Chip
                      label="Promoção Ativa"
                      size="small"
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.2)',
                        color: 'white',
                        fontWeight: 600,
                      }}
                    />
                  </Box>
                  <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                    {promotion.title}
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9 }}>
                    {promotion.description}
                  </Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end', p: 2, position: 'relative', zIndex: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleOpenDialog(promotion)}
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDeleteClick(promotion.id)}
                    sx={{
                      color: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.3)',
                      },
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingPromotion ? 'Editar Promoção' : 'Nova Promoção'}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
            <TextField
              fullWidth
              label="Título da Promoção"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              variant="outlined"
              placeholder="Ex: Frete Grátis"
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Descrição"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              variant="outlined"
              placeholder="Ex: Em pedidos acima de R$ 50,00"
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.title || !formData.description || saving}
          >
            {saving ? 'Salvando...' : editingPromotion ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Excluir Promoção"
        message="Tem certeza que deseja excluir esta promoção? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        severity="error"
      />
    </Box>
  );
};

export default PromotionsManagement;
