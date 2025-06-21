import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export default function Navbar({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [menuAberto, setMenuAberto] = useState(false);

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
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* LOGO */}
          <Link to="/" className="flex items-center gap-2 text-white font-bold text-lg">
            <img src="/Logo.png" alt="Logo" className="h-8 w-8 object-contain" />
            <span className="hidden sm:inline">Bolão 2025</span>
          </Link>

          {/* Botão do menu hamburguer no mobile */}
          <button
            onClick={() => setMenuAberto(!menuAberto)}
            className="sm:hidden text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={menuAberto ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>

          {/* Menu de navegação */}
          <div className={`flex-col sm:flex-row sm:flex gap-2 sm:items-center ${menuAberto ? 'flex' : 'hidden'} sm:gap-4 sm:mt-0 mt-4 w-full sm:w-auto`}>
            {visibleLinks.map(({ path, label }) => {
              const isActive = location.pathname === path;
              return (
                <Link
                  key={path}
                  to={path}
                  className={`text-sm font-semibold px-4 py-2 rounded-full transition-all text-center ${
                    isActive
                      ? 'bg-green-500 text-white'
                      : 'text-white hover:bg-white hover:text-blue-800'
                  }`}
                  onClick={() => setMenuAberto(false)} // fecha menu no mobile
                >
                  {label}
                </Link>
              );
            })}

            {isLoggedIn && (
              <span className="text-white text-sm font-medium text-center sm:ml-2">
                Olá, {userName.split(' ')[0]}
              </span>
            )}

            {!isLoggedIn ? (
              <Link
                to="/login"
                className="text-sm font-semibold px-4 py-2 rounded-full bg-white text-blue-800 hover:bg-green-500 hover:text-white transition-all text-center"
              >
                Login
              </Link>
            ) : (
              <button
                onClick={() => {
                  handleLogout();
                  setMenuAberto(false);
                }}
                className="text-sm font-semibold px-4 py-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition-all text-center"
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
