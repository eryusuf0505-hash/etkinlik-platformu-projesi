/**
 * Merkezi API istemcisi. 
 * Tüm fetch işlemlerini standartlaştırır ve hata yönetimini merkezi hale getirir.
 */

const apiClient = {
  async request(endpoint, options = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      ...options,
      headers,
    };

    try {
      const response = await fetch(endpoint, config);
      
      // Sadece 401 durumunda otomatik logout
      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          // localStorage.removeItem('token'); // Opsiyonel: Token'ı temizle
          // window.location.href = '/login'; // Sadece kritik durumlarda
        }
        const errorData = await response.json().catch(() => ({}));
        throw { status: 401, message: errorData.error || 'Oturum süresi doldu.', data: errorData };
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw { 
          status: response.status, 
          message: data.error || 'Bir hata oluştu.',
          data 
        };
      }

      return data;
    } catch (error) {
      // Network hataları veya fırlatılan objeler
      console.error(`API Error [${endpoint}]:`, error);
      throw error;
    }
  },

  get(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'GET' });
  },

  post(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'POST', body: JSON.stringify(body) });
  },

  put(endpoint, body, options = {}) {
    return this.request(endpoint, { ...options, method: 'PUT', body: JSON.stringify(body) });
  },

  delete(endpoint, options = {}) {
    return this.request(endpoint, { ...options, method: 'DELETE' });
  }
};

export default apiClient;
