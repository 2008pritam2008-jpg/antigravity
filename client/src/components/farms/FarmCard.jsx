// client/src/components/farms/FarmCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Droplets, Layers, Trash2, Edit3, ArrowRight } from 'lucide-react';

export function FarmCard({ farm, onDelete }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition p-5 flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div>
            <h3 className="font-bold text-gray-900 text-base">{farm.farm_name}</h3>
            <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-gray-400" />
              {farm.district}, {farm.state}
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-forest-50 text-forest-900 border border-forest-100">
            {farm.land_area} {farm.area_unit}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs py-3 border-y border-gray-100 my-3">
          <div className="flex items-center gap-1.5 text-gray-600">
            <Layers className="w-4 h-4 text-amber-600" />
            <span className="truncate capitalize">{farm.soil_type || 'Loam'}</span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-600">
            <Droplets className="w-4 h-4 text-blue-500" />
            <span className="truncate capitalize">{farm.irrigation_type?.replace('_', ' ') || 'Rainfed'}</span>
          </div>
        </div>

        {farm.soil_ph && (
          <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
            <span>Soil pH: <strong className="text-gray-800">{farm.soil_ph}</strong></span>
            {farm.nitrogen && <span>N: <strong className="text-gray-800">{farm.nitrogen}</strong> kg/ha</span>}
          </div>
        )}
      </div>

      <div className="flex items-center justify-between pt-3 mt-2 border-t border-gray-100">
        <Link
          to={`/farms/${farm.id}`}
          className="text-xs font-semibold text-agri-green hover:text-forest-900 flex items-center gap-1"
        >
          View Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button
          onClick={() => onDelete && onDelete(farm.id)}
          className="p-1.5 text-gray-400 hover:text-rose-600 rounded-lg transition"
          title="Delete Farm Plot"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
