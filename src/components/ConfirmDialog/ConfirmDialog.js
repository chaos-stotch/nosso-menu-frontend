import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  DialogContentText,
} from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';

const ConfirmDialog = ({ open, onClose, onConfirm, title, message, confirmText = 'Confirmar', cancelText = 'Cancelar', severity = 'warning' }) => {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 2, pb: 1 }}>
        <WarningIcon 
          sx={{ 
            color: severity === 'error' ? 'error.main' : 'warning.main',
            fontSize: 28,
          }} 
        />
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ fontSize: '1rem', color: 'text.primary', mt: 1 }}>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ minWidth: 100 }}>
          {cancelText}
        </Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          color={severity === 'error' ? 'error' : 'primary'}
          sx={{ minWidth: 100 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
