// client/src/components/layout/AuthLayout.jsx
import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Sprout } from 'lucide-react';

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-50 via-white to-agri-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <Link to="/" className="inline-flex items-center gap-2.5 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-forest-900 text-agri-leaf flex items-center justify-center shadow-md">
            <Sprout className="w-7 h-7" />
          </div>
          <span className="font-extrabold text-2xl text-forest-900 tracking-tight">AgriAssist AI</span>
        </Link>
        <h2 className="text-xl font-bold text-gray-900">Digital Agricultural Advisory Platform</h2>
        <p className="mt-1 text-sm text-gray-600">Precision agronomy, multimodal pathology & climate advisory</p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <div className="bg-white py-8 px-6 shadow-xl shadow-gray-200/50 rounded-2xl border border-gray-100 sm:px-10">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;

