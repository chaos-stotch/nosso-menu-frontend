import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export const useCartContext = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCartContext must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((product, options = {}, quantity = 1) => {
    const itemId = `${product.id}-${JSON.stringify(options)}`;
    
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === itemId);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === itemId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      
      return [
        ...prevItems,
        {
          id: itemId,
          product,
          options,
          quantity,
          unitPrice: product.price,
        },
      ];
    });
    
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((itemId) => {
    setItems(prevItems => prevItems.filter(item => item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId, quantity) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getTotal = useCallback((deliveryFee = 0, discount = 0) => {
    const subtotal = items.reduce(
      (sum, item) => {
        const optionsPrice = Object.values(item.options).reduce(
          (optSum, opt) => optSum + (opt.price || 0),
          0
        );
        return sum + (item.unitPrice + optionsPrice) * item.quantity;
      },
      0
    );
    return subtotal + deliveryFee - discount;
  }, [items]);

  const getSubtotal = useCallback(() => {
    return items.reduce(
      (sum, item) => {
        const optionsPrice = Object.values(item.options).reduce(
          (optSum, opt) => optSum + (opt.price || 0),
          0
        );
        return sum + (item.unitPrice + optionsPrice) * item.quantity;
      },
      0
    );
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        setIsOpen,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        getTotal,
        getSubtotal,
        getItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
