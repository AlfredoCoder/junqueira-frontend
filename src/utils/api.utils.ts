import axios from "axios";

const api = axios.create({
  // Usar variável de ambiente ou fallback para desenvolvimento
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000, // 30 segundos timeout para Vercel
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  (config) => {
    // Verificar se é browser environment
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para lidar com respostas de erro
api.interceptors.response.use(
  (response) => response,
  (error) => {
    
    if (error.response?.status === 401) {
      // Token expirado ou inválido - apenas para endpoints protegidos
      const isAuthEndpoint = error.config?.url?.includes('/auth/');
      
      if (typeof window !== 'undefined' && !isAuthEndpoint) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        // Redirecionar apenas se não estivermos já na página de login
        if (window.location.pathname !== '/' && window.location.pathname !== '/login') {
          window.location.href = '/';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;

