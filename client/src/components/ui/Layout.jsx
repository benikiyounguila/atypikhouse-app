
import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import * as HelmetModule from 'react-helmet-async';
const { Helmet } = HelmetModule;
import { Header } from './Header';
import Footer from './Footer';
import Breadcrumb from './Breadcrumb';

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  // Initialisation de isLoggedIn à false pour garantir le même rendu SSR/client
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Update login state when token or logout event occurs
  useEffect(() => {
    // Tout ce qui est à l'intérieur de useEffect ne s'exécute que côté client (navigateur)
    const handleStorageChange = (event) => {
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      console.log('Storage change detected, event:', event, 'token:', token, 'user:', user);
      setIsLoggedIn(!!token && !!user); // Update state based on token and user presence
    };

    const handleLogoutEvent = (event) => {
      console.log('Logout event detected, event:', event, 'isLoggedIn before:', isLoggedIn);
      // Vérifier que le localStorage est bien nettoyé
      const token = localStorage.getItem('token');
      const user = localStorage.getItem('user');
      console.log('After logout event - token:', !!token, 'user:', !!user);
      setIsLoggedIn(false); // Force logout state on custom event
      console.log('isLoggedIn after:', false); // Verify state change
    };

    // Listen for storage changes and custom logout event
    // Ces listeners sont ajoutés seulement côté client
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('logout', handleLogoutEvent);

    // Initial log to check token and user, également exécuté seulement côté client
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    console.log('Initial token check:', !!token, 'user:', !!user, 'isLoggedIn:', isLoggedIn);
    setIsLoggedIn(!!token && !!user);

    // Cleanup event listeners
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('logout', handleLogoutEvent);
    };
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Helmet>
        <title>Gérez et Louez des logements insolites - AtypikHouse</title>
        <meta
          name="description"
          content="Suivez vos réservations et commencez votre aventure en toute simplicité avec notre application intuitive pour la gestion de logements insolites."
        />
        <link
          rel="canonical"
          href={`https://votredomaine.com${location.pathname}`}
        />
      </Helmet>

      <Header />
      <div className="container mx-auto px-4 py-4 text-gray-600 text-center mt-20 text-sm">
        <Breadcrumb />
      </div>
     
      {isHomePage && (
  <main className="flex-grow mt-18">
    <div className="container mx-auto px-4 py-22">
      <Helmet>
        <title>Découvrez des Hébergements Insolites et Écologiques - AtypikHouse</title>
        <meta
          name="description"
          content="Réservez un séjour insolite dans nos hébergements écologiques : cabanes dans les arbres, yourtes durables, tiny houses. Gérez vos locations facilement avec AtypikHouse !"
        />
        <meta
          name="keywords"
          content="hébergement insolite, écologique, éco-responsable, séjour nature, cabane écologique, yourte durable, AtypikHouse"
        />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            "name": "AtypikHouse",
            "description": "Hébergements insolites et écologiques pour des séjours nature uniques.",
            "url": "https://atypikhouse.onrender.com",
            "image": "https://atypikhouse.onrender.com/images/cabane-ecologique.jpg",
            "address": { "@type": "PostalAddress", "addressCountry": "FR" }
          })}
        </script>
      </Helmet>
    </div>
  </main>
)}

      <div className="flex-grow">
        <Outlet />
      </div>

     

      {isHomePage && (
        <div className="bg-green-800 text-white py-12 text-center w-full mt-12 mb-12">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="text-3xl font-bold mb-4">Prêt à commencer votre aventure AtypikHouse ?</h2>
            <div className="md:flex md:items-center md:justify-center md:gap-8">
              <div className="md:w-1/2">
                <img
                  // src="src\img\cabane-ecologique.jpeg"
                  src="/img/cabane-ecologique.jpeg"
                  alt="Hébergement insolite écologique avec AtypikHouse"
                  className="w-full h-auto rounded-lg mx-auto mb-6 md:mb-0"
                  loading="lazy"
                />
              </div>
              <div className="md:w-1/2 md:text-left">
                <p className="text-lg mb-8"> Plongez dans une aventure unique avec nos hébergements insolites et éco-responsables.
                  Que vous soyez voyageur en quête d’une cabane écologique, d’une yourte durable ou d’une tiny house, ou propriétaire souhaitant gérer vos locations,
                  AtypikHouse vous offre une plateforme intuitive pour des séjours nature mémorables. Nos logements,
                  conçus avec des matériaux recyclés et équipés de solutions éco-énergétiques, garantissent un tourisme durable sans compromettre le confort.
                  Réservez ou gérez dès maintenant !</p>
              </div>
            </div>
            <div className="flex justify-center space-x-4">
              <Link to="/register" className="bg-white text-green-800 font-bold py-3 px-6 rounded-full hover:bg-gray-200 transition duration-300">
                S'inscrire
              </Link>
              <Link to="/contact" className="border-2 border-white text-white font-bold py-3 px-6 rounded-full hover:bg-white hover:text-green-800 transition duration-300">
                Nous écrire
              </Link>
            </div>
          </div>
        </div>
      )}

      

      <Footer />
    </div>
  );
};

export default Layout;

