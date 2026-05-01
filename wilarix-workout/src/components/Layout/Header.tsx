import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Dumbbell, Menu, X, LogOut, User, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export default function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/');
    setMenuOpen(false);
  }

  const navLinks = user
    ? [
        { to: '/dashboard', label: 'Dashboard' },
        { to: '/session/warmup', label: 'Warm-Up' },
        { to: '/session/session1', label: 'Session 1' },
        { to: '/session/session2', label: 'Session 2' },
        { to: '/session/session3', label: 'Session 3' },
      ]
    : [
        { to: '/about', label: 'About' },
        { to: '/how-it-works', label: 'How It Works' },
        { to: '/benefits', label: 'Benefits' },
        { to: '/contact', label: 'Contact' },
      ];

  return (
    <header className="bg-gray-900 border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-2">
          <div className="bg-orange-500 rounded-lg p-1.5">
            <Dumbbell className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-white text-lg leading-tight hidden sm:block">
            Wilarix<span className="text-orange-400"> Workout</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map(link => (
            <Link
              key={link.to}
              to={link.to}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                location.pathname === link.to
                  ? 'bg-orange-500 text-white'
                  : 'text-gray-300 hover:text-white hover:bg-gray-800'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          {user ? (
            <>
              {user.isAdmin && (
                <Link to="/admin" className="flex items-center gap-1 text-sm text-gray-400 hover:text-orange-400 px-2 py-1.5">
                  <Settings className="w-4 h-4" /> Admin
                </Link>
              )}
              <Link to="/profile" className="flex items-center gap-1.5 text-sm text-gray-300 hover:text-white px-2 py-1.5">
                <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                {user.name.split(' ')[0]}
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-sm text-gray-400 hover:text-red-400 px-2 py-1.5"
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-sm text-gray-300 hover:text-white px-3 py-1.5">Login</Link>
              <Link to="/signup" className="bg-orange-500 hover:bg-orange-600 text-white text-sm font-medium px-4 py-1.5 rounded-lg transition-colors">
                Sign Up Free
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-300 hover:text-white p-1"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-gray-900 border-t border-gray-800 px-4 pb-4">
          <nav className="flex flex-col gap-1 mt-2">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMenuOpen(false)}
                className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  location.pathname === link.to
                    ? 'bg-orange-500 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-800'
                }`}
              >
                {link.label}
              </Link>
            ))}
            <div className="border-t border-gray-800 mt-2 pt-2 flex flex-col gap-1">
              {user ? (
                <>
                  <Link to="/profile" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg">
                    <User className="w-4 h-4" /> Profile
                  </Link>
                  {user.isAdmin && (
                    <Link to="/admin" onClick={() => setMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg">
                      <Settings className="w-4 h-4" /> Admin Panel
                    </Link>
                  )}
                  <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2.5 text-sm text-red-400 hover:bg-gray-800 rounded-lg text-left">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMenuOpen(false)} className="px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg">Login</Link>
                  <Link to="/signup" onClick={() => setMenuOpen(false)} className="bg-orange-500 text-white px-3 py-2.5 text-sm font-medium rounded-lg text-center">Sign Up Free</Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
