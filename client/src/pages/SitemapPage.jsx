import React from 'react';

const SitemapPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center text-blue-800">
              Plan du site
            </h1>
            <p className="mt-4">Découvrez toutes les pages de notre site pour une navigation facilitée.</p>
            <ul className="list-disc pl-6 mt-4">
              <li><a href="/" className="text-blue-600 hover:underline">Accueil</a></li>
              <li><a href="/login" className="text-blue-600 hover:underline">Connexion</a></li>
              <li><a href="/register" className="text-blue-600 hover:underline">Inscription</a></li>
              <li><a href="/account" className="text-blue-600 hover:underline">Mon Compte</a></li>
              <li><a href="/account/places" className="text-blue-600 hover:underline">Mes Annonces</a></li>
              <li><a href="/account/bookings" className="text-blue-600 hover:underline">Mes Réservations</a></li>
              <li><a href="/infos-proprietaires" className="text-blue-600 hover:underline">Infos Propriétaires</a></li>
              <li><a href="/mentions-legales" className="text-blue-600 hover:underline">Mentions Légales</a></li>
              <li><a href="/cgv-cgu" className="text-blue-600 hover:underline">CGV/CGU</a></li>
              <li><a href="/contact" className="text-blue-600 hover:underline">Contact</a></li>
              <li><a href="/parametres-cookies" className="text-blue-600 hover:underline">Paramètres des cookies</a></li>
            </ul>
          </div>
        </div>
      </main>
    </div>
  );
};

export default SitemapPage;
