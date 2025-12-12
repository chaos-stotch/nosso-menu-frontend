import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Chip,
  Avatar,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import api from '../../../../services/api';
import { useAuth } from '../../../../contexts/AuthContext';
import IconSelector from '../../../../components/IconSelector/IconSelector';
import { DynamicCategoryIcon } from '../../../../components/CategoryIcon/CategoryIcon';

const CategoriesManagement = () => {
  const { restaurant } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'LocalPizza',
  });

  useEffect(() => {
    if (restaurant) {
      loadData();
    }
  }, [restaurant]);

  const loadData = async () => {
    if (!restaurant) return;
    
    try {
      setLoading(true);
      const data = await api.getCategories(restaurant.id);
      setCategories(data);
      setError(null);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Erro ao carregar categorias. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description,
        icon: category.icon,
      });
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
        description: '',
        icon: 'LocalPizza',
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingCategory(null);
    setFormData({
      name: '',
      description: '',
      icon: 'LocalPizza',
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

      const categoryData = {
        name: formData.name,
        description: formData.description,
        icon: formData.icon,
        restaurantId: restaurant?.id,
      };

      if (editingCategory) {
        await api.updateCategory(editingCategory.id, categoryData);
    } else {
        await api.createCategory(categoryData);
      }

      await loadData();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving category:', err);
      setError(err.message || 'Erro ao salvar categoria');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir esta categoria?')) {
      try {
        setError(null);
        await api.deleteCategory(id);
        await loadData();
      } catch (err) {
        console.error('Error deleting category:', err);
        setError(err.message || 'Erro ao deletar categoria');
    }
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
            Categorias
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Gerencie as categorias do seu cardápio
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
          Nova Categoria
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <TableContainer
        component={Paper}
        sx={{
          boxShadow: 'none',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: 'action.hover' }}>
              <TableCell sx={{ fontWeight: 700 }}>Categoria</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Descrição</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Ícone</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {categories.map((category) => (
              <TableRow
                key={category.id}
                component={motion.tr}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                sx={{
                  '&:hover': {
                    backgroundColor: 'action.hover',
                  },
                }}
              >
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Avatar
                      sx={{
                        backgroundColor: 'primary.main',
                        width: 40,
                        height: 40,
                      }}
                    >
                      <DynamicCategoryIcon iconName={category.icon} />
                    </Avatar>
                    <Typography variant="body1" sx={{ fontWeight: 600 }}>
                      {category.name}
                    </Typography>
                  </Box>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {category.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={category.icon} 
                    size="small"
                    icon={<DynamicCategoryIcon iconName={category.icon} sx={{ fontSize: 16 }} />}
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(category)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDelete(category.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

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
          {editingCategory ? 'Editar Categoria' : 'Nova Categoria'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome da Categoria"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descrição"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <IconSelector
                label="Ícone"
                value={formData.icon}
                onChange={(iconName) => setFormData({ ...formData, icon: iconName })}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.name || saving}
          >
            {saving ? 'Salvando...' : editingCategory ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CategoriesManagement;
