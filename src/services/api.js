// src/services/api.js
import axios from 'axios';

// Obter a URL do backend a partir das variáveis de ambiente
const api = axios.create({
  baseURL: process.env.API_URL || 'http://192.168.0.23:3333', // Substitua pela URL do seu backend
});

// Interceptador para adicionar o token JWT a cada requisição
api.interceptors.request.use(
  async (config) => {
    const token = "86c7e725bbd35b2c54493953a4699f3a"; // Aqui, substitua pela lógica para obter o token salvo
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
