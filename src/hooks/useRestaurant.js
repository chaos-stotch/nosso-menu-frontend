import { useState, useMemo } from 'react';
import { mockRestaurant, mockCategories, mockProducts } from '../utils/mockData';

const useRestaurant = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const restaurant = mockRestaurant;
  const categories = mockCategories;
  
  const products = useMemo(() => {
    if (!searchQuery.trim()) {
      return mockProducts;
    }
    
    const query = searchQuery.toLowerCase().trim();
    return mockProducts.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  return {
    restaurant,
    categories,
    products,
    searchQuery,
    handleSearchChange,
  };
};

export default useRestaurant;
