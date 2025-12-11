import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Stack,
  CircularProgress,
  Alert,
} from '@mui/material';
import {
  QrCode as QrCodeIcon,
  ContentCopy as ContentCopyIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Função para gerar um QR Code PIX simples (em produção, isso viria de uma API)
const generatePixQRCode = (amount, orderId, restaurant) => {
  // Em produção, isso seria gerado por uma API de pagamento
  // Por enquanto, vamos usar um QR code estático para demonstração
  const pixKey = restaurant?.pixKey || '12345678900'; // Chave PIX do restaurante
  const merchantName = restaurant?.name || 'Restaurante';
  const description = `Pedido ${orderId}`;
  
  // Formato simplificado do PIX (em produção seria o formato completo)
  const pixCode = `00020126580014BR.GOV.BCB.PIX0136${pixKey}520400005303986540${amount.toFixed(2)}5802BR59${merchantName.length}${merchantName}60${description.length}${description}62070503***6304`;
  
  return {
    code: pixCode,
    qrCodeImage: `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(pixCode)}`,
    pixKey,
    amount,
  };
};

const PixQRCode = ({ amount, orderId, restaurant, onPaymentConfirmed }) => {
  const [copied, setCopied] = React.useState(false);
  const pixData = React.useMemo(() => generatePixQRCode(amount, orderId, restaurant), [amount, orderId, restaurant]);

  const handleCopyPixCode = () => {
    navigator.clipboard.writeText(pixData.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyPixKey = () => {
    navigator.clipboard.writeText(pixData.pixKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Paper
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        p: 4,
        textAlign: 'center',
        background: 'linear-gradient(135deg, #32BCAD 0%, #2A9D8F 100%)',
        color: 'white',
      }}
    >
      <QrCodeIcon sx={{ fontSize: 48, mb: 2 }} />
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
        Pagamento via PIX
      </Typography>
      <Typography variant="body2" sx={{ mb: 3, opacity: 0.9 }}>
        Escaneie o QR Code ou copie o código PIX
      </Typography>

      {/* QR Code Image */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          mb: 3,
        }}
      >
        <Paper
          sx={{
            p: 2,
            backgroundColor: 'white',
            borderRadius: 2,
            display: 'inline-block',
          }}
        >
          <Box
            component="img"
            src={pixData.qrCodeImage}
            alt="QR Code PIX"
            sx={{
              width: 250,
              height: 250,
              display: 'block',
            }}
          />
        </Paper>
      </Box>

      {/* Valor */}
      <Typography variant="h4" sx={{ fontWeight: 800, mb: 3 }}>
        {new Intl.NumberFormat('pt-BR', {
          style: 'currency',
          currency: 'BRL',
        }).format(amount)}
      </Typography>

      {/* Chave PIX */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 1 }}>
          Chave PIX:
        </Typography>
        <Paper
          sx={{
            p: 1.5,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography variant="body2" sx={{ fontFamily: 'monospace', flex: 1, textAlign: 'left' }}>
            {pixData.pixKey}
          </Typography>
          <Button
            size="small"
            onClick={handleCopyPixKey}
            startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
            sx={{
              color: 'white',
              minWidth: 'auto',
              ml: 1,
            }}
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </Button>
        </Paper>
      </Box>

      {/* Código PIX Completo */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="caption" sx={{ opacity: 0.8, display: 'block', mb: 1 }}>
          Código PIX (Copiar e Colar):
        </Typography>
        <Paper
          sx={{
            p: 1.5,
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontFamily: 'monospace',
              flex: 1,
              textAlign: 'left',
              fontSize: '0.7rem',
              wordBreak: 'break-all',
            }}
          >
            {pixData.code.substring(0, 50)}...
          </Typography>
          <Button
            size="small"
            onClick={handleCopyPixCode}
            startIcon={copied ? <CheckCircleIcon /> : <ContentCopyIcon />}
            sx={{
              color: 'white',
              minWidth: 'auto',
              ml: 1,
            }}
          >
            {copied ? 'Copiado!' : 'Copiar'}
          </Button>
        </Paper>
      </Box>

      <Alert severity="info" sx={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', mb: 2 }}>
        Após realizar o pagamento, clique no botão abaixo para confirmar
      </Alert>

      <Button
        variant="contained"
        fullWidth
        onClick={onPaymentConfirmed}
        sx={{
          backgroundColor: 'white',
          color: '#32BCAD',
          fontWeight: 700,
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
          },
        }}
      >
        Já Paguei
      </Button>
    </Paper>
  );
};

export default PixQRCode;
