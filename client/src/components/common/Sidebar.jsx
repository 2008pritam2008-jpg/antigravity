// client/src/components/common/Sidebar.jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  MapPin,
  Sparkles,
  FlaskConical,
  ScanLine,
  Droplets,
  CloudSun,
  CalendarCheck2,
  BotMessageSquare,
  History,
  Settings,
  X,
} from 'lucide-react';

export function Sidebar({ isOpen, onClose }) {
  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/farms', label: 'My Farm Plots', icon: MapPin },
    { to: '/crop-recommendation', label: 'Crop Advisory', icon: Sparkles },
    { to: '/soil-analysis', label: 'Soil Analysis', icon: FlaskConical },
    { to: '/disease-detection', label: 'Disease Scanner', icon: ScanLine },
    { to: '/fertilizer-advisor', label: 'Fertilizer Advisor', icon: Droplets },
    { to: '/weather', label: 'Weather Advisory', icon: CloudSun },
    { to: '/cultivation-plans', label: 'Cultivation Plans', icon: CalendarCheck2 },
    { to: '/ai-assistant', label: 'AI Assistant', icon: BotMessageSquare },
    { to: '/history', label: 'Advisory History', icon: History },
    { to: '/profile', label: 'Farmer Profile', icon: Settings },
  ];

  const linkClasses = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
      isActive
        ? 'bg-forest-900 text-white shadow-sm'
        : 'text-gray-600 hover:text-forest-900 hover:bg-forest-50'
    }`;

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Panel */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:z-auto ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile Header Close */}
          <div className="flex items-center justify-between p-4 border-b border-gray-100 lg:hidden">
            <span className="font-bold text-gray-900">AgriAssist Menu</span>
            <button onClick={onClose} className="p-1 rounded-lg text-gray-500 hover:bg-gray-100">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            {navLinks.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => onClose && onClose()}
                  className={linkClasses}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Quick Disclaimer footer */}
          <div className="p-4 border-t border-gray-100 text-xs text-gray-400">
            <p className="font-semibold text-gray-600">AgriAssist AI v1.0</p>
            <p className="mt-0.5 leading-relaxed">Scientific agricultural intelligence for resilient farming.</p>
          </div>
        </div>
      </aside>
    </>
  );
}
