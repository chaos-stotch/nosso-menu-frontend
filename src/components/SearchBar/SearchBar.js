import React from 'react';
import { Box, Container, TextField, InputAdornment, Avatar, Stack } from '@mui/material';
import { Search } from '@mui/icons-material';
import { motion } from 'framer-motion';

const SearchBar = ({ searchQuery, onSearchChange, showLogo = false, restaurant }) => {
  const handleLogoClick = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <Box
      sx={{
        py: 3,
        backgroundColor: 'background.paper',
        borderBottom: '1px solid',
        borderColor: 'divider',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255,255,255,0.95)',
      }}
    >
      <Container maxWidth="lg">
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          sx={{
            gap: 2,
          }}
        >
          {showLogo && restaurant && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, x: -20 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Avatar
                src={restaurant.logo}
                alt={restaurant.name}
                onClick={handleLogoClick}
                sx={(theme) => ({
                  width: { xs: 50, sm: 60 },
                  height: { xs: 50, sm: 60 },
                  border: '2px solid',
                  borderColor: 'divider',
                  boxShadow: `0px 4px 12px ${theme.palette.shadowColors.light}`,
                  flexShrink: 0,
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                  '&:active': {
                    transform: 'scale(0.95)',
                  },
                })}
              />
            </motion.div>
          )}
          <Box sx={{ flex: 1 }}>
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <TextField
                fullWidth
                placeholder="Buscar no cardápio"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 3,
                    backgroundColor: 'background.default',
                    '&:hover': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'secondary.main',
                      },
                    },
                    '&.Mui-focused': {
                      '& .MuiOutlinedInput-notchedOutline': {
                        borderColor: 'secondary.main',
                        borderWidth: 2,
                      },
                    },
                  },
                }}
              />
            </motion.div>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default SearchBar;
