import React from 'react';

const ParametresCookiesPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max_w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center text-blue-800">
              Paramètres des cookies
            </h1>
            {/* Add your cookie settings content here */}
            <p className="mt-4">Gérez vos préférences en matière de cookies sur notre site. Vous pouvez choisir d'accepter ou de refuser différentes catégories de cookies.</p>
            <h2 className="text-xl font-semibold mt-6 text-blue-700">Types de cookies</h2>
            <ul className="list-disc pl-6 mt-4">
              <li>
                <strong>Cookies Essentiels:</strong> Ces cookies sont nécessaires au bon fonctionnement du site et ne peuvent pas être désactivés. Ils incluent, par exemple, les cookies qui vous permettent de vous connecter à des zones sécurisées de notre site.
              </li>
              <li>
                <strong>Cookies de Performance:</strong> Ces cookies collectent des informations sur la façon dont les visiteurs utilisent notre site, par exemple, quelles pages sont les plus visitées. Ces cookies ne collectent pas d'informations qui identifient un visiteur. Toutes les informations collectées par ces cookies sont agrégées et donc anonymes. Ils sont uniquement utilisés pour améliorer le fonctionnement de notre site web.
              </li>
              <li>
                <strong>Cookies de Fonctionnalité:</strong> Ces cookies permettent à notre site web de se souvenir des choix que vous faites (comme votre nom d'utilisateur, votre langue ou la région où vous vous trouvez) et de fournir des fonctionnalités améliorées et plus personnelles. Les informations collectées par ces cookies peuvent être anonymisées et ne peuvent pas suivre votre activité de navigation sur d'autres sites web.
              </li>
              <li>
                <strong>Cookies de Ciblage/Publicité:</strong> Ces cookies sont utilisés pour diffuser des publicités plus pertinentes pour vous et vos intérêts. Ils sont également utilisés pour limiter le nombre de fois que vous voyez une publicité ainsi que pour aider à mesurer l'efficacité des campagnes publicitaires. Ils sont généralement placés par des réseaux publicitaires avec la permission de l'opérateur du site web.
              </li>
            </ul>
            <h2 className="text-xl font-semibold mt-6 text-blue-700">Vos choix</h2>
            <p className="mt-4">Vous pouvez modifier vos préférences de cookies à tout moment. Veuillez noter que la désactivation de certains cookies peut affecter la fonctionnalité de notre site.</p>
            {/* Here you would typically add toggles or checkboxes for cookie preferences */}
            <div className="mt-6">
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2">Accepter tout</button>
              <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Refuser tout</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParametresCookiesPage;
