
import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from '../../assets/images/Logo_AtypikHouse.png';
import { useAuth } from '../../../hooks';
import SearchBar from './SearchBar';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import ClientOnly from '../utils/ClientOnly';

export const Header = () => {
  const auth = useAuth();
  const location = useLocation();
  const [showSearchBar, setShowSearchBar] = useState(true);
  const [hasShadow, setHasShadow] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { user } = auth;
  const menuRef = useRef(null);

  const handleScroll = () => {
    setHasShadow(window.scrollY > 0);
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    setShowSearchBar(location.pathname === '/');
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [location]);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    console.log('Logout initiated');
    setShowMenu(false);
    
    try {
      if (auth.logout) {
        console.log('Calling auth.logout');
        const result = await auth.logout();
        console.log('Logout result:', result);
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
    
    // Nettoyer le localStorage et déclencher l'événement de déconnexion
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('Token and user removed from localStorage');
    window.dispatchEvent(new Event('logout'));
  };

  const menuItems = [
    { to: '/account', text: 'Mon Profil', userOnly: true },
    { to: '/account/bookings', text: 'Réservations', userOnly: true },
    { to: '/owner/dashboard', text: 'Dashboard Propriétaire', userOnly: true, ownerOnly: true },
    { to: '/admin/dashboard', text: 'Dashboard Admin', userOnly: true, adminOnly: true },
    { to: '/register', text: 'Inscription', guestOnly: true },
    { to: '/login', text: 'Connexion', guestOnly: true },
    { to: '/infos-proprietaires', text: 'Infos Propriétaires' },
    { to: '/contact', text: 'Contact' },
    { to: '/discover-company', text: "Découvrir l'entreprise" },
    { text: 'Déconnexion', onClick: handleLogout, userOnly: true },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-10 flex justify-between items-center bg-white py-4 ${hasShadow ? 'shadow-md' : ''}`}
    >
      <div className="flex justify-between items-center w-full max-w-screen-xl mx-auto px-4">
        <a href="/" className="flex items-center gap-1">
          <img
            className="h-12 w-24 md:h-16 md:w-32"
            src="/Logo_AtypikHouse.png"
            alt="AtypikHouse Logo"
          />
        </a>

        {showSearchBar && <SearchBar />}

        <div className="relative" ref={menuRef}>
          <button
            onClick={toggleMenu}
            className="flex items-center justify-center rounded-full border border-gray-300 p-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
              />
            </svg>
            <div className="ml-2 h-[35px] w-[35px] overflow-hidden rounded-full hidden md:block">
              {user ? (
                <ClientOnly>
                  <Avatar>
                    <AvatarImage
                      src={
                        user.picture ||
                        'https://res.cloudinary.com/rahul4019/image/upload/v1695133265/pngwing.com_zi4cre.png'
                      }
                      className="h-full w-full"
                    />
                  </Avatar>
                </ClientOnly>
              ) : (
                <svg
                  fill="#858080"
                  version="1.1"
                  id="Layer_1"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  className="h-full w-full"
                >
                  <circle cx="12" cy="12" r="10" />
                </svg>
              )}
            </div>
          </button>

          {showMenu && (
            <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-[1000]">
              <div className="py-1">
                {menuItems.map((item, index) => (
                  ((item.userOnly && user) ||
                    (item.guestOnly && !user) ||
                    (!item.userOnly && !item.guestOnly)) &&
                  (!item.ownerOnly || (user && user.role === 'owner')) &&
                  (!item.adminOnly || (user && user.role === 'admin')) && (
                    <div key={index}>
                      {item.to ? (
                        <Link
                          to={item.to}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                          onClick={() => setShowMenu(false)}
                        >
                          {item.text}
                        </Link>
                      ) : (
                        <button
                          onClick={() => {
                            handleLogout();
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          {item.text}
                        </button>
                      )}
                    </div>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};