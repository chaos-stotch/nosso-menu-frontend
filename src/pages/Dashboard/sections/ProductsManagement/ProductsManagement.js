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
  Switch,
  FormControlLabel,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  CircularProgress,
  Alert,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Checkbox,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Fastfood as FastfoodIcon,
  Image as ImageIcon,
  DeleteOutline as DeleteOutlineIcon,
  ExpandMore as ExpandMoreIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../../../utils/mockData';
import api from '../../../../services/api';
import { useAuth } from '../../../../contexts/AuthContext';
import ConfirmDialog from '../../../../components/ConfirmDialog/ConfirmDialog';

const ProductsManagement = () => {
  const { restaurant } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ open: false, id: null });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    image: '',
    isRecommended: false,
    isBestSeller: false,
    preparationTime: '',
    options: [],
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
      const [productsData, categoriesData] = await Promise.all([
        api.getProducts(restaurant.id),
        api.getCategories(restaurant.id),
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setError(null);
    } catch (err) {
      console.error('Error loading data:', err);
      setError('Erro ao carregar dados. Verifique se o backend está rodando.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        category: product.category || '',
        image: product.image || '',
        isRecommended: product.isRecommended || false,
        isBestSeller: product.isBestSeller || false,
        preparationTime: product.preparationTime || '',
        options: product.options || [],
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        category: categories[0]?.id || '',
        image: '',
        isRecommended: false,
        isBestSeller: false,
        preparationTime: '',
        options: [],
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError(null);

    const productData = {
        name: formData.name,
        description: formData.description,
      price: parseFloat(formData.price),
        category: formData.category,
        image: formData.image,
        isRecommended: formData.isRecommended,
        isBestSeller: formData.isBestSeller,
        preparationTime: formData.preparationTime || null,
      options: formData.options || [],
        restaurantId: restaurant?.id,
    };

    if (editingProduct) {
        await api.updateProduct(editingProduct.id, productData);
    } else {
        await api.createProduct(productData);
    }

      await loadData();
      handleCloseDialog();
    } catch (err) {
      console.error('Error saving product:', err);
      setError(err.message || 'Erro ao salvar produto');
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
      await api.deleteProduct(deleteConfirm.id);
        await loadData();
      } catch (err) {
        console.error('Error deleting product:', err);
        setError(err.message || 'Erro ao deletar produto');
    } finally {
      setDeleteConfirm({ open: false, id: null });
    }
  };

  const handleImageUpload = async (file) => {
    try {
      setUploadingImage(true);
      const imageUrl = await api.uploadImage(file, 'products');
      setFormData({ ...formData, image: imageUrl });
      return imageUrl;
    } catch (err) {
      console.error('Error uploading image:', err);
      setError('Erro ao fazer upload da imagem');
      throw err;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('A imagem deve ter no máximo 5MB');
        return;
      }
      handleImageUpload(file);
    }
  };

  const getCategoryName = (categoryId) => {
    const category = categories.find((c) => c.id === categoryId);
    return category?.name || categoryId;
  };

  // Funções para gerenciar opções
  const addOption = () => {
    const newOption = {
      id: `option_${Date.now()}`,
      name: '',
      required: false,
      choices: [],
    };
    setFormData({
      ...formData,
      options: [...formData.options, newOption],
    });
  };

  const removeOption = (optionIndex) => {
    const newOptions = formData.options.filter((_, index) => index !== optionIndex);
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const updateOption = (optionIndex, field, value) => {
    const newOptions = [...formData.options];
    newOptions[optionIndex] = {
      ...newOptions[optionIndex],
      [field]: value,
    };
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const addChoice = (optionIndex) => {
    const newChoice = {
      id: `choice_${Date.now()}`,
      name: '',
      price: 0,
    };
    const newOptions = [...formData.options];
    newOptions[optionIndex].choices = [...newOptions[optionIndex].choices, newChoice];
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const removeChoice = (optionIndex, choiceIndex) => {
    const newOptions = [...formData.options];
    newOptions[optionIndex].choices = newOptions[optionIndex].choices.filter(
      (_, index) => index !== choiceIndex
    );
    setFormData({
      ...formData,
      options: newOptions,
    });
  };

  const updateChoice = (optionIndex, choiceIndex, field, value) => {
    const newOptions = [...formData.options];
    newOptions[optionIndex].choices[choiceIndex] = {
      ...newOptions[optionIndex].choices[choiceIndex],
      [field]: field === 'price' ? parseFloat(value) || 0 : value,
    };
    setFormData({
      ...formData,
      options: newOptions,
    });
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
            Produtos
          </Typography>
          <Typography variant="body1" sx={{ color: 'text.secondary' }}>
            Gerencie os produtos do seu cardápio
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
          Novo Produto
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
              <TableCell sx={{ fontWeight: 700 }}>Produto</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Categoria</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Preço</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell align="right" sx={{ fontWeight: 700 }}>
                Ações
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((product) => (
              <TableRow
                key={product.id}
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
                      src={product.image}
                      alt={product.name}
                      variant="rounded"
                      sx={{
                        width: 56,
                        height: 56,
                      }}
                    >
                      <FastfoodIcon />
                    </Avatar>
                    <Box>
                      <Typography variant="body1" sx={{ fontWeight: 600 }}>
                        {product.name}
                      </Typography>
                      <Typography
                        variant="caption"
                        sx={{ color: 'text.secondary' }}
                        noWrap
                      >
                        {product.description ? `${product.description.substring(0, 50)}...` : ''}
                      </Typography>
                    </Box>
                  </Box>
                </TableCell>
                <TableCell>
                  <Chip
                    label={getCategoryName(product.category)}
                    size="small"
                    color="primary"
                    variant="outlined"
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="body1" sx={{ fontWeight: 600 }}>
                    {formatCurrency(product.price)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    {product.isRecommended && (
                      <Chip
                        label="Recomendado"
                        size="small"
                        sx={{
                          backgroundColor: '#ffd700',
                          color: '#1a1a1a',
                          fontWeight: 600,
                        }}
                      />
                    )}
                    {product.isBestSeller && (
                      <Chip
                        label="Mais Vendido"
                        size="small"
                        sx={{
                          backgroundColor: '#ff6b19',
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                    )}
                  </Box>
                </TableCell>
                <TableCell align="right">
                  <IconButton
                    color="primary"
                    onClick={() => handleOpenDialog(product)}
                    sx={{ mr: 1 }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="error"
                    onClick={() => handleDeleteClick(product.id)}
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
        maxWidth="md"
        fullWidth
        PaperProps={{
          component: motion.div,
          initial: { opacity: 0, scale: 0.9 },
          animate: { opacity: 1, scale: 1 },
        }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          {editingProduct ? 'Editar Produto' : 'Novo Produto'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Produto"
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
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Categoria</InputLabel>
                <Select
                  value={formData.category}
                  label="Categoria"
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Preço"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                variant="outlined"
                InputProps={{
                  startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                }}
              />
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Typography variant="body2" sx={{ mb: 1, color: 'text.secondary' }}>
                  Imagem do Produto
                </Typography>
                {formData.image && (
                  <Box sx={{ mb: 2 }}>
                    <Avatar
                      src={formData.image}
                      alt="Preview"
                      variant="rounded"
                      sx={{ width: 120, height: 120 }}
                    />
                  </Box>
                )}
                <Box
                  component="label"
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 2,
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
                    onChange={handleImageChange}
                    disabled={uploadingImage}
                  />
                  {uploadingImage ? (
                    <>
                      <CircularProgress size={20} />
                      <Typography variant="body2">Enviando...</Typography>
                    </>
                  ) : (
                    <>
                      <ImageIcon />
                      <Typography variant="body2">
                        {formData.image ? 'Alterar Imagem' : 'Selecionar Imagem'}
                      </Typography>
                    </>
                  )}
                </Box>
                {formData.image && (
              <TextField
                fullWidth
                    label="URL da Imagem (ou cole uma URL manualmente)"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                variant="outlined"
                    sx={{ mt: 2 }}
                    size="small"
              />
                )}
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tempo de Preparo"
                value={formData.preparationTime}
                onChange={(e) => setFormData({ ...formData, preparationTime: e.target.value })}
                variant="outlined"
                placeholder="Ex: 25 min"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 2 }}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isRecommended}
                      onChange={(e) =>
                        setFormData({ ...formData, isRecommended: e.target.checked })
                      }
                    />
                  }
                  label="Produto Recomendado"
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={formData.isBestSeller}
                      onChange={(e) =>
                        setFormData({ ...formData, isBestSeller: e.target.checked })
                      }
                    />
                  }
                  label="Mais Vendido"
                />
              </Box>
            </Grid>

            {/* Opções do Produto */}
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                  Opções do Produto
                </Typography>
                <Button
                  startIcon={<AddIcon />}
                  onClick={addOption}
                  variant="outlined"
                  size="small"
                >
                  Adicionar Opção
                </Button>
              </Box>

              {formData.options.length === 0 ? (
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 3 }}>
                  Nenhuma opção adicionada. Clique em "Adicionar Opção" para criar opções como tamanho, borda, etc.
                </Typography>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {formData.options.map((option, optionIndex) => (
                    <Accordion key={option.id} defaultExpanded>
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%', pr: 2 }}>
                          <Typography sx={{ fontWeight: 600, flex: 1 }}>
                            {option.name || `Opção ${optionIndex + 1}`}
                          </Typography>
                          {option.required && (
                            <Chip label="Obrigatória" size="small" color="primary" />
                          )}
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeOption(optionIndex);
                            }}
                            sx={{ color: 'error.main' }}
                          >
                            <DeleteOutlineIcon />
                          </IconButton>
                        </Box>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Grid container spacing={2}>
                          <Grid item xs={12} sm={8}>
                            <TextField
                              fullWidth
                              label="Nome da Opção"
                              placeholder="Ex: Tamanho, Borda, Bebida"
                              value={option.name}
                              onChange={(e) => updateOption(optionIndex, 'name', e.target.value)}
                              variant="outlined"
                              size="small"
                            />
                          </Grid>
                          <Grid item xs={12} sm={4}>
                            <FormControlLabel
                              control={
                                <Checkbox
                                  checked={option.required}
                                  onChange={(e) => updateOption(optionIndex, 'required', e.target.checked)}
                                />
                              }
                              label="Obrigatória"
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Divider sx={{ my: 1 }} />
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                                Escolhas
                              </Typography>
                              <Button
                                startIcon={<AddIcon />}
                                onClick={() => addChoice(optionIndex)}
                                variant="outlined"
                                size="small"
                              >
                                Adicionar Escolha
                              </Button>
                            </Box>
                            {option.choices.length === 0 ? (
                              <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center', py: 2 }}>
                                Nenhuma escolha adicionada. Adicione escolhas para esta opção.
                              </Typography>
                            ) : (
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                                {option.choices.map((choice, choiceIndex) => (
                                  <Box
                                    key={choice.id}
                                    sx={{
                                      display: 'flex',
                                      gap: 2,
                                      alignItems: 'flex-start',
                                      p: 2,
                                      border: '1px solid',
                                      borderColor: 'divider',
                                      borderRadius: 1,
                                    }}
                                  >
                                    <TextField
                                      label="Nome da Escolha"
                                      placeholder="Ex: Pequeno, Grande, Sem borda"
                                      value={choice.name}
                                      onChange={(e) => updateChoice(optionIndex, choiceIndex, 'name', e.target.value)}
                                      variant="outlined"
                                      size="small"
                                      sx={{ flex: 1 }}
                                    />
                                    <TextField
                                      label="Preço Adicional"
                                      type="number"
                                      value={choice.price}
                                      onChange={(e) => updateChoice(optionIndex, choiceIndex, 'price', e.target.value)}
                                      variant="outlined"
                                      size="small"
                                      InputProps={{
                                        startAdornment: <Typography sx={{ mr: 1 }}>R$</Typography>,
                                      }}
                                      sx={{ width: 150 }}
                                    />
                                    <IconButton
                                      onClick={() => removeChoice(optionIndex, choiceIndex)}
                                      sx={{ color: 'error.main', mt: 0.5 }}
                                    >
                                      <DeleteOutlineIcon />
                                    </IconButton>
                                  </Box>
                                ))}
                              </Box>
                            )}
                          </Grid>
                        </Grid>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Box>
              )}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleCloseDialog}>Cancelar</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!formData.name || !formData.price || !formData.category || saving}
          >
            {saving ? 'Salvando...' : editingProduct ? 'Salvar' : 'Criar'}
          </Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteConfirm.open}
        onClose={() => setDeleteConfirm({ open: false, id: null })}
        onConfirm={handleDeleteConfirm}
        title="Excluir Produto"
        message="Tem certeza que deseja excluir este produto? Esta ação não pode ser desfeita."
        confirmText="Excluir"
        cancelText="Cancelar"
        severity="error"
      />
    </Box>
  );
};

export default ProductsManagement;
