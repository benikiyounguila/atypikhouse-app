import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import Spinner from '@/components/ui/Spinner';
import PlaceCard from '@/components/ui/PlaceCard';
import { usePlaces } from '../providers/PlaceProvider';

const IndexPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const pageFromUrl = parseInt(searchParams.get('page')) || 1;
  const { page, changePage, places = [], loading = false, total = 0, pages = 1, limit = 12 } = usePlaces();

  // Debug logs
  console.log('[INDEX PAGE] Places count:', places.length);
  console.log('[INDEX PAGE] Loading:', loading);
  console.log('[INDEX PAGE] Total:', total);
  console.log('[INDEX PAGE] Pages:', pages);
  console.log('[INDEX PAGE] Current page:', page);

  // Synchronise le Provider avec l'URL
  useEffect(() => {
    if (page !== pageFromUrl) {
      changePage(pageFromUrl);
    }
  }, [pageFromUrl, page, changePage]);

  // Met à jour l'URL lors du clic sur la pagination
  const handlePageChange = (newPage) => {
    if (newPage !== pageFromUrl) {
      navigate(`/?page=${newPage}`);
    }
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      {/* Section Hero */}
      <section className="relative bg-gradient-to-r from-green-600 to-green-800 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="container mx-auto px-4 relative"> 
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Découvrez des Hébergements Insolites et Écologiques
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-green-100">
              Vivez des expériences uniques dans des lieux extraordinaires, respectueux de l'environnement
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#hebergements"
                className="bg-white text-green-800 px-8 py-4 rounded-full font-semibold hover:bg-green-50 transition duration-300 text-lg"
              >
                Découvrir nos hébergements
              </a>
              <Link
                to="/contact"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-green-800 transition duration-300 text-lg"
              >
                Nous contacter
              </Link>
            </div>
          </div>
          </div>
      </section>

      {/* Section Hébergements */}
      <section id="hebergements" className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-green-800 mb-4">
              Nos Hébergements Exceptionnels
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez notre sélection d'hébergements <sapn>Insolites</sapn> uniques, tous respectueux de l'environnement 
              et offrant des expériences inoubliables.
            </p>
          </div>

          {places.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
                {places.map((place) => (
                  <PlaceCard place={place} key={place._id} />
                ))}
              </div>
              
              {pages > 1 && (
                <Pagination
                  totalPages={pages}
                  currentPage={page}
                  changePage={handlePageChange}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏠</div>
              <h3 className="text-2xl font-semibold mb-4">Aucun hébergement insolite trouvé</h3>
              <p className="text-gray-600 mb-6">
                Nous travaillons actuellement à ajouter de nouveaux hébergements exceptionnels.
              </p>
              <Link
                to="/contact"
                className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition duration-300"
              >
                Nous contacter
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Section CTA */}
      <section className="py-16 bg-green-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Prêt pour une aventure inoubliable ?
          </h2>
          <p className="text-xl mb-6 text-green-100">
            Rejoignez des milliers de voyageurs qui ont déjà vécu des expériences extraordinaires avec AtypikHouse.
          </p>
          <div className="max-w-3xl mx-auto">
            <p className="text-lg mb-6 text-green-100">
              Pour une escapade vraiment insolite, AtypikHouse vous propose des hébergements uniques.
              Nos hébergements insolites vous offrent une expérience unique où confort moderne et respect de
              l'environnement se rencontrent. Que vous cherchiez une cabane dans les arbres, une maison troglodyte
              ou une yourte moderne, chaque séjour est conçu pour vous reconnecter avec la nature tout en préservant
              le luxe du confort contemporain.
            </p>
            <p className="text-lg text-green-100">
              Découvrez des lieux extraordinaires, rencontrez des hôtes passionnés et créez des souvenirs inoubliables. 
              AtypikHouse, c'est plus qu'un hébergement, c'est une aventure qui vous transforme.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

// Adapter la pagination pour utiliser les infos du backend
const Pagination = ({ totalPages, currentPage, changePage }) => {
  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (currentPage <= 3) return [1, 2, 3, 4, 5, '...', totalPages];
    if (currentPage >= totalPages - 2)
      return [
        1,
        '...',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    return [
      1,
      '...',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      '...',
      totalPages,
    ];
  };

  return (
    <nav className="flex justify-center mt-8">
      <ul className="flex flex-wrap justify-center items-center space-x-2">
        <li>
          <button
            onClick={() => changePage(Math.max(1, currentPage - 1))}
            className="px-4 py-2 border rounded-lg bg-white text-green-600 hover:bg-green-600 hover:text-white transition-colors font-semibold"
            disabled={currentPage === 1}
          >
            &laquo; Précédent
          </button>
        </li>
        {getPageNumbers().map((number, index) => (
          <li key={index}>
            {number === '...' ? (
              <span className="px-3 py-2">...</span>
            ) : (
              <button
                onClick={() => changePage(number)}
                className={`px-4 py-2 border rounded-lg font-semibold ${
                  currentPage === number
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-green-600 hover:bg-green-600 hover:text-white'
                } transition-colors`}
              >
                {number}
              </button>
            )}
          </li>
        ))}
        <li>
          <button
            onClick={() => changePage(Math.min(totalPages, currentPage + 1))}
            className="px-4 py-2 border rounded-lg bg-white text-green-600 hover:bg-green-600 hover:text-white transition-colors font-semibold"
            disabled={currentPage === totalPages}
          >
            Suivant &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default IndexPage;
