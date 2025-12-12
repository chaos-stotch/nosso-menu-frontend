import { useState, useEffect, useRef, useCallback } from 'react';
import api from '../services/api';

const useNotifications = (restaurantId) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const previousOrdersRef = useRef([]);
  const isInitialLoadRef = useRef(true);
  const notificationIdsRef = useRef(new Set());

  const addNotification = useCallback((notification) => {
    // Evitar notificações duplicadas
    if (notificationIdsRef.current.has(notification.id)) {
      return;
    }
    
    notificationIdsRef.current.add(notification.id);
    setNotifications(prev => [notification, ...prev]);
    setUnreadCount(prev => prev + 1);
  }, []);

  useEffect(() => {
    if (!restaurantId) return;

    // Reset ao mudar restaurante
    previousOrdersRef.current = [];
    isInitialLoadRef.current = true;
    notificationIdsRef.current.clear();

    // Carregar pedidos iniciais
    const loadInitialOrders = async () => {
      try {
        const orders = await api.getOrders(restaurantId);
        previousOrdersRef.current = orders || [];
        isInitialLoadRef.current = false;
      } catch (err) {
        console.error('Error loading initial orders:', err);
        isInitialLoadRef.current = false;
      }
    };

    loadInitialOrders();

    // Polling para verificar novos pedidos a cada 5 segundos
    const interval = setInterval(async () => {
      if (!restaurantId || isInitialLoadRef.current) return;

      try {
        const currentOrders = await api.getOrders(restaurantId);
        
        if (previousOrdersRef.current.length > 0 && currentOrders && currentOrders.length > 0) {
          // Encontrar novos pedidos comparando IDs
          const previousOrderIds = new Set(previousOrdersRef.current.map(o => o.id));
          const newOrders = currentOrders.filter(order => !previousOrderIds.has(order.id));

          // Adicionar notificações para novos pedidos
          newOrders.forEach(order => {
            const notificationId = `order_${order.id}`;
            if (!notificationIdsRef.current.has(notificationId)) {
              addNotification({
                id: notificationId,
                type: 'order',
                orderId: order.id,
                title: 'Novo Pedido',
                message: `Pedido #${order.id.slice(-8)} - ${order.customerName || order.customer_name || 'Cliente'}`,
                timestamp: new Date().toISOString(),
                read: false,
              });
            }
          });
        }

        previousOrdersRef.current = currentOrders || [];
      } catch (err) {
        console.error('Error checking for new orders:', err);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [restaurantId, addNotification]);

  const markAsRead = (notificationId) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
    setUnreadCount(0);
  };

  const removeNotification = (notificationId) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === notificationId);
      if (notification && !notification.read) {
        setUnreadCount(count => Math.max(0, count - 1));
      }
      notificationIdsRef.current.delete(notificationId);
      return prev.filter(n => n.id !== notificationId);
    });
  };

  const clearAll = () => {
    setNotifications([]);
    setUnreadCount(0);
    notificationIdsRef.current.clear();
  };

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };
};

export default useNotifications;
