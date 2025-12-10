import React, { createContext, useContext, useState } from 'react';

const DeliveryContext = createContext();

export const useDelivery = () => {
  const context = useContext(DeliveryContext);
  if (!context) {
    throw new Error('useDelivery must be used within a DeliveryProvider');
  }
  return context;
};

export const DeliveryProvider = ({ children }) => {
  const [deliveryType, setDeliveryType] = useState('delivery'); // 'delivery' ou 'pickup'

  const handleDeliveryTypeChange = (newType) => {
    if (newType !== null) {
      setDeliveryType(newType);
    }
  };

  return (
    <DeliveryContext.Provider value={{ deliveryType, setDeliveryType, handleDeliveryTypeChange }}>
      {children}
    </DeliveryContext.Provider>
  );
};
