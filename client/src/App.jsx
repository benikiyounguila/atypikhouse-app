import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './styles/index.css';
import Layout from './components/ui/Layout';
import IndexPage from './pages/IndexPage';
import RegisterPage from './pages/RegisterPage';
import OwnerRegisterPage from './pages/OwnerRegisterPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import PlacesPage from './pages/PlacesPage';
import BookingsPage from './pages/BookingsPage';
import PlacesFormPage from './pages/PlacesFormPage';
import PlacePage from './pages/PlacePage';
import SingleBookedPlace from './pages/SingleBookedPlace';
import PaymentPage from './pages/PaymentPage'
import NotFoundPage from './pages/NotFoundPage';
import InfosProprietaires from './pages/InfosProprietairesPage';
import MentionsLegales from './pages/MentionsLegalesPage';
import ContactPage from './pages/ContactPage';
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminEquipments from './pages/AdminPerks';
import AdminProperties from './pages/AdminProperties';
import AdminComments from './pages/AdminComments';
import ContactMessagesPage from './pages/ContactMessagesPage';
import CGV_CGUPage from './pages/CGV_CGUPage';
import OwnerDashboard from './pages/OwnerDashboard';
import OwnerPlaces from './pages/OwnerPlaces';
import OwnerBookings from './pages/OwnerBookings';
import SitemapPage from './pages/SitemapPage';
import ParametresCookiesPage from './pages/ParametresCookiesPage';
import DiscoverCompanyPage from './pages/DiscoverCompanyPage';
import AdminPendingOwners from './pages/AdminPendingOwners';
import AdminEditOwnerPage from './pages/AdminEditOwnerPage';
import { HelmetProvider } from 'react-helmet-async';
import axiosInstance from './utils/axios';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { getItemFromLocalStorage } from './utils';
import ProtectedAdminRoute from './components/ui/ProtectedAdminRoute';
import ProtectedOwnerRoute from './components/ui/ProtectedOwnerRoute';
import ClientOnly from './components/utils/ClientOnly';
import { UserProvider } from './providers/UserProvider';
import { PlaceProvider } from './providers/PlaceProvider';

function App({ initialUser, initialPlaces, initialBookings, initialPerks, paginationData }) {
  useEffect(() => {
    const updateAxiosHeaders = () => {
      const token = getItemFromLocalStorage('token');
      if (token) {
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      } else {
        delete axiosInstance.defaults.headers.common['Authorization']; // Clear if no token
      }
    };

    // Initial setup
    updateAxiosHeaders();

    // Listen for logout events
    const handleLogout = () => {
      updateAxiosHeaders();
    };

    window.addEventListener('logout', handleLogout);
    window.addEventListener('storage', updateAxiosHeaders);

    return () => {
      window.removeEventListener('logout', handleLogout);
      window.removeEventListener('storage', updateAxiosHeaders);
    };
  }, []);

  return (
    <HelmetProvider>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <UserProvider initialUser={initialUser}>
          <PlaceProvider initialPlaces={initialPlaces} initialPagination={paginationData}>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<IndexPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/register-owner" element={<OwnerRegisterPage />} />
                <Route path="/account" element={<ProfilePage />} />
                <Route path="/account/places" element={<PlacesPage />} />
                <Route path="/account/places/new" element={<PlacesFormPage />} />
                <Route path="/account/places/:id" element={<PlacesFormPage />} />
                <Route path="/place/:id" element={<PlacePage />} />
                <Route path="/account/bookings" element={<BookingsPage />} />
                <Route path="/account/bookings/:id" element={<SingleBookedPlace />} />
                <Route path="/payment/:id" element={<PaymentPage />} />
                <Route path="/infos-proprietaires" element={<InfosProprietaires />} />
                <Route path="/mentions-legales" element={<MentionsLegales />} />
                <Route path="/cgv-cgu" element={<CGV_CGUPage />} />
                <Route path="/sitemap.xml" element={<SitemapPage />} />
                <Route path="/parametres-cookies" element={<ParametresCookiesPage />} />
                <Route path="/discover-company" element={<DiscoverCompanyPage />} />
                <Route path="/contact" element={<ContactPage />} />

                {/* Protected Admin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <ProtectedAdminRoute>
                      <AdminDashboard initialBookings={initialBookings} />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/users"
                  element={
                    <ProtectedAdminRoute>
                      <AdminUsers />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/equipments"
                  element={
                    <ProtectedAdminRoute>
                      <AdminEquipments initialPerks={initialPerks} />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/properties"
                  element={
                    <ProtectedAdminRoute>
                      <AdminProperties />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/comments"
                  element={
                    <ProtectedAdminRoute>
                      <AdminComments initialComments={initialPerks} />
                    </ProtectedAdminRoute>
                  }
                />
                <Route
                  path="/admin/contact-messages"
                  element={
                    <ProtectedAdminRoute>
                      <ContactMessagesPage initialMessages={initialBookings} />
                    </ProtectedAdminRoute>
                  }
                />

                <Route
                  path="/admin/pending-owners"
                  element={
                    <ProtectedAdminRoute>
                      <AdminPendingOwners />
                    </ProtectedAdminRoute>
                  }
                />

                <Route
                  path="/admin/owners/:id/edit"
                  element={
                    <ProtectedAdminRoute>
                      <AdminEditOwnerPage />
                    </ProtectedAdminRoute>
                  }
                />

                {/* Protected Owner Routes */}
                <Route
                  path="/owner/dashboard"
                  element={
                    <ProtectedOwnerRoute>
                      <OwnerDashboard />
                    </ProtectedOwnerRoute>
                  }
                />
                <Route
                  path="/owner/places"
                  element={
                    <ProtectedOwnerRoute>
                      <OwnerPlaces />
                    </ProtectedOwnerRoute>
                  }
                />
                <Route
                  path="/owner/bookings"
                  element={
                    <ProtectedOwnerRoute>
                      <OwnerBookings />
                    </ProtectedOwnerRoute>
                  }
                />
                <Route
                  path="/owner/places/new"
                  element={
                    <ProtectedOwnerRoute>
                      <PlacesFormPage />
                    </ProtectedOwnerRoute>
                  }
                />
                <Route
                  path="/owner/places/:id/edit"
                  element={
                    <ProtectedOwnerRoute>
                      <PlacesFormPage />
                    </ProtectedOwnerRoute>
                  }
                />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
            <ClientOnly fallback={<p>Chargement...</p>}>
              <ToastContainer autoClose={2000} transition={Slide} />
            </ClientOnly>
          </PlaceProvider>
        </UserProvider>
      </GoogleOAuthProvider>
    </HelmetProvider>
  );
}

export default App;