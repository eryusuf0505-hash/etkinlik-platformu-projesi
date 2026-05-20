/**
 * Merkezi API istemcisi. 
 * Tüm fetch işlemlerini standartlaştırır ve hata yönetimini merkezi hale getirir.
 */

const apiClient = {
  async request(endpoint, options = {}) {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    
    const headers = {
      ...options.headers,
    };

    if (options.body !== undefined && options.body !== null) {
      headers['Content-Type'] = 'application/json';
    }

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const config = {
      credentials: 'same-origin',
      ...options,
      headers,
    };

    try {
      const response = await fetch(endpoint, config);
      const text = await response.text();
      let data = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch (parseError) {
          data = { raw: text };
        }
      }

      if (response.status === 401) {
        if (typeof window !== 'undefined') {
          // localStorage.removeItem('token'); // Opsiyonel: Token'ı temizle
          // window.location.href = '/login'; // Sadece kritik durumlarda
        }
        const message = data.error || 'Oturum süresi doldu.';
        const authError = new Error(message);
        authError.status = 401;
        authError.data = data;
        throw authError;
      }

      if (!response.ok) {
        const error = new Error(data.error || 'Bir hata oluştu.');
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      // Network hataları veya fırlatılan objeler
      console.error(`API Error [${endpoint}]:`, error);
      if (error instanceof Error) {
        throw error;
      }
      const wrappedError = new Error(error?.message || 'Bilinmeyen API hatası.');
      wrappedError.status = error?.status;
      wrappedError.data = error?.data;
      throw wrappedError;
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
