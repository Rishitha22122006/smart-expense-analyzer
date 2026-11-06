import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to attach JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sea_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to catch unauthorized errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If token expired or invalid and not already on login
      if (
        window.location.pathname !== '/login' &&
        window.location.pathname !== '/register' &&
        window.location.pathname !== '/'
      ) {
        localStorage.removeItem('sea_token');
        localStorage.removeItem('sea_user');
        window.location.href = '/login?expired=true';
      }
    }
    return Promise.reject(error);
  }
);

// Auth Endpoints
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
};

// Expense Endpoints
export const expenseService = {
  getAll: (params) => api.get('/expenses', { params }),
  getById: (id) => api.get(`/expenses/${id}`),
  create: (data) => api.post('/expenses', data),
  update: (id, data) => api.put(`/expenses/${id}`, data),
  delete: (id) => api.delete(`/expenses/${id}`),
  getMetaOptions: () => api.get('/expenses/meta/options'),
};

// Income Endpoints
export const incomeService = {
  getAll: (params) => api.get('/incomes', { params }),
  getById: (id) => api.get(`/incomes/${id}`),
  create: (data) => api.post('/incomes', data),
  update: (id, data) => api.put(`/incomes/${id}`, data),
  delete: (id) => api.delete(`/incomes/${id}`),
  getMetaOptions: () => api.get('/incomes/meta/options'),
};

// Budget Endpoints
export const budgetService = {
  getStatus: (month, year) =>
    api.get('/budgets/status', { params: { month, year } }),
  getAll: () => api.get('/budgets'),
  setBudget: (data) => api.post('/budgets', data),
  delete: (id) => api.delete(`/budgets/${id}`),
};

// Analytics Endpoints
export const analyticsService = {
  getDashboard: () => api.get('/analytics/dashboard'),
  getSmartAnalysis: () => api.get('/analytics/smart-analysis'),
};

// Report Endpoints
export const reportService = {
  getSummary: (year, month) =>
    api.get('/reports/summary', { params: { year, month } }),
  getExportCSVUrl: (params = {}) => {
    const token = localStorage.getItem('sea_token');
    const query = new URLSearchParams(params);
    return `${API_BASE_URL}/reports/export/csv?${query.toString()}`;
  },
  downloadCSV: async (params = {}) => {
    const response = await api.get('/reports/export/csv', {
      params,
      responseType: 'blob',
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute(
      'download',
      `expense-report-${new Date().toISOString().split('T')[0]}.csv`
    );
    document.body.appendChild(link);
    link.click();
    link.remove();
  },
};

export default api;
