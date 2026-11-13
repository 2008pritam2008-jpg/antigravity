// client/src/components/common/Navbar.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Sprout, Bell, User, LogOut, Menu, Shield } from 'lucide-react';

export function Navbar({ onMenuToggle }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onMenuToggle}
            className="p-2 rounded-lg text-gray-600 hover:bg-gray-100 lg:hidden"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/dashboard" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-900 text-agri-leaf flex items-center justify-center shadow-sm">
              <Sprout className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg text-forest-900 leading-tight">AgriAssist AI</span>
              <span className="text-[10px] uppercase font-semibold tracking-wider text-agri-leaf">Crop Advisory</span>
            </div>
          </Link>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/notifications"
            className="p-2 text-gray-600 hover:text-agri-green hover:bg-gray-100 rounded-lg relative transition"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-amber-500 rounded-full"></span>
          </Link>

          {isAdmin && (
            <Link
              to="/admin"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-semibold hover:bg-purple-100 transition"
            >
              <Shield className="w-3.5 h-3.5" />
              Admin
            </Link>
          )}

          <div className="h-6 w-px bg-gray-200 hidden sm:block"></div>

          <div className="flex items-center gap-3">
            <Link
              to="/profile"
              className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-gray-100 transition text-left"
            >
              <div className="w-8 h-8 rounded-full bg-forest-100 text-forest-900 flex items-center justify-center font-bold text-xs">
                <User className="w-4 h-4" />
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-xs font-semibold text-gray-900 leading-none">
                  {user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Farmer'}
                </span>
                <span className="text-[11px] text-gray-500 capitalize">{user?.role || 'Farmer'}</span>
              </div>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2 text-gray-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
