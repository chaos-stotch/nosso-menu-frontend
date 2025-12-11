import React, { useState, useRef, useEffect } from 'react';
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
import { Close, Add, Remove, Star, TrendingUp, KeyboardArrowDown } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/mockData';

const ProductModal = ({ product, open, onClose, onAddToCart }) => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [showScrollIndicator, setShowScrollIndicator] = useState(false);
  const scrollableContentRef = useRef(null);

  // Verificar se há conteúdo para rolar
  useEffect(() => {
    const checkScroll = () => {
      if (scrollableContentRef.current) {
        const { scrollHeight, clientHeight, scrollTop } = scrollableContentRef.current;
        // Mostrar indicador apenas se houver scroll disponível, estiver no topo e não tiver rolado ainda
        const hasScroll = scrollHeight > clientHeight;
        const isAtTop = scrollTop < 10; // Considera "no topo" se scrollTop for menor que 10px
        setShowScrollIndicator(hasScroll && isAtTop);
      }
    };

    if (open) {
      // Aguardar um pouco para o conteúdo ser renderizado
      const timeouts = [];
      
      const setupScrollListener = () => {
        if (scrollableContentRef.current) {
          checkScroll();
          const scrollElement = scrollableContentRef.current;
          scrollElement.addEventListener('scroll', checkScroll);
          
          // Verificar periodicamente para garantir que detecta mudanças
          const interval = setInterval(checkScroll, 200);
          
          // Usar ResizeObserver para detectar mudanças no tamanho do conteúdo
          const resizeObserver = new ResizeObserver(checkScroll);
          resizeObserver.observe(scrollElement);
          
          return () => {
            scrollElement.removeEventListener('scroll', checkScroll);
            clearInterval(interval);
            resizeObserver.disconnect();
          };
        }
      };

      // Múltiplos delays para garantir que detecta
      timeouts.push(setTimeout(setupScrollListener, 50));
      timeouts.push(setTimeout(setupScrollListener, 200));
      timeouts.push(setTimeout(setupScrollListener, 500));
      
      return () => {
        timeouts.forEach(clearTimeout);
      };
    } else {
      setShowScrollIndicator(false);
    }
  }, [open, product, selectedOptions]);

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
    return product?.options?.some(option => 
      option.required && !selectedOptions[option.id]
    ) || false;
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh',
        },
      }}
    >
      {/* Close Button - Fixed Position */}
      <IconButton
        onClick={onClose}
        sx={{
          position: 'absolute',
          top: 16,
          right: 16,
          zIndex: 10,
          backgroundColor: 'rgba(255,255,255,0.9)',
          '&:hover': {
            backgroundColor: 'white',
          },
        }}
      >
        <Close />
      </IconButton>

      <DialogContent 
        sx={{ 
          p: 0,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Scrollable Content */}
        <Box
          ref={scrollableContentRef}
          sx={{
            flex: 1,
            overflowY: 'auto',
            position: 'relative',
            '&::-webkit-scrollbar': {
              width: '6px',
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'transparent',
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'rgba(0,0,0,0.2)',
              borderRadius: '3px',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.3)',
              },
            },
          }}
        >
          {/* Product Image */}
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              paddingTop: { xs: '40%', sm: '35%', md: '30%' },
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
                userSelect: 'none',
                pointerEvents: 'none',
              }}
            />
          </Box>

          {/* Content */}
          <Box sx={{ p: 3 }}>
          {/* Scroll Indicator */}
          {showScrollIndicator && (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.95) 100%)',
                pointerEvents: 'none',
                zIndex: 2,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                pb: 1,
              }}
            >
              <Box
                component={motion.div}
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Role para ver mais
                </Typography>
                <KeyboardArrowDown
                  sx={{
                    fontSize: 24,
                    color: 'secondary.main',
                  }}
                />
              </Box>
            </Box>
          )}
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

          {/* Options */}
          {product.options && product.options.length > 0 && (
            <>
              <Divider />
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
              </Stack>
            </>
          )}
        </Stack>
          </Box>

          {/* Scroll Indicator */}
          {showScrollIndicator && (
            <Box
              component={motion.div}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              sx={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: 80,
                background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.7) 30%, rgba(255,255,255,0.95) 100%)',
                pointerEvents: 'none',
                zIndex: 2,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                pb: 1,
              }}
            >
              <Box
                component={motion.div}
                animate={{
                  y: [0, 8, 0],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 0.5,
                }}
              >
                <Typography
                  variant="caption"
                  sx={{
                    color: 'text.secondary',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: 1,
                  }}
                >
                  Role para ver mais
                </Typography>
                <KeyboardArrowDown
                  sx={{
                    fontSize: 24,
                    color: 'secondary.main',
                  }}
                />
              </Box>
            </Box>
          )}
        </Box>

        {/* Fixed Footer */}
        <Box
          sx={{
            borderTop: '1px solid',
            borderColor: 'divider',
            backgroundColor: 'background.paper',
            p: 3,
            position: 'sticky',
            bottom: 0,
            zIndex: 1,
          }}
        >
          <Stack spacing={2}>
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
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
