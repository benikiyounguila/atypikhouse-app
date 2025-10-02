
export const getItemFromLocalStorage = (key) => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(key);
  }
  return null;
};

export const setItemsInLocalStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const removeItemFromLocalStorage = (key) => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(key);
  }
};
// src/hooks/usePlaces.js
import { useContext } from 'react';
import { PlaceContext } from '../providers/PlaceProvider.jsx';

export function usePlaces() {
  const context = useContext(PlaceContext);
  if (!context) {
    throw new Error('usePlaces must be used within a PlaceProvider');
  }
  return context;
}