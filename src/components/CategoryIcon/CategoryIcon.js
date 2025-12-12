import React from 'react';
import * as Icons from '@mui/icons-material';
import { Category as DefaultIcon } from '@mui/icons-material';

// Componente para renderizar ícone dinamicamente baseado no nome
const DynamicCategoryIcon = ({ iconName, sx = {} }) => {
  const iconProps = {
    sx: {
      fontSize: '1.5rem',
      ...sx,
    },
  };

  if (!iconName) {
    return <DefaultIcon {...iconProps} />;
  }

  const IconComponent = Icons[iconName] || DefaultIcon;
  return <IconComponent {...iconProps} />;
};

// Componente legado para compatibilidade (usa categoryId)
const CategoryIcon = ({ categoryId, iconName, sx = {} }) => {
  // Se iconName for fornecido, usa o componente dinâmico
  if (iconName) {
    return <DynamicCategoryIcon iconName={iconName} sx={sx} />;
  }

  // Mantém compatibilidade com o código antigo
  const iconProps = {
    sx: {
      fontSize: '1.5rem',
      ...sx,
    },
  };

  switch (categoryId) {
    case 'pizzas':
      return <Icons.LocalPizza {...iconProps} />;
    case 'bebidas':
      return <Icons.EmojiFoodBeverage {...iconProps} />;
    case 'sobremesas':
      return <Icons.Cake {...iconProps} />;
    case 'combos':
      return <Icons.CardGiftcard {...iconProps} />;
    default:
      return <DefaultIcon {...iconProps} />;
  }
};

export default CategoryIcon;
export { DynamicCategoryIcon };
