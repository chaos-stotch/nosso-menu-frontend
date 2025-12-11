import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const OrderContext = createContext();

export const useOrder = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within an OrderProvider');
  }
  return context;
};

const ORDER_STATUS = {
  PENDING_PAYMENT: 'pending_payment',
  CONFIRMED: 'confirmed',
  PREPARING: 'preparing',
  READY: 'ready',
  OUT_FOR_DELIVERY: 'out_for_delivery',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
};

const ORDER_STATUS_LABELS = {
  [ORDER_STATUS.PENDING_PAYMENT]: 'Aguardando Pagamento',
  [ORDER_STATUS.CONFIRMED]: 'Pedido Confirmado',
  [ORDER_STATUS.PREPARING]: 'Em Preparação',
  [ORDER_STATUS.READY]: 'Pronto para Retirada',
  [ORDER_STATUS.OUT_FOR_DELIVERY]: 'Saiu para Entrega',
  [ORDER_STATUS.DELIVERED]: 'Entregue',
  [ORDER_STATUS.CANCELLED]: 'Cancelado',
};

export const OrderProvider = ({ children }) => {
  const [currentOrder, setCurrentOrder] = useState(null);

  // Carregar pedido do localStorage ao iniciar
  useEffect(() => {
    const savedOrder = localStorage.getItem('currentOrder');
    if (savedOrder) {
      try {
        const order = JSON.parse(savedOrder);
        // Verificar se o pedido não foi entregue ou cancelado
        if (order.status !== ORDER_STATUS.DELIVERED && order.status !== ORDER_STATUS.CANCELLED) {
          setCurrentOrder(order);
        }
      } catch (error) {
        console.error('Error loading order from localStorage:', error);
      }
    }
  }, []);

  // Salvar pedido no localStorage sempre que mudar
  useEffect(() => {
    if (currentOrder) {
      localStorage.setItem('currentOrder', JSON.stringify(currentOrder));
    } else {
      localStorage.removeItem('currentOrder');
    }
  }, [currentOrder]);

  const createOrder = async (orderData) => {
    try {
      // Criar pedido no backend - SEMPRE salvar no banco
      const order = await api.createOrder(orderData);
      if (!order || !order.id) {
        throw new Error('Pedido não foi criado corretamente no backend');
      }
      setCurrentOrder(order);
      console.log('Pedido criado com sucesso no banco:', order.id);
      return order;
    } catch (error) {
      console.error('Error creating order:', error);
      // Não usar fallback - sempre exigir que seja salvo no banco
      throw new Error(`Erro ao criar pedido: ${error.message || 'Verifique se o backend está rodando'}`);
    }
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setCurrentOrder((prev) => {
      if (prev && prev.id === orderId) {
        return {
          ...prev,
          status: newStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return prev;
    });
  };

  const markPaymentAsPaid = async (orderId) => {
    try {
      // Atualizar no backend
      const updatedOrder = await api.updateOrder(orderId, {
        paymentPaid: true,
        status: ORDER_STATUS.CONFIRMED,
      });
      setCurrentOrder(updatedOrder);
    } catch (error) {
      console.error('Error updating order payment:', error);
      // Fallback para atualizar localmente
      setCurrentOrder((prev) => {
        if (prev && prev.id === orderId) {
          return {
            ...prev,
            status: ORDER_STATUS.CONFIRMED,
            paymentPaid: true,
            paymentPaidAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        }
        return prev;
      });
    }
  };

  const clearOrder = () => {
    setCurrentOrder(null);
    localStorage.removeItem('currentOrder');
  };

  const refreshOrder = async (orderId) => {
    try {
      const order = await api.getOrder(orderId);
      if (order) {
        setCurrentOrder(order);
        return order;
      }
    } catch (error) {
      console.error('Error refreshing order:', error);
    }
    return null;
  };

  // Simular progresso do pedido (para demonstração)
  const simulateOrderProgress = (orderId, deliveryType) => {
    if (!currentOrder || currentOrder.id !== orderId) return;

    const statusSequence = [
      ORDER_STATUS.CONFIRMED,
      ORDER_STATUS.PREPARING,
      ORDER_STATUS.READY,
      deliveryType === 'delivery' ? ORDER_STATUS.OUT_FOR_DELIVERY : ORDER_STATUS.READY,
      ORDER_STATUS.DELIVERED,
    ];

    let currentIndex = statusSequence.indexOf(currentOrder.status);
    if (currentIndex === -1) currentIndex = 0;

    const interval = setInterval(() => {
      if (currentIndex < statusSequence.length - 1) {
        currentIndex++;
        updateOrderStatus(orderId, statusSequence[currentIndex]);
      } else {
        clearInterval(interval);
      }
    }, 30000); // Atualiza a cada 30 segundos (para demonstração)

    return () => clearInterval(interval);
  };

  return (
    <OrderContext.Provider
      value={{
        currentOrder,
        createOrder,
        updateOrderStatus,
        markPaymentAsPaid,
        clearOrder,
        refreshOrder,
        simulateOrderProgress,
        ORDER_STATUS,
        ORDER_STATUS_LABELS,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export { ORDER_STATUS, ORDER_STATUS_LABELS };
