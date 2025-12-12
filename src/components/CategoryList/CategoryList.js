import React from 'react';
import { Box, Container, Stack, Button, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import CategoryIcon from '../CategoryIcon/CategoryIcon';

const CategoryList = ({ categories, selectedCategory, onSelectCategory }) => {
  return (
    <Box
      sx={{
        py: 4,
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
          sx={{
            overflowX: 'auto',
            overflowY: 'visible',
            pb: 2,
            pt: 1,
            px: 1,
            '&::-webkit-scrollbar': {
              height: 6,
            },
            '&::-webkit-scrollbar-track': {
              backgroundColor: 'grey.100',
              borderRadius: 3,
            },
            '&::-webkit-scrollbar-thumb': {
              backgroundColor: 'grey.300',
              borderRadius: 3,
              '&:hover': {
                backgroundColor: 'grey.400',
              },
            },
          }}
        >
          <Button
            component={motion.button}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelectCategory(null)}
            variant={selectedCategory === null ? 'contained' : 'outlined'}
            sx={{
              minWidth: 120,
              py: 1.5,
              borderRadius: 3,
              textTransform: 'none',
              fontWeight: 600,
              whiteSpace: 'nowrap',
              overflow: 'visible',
              ...(selectedCategory === null && {
                backgroundColor: 'secondary.main',
                color: 'white',
                '&:hover': {
                  backgroundColor: 'secondary.dark',
                },
              }),
            }}
          >
            Todos
          </Button>
          {categories.map((category, index) => (
            <Button
              key={category.id}
              component={motion.button}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelectCategory(category.id)}
              variant={selectedCategory === category.id ? 'contained' : 'outlined'}
              sx={{
                minWidth: 140,
                py: 1.5,
                borderRadius: 3,
                textTransform: 'none',
                fontWeight: 600,
                whiteSpace: 'nowrap',
                overflow: 'visible',
                ...(selectedCategory === category.id && {
                  backgroundColor: 'secondary.main',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'secondary.dark',
                  },
                }),
              }}
            >
              <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                <CategoryIcon iconName={category.icon} />
              </Box>
              {category.name}
            </Button>
          ))}
        </Stack>
      </Container>
    </Box>
  );
};

export default CategoryList;
