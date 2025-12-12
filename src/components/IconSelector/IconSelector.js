import React, { useState, useMemo } from 'react';
import {
  Box,
  TextField,
  Grid,
  Paper,
  IconButton,
  InputAdornment,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import { Search as SearchIcon, Close as CloseIcon } from '@mui/icons-material';
import * as Icons from '@mui/icons-material';

// Mapeamento de ícones com nomes em português e termos de busca
const iconMap = [
  // Comida
  { icon: 'LocalPizza', names: ['pizza', 'pizzas', 'massa', 'italiana'], label: 'Pizza' },
  { icon: 'Fastfood', names: ['hamburguer', 'hambúrguer', 'lanche', 'fast food', 'comida rápida'], label: 'Hambúrguer' },
  { icon: 'Restaurant', names: ['restaurante', 'comida', 'refeição'], label: 'Restaurante' },
  { icon: 'LunchDining', names: ['almoço', 'jantar', 'refeição', 'prato'], label: 'Refeição' },
  { icon: 'Dining', names: ['jantar', 'mesa', 'refeição'], label: 'Jantar' },
  { icon: 'BreakfastDining', names: ['café da manhã', 'café', 'desjejum', 'manhã'], label: 'Café da Manhã' },
  { icon: 'SetMeal', names: ['prato feito', 'prato', 'comida', 'refeição'], label: 'Prato Feito' },
  { icon: 'RamenDining', names: ['ramen', 'macarrão', 'sopa', 'japonês'], label: 'Ramen' },
  { icon: 'RiceBowl', names: ['arroz', 'bowl', 'tigela', 'asiático'], label: 'Bowl' },
  { icon: 'KebabDining', names: ['kebab', 'churrasco', 'espeto'], label: 'Kebab' },
  { icon: 'BakeryDining', names: ['padaria', 'pão', 'confeitaria', 'doces'], label: 'Padaria' },
  { icon: 'Icecream', names: ['sorvete', 'gelado', 'sobremesa'], label: 'Sorvete' },
  { icon: 'Cake', names: ['bolo', 'sobremesa', 'doce', 'confeitaria'], label: 'Bolo' },
  { icon: 'Cookie', names: ['biscoito', 'cookie', 'doce'], label: 'Biscoito' },
  { icon: 'Candy', names: ['doce', 'bala', 'guloseima'], label: 'Doce' },
  
  // Bebidas
  { icon: 'EmojiFoodBeverage', names: ['bebida', 'copo', 'drink'], label: 'Bebida' },
  { icon: 'LocalCafe', names: ['café', 'cafezinho', 'expresso'], label: 'Café' },
  { icon: 'WineBar', names: ['vinho', 'bebida alcoólica', 'bar'], label: 'Vinho' },
  { icon: 'LocalBar', names: ['bar', 'bebida', 'drink', 'coquetel'], label: 'Bar' },
  { icon: 'SportsBar', names: ['bar esportivo', 'cerveja', 'bar'], label: 'Bar Esportivo' },
  { icon: 'Liquor', names: ['bebida alcoólica', 'licor', 'drink'], label: 'Licor' },
  { icon: 'WaterDrop', names: ['água', 'bebida'], label: 'Água' },
  
  // Frutas e Vegetais
  { icon: 'Apple', names: ['maçã', 'fruta'], label: 'Maçã' },
  { icon: 'LocalGroceryStore', names: ['mercado', 'compras', 'supermercado'], label: 'Mercado' },
  { icon: 'ShoppingCart', names: ['carrinho', 'compras'], label: 'Carrinho' },
  
  // Outros
  { icon: 'CardGiftcard', names: ['presente', 'combo', 'promoção', 'oferta'], label: 'Presente' },
  { icon: 'LocalOffer', names: ['promoção', 'oferta', 'desconto', 'tag'], label: 'Promoção' },
  { icon: 'Star', names: ['estrela', 'destaque', 'favorito'], label: 'Estrela' },
  { icon: 'Favorite', names: ['favorito', 'coração', 'gostar'], label: 'Favorito' },
  { icon: 'Whatshot', names: ['quente', 'picante', 'destaque'], label: 'Quente' },
  { icon: 'NewReleases', names: ['novo', 'lançamento', 'destaque'], label: 'Novo' },
  { icon: 'TrendingUp', names: ['popular', 'tendência', 'mais vendido'], label: 'Popular' },
  { icon: 'Category', names: ['categoria', 'menu', 'lista'], label: 'Categoria' },
  { icon: 'MenuBook', names: ['cardápio', 'menu', 'livro'], label: 'Cardápio' },
  { icon: 'Receipt', names: ['nota', 'pedido', 'recibo'], label: 'Pedido' },
  { icon: 'RoomService', names: ['serviço', 'atendimento', 'garçom'], label: 'Serviço' },
  { icon: 'TableRestaurant', names: ['mesa', 'restaurante'], label: 'Mesa' },
  { icon: 'Store', names: ['loja', 'estabelecimento'], label: 'Loja' },
  { icon: 'Storefront', names: ['fachada', 'loja', 'estabelecimento'], label: 'Fachada' },
  { icon: 'ShoppingBag', names: ['sacola', 'compras'], label: 'Sacola' },
  { icon: 'TakeoutDining', names: ['delivery', 'entrega', 'viagem'], label: 'Delivery' },
  { icon: 'DeliveryDining', names: ['delivery', 'entrega', 'moto'], label: 'Entrega' },
  { icon: 'TwoWheeler', names: ['moto', 'delivery', 'entrega'], label: 'Moto' },
  { icon: 'DirectionsBike', names: ['bicicleta', 'delivery'], label: 'Bicicleta' },
  { icon: 'Timer', names: ['tempo', 'relógio', 'horário'], label: 'Tempo' },
  { icon: 'AccessTime', names: ['horário', 'tempo'], label: 'Horário' },
  { icon: 'Schedule', names: ['agenda', 'horário'], label: 'Agenda' },
  { icon: 'Event', names: ['evento', 'data'], label: 'Evento' },
  { icon: 'Celebration', names: ['festa', 'celebração'], label: 'Festa' },
  { icon: 'RestaurantMenu', names: ['menu', 'cardápio'], label: 'Menu' },
  { icon: 'DinnerDining', names: ['jantar', 'refeição'], label: 'Jantar' },
  { icon: 'Bento', names: ['bento', 'japonês', 'asiático'], label: 'Bento' },
  { icon: 'Flatware', names: ['talheres', 'utensílios'], label: 'Talheres' },
];

const IconSelector = ({ value, onChange, label = 'Ícone' }) => {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIcons = useMemo(() => {
    // Filtrar apenas ícones que existem no Material-UI
    const validIcons = iconMap.filter((item) => Icons[item.icon]);
    
    if (!searchQuery.trim()) {
      return validIcons;
    }

    const query = searchQuery.toLowerCase().trim();
    return validIcons.filter((item) => {
      return (
        item.label.toLowerCase().includes(query) ||
        item.names.some((name) => name.toLowerCase().includes(query)) ||
        item.icon.toLowerCase().includes(query)
      );
    });
  }, [searchQuery]);

  const handleSelectIcon = (iconName) => {
    onChange(iconName);
    setOpen(false);
    setSearchQuery('');
  };

  const handleClose = () => {
    setOpen(false);
    setSearchQuery('');
  };

  const selectedIcon = iconMap.find((item) => item.icon === value);
  const IconComponent = selectedIcon && Icons[selectedIcon.icon] ? Icons[selectedIcon.icon] : Icons.Category;

  return (
    <>
      <Box
        onClick={() => setOpen(true)}
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          p: 2,
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 1,
          cursor: 'pointer',
          '&:hover': {
            backgroundColor: 'action.hover',
          },
        }}
      >
        <IconComponent sx={{ fontSize: 32, color: 'primary.main' }} />
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
            {label}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {selectedIcon ? selectedIcon.label : 'Selecione um ícone'}
          </Typography>
        </Box>
      </Box>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            maxHeight: '80vh',
          },
        }}
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h6" sx={{ fontWeight: 700 }}>
              Selecionar Ícone
            </Typography>
            <IconButton onClick={handleClose} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Buscar ícone (ex: pizza, bebida, café, hambúrguer...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ mb: 3, mt: 1 }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />

          <Box
            sx={{
              maxHeight: '50vh',
              overflowY: 'auto',
              border: '1px solid',
              borderColor: 'divider',
              borderRadius: 1,
              p: 2,
            }}
          >
            {filteredIcons.length === 0 ? (
              <Typography variant="body2" sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                Nenhum ícone encontrado
              </Typography>
            ) : (
              <Grid container spacing={2}>
                {filteredIcons
                  .filter((item) => Icons[item.icon]) // Filtrar apenas ícones que existem
                  .map((item) => {
                    const Icon = Icons[item.icon];
                    const isSelected = value === item.icon;

                    return (
                      <Grid item xs={6} sm={4} md={3} key={item.icon}>
                        <Paper
                          onClick={() => handleSelectIcon(item.icon)}
                          sx={{
                            p: 2,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: 1,
                            cursor: 'pointer',
                            border: isSelected ? 2 : 1,
                            borderColor: isSelected ? 'primary.main' : 'divider',
                            backgroundColor: isSelected ? 'primary.light' : 'background.paper',
                            '&:hover': {
                              backgroundColor: isSelected ? 'primary.light' : 'action.hover',
                              borderColor: 'primary.main',
                            },
                            transition: 'all 0.2s',
                          }}
                        >
                          <Icon sx={{ fontSize: 32, color: isSelected ? 'primary.main' : 'text.primary' }} />
                          <Typography
                            variant="caption"
                            sx={{
                              textAlign: 'center',
                              fontWeight: isSelected ? 600 : 400,
                              color: isSelected ? 'primary.main' : 'text.secondary',
                            }}
                          >
                            {item.label}
                          </Typography>
                        </Paper>
                      </Grid>
                    );
                  })}
              </Grid>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default IconSelector;
