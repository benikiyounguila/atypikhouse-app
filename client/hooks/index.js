import { useState, useEffect, useContext } from 'react';
import jwt_decode from 'jwt-decode';

import { UserContext } from '@/providers/UserProvider.jsx';
import {
  getItemFromLocalStorage,
  setItemsInLocalStorage,
  removeItemFromLocalStorage,
} from '@/utils/index.js';
import axiosInstance from '@/utils/axios.js';

// USER
export const useAuth = () => {
  return useContext(UserContext);
};


//pour le ssr
export const useProvideAuth = (initialUser = null) => {
  const [user, setUser] = useState(initialUser);
  const [loading, setLoading] = useState(!initialUser);

  useEffect(() => {
    if (!initialUser) {
      const storedUser = getItemFromLocalStorage('user');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
  }, [initialUser]);
//------

// export const useProvideAuth = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const storedUser = getItemFromLocalStorage('user');
//     console.log('Stored user from localStorage:', storedUser);
//     if (storedUser) {
//       const parsedUser = JSON.parse(storedUser);
//       console.log('Parsed user:', parsedUser);
//       setUser(parsedUser);
//     }
//     setLoading(false);
//   }, []);

  const register = async (formData) => {
    const { name, email, password } = formData;

    try {
      const { data } = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/user/register`, {
        name,
        email,
        password,
      });
      if (data.user && data.token) {
        setUser(data.user);
        // save user and token in local storage
        setItemsInLocalStorage('user', data.user);
        setItemsInLocalStorage('token', data.token);
      }
      return { success: true, message: 'Registration successfull' };
    } catch (error) {
      const { message } = error.response.data;
      return { success: false, message };
    }
  };

  const login = async (formData) => {
    const { email, password } = formData;

    try {
      console.log('[LOGIN] Attempting login for:', email);
      const startTime = Date.now();
      
      const { data } = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/user/login`, {
        email,
        password,
      });

      const endTime = Date.now();
      console.log(`[LOGIN] Login completed in ${endTime - startTime}ms`);

      // Vérifiez que l'utilisateur et le token sont bien retournés
      console.log('[LOGIN] User data received:', data.user ? 'Yes' : 'No');
      console.log('[LOGIN] Token received:', data.token ? 'Yes' : 'No');

      if (data.user && data.token) {
        console.log('[LOGIN] Is Admin:', data.user.isAdmin);
        
        // Mise à jour optimisée de l'état
        setUser(data.user);
        
        // Sauvegarde en localStorage de manière optimisée
        setItemsInLocalStorage('user', data.user);
        setItemsInLocalStorage('token', data.token);
        
        console.log('[LOGIN] Login successful');
        return { success: true, message: 'Connexion réussie' };
      } else {
        console.error('[LOGIN] Missing user data or token');
        return { success: false, message: 'Données de connexion incomplètes' };
      }
    } catch (error) {
      console.error('[LOGIN] Login error:', error);
      
      // Gestion d'erreur améliorée
      if (error.message) {
        return { success: false, message: error.message };
      } else if (error.response?.data?.message) {
        return { success: false, message: error.response.data.message };
      } else {
        return { success: false, message: 'Erreur de connexion. Veuillez réessayer.' };
      }
    }
  };

  const googleLogin = async (credential) => {
    const decoded = jwt_decode(credential);
    try {
      const { data } = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/user/google/login`, {
        name: `${decoded.given_name} ${decoded.family_name}`,
        email: decoded.email,
      });
      if (data.user && data.token) {
        setUser(data.user);
        // save user and token in local storage
        setItemsInLocalStorage('user', data.user);
        setItemsInLocalStorage('token', data.token);
      }
      return { success: false, message: error.message };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = async () => {
    try {
      const { data } = await axiosInstance.get(`${import.meta.env.VITE_BASE_URL}/user/logout`);
      if (data.success) {
        setUser(null);
        // Clear user data and token from localStorage when logging out
        removeItemFromLocalStorage('user');
        removeItemFromLocalStorage('token');
        return { success: true, message: 'Logout successful' };
      }
      return { success: false, message: 'Logout failed' };
    } catch (error) {
      console.log('Logout API error:', error);
      // Même si l'appel API échoue, on nettoie le localStorage côté client
      setUser(null);
      removeItemFromLocalStorage('user');
      removeItemFromLocalStorage('token');
      return { success: true, message: 'Logout completed (local cleanup)' };
    }
  };

  const uploadPicture = async (picture) => {
    try {
      const formData = new FormData();
      formData.append('picture', picture);
      const { data } = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/user/upload-picture`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        },
      );
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  const updateUser = async (userDetails) => {
    const { name, password, picture } = userDetails;
    //const email = JSON.parse(getItemFromLocalStorage('user')).email;
    const storedUser = getItemFromLocalStorage('user');
    const email = storedUser ? JSON.parse(storedUser).email : null;
    try {
      const { data } = await axiosInstance.put(`${import.meta.env.VITE_BASE_URL}/user/update-user`, {
        name,
        password,
        email,
        picture,
      });
      return data;
    } catch (error) {
      console.log(error);
    }
  };

  return {
    user,
    setUser,
    register,
    login,
    googleLogin,
    logout,
    loading,
    uploadPicture,
    updateUser,
  };
};

// export const useProvidePlaces = () => {
//   const [places, setPlaces] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const getPlaces = async () => {
//     const { data } = await axiosInstance.get('/places');
//     setPlaces(data.places);
//     setLoading(false);
//   };

//   useEffect(() => {
//     getPlaces();
//   }, []);

//   return {
//     places,
//     setPlaces,
//     loading,
//     setLoading,
//   };
// };



