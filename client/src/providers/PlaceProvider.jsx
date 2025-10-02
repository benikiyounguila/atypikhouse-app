import React, { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axios';

export const PlaceContext = createContext({
  places: [],
  loading: true,
  setPlaces: () => {},
  setLoading: () => {},
});

export const useProvidePlaces = (initialPlaces = [], initialPagination = null) => {
  const [places, setPlaces] = useState(initialPlaces);
  const [loading, setLoading] = useState(!initialPlaces.length);
  const [page, setPage] = useState(initialPagination?.page || 1);
  const [total, setTotal] = useState(initialPagination?.total || 0);
  const [pages, setPages] = useState(initialPagination?.pages || 1);
  const [limit] = useState(12); // même valeur que placesPerPage côté frontend

  const [search, setSearch] = useState('');

  const getPlaces = async (pageToFetch = 1, searchTerm = '') => {
    try {
      console.log(`[PLACE PROVIDER] Fetching places for page: ${pageToFetch}, search: ${searchTerm}`);
      setLoading(true);
      const { data } = await axiosInstance.get(`/places?page=${pageToFetch}&limit=${limit}&search=${searchTerm}`);
      console.log('[PLACE PROVIDER] Received data:', data);
      console.log('[PLACE PROVIDER] Places count:', data.places?.length || 0);
      setPlaces(data.places || []);
      setTotal(data.total || 0);
      setPages(data.pages || 1);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('[PLACE PROVIDER] Error fetching places:', error);
    }
  };

  const searchPlaces = (term) => {
    setSearch(term);
    getPlaces(1, term);
  };

  useEffect(() => {
    if (
      (typeof initialPlaces === 'undefined' || (Array.isArray(initialPlaces) && initialPlaces.length === 0)) &&
      page === 1
    ) {
      getPlaces(1, search);
    }
  }, []);

  const changePage = (newPage) => {
    setPage(newPage);
    getPlaces(newPage, search);
  };

  return {
    places,
    setPlaces,
    loading,
    setLoading,
    page,
    total,
    pages,
    changePage,
    limit,
    searchPlaces,
  };
};

export const PlaceProvider = ({ children, initialPlaces = [], initialPagination = null }) => {
  const allPlaces = useProvidePlaces(initialPlaces, initialPagination);
  return (
    <PlaceContext.Provider value={allPlaces}>
      {children}
    </PlaceContext.Provider>
  );
};

export const usePlaces = () => useContext(PlaceContext);