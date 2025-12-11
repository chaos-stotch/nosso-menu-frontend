import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Stack,
} from '@mui/material';
import { motion } from 'framer-motion';
import { Restaurant as RestaurantIcon } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const Signup = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    restaurantName: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field) => (e) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    setLoading(true);

    try {
      await signup(formData.email, formData.password, {
        name: formData.name,
        restaurant_name: formData.restaurantName,
      });
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Erro ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'background.default',
        py: 4,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          component={motion.div}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          sx={{ p: 4 }}
        >
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <RestaurantIcon sx={{ fontSize: 48, color: 'primary.main', mb: 2 }} />
            <Typography variant="h4" sx={{ fontWeight: 800, mb: 1 }}>
              Crie sua conta grátis
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Comece a vender online em minutos
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Seu nome"
                value={formData.name}
                onChange={handleChange('name')}
                required
              />
              <TextField
                fullWidth
                label="Nome do restaurante"
                value={formData.restaurantName}
                onChange={handleChange('restaurantName')}
                required
                helperText="Este será o nome exibido no seu cardápio"
              />
              <TextField
                fullWidth
                label="E-mail"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
                required
                autoComplete="email"
              />
              <TextField
                fullWidth
                label="Senha"
                type="password"
                value={formData.password}
                onChange={handleChange('password')}
                required
                autoComplete="new-password"
                helperText="Mínimo de 6 caracteres"
              />
              <TextField
                fullWidth
                label="Confirmar senha"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange('confirmPassword')}
                required
                autoComplete="new-password"
              />
              <Button
                type="submit"
                variant="contained"
                size="large"
                fullWidth
                disabled={loading}
                sx={{ py: 1.5 }}
              >
                {loading ? 'Criando conta...' : 'Criar conta grátis'}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Já tem uma conta?{' '}
              <Link to="/login" style={{ color: 'inherit', fontWeight: 600 }}>
                Fazer login
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Signup;

