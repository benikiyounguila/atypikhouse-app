import React from 'react';
import { Helmet } from 'react-helmet-async';

const DiscoverCompanyPage = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-20">
      <Helmet>
        <title>Découvrir l'entreprise - AtypikHouse</title>
        <meta
          name="description"
          content="Découvrez AtypikHouse, notre mission, notre vision et notre engagement à offrir des expériences de logement insolites et mémorables."
        />
      </Helmet>
      <h1 className="text-4xl font-bold text-center text-primary mb-8">Découvrir AtypikHouse</h1>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-secondary mb-4">Notre Mission</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Chez AtypikHouse, notre mission est de révolutionner l'expérience de voyage en offrant une plateforme unique dédiée aux logements insolites. Nous connectons les voyageurs en quête d'aventure et d'originalité avec des hôtes proposant des hébergements hors du commun : cabanes dans les arbres, yourtes, bulles transparentes, péniches, et bien plus encore. Nous croyons que chaque voyage devrait être une histoire à raconter, et nous nous engageons à rendre ces expériences accessibles et inoubliables.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-secondary mb-4">Notre Vision</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Nous aspirons à devenir la référence mondiale des séjours atypiques, en créant une communauté où l'innovation, la durabilité et l'authenticité sont au cœur de chaque interaction. Nous envisageons un monde où les voyages ne se limitent plus aux hôtels traditionnels, mais s'ouvrent à des découvertes uniques qui enrichissent l'esprit et connectent les individus à des lieux extraordinaires.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold text-secondary mb-4">Nos Valeurs</h2>
        <ul className="list-disc list-inside text-lg text-gray-700 leading-relaxed">
          <li className="mb-2"><strong>Authenticité :</strong> Proposer des expériences de logement qui reflètent la singularité de chaque lieu et de chaque culture.</li>
          <li className="mb-2"><strong>Innovation :</strong> Toujours chercher de nouvelles façons d'améliorer notre plateforme et d'élargir notre offre de logements.</li>
          <li className="mb-2"><strong>Communauté :</strong> Bâtir un réseau solide et bienveillant entre hôtes et voyageurs.</li>
          <li className="mb-2"><strong>Durabilité :</strong> Promouvoir des pratiques de tourisme respectueuses de l'environnement et des communautés locales.</li>
          <li className="mb-2"><strong>Qualité :</strong> Assurer une sélection rigoureuse des logements pour garantir des séjours de haute qualité.</li>
        </ul>
      </section>

      <section>
        <h2 className="text-3xl font-semibold text-secondary mb-4">Rejoignez l'Aventure AtypikHouse</h2>
        <p className="text-lg text-gray-700 leading-relaxed">
          Que vous soyez un voyageur en quête d'évasion ou un propriétaire désireux de partager un lieu unique, AtypikHouse est votre partenaire idéal. Explorez notre collection grandissante de logements insolites et commencez dès aujourd'hui à créer des souvenirs inoubliables.
        </p>
        <div className="text-center mt-8">
          <a href="/register" className="btn btn-primary btn-lg">
            S'inscrire et Commencer l'Aventure
          </a>
        </div>
      </section>
    </div>
  );
};

export default DiscoverCompanyPage;