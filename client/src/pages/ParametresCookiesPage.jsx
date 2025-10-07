import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const CookieToggle = ({ label, description, isEnabled, onToggle, disabled = false }) => (
  <div className="flex items-center justify-between py-3 border-b">
    <div>
      <h3 className="text-lg font-semibold text-gray-800">{label}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={isEnabled} onChange={onToggle} className="sr-only peer" disabled={disabled} />
      <div className={`w-11 h-6 bg-gray-200 rounded-full peer ${disabled ? 'peer-disabled:opacity-50' : 'peer-focus:ring-4 peer-focus:ring-blue-300'} peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600`}></div>
    </label>
  </div>
);

const ParametresCookiesPage = () => {
  const [cookiePreferences, setCookiePreferences] = useState({
    performance: false,
    functionality: false,
    targeting: false,
  });

  useEffect(() => {
    const savedPrefs = Cookies.get('cookie-preferences');
    if (savedPrefs) {
      setCookiePreferences(JSON.parse(savedPrefs));
    }
  }, []);

  const handleToggle = (category) => {
    setCookiePreferences((prev) => ({
      ...prev,
      [category]: !prev[category],
    }));
  };

  const handleSave = () => {
    Cookies.set('cookie-preferences', JSON.stringify(cookiePreferences), { expires: 365 });
    Cookies.set('atypikhouseCookieConsent', true, { expires: 365 });
    alert('Préférences enregistrées !');
  };

  const handleAcceptAll = () => {
    const allAccepted = { performance: true, functionality: true, targeting: true };
    setCookiePreferences(allAccepted);
    Cookies.set('cookie-preferences', JSON.stringify(allAccepted), { expires: 365 });
    Cookies.set('atypikhouseCookieConsent', true, { expires: 365 });
    alert('Tous les cookies ont été acceptés.');
  };

  const handleDeclineAll = () => {
    const allDeclined = { performance: false, functionality: false, targeting: false };
    setCookiePreferences(allDeclined);
    Cookies.set('cookie-preferences', JSON.stringify(allDeclined), { expires: 365 });
    Cookies.set('atypikhouseCookieConsent', 'declined', { expires: 365 });
    alert('Tous les cookies non essentiels ont été refusés.');
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <main className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max_w-2xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h1 className="text-3xl font-bold text-center text-blue-800">
              Paramètres des cookies
            </h1>
            <p className="mt-4">Gérez vos préférences en matière de cookies sur notre site. Vous pouvez choisir d'accepter ou de refuser différentes catégories de cookies.</p>

            <div className="mt-6 space-y-4">
              <CookieToggle
                label="Cookies Essentiels"
                description="Ces cookies sont nécessaires au bon fonctionnement du site et ne peuvent pas être désactivés."
                isEnabled={true}
                onToggle={() => {}}
                disabled={true}
              />
              <CookieToggle
                label="Cookies de Performance"
                description="Ces cookies collectent des informations sur la façon dont les visiteurs utilisent notre site."
                isEnabled={cookiePreferences.performance}
                onToggle={() => handleToggle('performance')}
              />
              <CookieToggle
                label="Cookies de Fonctionnalité"
                description="Ces cookies permettent à notre site web de se souvenir des choix que vous faites."
                isEnabled={cookiePreferences.functionality}
                onToggle={() => handleToggle('functionality')}
              />
              <CookieToggle
                label="Cookies de Ciblage/Publicité"
                description="Ces cookies sont utilisés pour diffuser des publicités plus pertinentes pour vous."
                isEnabled={cookiePreferences.targeting}
                onToggle={() => handleToggle('targeting')}
              />
            </div>

            <div className="mt-8 flex flex-wrap gap-2 justify-center">
              <button onClick={handleAcceptAll} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Accepter tout</button>
              <button onClick={handleDeclineAll} className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">Refuser tout</button>
              <button onClick={handleSave} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">Enregistrer mes choix</button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ParametresCookiesPage;
