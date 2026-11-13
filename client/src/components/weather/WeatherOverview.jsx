// client/src/components/weather/WeatherOverview.jsx
import React from 'react';
import { CloudSun, Droplets, Wind, Thermometer, Calendar } from 'lucide-react';

export function WeatherOverview({ weatherData }) {
  if (!weatherData) return null;

  const current = weatherData.current || {};
  const forecast = weatherData.forecast || {};
  const dates = forecast.dates || [];

  return (
    <div className="space-y-6">
      {/* Current Conditions Big Card */}
      <div className="bg-gradient-to-br from-sky-600 via-sky-700 to-forest-900 text-white rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-200">
              Live Agricultural Meteorology
            </span>
            <div className="flex items-baseline gap-3 mt-1">
              <span className="text-4xl sm:text-5xl font-black">
                {current.temperature != null ? `${current.temperature}°C` : '—'}
              </span>
              <span className="text-lg font-medium text-sky-100">
                {current.weatherCondition || 'Partly Cloudy'}
              </span>
            </div>
            <p className="text-xs text-sky-200 mt-2">
              Provider: {weatherData.provider || 'Open-Meteo Global Agro-Meteorological Service'}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/10 text-center">
            <div>
              <Droplets className="w-4 h-4 mx-auto text-sky-300 mb-1" />
              <span className="text-[10px] text-sky-200 uppercase font-semibold">Humidity</span>
              <p className="text-sm font-bold mt-0.5">{current.humidity ?? '50'}%</p>
            </div>
            <div>
              <Wind className="w-4 h-4 mx-auto text-sky-300 mb-1" />
              <span className="text-[10px] text-sky-200 uppercase font-semibold">Wind</span>
              <p className="text-sm font-bold mt-0.5">{current.windSpeed ?? '10'} km/h</p>
            </div>
            <div>
              <CloudSun className="w-4 h-4 mx-auto text-sky-300 mb-1" />
              <span className="text-[10px] text-sky-200 uppercase font-semibold">Precip</span>
              <p className="text-sm font-bold mt-0.5">{current.precipitation ?? '0'} mm</p>
            </div>
          </div>
        </div>
      </div>

      {/* 7-Day Forecast Grid */}
      {dates.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-agri-green" />
            7-Day Agronomic Forecast
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
            {dates.map((d, idx) => {
              const dayName = new Date(d).toLocaleDateString('en-US', { weekday: 'short' });
              const maxT = forecast.maxTemps?.[idx];
              const minT = forecast.minTemps?.[idx];
              const rainProb = forecast.rainProbabilities?.[idx] || 0;

              return (
                <div key={idx} className="bg-white p-3 rounded-xl border border-gray-200 text-center shadow-sm">
                  <span className="text-xs font-bold text-gray-800 block">{dayName}</span>
                  <span className="text-[10px] text-gray-400 block mb-1">{d.slice(5)}</span>
                  <div className="my-1.5 flex items-center justify-center gap-1 text-xs font-bold">
                    <span className="text-gray-900">{maxT != null ? `${Math.round(maxT)}°` : '—'}</span>
                    <span className="text-gray-400 font-normal">/ {minT != null ? `${Math.round(minT)}°` : '—'}</span>
                  </div>
                  <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full inline-block">
                    Rain: {rainProb}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

