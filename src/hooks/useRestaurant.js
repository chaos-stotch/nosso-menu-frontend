import { useState, useMemo, useEffect } from 'react';
import api from '../services/api';

const useRestaurant = (slug = null) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [restaurant, setRestaurant] = useState(null);
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carregar dados do restaurante
  useEffect(() => {
    const loadData = async () => {
      if (!slug) {
        setError('Slug do restaurante é obrigatório');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Buscar por slug
        const restaurantData = await api.getRestaurantBySlug(slug);
        
        if (!restaurantData) {
          throw new Error('Restaurante não encontrado');
        }
        
        const restaurantId = restaurantData.id;
        const [categoriesData, productsData] = await Promise.all([
          api.getCategories(restaurantId),
          api.getProducts(restaurantId),
        ]);
        
        setRestaurant(restaurantData);
        setCategories(categoriesData || []);
        setProducts(productsData || []);
        setError(null);
      } catch (err) {
        console.error('Error loading restaurant data:', err);
        setError(err.message);
        setRestaurant(null);
        setCategories([]);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      loadData();
    } else {
      setLoading(false);
    }
  }, [slug]);
  
  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) {
      return products;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return products.filter(product => 
      product.name?.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query) ||
      product.category?.toLowerCase().includes(query)
    );
  }, [products, searchQuery]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const refreshData = async () => {
    if (!slug) return;
    
    try {
      const restaurantData = await api.getRestaurantBySlug(slug);
      if (!restaurantData) return;
      
      const restaurantId = restaurantData.id;
      const [categoriesData, productsData] = await Promise.all([
        api.getCategories(restaurantId),
        api.getProducts(restaurantId),
      ]);
      
      setRestaurant(restaurantData);
      setCategories(categoriesData || []);
      setProducts(productsData || []);
    } catch (err) {
      console.error('Error refreshing data:', err);
    }
  };

  return {
    restaurant,
    categories,
    products: filteredProducts,
    searchQuery,
    handleSearchChange,
    loading,
    error,
    refreshData,
  };
};

export default useRestaurant;
