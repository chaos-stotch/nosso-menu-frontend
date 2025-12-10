# Nosso Menu - Sistema Premium de Cardápio Digital

Sistema de cardápio digital premium inspirado no iFood, porém com design e experiência muito superiores. Cada restaurante possui sua própria página personalizada e elegante.

## 🚀 Tecnologias

- **React** 18.2.0
- **Material UI (MUI)** 5.14.20
- **Framer Motion** 10.16.16
- **React Router DOM** 6.20.1

## 📦 Instalação

```bash
npm install
```

## 🏃 Executar

```bash
npm start
```

A aplicação estará disponível em `http://localhost:3000`

## 🏗️ Estrutura do Projeto

```
/src
  /components
    /RestaurantHeader    # Header premium com foto, logo e informações
    /CategoryList        # Navegação de categorias elegante
    /ProductCard         # Card de produto premium
    /ProductModal        # Modal detalhado do produto
    /CartSidebar         # Carrinho lateral moderno
    /Footer              # Rodapé premium
  /pages
    /RestaurantPage      # Página principal do restaurante
  /hooks
    useCart.js           # Hook para gerenciamento do carrinho
    useRestaurant.js     # Hook para dados do restaurante
  /utils
    mockData.js          # Dados mockados do restaurante e produtos
  /theme
    theme.js             # Tema MUI premium customizado
```

## ✨ Funcionalidades

### Header Premium
- Foto de capa em full width
- Logo destacado
- Informações do restaurante (nome, categoria, nota, preço)
- Botão "Iniciar Pedido"
- Cards informativos (taxa de entrega, tempo, endereço, telefone)
- Promoções destacadas

### Menu Organizado
- Categorias com navegação fluida
- Cards de produtos com:
  - Foto grande e bonita
  - Nome e descrição
  - Preço destacado
  - Selos de recomendados/mais vendidos
  - Botão de adicionar rápido

### Modal de Produto
- Visualização completa do produto
- Opções e variações (tamanhos, bordas, etc)
- Seletor de quantidade
- Cálculo automático do preço
- Botão de adicionar ao carrinho

### Carrinho Lateral
- Animações elegantes
- Lista de itens com foto, título e quantidade
- Cálculo automático (subtotal, taxa, desconto, total)
- Sistema de cupons
- Validação de pedido mínimo
- Botão de finalizar pedido

### Rodapé Premium
- Informações completas do restaurante
- Horário de funcionamento
- Redes sociais
- Branding "Nosso Menu"

## 🎨 Design

O design foi pensado para ser:
- **Premium** - Visual luxuoso e elegante
- **Moderno** - Interface contemporânea e limpa
- **Responsivo** - Funciona perfeitamente em todos os dispositivos
- **Fluido** - Animações sutis e agradáveis
- **Profissional** - Atenção a cada detalhe

## 📝 Notas

- Todo o código está em inglês
- Todo o conteúdo exibido está em português
- Dados mockados podem ser facilmente substituídos por API real
- Arquitetura altamente componentizada e escalável

## 🔄 Próximos Passos

- Integração com API real
- Sistema de autenticação
- Checkout completo
- Histórico de pedidos
- Avaliações e comentários
- Busca de produtos
- Filtros avançados
