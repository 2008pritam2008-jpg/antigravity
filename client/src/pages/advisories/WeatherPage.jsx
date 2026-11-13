// client/src/pages/advisories/WeatherPage.jsx
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/endpoints.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { WeatherOverview } from '../../components/weather/WeatherOverview.jsx';
import { WeatherAlertCard } from '../../components/weather/WeatherAlertCard.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { CloudSun, MapPin, AlertTriangle } from 'lucide-react';

export function WeatherPage() {
  const [selectedFarmId, setSelectedFarmId] = useState('');

  const { data: farmsData } = useQuery({
    queryKey: ['farms'],
    queryFn: () => api.getFarms(),
  });

  const farms = farmsData?.data || [];
  const activeFarmId = selectedFarmId || farms[0]?.id;

  const { data: weatherData, isLoading } = useQuery({
    queryKey: ['weather', activeFarmId],
    queryFn: () => api.getCurrentWeather({ farmId: activeFarmId }),
  });

  if (isLoading) {
    return <LoadingSpinner text="Retrieving live agro-meteorological data..." />;
  }

  const weather = weatherData?.data || {};
  const alerts = weather.agriculturalAlerts || [];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader
          title="Agro-Meteorological Advisory"
          subtitle="Real-time temperature, precipitation probability, and actionable extreme weather alerts"
        />

        {farms.length > 0 && (
          <div className="flex items-center gap-2 bg-white px-3 py-2 rounded-xl border border-gray-200 text-xs flex-shrink-0">
            <MapPin className="w-4 h-4 text-agri-green" />
            <select
              value={activeFarmId}
              onChange={(e) => setSelectedFarmId(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-gray-800 focus:outline-none cursor-pointer"
            >
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.farm_name} ({f.district}, {f.state})
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Meteorological Dashboard */}
      <WeatherOverview weatherData={weather} />

      {/* Active Agricultural Risk Alerts */}
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          Active Farm Interventions & Weather Contingency
        </h3>

        {alerts.length > 0 ? (
          <div className="space-y-3">
            {alerts.map((alert, idx) => (
              <WeatherAlertCard key={idx} alert={alert} />
            ))}
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 text-center text-emerald-950 text-xs">
            <p className="font-bold text-sm text-emerald-900 mb-1">No Severe Weather Warnings Active</p>
            <p className="opacity-90">Microclimatic and forecasted variables indicate safe conditions for sowing, fertigation, and harvesting operations.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default WeatherPage;
