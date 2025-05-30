import axios from 'axios';
import { API } from '../context';

// Create axios instance
const api = axios.create({
  baseURL: API || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  // Include credentials (cookies) with every request
  withCredentials: true,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
