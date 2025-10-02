import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axiosInstance from '@/utils/axios';
import Spinner from '@/components/ui/Spinner';

const OwnerDashboard = () => {
  const [stats, setStats] = useState(null);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);

  useEffect(() => {
    // Vérifier l'utilisateur connecté
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const token = localStorage.getItem('token');
    
    console.log('[OWNER DASHBOARD] Current user:', user);
    console.log('[OWNER DASHBOARD] User role:', user.role);
    console.log('[OWNER DASHBOARD] User email:', user.email);
    console.log('[OWNER DASHBOARD] Token exists:', !!token);
    
    // Vérifier si c'est le bon utilisateur
    if (user.role !== 'owner') {
      console.error('[OWNER DASHBOARD] Wrong user logged in!');
      console.error('[OWNER DASHBOARD] Actual:', user.email, 'with role', user.role);
      alert('Veuillez vous connecter avec le compte propriétaire');
      return;
    }
    
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      console.log('[OWNER DASHBOARD] Fetching dashboard data...');
      
      // Vérifier le token dans localStorage
      const token = localStorage.getItem('token');
      console.log('[OWNER DASHBOARD] Token exists:', !!token);
      
      // Vérifier les headers d'axios
      console.log('[OWNER DASHBOARD] Axios headers:', axiosInstance.defaults.headers.common);
      
      const [statsResponse, balanceResponse] = await Promise.all([
        axiosInstance.get('/owner/stats'),
        axiosInstance.get('/owner/balance')
      ]);

      console.log('[OWNER DASHBOARD] Stats response:', statsResponse.data);
      console.log('[OWNER DASHBOARD] Balance response:', balanceResponse.data);

      setStats(statsResponse.data.data);
      setBalance(balanceResponse.data.data.balance);
    } catch (error) {
      console.error('[OWNER DASHBOARD] Error:', error.response?.data || error.message);
      console.error('[OWNER DASHBOARD] Error status:', error.response?.status);
      console.error('[OWNER DASHBOARD] Error URL:', error.config?.url);
    } finally {
      setLoading(false);
    }
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    if (!withdrawalAmount || withdrawalAmount <= 0) {
      alert('Montant invalide');
      return;
    }

    try {
      const response = await axiosInstance.post('/owner/withdrawal', {
        amount: parseFloat(withdrawalAmount)
      });
      
      setBalance(response.data.data.newBalance);
      setWithdrawalAmount('');
      setShowWithdrawalModal(false);
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || 'Erreur lors du retrait');
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord Propriétaire</h1>
          <p className="mt-2 text-gray-600">Gérez vos logements, réservations et finances</p>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Logements</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalPlaces || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-100 text-green-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Logements Actifs</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.activePlaces || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Réservations</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalBookings || 0}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-purple-100 text-purple-600">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Revenus Totaux</p>
                <p className="text-2xl font-semibold text-gray-900">{stats?.totalRevenue || 0}€</p>
              </div>
            </div>
          </div>
        </div>

        {/* Solde et Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Solde */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Mon Solde</h2>
            <div className="text-3xl font-bold text-green-600 mb-4">{balance}€</div>
            <button
              onClick={() => setShowWithdrawalModal(true)}
              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              Demander un retrait
            </button>
          </div>

          {/* Actions Rapides */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions Rapides</h2>
            <div className="space-y-3">
              <Link
                to="/owner/places"
                className="block w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center"
              >
                Gérer mes logements
              </Link>
              <Link
                to="/owner/bookings"
                className="block w-full bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-center"
              >
                Voir mes réservations
              </Link>
              <Link
                to="/owner/places/new"
                className="block w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors text-center"
              >
                Ajouter un logement
              </Link>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Navigation</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/owner/places"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Mes Logements</p>
                <p className="text-sm text-gray-500">Gérer vos propriétés</p>
              </div>
            </Link>

            <Link
              to="/owner/bookings"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6 text-yellow-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Mes Réservations</p>
                <p className="text-sm text-gray-500">Voir les réservations</p>
              </div>
            </Link>

            <Link
              to="/owner/finances"
              className="flex items-center p-4 border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <svg className="w-6 h-6 text-green-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
              <div>
                <p className="font-medium text-gray-900">Finances</p>
                <p className="text-sm text-gray-500">Gérer vos revenus</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de retrait */}
      {showWithdrawalModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Demander un retrait</h3>
            <form onSubmit={handleWithdrawal}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Montant (€)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max={balance}
                  value={withdrawalAmount}
                  onChange={(e) => setWithdrawalAmount(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Montant à retirer"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Solde disponible: {balance}€
                </p>
              </div>
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowWithdrawalModal(false)}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
                >
                  Confirmer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard; 