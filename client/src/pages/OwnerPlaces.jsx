import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '@/utils/axios';
import Spinner from '@/components/ui/Spinner';

const OwnerPlaces = () => {
  const [places, setPlaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

  const fetchPlaces = async () => {
    try {
      console.log('[OWNER PLACES] Fetching places...');
      const response = await axiosInstance.get('/owner/places');
      console.log('[OWNER PLACES] Response:', response.data);
      setPlaces(response.data.data || []);
      setError(null);
    } catch (error) {
      console.error('[OWNER PLACES] Error:', error.response?.data || error.message);
      setError('Impossible de charger vos logements');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async (placeId) => {
    try {
      console.log('[OWNER PLACES] Toggling status for place:', placeId);
      const response = await axiosInstance.patch(`/owner/places/${placeId}/toggle`);
      console.log('[OWNER PLACES] Toggle response:', response.data);
      
      setPlaces(places.map(place => 
        place._id === placeId 
          ? { ...place, isActive: response.data.data.isActive }
          : place
      ));
      
      // Utiliser une notification plus moderne au lieu d'alert
      const message = response.data.message || `Logement ${response.data.data.isActive ? 'activé' : 'désactivé'} avec succès`;
      console.log('[OWNER PLACES] Success:', message);
      
      // Si tu as react-toastify installé, utilise toast.success(message)
      // Sinon, garde alert pour l'instant
      alert(message);
    } catch (error) {
      console.error('[OWNER PLACES] Toggle error:', error.response?.data || error.message);
      
      let errorMessage = 'Erreur lors de la modification du statut';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 403) {
        errorMessage = 'Accès refusé : Vous devez être propriétaire';
      } else if (error.response?.status === 404) {
        errorMessage = 'Logement non trouvé';
      }
      
      alert(errorMessage);
    }
  };

  const handleDeletePlace = async (placeId) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce logement ?')) {
      return;
    }

    try {
      console.log('[OWNER PLACES] Deleting place:', placeId);
      const response = await axiosInstance.delete(`/owner/places/${placeId}`);
      console.log('[OWNER PLACES] Delete response:', response.data);
      
      setPlaces(places.filter(place => place._id !== placeId));
      alert('Logement supprimé avec succès');
    } catch (error) {
      alert('Erreur lors de la suppression du logement');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchPlaces} 
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Réessayer
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mes Logements</h1>
            <p className="mt-2 text-gray-600">Gérez vos propriétés et leur disponibilité</p>
          </div>
          <Link
            to="/owner/places/new"
            className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
          >
            Ajouter un logement
          </Link>
        </div>

        {/* Liste des logements */}
        {places.length === 0 ? (
          <div className="text-center py-12">
            <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucun logement</h3>
            <p className="mt-1 text-sm text-gray-500">
              Commencez par ajouter votre premier logement.
            </p>
            <div className="mt-6">
              <Link
                to="/owner/places/new"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
              >
                Ajouter un logement
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {places.map((place) => (
              <div key={place._id} className="bg-white rounded-lg shadow overflow-hidden">
                {/* Image */}
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  {place.photos && place.photos.length > 0 ? (
                    <img
                      src={place.photos[0]}
                      alt={place.title}
                      className="w-full h-48 object-cover"
                    />
                  ) : (
                    <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                      <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {place.title}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                      place.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {place.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-2">{place.address}</p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-lg font-bold text-green-600">{place.price}€</span>
                    <span className="text-sm text-gray-500">{place.type}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleToggleStatus(place._id)}
                      className={`flex-1 px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                        place.isActive
                          ? 'bg-red-100 text-red-700 hover:bg-red-200'
                          : 'bg-green-100 text-green-700 hover:bg-green-200'
                      }`}
                    >
                      {place.isActive ? 'Désactiver' : 'Activer'}
                    </button>
                    
                    <Link
                      to={`/owner/places/${place._id}/edit`}
                      className="flex-1 px-3 py-2 text-sm font-medium text-blue-700 bg-blue-100 rounded-md hover:bg-blue-200 transition-colors text-center"
                    >
                      Modifier
                    </Link>
                    
                    <button
                      onClick={() => handleDeletePlace(place._id)}
                      className="px-3 py-2 text-sm font-medium text-red-700 bg-red-100 rounded-md hover:bg-red-200 transition-colors"
                    >
                      Supprimer
                    </button>
                  </div>

                  {/* Statistiques rapides */}
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="flex justify-between text-sm text-gray-500">
                      <span>Note moyenne: {place.reviews?.length > 0 
                        ? (place.reviews.reduce((sum, review) => sum + review.rating, 0) / place.reviews.length).toFixed(1)
                        : 'Aucune'
                      }</span>
                      <span>{place.reviews?.length || 0} avis</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerPlaces; 