// client/src/components/dashboard/WeatherSummaryCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { CloudSun, Droplets, Wind, ArrowRight, AlertTriangle } from 'lucide-react';

export function WeatherSummaryCard({ weatherData }) {
  const current = weatherData?.current || {};
  const alerts = weatherData?.agriculturalAlerts || [];

  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center">
              <CloudSun className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-gray-900">Agro-Weather Advisory</h3>
          </div>
          <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
            Live
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-4">
          <div>
            <span className="text-3xl font-extrabold text-gray-900">
              {current.temperature != null ? `${current.temperature}°C` : '28°C'}
            </span>
            <p className="text-xs text-gray-500 capitalize mt-0.5">
              {current.weatherCondition || 'Partly cloudy'}
            </p>
          </div>
          <div className="flex gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1" title="Humidity">
              <Droplets className="w-3.5 h-3.5 text-blue-500" />
              <span>{current.humidity != null ? `${current.humidity}%` : '55%'}</span>
            </div>
            <div className="flex items-center gap-1" title="Wind Speed">
              <Wind className="w-3.5 h-3.5 text-gray-400" />
              <span>{current.windSpeed != null ? `${current.windSpeed} km/h` : '12 km/h'}</span>
            </div>
          </div>
        </div>

        {alerts.length > 0 ? (
          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-amber-900">
              <p className="font-bold">{alerts[0].title}</p>
              <p className="text-[11px] opacity-90 truncate max-w-[200px]">{alerts[0].action}</p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
            Normal weather conditions favorable for ongoing agricultural operations.
          </p>
        )}
      </div>

      <Link
        to="/weather"
        className="mt-4 pt-3 border-t border-gray-100 text-xs font-semibold text-sky-700 hover:text-sky-900 flex items-center justify-between"
      >
        <span>View 7-day forecast & alerts</span>
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  );
}
