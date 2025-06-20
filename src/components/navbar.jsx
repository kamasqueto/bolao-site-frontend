import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Navbar({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  let isLoggedIn = false;
  let userName = '';

  if (token) {
    try {
      const decoded = jwtDecode(token);
      isLoggedIn = decoded.exp * 1000 > Date.now();
      userName = decoded.name || decoded.email || '';
    } catch {
      isLoggedIn = false;
    }
  }

  const navLinks = [
    { path: '/palpitar', label: 'Palpitar' },
    { path: '/ranking', label: 'Ranking' },
    { path: '/meus-palpites', label: 'Meus Palpites' },
  ];

  const isHome = location.pathname === '/';
  const visibleLinks = isHome && !isLoggedIn ? [] : navLinks;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div>
      <nav className="bg-blue-900 shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between flex-wrap">
          
          {/* LOGO COM IMAGEM */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg">
            <img src="/Logo.png" alt="Logo" className="h-8 w-8 object-contain" />
            <span className="hidden sm:inline">Bolão 2025</span>
          </Link>

          <div className="flex flex-wrap gap-2 mt-2 md:mt-0 items-center">
            {visibleLinks.map(({ path, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`text-sm md:text-base font-semibold px-4 py-2 rounded-full transition-all ${
                    isActive
                      ? 'bg-green-500 text-white'
                      : 'text-white hover:bg-white hover:text-blue-800'
                  }`}
                >
                  {label}
                </Link>
              );
            })}

            {isLoggedIn && (
              <span className="text-white text-sm font-medium mr-2 hidden sm:inline">
                Olá, {userName.split(' ')[0]}
              </span>
            )}

            {!isLoggedIn ? (
              <Link
                to="/login"
                className="text-sm md:text-base font-semibold px-4 py-2 rounded-full bg-white text-blue-800 hover:bg-green-500 hover:text-white transition-all"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="text-sm md:text-base font-semibold px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all"
              >
                Sair
              </button>
            )}
          </div>
        </div>
      </nav>

      <main className={isHome ? '' : 'p-4'}>
        {children}
      </main>
    </div>
  );
}
