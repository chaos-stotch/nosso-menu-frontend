import React from 'react';
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
} from '@mui/material';
import { Add, Star, TrendingUp } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { formatCurrency } from '../../utils/mockData';

const ProductCard = ({ product, onAddToCart, onOpenModal }) => {
  const hasOptions = () => {
    return product.options && product.options.length > 0;
  };

  const handleAddClick = (e) => {
    e.stopPropagation();
    
    // Se não houver opções, adiciona direto ao carrinho
    if (!hasOptions()) {
      onAddToCart(product, {}, 1);
    } else {
      // Se houver opções, abre o modal para o usuário escolher
      onOpenModal(product);
    }
  };

  return (
    <Card
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -8 }}
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        '&:hover .product-image': {
          transform: 'scale(1.1)',
        },
      }}
      onClick={() => onOpenModal(product)}
    >
      {/* Badges */}
      <Box
        sx={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
        }}
      >
        {product.isRecommended && (
          <Chip
            icon={<Star sx={{ fontSize: 16 }} />}
            label="Recomendado"
            size="small"
            sx={(theme) => ({
              backgroundColor: theme.palette.badges.recommended.main,
              color: theme.palette.badges.recommended.contrastText,
              fontWeight: 700,
              fontSize: '0.7rem',
              height: 24,
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
              fontSize: '0.7rem',
              height: 24,
              '& .MuiChip-icon': {
                color: `${theme.palette.badges.bestSeller.contrastText} !important`,
              },
            })}
          />
        )}
      </Box>

      {/* Product Image */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          paddingTop: '75%',
          overflow: 'hidden',
          backgroundColor: 'grey.100',
        }}
      >
        <CardMedia
          component="img"
          image={product.image}
          alt={product.name}
          className="product-image"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
        />
      </Box>

      {/* Product Info */}
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2.5 }}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            mb: 1,
            color: 'text.primary',
            lineHeight: 1.3,
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            mb: 2,
            flexGrow: 1,
            lineHeight: 1.6,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}
        >
          {product.description}
        </Typography>

        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          sx={{ mt: 'auto' }}
        >
          <Box>
            {product.originalPrice && (
              <Typography
                variant="caption"
                sx={{
                  textDecoration: 'line-through',
                  color: 'text.secondary',
                  mr: 1,
                }}
              >
                {formatCurrency(product.originalPrice)}
              </Typography>
            )}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 800,
                color: 'primary.main',
                display: 'inline',
              }}
            >
              {formatCurrency(product.price)}
            </Typography>
          </Box>

          <IconButton
            component={motion.button}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleAddClick}
            sx={(theme) => ({
              backgroundColor: 'secondary.main',
              color: 'white',
              '&:hover': {
                backgroundColor: 'secondary.dark',
                boxShadow: `0px 4px 12px ${theme.palette.shadowColors.secondary}`,
              },
            })}
          >
            <Add />
          </IconButton>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
