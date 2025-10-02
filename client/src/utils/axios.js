import axios from 'axios';

const isServer = typeof window === 'undefined';

const axiosInstance = axios.create({
  baseURL: isServer
  ? process.env.VITE_BASE_URL || 'http://localhost:5000/api'
  : import.meta.env.VITE_BASE_URL || '/',
  withCredentials: true,
  timeout: 10000, // 10 secondes de timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour les requêtes
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log(`[AXIOS] ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('[AXIOS] Request error:', error);
    return Promise.reject(error);
  },
);

// Intercepteur pour les réponses
axiosInstance.interceptors.response.use(
  (response) => {
    console.log(`[AXIOS] Response ${response.status} from ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('[AXIOS] Response error:', error.response?.status, error.response?.data);
    
    // Gestion des erreurs de timeout
    if (error.code === 'ECONNABORTED') {
      console.error('[AXIOS] Request timeout');
      return Promise.reject(new Error('La requête a pris trop de temps. Veuillez réessayer.'));
    }
    
    // Gestion des erreurs réseau
    if (!error.response) {
      console.error('[AXIOS] Network error');
      return Promise.reject(new Error('Erreur de connexion. Vérifiez votre connexion internet.'));
    }
    
    return Promise.reject(error);
  },
);
console.log('[AXIOS] Base URL:', isServer ? process.env.VITE_BASE_URL : import.meta.env.VITE_BASE_URL);

export default axiosInstance;






//import axios from 'axios';

// const isServer = typeof window === 'undefined';

// const axiosInstance = axios.create({
//   // baseURL: isServer
//   //   ? process.env.VITE_BASE_URL || 'http://localhost:5000/api'
//   //   : import.meta.env.VITE_BASE_URL || '/api',
//   baseURL: 'http://localhost:5000/api'||'https://atypikhouse.onrender.com',
//   withCredentials: true,
//   timeout: 10000, // 10 secondes de timeout
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Intercepteur pour les requêtes
// axiosInstance.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     console.log(`[AXIOS] ${config.method?.toUpperCase()} ${config.url}`);
//     return config;
//   },
//   (error) => {
//     console.error('[AXIOS] Request error:', error);
//     return Promise.reject(error);
//   },
// );

// // Intercepteur pour les réponses
// axiosInstance.interceptors.response.use(
//   (response) => {
//     console.log(`[AXIOS] Response ${response.status} from ${response.config.url}`);
//     return response;
//   },
//   (error) => {
//     console.error('[AXIOS] Response error:', error.response?.status, error.response?.data);
    
//     // Gestion des erreurs de timeout
//     if (error.code === 'ECONNABORTED') {
//       console.error('[AXIOS] Request timeout');
//       return Promise.reject(new Error('La requête a pris trop de temps. Veuillez réessayer.'));
//     }
    
//     // Gestion des erreurs réseau
//     if (!error.response) {
//       console.error('[AXIOS] Network error');
//       return Promise.reject(new Error('Erreur de connexion. Vérifiez votre connexion internet.'));
//     }
    
//     return Promise.reject(error);
//   },
// );
// console.log('[AXIOS] Base URL:', isServer ? process.env.VITE_BASE_URL : import.meta.env.VITE_BASE_URL);

// export default axiosInstance;




