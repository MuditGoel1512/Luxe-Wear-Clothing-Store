import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
  timeout: 15000,
});

// Request interceptor - attach token
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('luxe_token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle auth errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('luxe_token');
      localStorage.removeItem('luxe_user');
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const authAPI = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
  updateProfile: (data) => API.put('/auth/profile', data),
};

// Products
export const productAPI = {
  getAll: (params) => API.get('/products', { params }),
  getOne: (id) => API.get(`/products/${id}`),
  getFeatured: () => API.get('/products/featured'),
  create: (data) => API.post('/products', data),
  update: (id, data) => API.put(`/products/${id}`, data),
  delete: (id) => API.delete(`/products/${id}`),
};

// Categories
export const categoryAPI = {
  getAll: () => API.get('/categories'),
  create: (data) => API.post('/categories', data),
  delete: (id) => API.delete(`/categories/${id}`),
};

// Cart
export const cartAPI = {
  get: () => API.get('/cart'),
  add: (data) => API.post('/cart', data),
  update: (itemId, data) => API.put(`/cart/${itemId}`, data),
  remove: (itemId) => API.delete(`/cart/${itemId}`),
  clear: () => API.delete('/cart/clear'),
};

// Wishlist
export const wishlistAPI = {
  get: () => API.get('/wishlist'),
  add: (data) => API.post('/wishlist', data),
  remove: (productId) => API.delete(`/wishlist/${productId}`),
};

// Orders
export const orderAPI = {
  createRazorpayOrder: (data) => API.post('/orders/create-razorpay-order', data),
  verifyPayment: (data) => API.post('/orders/verify-payment', data),
  getMyOrders: () => API.get('/orders/my-orders'),
  getAllOrders: () => API.get('/orders/all'),
  updateStatus: (id, data) => API.put(`/orders/${id}/status`, data),
};

// Admin
export const adminAPI = {
  getStats: () => API.get('/admin/stats'),
};

export default API;
