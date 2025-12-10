import React from 'react';
import {
  LocalPizza,
  EmojiFoodBeverage,
  Cake,
  CardGiftcard,
} from '@mui/icons-material';

const CategoryIcon = ({ categoryId, sx = {} }) => {
  const iconProps = {
    sx: {
      fontSize: '1.5rem',
      ...sx,
    },
  };

  switch (categoryId) {
    case 'pizzas':
      return <LocalPizza {...iconProps} />;
    case 'bebidas':
      return <EmojiFoodBeverage {...iconProps} />;
    case 'sobremesas':
      return <Cake {...iconProps} />;
    case 'combos':
      return <CardGiftcard {...iconProps} />;
    default:
      return null;
  }
};

export default CategoryIcon;
