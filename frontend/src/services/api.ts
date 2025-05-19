import axios from 'axios';

const API_URL = import.meta.env.BASE_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Include credentials (cookies) with every request
  withCredentials: true,
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    //const token = localStorage.getItem('accessToken');
    /*const data = localStorage.getItem('user');
    if (data) {
      const parsedUser = JSON.parse(data);
      const token = parsedUser.accessToken;
      console.log(parsedUser);
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    console.log(config, 'config');*/
    return config;
  },
  (error) => Promise.reject(error),
);

export default api;
