import { createTheme } from '@mui/material/styles';

// Função helper para gerar sombras baseadas no tema
const generateShadows = (shadowColor = 'rgba(0, 0, 0, 0.1)') => {
  const rgbaMatch = shadowColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (!rgbaMatch) {
    return [
      'none',
      '0px 2px 4px rgba(0,0,0,0.04)',
      '0px 4px 8px rgba(0,0,0,0.06)',
      '0px 8px 16px rgba(0,0,0,0.08)',
      '0px 12px 24px rgba(0,0,0,0.10)',
      '0px 16px 32px rgba(0,0,0,0.12)',
      '0px 20px 40px rgba(0,0,0,0.14)',
      '0px 24px 48px rgba(0,0,0,0.16)',
      '0px 28px 56px rgba(0,0,0,0.18)',
      '0px 32px 64px rgba(0,0,0,0.20)',
      '0px 36px 72px rgba(0,0,0,0.22)',
      '0px 40px 80px rgba(0,0,0,0.24)',
      '0px 44px 88px rgba(0,0,0,0.26)',
      '0px 48px 96px rgba(0,0,0,0.28)',
      '0px 52px 104px rgba(0,0,0,0.30)',
      '0px 56px 112px rgba(0,0,0,0.32)',
      '0px 60px 120px rgba(0,0,0,0.34)',
      '0px 64px 128px rgba(0,0,0,0.36)',
      '0px 68px 136px rgba(0,0,0,0.38)',
      '0px 72px 144px rgba(0,0,0,0.40)',
      '0px 76px 152px rgba(0,0,0,0.42)',
      '0px 80px 160px rgba(0,0,0,0.44)',
      '0px 84px 168px rgba(0,0,0,0.46)',
      '0px 88px 176px rgba(0,0,0,0.48)',
      '0px 92px 184px rgba(0,0,0,0.50)',
    ];
  }
  
  const r = rgbaMatch[1];
  const g = rgbaMatch[2];
  const b = rgbaMatch[3];
  const opacities = [0, 0.04, 0.06, 0.08, 0.10, 0.12, 0.14, 0.16, 0.18, 0.20, 0.22, 0.24, 0.26, 0.28, 0.30, 0.32, 0.34, 0.36, 0.38, 0.40, 0.42, 0.44, 0.46, 0.48, 0.50];
  
  return opacities.map((opacity, index) => {
    if (index === 0) return 'none';
    return `0px ${index * 2}px ${index * 4}px rgba(${r},${g},${b},${opacity})`;
  });
};

// Função auxiliar para converter hex para RGB
const hexToRgb = (hex) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Função auxiliar para calcular cor clara/escura
const lightenColor = (hex, percent) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * percent));
  const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * percent));
  const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * percent));
  
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
};

const darkenColor = (hex, percent) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const r = Math.max(0, Math.round(rgb.r * (1 - percent)));
  const g = Math.max(0, Math.round(rgb.g * (1 - percent)));
  const b = Math.max(0, Math.round(rgb.b * (1 - percent)));
  
  return `#${[r, g, b].map(x => {
    const hex = x.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  }).join('')}`;
};

// Função para determinar se uma cor é clara ou escura
// Usa um threshold mais alto (200) para considerar apenas cores bem claras
const isLightColor = (hex) => {
  const rgb = hexToRgb(hex);
  if (!rgb) return false;
  const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  // Só considera clara se o brightness for maior que 200 (bem claro, próximo ao branco)
  return brightness > 200;
};

export const createRestaurantTheme = (primaryColor = '#ff6b19') => {
  const baseShadowColor = 'rgba(0, 0, 0, 0.1)';
  
  // Calcular cores derivadas
  const primaryLight = lightenColor(primaryColor, 0.2);
  const primaryDark = darkenColor(primaryColor, 0.2);
  
  // Determinar cor de texto de contraste
  const primaryContrastText = isLightColor(primaryColor) ? '#000000' : '#ffffff';
  
  // Usar a cor primária como secundária também (para hover e destaques)
  const secondaryColor = primaryColor;
  const secondaryLight = primaryLight;
  const secondaryDark = primaryDark;
  const secondaryContrastText = primaryContrastText;

  return createTheme({
    palette: {
      mode: 'light',
      primary: {
        main: primaryColor,
        light: primaryLight,
        dark: primaryDark,
        contrastText: primaryContrastText,
      },
      secondary: {
        main: secondaryColor,
        light: secondaryLight,
        dark: secondaryDark,
        contrastText: secondaryContrastText,
      },
      background: {
        default: '#fafafa',
        paper: '#ffffff',
      },
      text: {
        primary: '#1a1a1a',
        secondary: '#666666',
      },
      success: {
        main: '#4caf50',
        light: '#81c784',
        dark: '#388e3c',
      },
      warning: {
        main: '#ff9800',
      },
      error: {
        main: secondaryColor,
      },
      info: {
        main: '#ffd700',
        light: '#ffed4e',
        dark: '#ccac00',
        contrastText: '#1a1a1a',
      },
      grey: {
        50: '#fafafa',
        100: '#f5f5f5',
        200: '#eeeeee',
        300: '#e0e0e0',
        400: '#bdbdbd',
        500: '#9e9e9e',
        600: '#757575',
        700: '#616161',
        800: '#424242',
        900: '#212121',
      },
      badges: {
        recommended: {
          main: '#ffd700',
          contrastText: '#1a1a1a',
        },
        bestSeller: {
          main: secondaryColor,
          contrastText: secondaryContrastText,
        },
      },
      shadowColors: {
        default: 'rgba(0, 0, 0, 0.1)',
        light: 'rgba(0, 0, 0, 0.05)',
        dark: 'rgba(0, 0, 0, 0.2)',
        secondary: `${secondaryColor}22`,
        secondaryLight: `${secondaryColor}40`,
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '3rem',
        fontWeight: 800,
        letterSpacing: '-0.02em',
        lineHeight: 1.2,
      },
      h2: {
        fontSize: '2.5rem',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
      },
      h3: {
        fontSize: '2rem',
        fontWeight: 700,
        letterSpacing: '-0.01em',
        lineHeight: 1.3,
      },
      h4: {
        fontSize: '1.5rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h5: {
        fontSize: '1.25rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      h6: {
        fontSize: '1.125rem',
        fontWeight: 600,
        lineHeight: 1.4,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
      body2: {
        fontSize: '0.875rem',
        lineHeight: 1.6,
      },
      button: {
        textTransform: 'none',
        fontWeight: 600,
        letterSpacing: '0.02em',
      },
    },
    shape: {
      borderRadius: 12,
    },
    shadows: generateShadows(baseShadowColor),
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 12,
            padding: '12px 24px',
            fontSize: '1rem',
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: `0px 4px 12px ${theme.palette.shadowColors.default.replace('0.1', '0.15')}`,
              backgroundColor: secondaryColor,
            },
          }),
          contained: ({ theme }) => ({
            '&:hover': {
              boxShadow: `0px 4px 12px ${theme.palette.shadowColors.default.replace('0.1', '0.15')}`,
              backgroundColor: secondaryColor,
            },
          }),
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            borderRadius: 16,
            boxShadow: `0px 2px 8px ${theme.palette.shadowColors.default.replace('0.1', '0.08')}`,
            '&:hover': {
              boxShadow: `0px 8px 24px ${theme.palette.shadowColors.default.replace('0.1', '0.12')}`,
              transform: 'translateY(-4px)',
              borderColor: secondaryColor,
            },
          }),
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 16,
          },
        },
      },
    },
  });
};

