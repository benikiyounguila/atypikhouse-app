

import React, { useEffect, useState } from 'react';
import axiosInstance from '@/utils/axios';

const AdminProperties = () => {
  const [places, setPlaces] = useState([]);
  const [editingPlaceId, setEditingPlaceId] = useState(null);
  const [editedPlace, setEditedPlace] = useState({});
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [limit] = useState(10); // Nombre de propriétés par page

  const API_BASE_URL = import.meta.env.VITE_BASE_URL;

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const response = await axiosInstance.get(`${API_BASE_URL}/admin/places?page=${page}&limit=${limit}`);
        setPlaces(response.data.data);
        setPages(response.data.pages);
        setTotal(response.data.total);
      } catch (error) {
        console.error('Error fetching places:', error.response ? error.response.data : error.message);
      }
    };
    fetchPlaces();
  }, [API_BASE_URL, page, limit]);

  const handleEditPlace = (place) => {
    setEditingPlaceId(place._id);
    setEditedPlace({ ...place });
  };

  const handleSavePlace = async (placeId) => {
    const confirmSave = window.confirm('Êtes-vous sûr de vouloir sauvegarder les modifications ?');
    if (!confirmSave) return;

    try {
      const response = await axiosInstance.put(`${API_BASE_URL}/admin/places/${placeId}`, editedPlace);
      setPlaces(places.map((place) => (place._id === placeId ? response.data.data : place)));
      setEditingPlaceId(null);
    } catch (error) {
      console.error('Error saving place:', error.response ? error.response.data : error.message);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedPlace((prevPlace) => ({
      ...prevPlace,
      [name]: value,
    }));
  };

  const handleDeletePlace = async (placeId) => {
    const confirmDelete = window.confirm('Êtes-vous sûr de vouloir supprimer cette propriété ?');
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`${API_BASE_URL}/admin/places/${placeId}`);
      setPlaces(places.filter((place) => place._id !== placeId));
    } catch (error) {
      console.error('Error deleting place:', error.response ? error.response.data : error.message);
    }
  };

  // Pagination visuelle
  const Pagination = () => {
    const getPageNumbers = () => {
      if (pages <= 5) return Array.from({ length: pages }, (_, i) => i + 1);
      if (page <= 3) return [1, 2, 3, 4, 5, '...', pages];
      if (page >= pages - 2)
        return [
          1,
          '...',
          pages - 4,
          pages - 3,
          pages - 2,
          pages - 1,
          pages,
        ];
      return [
        1,
        '...',
        page - 1,
        page,
        page + 1,
        '...',
        pages,
      ];
    };
    return (
      <nav className="flex justify-center mt-8">
        <ul className="flex flex-wrap justify-center items-center space-x-2">
          <li>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              className="px-2 py-1 border rounded bg-white text-primary hover:bg-primary hover:text-white transition-colors"
              disabled={page === 1}
            >
              &laquo;
            </button>
          </li>
          {getPageNumbers().map((number, index) => (
            <li key={index}>
              {number === '...' ? (
                <span className="px-2 py-1">...</span>
              ) : (
                <button
                  onClick={() => setPage(number)}
                  className={`px-2 py-1 border rounded ${
                    page === number
                      ? 'bg-primary text-white'
                      : 'bg-white text-primary hover:bg-primary hover:text-white'
                  } transition-colors`}
                >
                  {number}
                </button>
              )}
            </li>
          ))}
          <li>
            <button
              onClick={() => setPage(Math.min(pages, page + 1))}
              className="px-2 py-1 border rounded bg-white text-primary hover:bg-primary hover:text-white transition-colors"
              disabled={page === pages}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  return (
    <div className="container mx-auto mt-8 p-4">
      <h2 className="text-2xl font-bold mb-4">Gestion des Propriétés</h2>
      <p className="mb-4">Total propriétés : {total}</p>
      {places.map((place) => (
        <div key={place._id} className="mb-8 p-4 border rounded">
          {editingPlaceId === place._id ? (
            <div>
              <input
                type="text"
                name="title"
                value={editedPlace.title}
                onChange={handleInputChange}
                className="p-2 border rounded mb-2 w-full"
                placeholder="Titre"
              />
              <input
                type="text"
                name="address"
                value={editedPlace.address}
                onChange={handleInputChange}
                className="p-2 border rounded mb-2 w-full"
                placeholder="Adresse"
              />
              <textarea
                name="description"
                value={editedPlace.description}
                onChange={handleInputChange}
                className="p-2 border rounded mb-2 w-full"
                placeholder="Description"
              />
              <input
                type="number"
                name="price"
                value={editedPlace.price}
                onChange={handleInputChange}
                className="p-2 border rounded mb-2 w-full"
                placeholder="Prix"
              />
              <input
                type="number"
                name="maxGuests"
                value={editedPlace.maxGuests}
                onChange={handleInputChange}
                className="p-2 border rounded mb-2 w-full"
                placeholder="Nombre maximum d'invités"
              />
              <button
                onClick={() => handleSavePlace(place._id)}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700 mr-2"
              >
                Enregistrer
              </button>
              <button
                onClick={() => setEditingPlaceId(null)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
              >
                Annuler
              </button>
            </div>
          ) : (
            <div>
              <h3 className="text-xl font-semibold">{place.title}</h3>
              <p>{place.address}</p>
              <p>{place.description}</p>
              <p>{place.price} € par nuit</p>
              <p>Max Guests: {place.maxGuests}</p>
              <button
                onClick={() => handleEditPlace(place)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
              >
                Modifier
              </button>
              <button
                onClick={() => handleDeletePlace(place._id)}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Supprimer
              </button>
            </div>
          )}
        </div>
      ))}
      {pages > 1 && <Pagination />}
    </div>
  );
};

export default AdminProperties;