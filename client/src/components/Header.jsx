import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { isAuthenticated, logout, getCurrentUser } from '../services/authService';
import {
  GraduationCap, LayoutDashboard, MapPin, Calendar, BookMarked, User, LogOut, ArrowRight, LogIn
} from 'lucide-react';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const loggedIn = isAuthenticated();
  const user = loggedIn ? getCurrentUser() : null;
  const path = location.pathname;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (route) => path === route;

  const navLink = (route, label, Icon) => (
    <button
      key={route}
      onClick={() => navigate(route)}
      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
        isActive(route)
          ? 'bg-indigo-100 text-indigo-700'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon className="w-4 h-4" />
      {label}
    </button>
  );

  // Authenticated navigation items
  const authNavItems = [
    { route: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { route: '/roadmap', label: 'Roadmap', icon: MapPin },
    { route: '/timetable', label: 'Timetable', icon: Calendar },
    { route: '/resources', label: 'Resources', icon: BookMarked },
    { route: '/profile', label: 'Profile', icon: User },
  ];

  // Guest navigation items (landing page sections)
  const isLanding = path === '/';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        {/* Logo */}
        <button
          onClick={() => navigate(loggedIn ? '/dashboard' : '/')}
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
        >
          <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">
            AcadBoost<span className="text-indigo-600">AI</span>
          </span>
        </button>

        {/* Center Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {loggedIn ? (
            authNavItems.map(item => navLink(item.route, item.label, item.icon))
          ) : (
            isLanding && (
              <>
                <a href="#features" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors px-4 py-2">Features</a>
                <a href="#how-it-works" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors px-4 py-2">How It Works</a>
              </>
            )
          )}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {loggedIn ? (
            <>
              {user && (
                <span className="hidden sm:block text-sm text-gray-500">
                  Hi, <span className="font-semibold text-gray-700">{user.name}</span>
                </span>
              )}
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors text-sm font-medium"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-gray-700 hover:text-indigo-600 transition-colors px-4 py-2 flex items-center gap-1"
              >
                <LogIn className="w-4 h-4" />
                Log In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="text-sm font-medium bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-1"
              >
                Get Started <ArrowRight className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
