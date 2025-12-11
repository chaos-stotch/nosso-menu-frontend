/**
 * Serviço de API para comunicação com o backend Flask
 */
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api/v1';

class ApiService {
  /**
   * Faz uma requisição HTTP
   */
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (config.body && typeof config.body === 'object') {
      config.body = JSON.stringify(config.body);
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        const errorMessage = data.error || `Erro ${response.status}: ${response.statusText}`;
        console.error('API Error:', {
          url,
          status: response.status,
          statusText: response.statusText,
          error: errorMessage,
          data
        });
        throw new Error(errorMessage);
      }

      return data;
    } catch (error) {
      console.error('API Error:', {
        url,
        error: error.message,
        stack: error.stack
      });
      throw error;
    }
  }

  // ========== RESTAURANT ==========
  async getRestaurant(restaurantId) {
    if (!restaurantId) {
      throw new Error('ID do restaurante é obrigatório');
    }
    return this.request(`/restaurant?id=${restaurantId}`);
  }

  async getRestaurantBySlug(slug) {
    return this.request(`/restaurant/slug/${slug}`);
  }

  async getRestaurantByUserId(userId) {
    return this.request(`/restaurant/user/${userId}`);
  }

  async createRestaurant(data) {
    return this.request('/restaurant', {
      method: 'POST',
      body: data,
    });
  }

  async updateRestaurant(data) {
    return this.request('/restaurant', {
      method: 'PUT',
      body: data,
    });
  }

  // ========== CATEGORIES ==========
  async getCategories(restaurantId = null) {
    const endpoint = restaurantId 
      ? `/categories?restaurantId=${restaurantId}`
      : '/categories';
    return this.request(endpoint);
  }

  async createCategory(data) {
    return this.request('/categories', {
      method: 'POST',
      body: data,
    });
  }

  async updateCategory(categoryId, data) {
    return this.request(`/categories/${categoryId}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteCategory(categoryId) {
    return this.request(`/categories/${categoryId}`, {
      method: 'DELETE',
    });
  }

  // ========== PRODUCTS ==========
  async getProducts(restaurantId = null, categoryId = null) {
    let endpoint = '/products';
    const params = [];
    if (restaurantId) params.push(`restaurantId=${restaurantId}`);
    if (categoryId) params.push(`categoryId=${categoryId}`);
    if (params.length > 0) {
      endpoint += `?${params.join('&')}`;
    }
    return this.request(endpoint);
  }

  async getProduct(productId) {
    return this.request(`/products/${productId}`);
  }

  async createProduct(data) {
    return this.request('/products', {
      method: 'POST',
      body: data,
    });
  }

  async updateProduct(productId, data) {
    return this.request(`/products/${productId}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deleteProduct(productId) {
    return this.request(`/products/${productId}`, {
      method: 'DELETE',
    });
  }

  // ========== PROMOTIONS ==========
  async getPromotions(restaurantId) {
    if (!restaurantId) {
      throw new Error('ID do restaurante é obrigatório');
    }
    return this.request(`/promotions?restaurantId=${restaurantId}`);
  }

  async createPromotion(data) {
    return this.request('/promotions', {
      method: 'POST',
      body: data,
    });
  }

  async updatePromotion(promotionId, data) {
    return this.request(`/promotions/${promotionId}`, {
      method: 'PUT',
      body: data,
    });
  }

  async deletePromotion(promotionId) {
    return this.request(`/promotions/${promotionId}`, {
      method: 'DELETE',
    });
  }

  // ========== UPLOAD ROUTES ==========
  async uploadImage(imageFile, folder = '') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        try {
          const base64Data = reader.result;
          const filename = imageFile.name;
          
          const response = await this.request('/upload/image', {
            method: 'POST',
            body: {
              image: base64Data,
              filename: filename,
              folder: folder,
            },
          });
          
          resolve(response.url);
        } catch (error) {
          reject(error);
        }
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(imageFile);
    });
  }

  async deleteImage(imagePath) {
    return this.request('/upload/image', {
      method: 'DELETE',
      body: {
        path: imagePath,
      },
    });
  }

  // ========== ORDERS ==========
  async getOrders(restaurantId = null) {
    let endpoint = '/orders';
    if (restaurantId) {
      endpoint += `?restaurantId=${restaurantId}`;
    }
    return this.request(endpoint);
  }

  async getOrder(orderId) {
    return this.request(`/orders/${orderId}`);
  }

  async createOrder(data) {
    return this.request('/orders', {
      method: 'POST',
      body: data,
    });
  }

  async updateOrder(orderId, data) {
    return this.request(`/orders/${orderId}`, {
      method: 'PUT',
      body: data,
    });
  }
}

export default new ApiService();

