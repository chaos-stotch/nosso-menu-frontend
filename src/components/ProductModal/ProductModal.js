import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Typography,
  Box,
  Button,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel,
  Divider,
  Chip,
  Paper,
} from '@mui/material';
import { Close, Add, Remove, Star, TrendingUp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/mockData';

const ProductModal = ({ product, open, onClose, onAddToCart }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleOptionChange = (optionId, choiceId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [optionId]: choiceId,
    }));
  };

  const calculatePrice = () => {
    let total = product.price;
    
    Object.entries(selectedOptions).forEach(([optionId, choiceId]) => {
      const option = product.options.find(opt => opt.id === optionId);
      if (option) {
        const choice = option.choices.find(c => c.id === choiceId);
        if (choice) {
          total += choice.price;
        }
      }
    });

    return total * quantity;
  };

  const handleAddToCart = () => {
    const options = {};
    Object.entries(selectedOptions).forEach(([optionId, choiceId]) => {
      const option = product.options.find(opt => opt.id === optionId);
      if (option) {
        const choice = option.choices.find(c => c.id === choiceId);
        if (choice) {
          options[optionId] = {
            name: option.name,
            choice: choice.name,
            price: choice.price,
          };
        }
      }
    });

    onAddToCart(product, options, quantity);
    onClose();
    setQuantity(1);
    setSelectedOptions({});
  };

  const isAddButtonDisabled = () => {
    return product.options.some(option => 
      option.required && !selectedOptions[option.id]
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          maxHeight: '90vh',
        },
      }}
    >
      <DialogTitle
        sx={{
          p: 0,
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'relative',
            width: '100%',
            paddingTop: '40%',
            overflow: 'hidden',
            backgroundColor: 'grey.100',
          }}
        >
          <Box
            component="img"
            src={product.image}
            alt={product.name}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <IconButton
            onClick={onClose}
            sx={{
              position: 'absolute',
              top: 16,
              right: 16,
              backgroundColor: 'rgba(255,255,255,0.9)',
              '&:hover': {
                backgroundColor: 'white',
              },
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <Stack spacing={3}>
          {/* Product Name and Badges */}
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1, mt: 1 }}>
              {product.isRecommended && (
                <Chip
                  icon={<Star sx={{ fontSize: 16 }} />}
                  label="Recomendado"
                  size="small"
                  sx={(theme) => ({
                    backgroundColor: theme.palette.badges.recommended.main,
                    color: theme.palette.badges.recommended.contrastText,
                    fontWeight: 700,
                    '& .MuiChip-icon': {
                      color: `${theme.palette.badges.recommended.contrastText} !important`,
                    },
                  })}
                />
              )}
              {product.isBestSeller && (
                <Chip
                  icon={<TrendingUp sx={{ fontSize: 16 }} />}
                  label="Mais Vendido"
                  size="small"
                  sx={(theme) => ({
                    backgroundColor: theme.palette.badges.bestSeller.main,
                    color: theme.palette.badges.bestSeller.contrastText,
                    fontWeight: 700,
                    '& .MuiChip-icon': {
                      color: `${theme.palette.badges.bestSeller.contrastText} !important`,
                    },
                  })}
                />
              )}
            </Stack>
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              {product.name}
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary', lineHeight: 1.8 }}>
              {product.description}
            </Typography>
          </Box>

          <Divider />

          {/* Options */}
          {product.options && product.options.length > 0 && (
            <Stack spacing={3}>
              {product.options.map((option) => (
                <FormControl key={option.id} required={option.required}>
                  <FormLabel
                    sx={{
                      fontWeight: 700,
                      mb: 1.5,
                      color: 'text.primary',
                      fontSize: '1rem',
                      '& .MuiFormLabel-asterisk': {
                        color: 'error.main',
                      },
                    }}
                  >
                    {option.name}
                  </FormLabel>
                  <RadioGroup
                    value={selectedOptions[option.id] || ''}
                    onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  >
                    <Stack spacing={1}>
                      {option.choices.map((choice) => (
                        <Paper
                          key={choice.id}
                          component={motion.div}
                          whileHover={{ scale: 1.02, x: 4 }}
                          elevation={selectedOptions[option.id] === choice.id ? 4 : 1}
                          sx={{
                            p: 2,
                            cursor: 'pointer',
                            border: selectedOptions[option.id] === choice.id
                              ? '2px solid'
                              : '2px solid transparent',
                            borderColor: selectedOptions[option.id] === choice.id
                              ? 'secondary.main'
                              : 'transparent',
                            transition: 'all 0.2s',
                          }}
                          onClick={() => handleOptionChange(option.id, choice.id)}
                        >
                          <FormControlLabel
                            value={choice.id}
                            control={<Radio />}
                            label={
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                                <Typography sx={{ fontWeight: 600 }}>
                                  {choice.name}
                                </Typography>
                                {choice.price > 0 && (
                                  <Typography sx={{ fontWeight: 700, color: 'secondary.main' }}>
                                    +{formatCurrency(choice.price)}
                                  </Typography>
                                )}
                              </Box>
                            }
                            sx={{ m: 0, width: '100%' }}
                          />
                        </Paper>
                      ))}
                    </Stack>
                  </RadioGroup>
                </FormControl>
              ))}
              <Divider />
            </Stack>
          )}

          {/* Quantity and Price */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1 }}>
                Quantidade
              </Typography>
              <Stack direction="row" spacing={2} alignItems="center">
                <IconButton
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  sx={{
                    border: '2px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Remove />
                </IconButton>
                <Typography variant="h6" sx={{ minWidth: 40, textAlign: 'center', fontWeight: 700 }}>
                  {quantity}
                </Typography>
                <IconButton
                  component={motion.button}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setQuantity(quantity + 1)}
                  sx={{
                    border: '2px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Add />
                </IconButton>
              </Stack>
            </Box>

            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                Total
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 800, color: 'secondary.main' }}>
                {formatCurrency(calculatePrice())}
              </Typography>
            </Box>
          </Stack>

          {/* Add to Cart Button */}
          <Button
            component={motion.button}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            variant="contained"
            color="secondary"
            size="large"
            fullWidth
            onClick={handleAddToCart}
            disabled={isAddButtonDisabled()}
            sx={(theme) => ({
              py: 2,
              fontSize: '1.1rem',
              fontWeight: 700,
              boxShadow: `0px 4px 16px ${theme.palette.shadowColors.secondary}`,
            })}
          >
            Adicionar ao Carrinho
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
