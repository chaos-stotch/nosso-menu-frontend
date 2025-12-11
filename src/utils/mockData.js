export const mockRestaurant = {
  id: 'mock-restaurant',
  name: 'Restaurante Exemplo',
  category: 'Pizzaria • Italiana',
  rating: 4.8,
  totalReviews: 1247,
  priceRange: '$$',
  deliveryTime: '30-45 min',
  deliveryFee: 5.90,
  minOrder: 25.00,
  coverImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1920&q=80',
  logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQT-DxEDNqFR-BXKwPg0Xyxrmii8jL0NaH2Sg&s',
  description: 'As melhores pizzas artesanais com ingredientes selecionados e receitas tradicionais italianas.',
  address: 'Rua das Flores, 123 - Centro',
  phone: '(11) 3456-7890',
  openingHours: {
    monday: '18:00 - 23:00',
    tuesday: '18:00 - 23:00',
    wednesday: '18:00 - 23:00',
    thursday: '18:00 - 23:00',
    friday: '18:00 - 00:00',
    saturday: '18:00 - 00:00',
    sunday: '18:00 - 23:00'
  },
  promotions: [
    {
      id: 1,
      title: 'Frete Grátis',
      description: 'Em pedidos acima de R$ 50,00'
    },
    {
      id: 2,
      title: '2ª Pizza 50% OFF',
      description: 'Na compra de qualquer pizza grande'
    }
  ],
  socialMedia: {
    instagram: '@restaurante',
    facebook: 'Restaurante Exemplo'
  }
};

export const mockCategories = [
  {
    id: 'pizzas',
    name: 'Pizzas',
    icon: 'pizzas',
    description: 'Pizzas artesanais com massa fina e crocante'
  },
  {
    id: 'bebidas',
    name: 'Bebidas',
    icon: 'bebidas',
    description: 'Refrigerantes, sucos e cervejas geladas'
  },
  {
    id: 'sobremesas',
    name: 'Sobremesas',
    icon: 'sobremesas',
    description: 'Doces e sobremesas para finalizar bem'
  },
  {
    id: 'combos',
    name: 'Combos',
    icon: 'combos',
    description: 'Combos especiais com desconto'
  }
];

export const mockProducts = [
  {
    id: 1,
    name: 'Pizza Margherita',
    category: 'pizzas',
    description: 'Molho de tomate, mussarela de búfala, manjericão fresco e azeite extra virgem',
    price: 45.90,
    image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=800&q=80',
    isRecommended: true,
    isBestSeller: false,
    preparationTime: '25 min',
    options: [
      {
        id: 'size',
        name: 'Tamanho',
        required: true,
        choices: [
          { id: 'small', name: 'Pequena (30cm)', price: 0 },
          { id: 'medium', name: 'Média (35cm)', price: 10 },
          { id: 'large', name: 'Grande (40cm)', price: 20 }
        ]
      },
      {
        id: 'borda',
        name: 'Borda',
        required: false,
        choices: [
          { id: 'normal', name: 'Borda Normal', price: 0 },
          { id: 'catupiry', name: 'Borda Catupiry', price: 8 },
          { id: 'cheddar', name: 'Borda Cheddar', price: 8 }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Pizza Calabresa',
    category: 'pizzas',
    description: 'Molho de tomate, mussarela, calabresa fatiada, cebola e azeitonas',
    price: 48.90,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&q=80',
    isRecommended: false,
    isBestSeller: true,
    preparationTime: '25 min',
    options: [
      {
        id: 'size',
        name: 'Tamanho',
        required: true,
        choices: [
          { id: 'small', name: 'Pequena (30cm)', price: 0 },
          { id: 'medium', name: 'Média (35cm)', price: 10 },
          { id: 'large', name: 'Grande (40cm)', price: 20 }
        ]
      }
    ]
  },
  {
    id: 3,
    name: 'Pizza 4 Queijos',
    category: 'pizzas',
    description: 'Mussarela, gorgonzola, parmesão e provolone com azeite de ervas',
    price: 52.90,
    image: 'https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=800&q=80',
    isRecommended: true,
    isBestSeller: false,
    preparationTime: '30 min',
    options: [
      {
        id: 'size',
        name: 'Tamanho',
        required: true,
        choices: [
          { id: 'small', name: 'Pequena (30cm)', price: 0 },
          { id: 'medium', name: 'Média (35cm)', price: 10 },
          { id: 'large', name: 'Grande (40cm)', price: 20 }
        ]
      }
    ]
  },
  {
    id: 4,
    name: 'Pizza Portuguesa',
    category: 'pizzas',
    description: 'Molho de tomate, mussarela, presunto, ovos, cebola, azeitonas e ervilha',
    price: 49.90,
    image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?w=800&q=80',
    isRecommended: false,
    isBestSeller: true,
    preparationTime: '25 min',
    options: [
      {
        id: 'size',
        name: 'Tamanho',
        required: true,
        choices: [
          { id: 'small', name: 'Pequena (30cm)', price: 0 },
          { id: 'medium', name: 'Média (35cm)', price: 10 },
          { id: 'large', name: 'Grande (40cm)', price: 20 }
        ]
      }
    ]
  },
  {
    id: 5,
    name: 'Coca-Cola 2L',
    category: 'bebidas',
    description: 'Refrigerante gelado',
    price: 8.90,
    image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=800&q=80',
    isRecommended: false,
    isBestSeller: false,
    preparationTime: null,
    options: []
  },
  {
    id: 6,
    name: 'Suco de Laranja Natural',
    category: 'bebidas',
    description: 'Suco de laranja natural, sem açúcar',
    price: 12.90,
    image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=800&q=80',
    isRecommended: true,
    isBestSeller: false,
    preparationTime: null,
    options: [
      {
        id: 'size',
        name: 'Tamanho',
        required: true,
        choices: [
          { id: 'small', name: '300ml', price: 0 },
          { id: 'large', name: '500ml', price: 5 }
        ]
      }
    ]
  },
  {
    id: 7,
    name: 'Brownie com Sorvete',
    category: 'sobremesas',
    description: 'Brownie quente com sorvete de creme e calda de chocolate',
    price: 18.90,
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&q=80',
    isRecommended: true,
    isBestSeller: true,
    preparationTime: '10 min',
    options: []
  },
  {
    id: 8,
    name: 'Tiramisu',
    category: 'sobremesas',
    description: 'Sobremesa italiana tradicional com café e mascarpone',
    price: 22.90,
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&q=80',
    isRecommended: true,
    isBestSeller: false,
    preparationTime: null,
    options: []
  },
  {
    id: 9,
    name: 'Combo Família',
    category: 'combos',
    description: '2 Pizzas Grandes + 2 Refrigerantes 2L + 1 Sobremesa',
    price: 119.90,
    originalPrice: 149.90,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80',
    isRecommended: true,
    isBestSeller: true,
    preparationTime: '35 min',
    options: []
  }
];

export const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

export const getProductsByCategory = (categoryId) => {
  if (!categoryId) return mockProducts;
  return mockProducts.filter(product => product.category === categoryId);
};
