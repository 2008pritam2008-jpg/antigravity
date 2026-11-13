// client/src/components/dashboard/FarmSummaryCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Plus, ArrowRight } from 'lucide-react';

export function FarmSummaryCard({ farms = [] }) {
  const totalAcreage = farms.reduce((acc, f) => acc + Number(f.land_area || 0), 0);

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-forest-50 text-agri-green flex items-center justify-center">
              <MapPin className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-gray-900">Registered Land & Plots</h3>
          </div>
          <Link
            to="/farms/new"
            className="p-1.5 rounded-lg text-agri-green hover:bg-forest-50 transition"
            title="Add Farm"
          >
            <Plus className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-xs text-gray-500 font-medium">Total Plots</span>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">{farms.length}</p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-xs text-gray-500 font-medium">Total Area</span>
            <p className="text-2xl font-bold text-gray-900 mt-0.5">
              {totalAcreage.toFixed(1)} <span className="text-xs font-normal text-gray-500">acres</span>
            </p>
          </div>
        </div>

        {farms.length > 0 ? (
          <ul className="space-y-2">
            {farms.slice(0, 3).map((f) => (
              <li key={f.id} className="text-xs flex items-center justify-between py-1.5 border-b border-gray-100 last:border-none">
                <span className="font-semibold text-gray-800 truncate max-w-[140px]">{f.farm_name}</span>
                <span className="text-gray-500 capitalize">{f.soil_type || 'Loam'} · {f.land_area} {f.area_unit}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-xs text-gray-500 italic py-2">No farms registered yet. Add your first farm plot to begin.</p>
        )}
      </div>

      <Link
        to="/farms"
        className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-agri-green hover:text-forest-900 flex items-center justify-between"
      >
        <span>Manage all plots</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
