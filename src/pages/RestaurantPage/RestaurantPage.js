import React, { useState, useMemo, useRef, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Fab,
  Badge,
  Typography,
  Divider,
  CircularProgress,
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { motion } from 'framer-motion';
import RestaurantHeader from '../../components/RestaurantHeader/RestaurantHeader';
import SearchBar from '../../components/SearchBar/SearchBar';
import ProductCard from '../../components/ProductCard/ProductCard';
import ProductModal from '../../components/ProductModal/ProductModal';
import CartSidebar from '../../components/CartSidebar/CartSidebar';
import Footer from '../../components/Footer/Footer';
import RestaurantThemeProvider from '../../components/RestaurantThemeProvider/RestaurantThemeProvider';
import useRestaurant from '../../hooks/useRestaurant';
import { useCartContext } from '../../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const RestaurantPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams();
  const { restaurant, categories, products, searchQuery, handleSearchChange, loading } = useRestaurant(slug);
  const headerRef = useRef(null);
  const [showLogoInSearchBar, setShowLogoInSearchBar] = useState(false);
  const {
    items,
    isOpen: isCartOpen,
    setIsOpen: setIsCartOpen,
    addItem,
    removeItem,
    updateQuantity,
    getItemCount,
    getTotal,
    getSubtotal,
  } = useCartContext();

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCart = (product, options = {}, quantity = 1) => {
    addItem(product, options, quantity);
  };

  const handleStartOrder = () => {
    setIsCartOpen(true);
  };

  const handleCheckout = () => {
    setIsCartOpen(false);
    if (slug) {
      navigate(`/${slug}/checkout`);
    }
  };

  // Detectar quando o header sair de vista
  useEffect(() => {
    const headerElement = headerRef.current;
    if (!headerElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // Se o header não está visível (saiu de vista), mostrar logo na barra de pesquisa
          setShowLogoInSearchBar(!entry.isIntersecting);
        });
      },
      {
        threshold: 0,
        rootMargin: '0px',
      }
    );

    observer.observe(headerElement);

    return () => {
      if (headerElement) {
        observer.unobserve(headerElement);
      }
    };
  }, []);

  // Atualizar favicon com a logo do restaurante
  useEffect(() => {
    if (!restaurant?.logo) return;

    // Encontrar ou criar o elemento link do favicon
    let link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = restaurant.logo;
    
    // Adicionar ao head se não existir
    if (!document.querySelector("link[rel*='icon']")) {
      document.getElementsByTagName('head')[0].appendChild(link);
    }

    // Função de limpeza: restaurar favicon padrão ao sair da página
    return () => {
      // Remover o favicon customizado quando sair da página
      const customLink = document.querySelector("link[rel*='icon']");
      if (customLink && customLink.href === restaurant.logo) {
        customLink.remove();
      }
    };
  }, [restaurant?.logo]);

  // Agrupar produtos por categoria
  const productsByCategory = useMemo(() => {
    const grouped = {};
    
    products.forEach(product => {
      const categoryId = product.category;
      if (!grouped[categoryId]) {
        grouped[categoryId] = [];
      }
      grouped[categoryId].push(product);
    });
    
    // Ordenar categorias na ordem definida em mockCategories
    const orderedCategories = categories
      .filter(cat => grouped[cat.id] && grouped[cat.id].length > 0)
      .map(cat => ({
        category: cat,
        products: grouped[cat.id]
      }));
    
    return orderedCategories;
  }, [products, categories]);

  // Mostrar loading enquanto carrega
  if (loading && !restaurant) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'background.default',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Se não houver restaurante, não renderizar nada
  if (!restaurant) {
    return null;
  }

  return (
    <RestaurantThemeProvider restaurant={restaurant}>
      <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'background.default',
      }}
    >
      <Box ref={headerRef}>
      <RestaurantHeader restaurant={restaurant} onStartOrder={handleStartOrder} />
      </Box>

      <SearchBar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        showLogo={showLogoInSearchBar}
        restaurant={restaurant}
      />

      <Container maxWidth="lg" sx={{ py: 6 }}>
        {products.length === 0 ? (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: 'text.secondary' }}>
              Nenhum produto encontrado
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>
              Tente buscar por outro termo
            </Typography>
          </Box>
        ) : (
          <Box>
            {productsByCategory.map(({ category, products: categoryProducts }, categoryIndex) => (
              <Box key={category.id} sx={{ mb: 6 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 3,
                    color: 'text.primary',
                    fontSize: { xs: '1.5rem', sm: '1.75rem', md: '2rem' },
                  }}
                >
                  {category.name}
                </Typography>
                <Divider sx={{ mb: 3 }} />
          <Grid container spacing={3}>
                  {categoryProducts.map((product, index) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: (categoryIndex * 0.1) + (index * 0.05) }}
                >
                  <ProductCard
                    product={product}
                    onAddToCart={handleAddToCart}
                    onOpenModal={handleOpenModal}
                  />
                </motion.div>
              </Grid>
            ))}
          </Grid>
              </Box>
            ))}
          </Box>
        )}
      </Container>

      <Footer restaurant={restaurant} />

      {/* Floating Cart Button */}
      {getItemCount() > 0 && (
        <Fab
          component={motion.button}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          color="secondary"
          aria-label="carrinho"
          onClick={() => setIsCartOpen(true)}
          sx={(theme) => ({
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 1000,
            boxShadow: `0px 8px 24px ${theme.palette.shadowColors.secondaryLight}`,
          })}
        >
          <Badge badgeContent={getItemCount()} color="primary">
            <ShoppingCart />
          </Badge>
        </Fab>
      )}

      {/* Product Modal */}
      <ProductModal
        product={selectedProduct}
        open={isModalOpen}
        onClose={handleCloseModal}
        onAddToCart={handleAddToCart}
      />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        restaurant={restaurant}
        onCheckout={handleCheckout}
      />
    </Box>
    </RestaurantThemeProvider>
  );
};

export default RestaurantPage;
