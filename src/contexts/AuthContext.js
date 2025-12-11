import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import api from '../services/api';

const SUPABASE_URL = process.env.REACT_APP_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.REACT_APP_SUPABASE_ANON_KEY || '';

const supabase = SUPABASE_URL && SUPABASE_ANON_KEY 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Verificar sessão atual
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadRestaurant(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Ouvir mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        loadRestaurant(session.user.id);
      } else {
        setRestaurant(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadRestaurant = async (userId) => {
    try {
      // Buscar restaurante do usuário
      const response = await api.getRestaurantByUserId(userId);
      if (response) {
        setRestaurant(response);
      }
    } catch (error) {
      console.error('Error loading restaurant:', error);
    } finally {
      setLoading(false);
    }
  };

  const signup = async (email, password, metadata = {}) => {
    if (!supabase) {
      throw new Error('Supabase não configurado');
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });

    if (error) throw error;

    // Criar restaurante para o usuário
    if (data.user) {
      try {
        // Gerar slug a partir do nome do restaurante
        const generateSlug = (name) => {
          return name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
        };
        
        const restaurantName = metadata.restaurant_name || 'Meu Restaurante';
        const restaurantData = {
          id: `restaurant-${data.user.id}`,
          name: restaurantName,
          slug: generateSlug(restaurantName),
          user_id: data.user.id,
          category: 'Restaurante',
          rating: 0,
          total_reviews: 0,
          price_range: '$$',
          delivery_time: '30-45 min',
          delivery_fee: 0,
          min_order: 0,
        };
        await api.createRestaurant(restaurantData);
      } catch (err) {
        console.error('Error creating restaurant:', err);
      }
    }

    return data;
  };

  const login = async (email, password) => {
    if (!supabase) {
      throw new Error('Supabase não configurado');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      await loadRestaurant(data.user.id);
    }

    return data;
  };

  const logout = async () => {
    if (!supabase) {
      return;
    }

    await supabase.auth.signOut();
    setUser(null);
    setRestaurant(null);
  };

  const refreshRestaurant = async () => {
    if (user) {
      await loadRestaurant(user.id);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        restaurant,
        loading,
        signup,
        login,
        logout,
        refreshRestaurant,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

