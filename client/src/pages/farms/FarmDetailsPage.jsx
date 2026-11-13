// client/src/pages/farms/FarmDetailsPage.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/endpoints.js';
import { PageHeader } from '../../components/common/PageHeader.jsx';
import { MetricBadge } from '../../components/common/MetricBadge.jsx';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.jsx';
import { ArrowLeft, MapPin, Droplets, Layers, Sparkles, CalendarCheck2 } from 'lucide-react';

export function FarmDetailsPage() {
  const { farmId } = useParams();

  const { data, isLoading } = useQuery({
    queryKey: ['farm', farmId],
    queryFn: () => api.getFarmById(farmId),
  });

  const { data: weatherData } = useQuery({
    queryKey: ['weather', farmId],
    queryFn: () => api.getCurrentWeather({ farmId }),
  });

  if (isLoading) {
    return <LoadingSpinner text="Retrieving farm parameters..." />;
  }

  const farm = data?.data;
  if (!farm) {
    return <div className="p-8 text-center text-gray-500">Farm plot not found.</div>;
  }

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div>
        <Link to="/farms" className="inline-flex items-center gap-1.5 text-xs font-semibold text-agri-green hover:underline mb-2">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Plots
        </Link>
        <PageHeader
          title={farm.farm_name}
          subtitle={`${farm.district}, ${farm.state}${farm.village ? ` (Village: ${farm.village})` : ''}`}
        />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <MetricBadge label="Land Area" value={farm.land_area} unit={farm.area_unit} status="info" />
        <MetricBadge label="Soil Taxonomy" value={farm.soil_type || 'Loam'} status="default" />
        <MetricBadge label="Soil pH" value={farm.soil_ph ?? '7.0'} status="success" />
        <MetricBadge label="Irrigation" value={farm.irrigation_type?.replace('_', ' ')} status="warning" />
      </div>

      {/* Soil Fertility Baseline Card */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <h3 className="font-bold text-gray-900 text-sm mb-4 flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-600" />
          Recorded Soil Chemical Baseline (NPK & Carbon)
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-[11px] text-gray-500 font-semibold uppercase">Nitrogen (N)</span>
            <p className="text-xl font-extrabold text-gray-900 mt-0.5">{farm.nitrogen ?? '—'} <span className="text-xs font-normal">kg/ha</span></p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-[11px] text-gray-500 font-semibold uppercase">Phosphorus (P)</span>
            <p className="text-xl font-extrabold text-gray-900 mt-0.5">{farm.phosphorus ?? '—'} <span className="text-xs font-normal">kg/ha</span></p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-[11px] text-gray-500 font-semibold uppercase">Potassium (K)</span>
            <p className="text-xl font-extrabold text-gray-900 mt-0.5">{farm.potassium ?? '—'} <span className="text-xs font-normal">kg/ha</span></p>
          </div>
          <div className="p-3 bg-gray-50 rounded-xl">
            <span className="text-[11px] text-gray-500 font-semibold uppercase">Organic Carbon</span>
            <p className="text-xl font-extrabold text-gray-900 mt-0.5">{farm.organic_carbon ?? '—'} <span className="text-xs font-normal">%</span></p>
          </div>
        </div>
      </div>

      {/* Action shortcuts linked to this farm */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/crop-recommendation"
          state={{ farmId: farm.id }}
          className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-emerald-500 shadow-sm transition flex items-center justify-between"
        >
          <div>
            <span className="font-bold text-sm text-gray-900 block">Generate Crop Advisory</span>
            <span className="text-xs text-gray-500 mt-0.5 block">Evaluate suitable crops for this specific plot</span>
          </div>
          <Sparkles className="w-5 h-5 text-emerald-600" />
        </Link>

        <Link
          to="/cultivation-plans/new"
          state={{ farmId: farm.id }}
          className="p-5 rounded-2xl bg-white border border-gray-200 hover:border-indigo-500 shadow-sm transition flex items-center justify-between"
        >
          <div>
            <span className="font-bold text-sm text-gray-900 block">Establish Cultivation Timeline</span>
            <span className="text-xs text-gray-500 mt-0.5 block">Create full production timeline for this acreage</span>
          </div>
          <CalendarCheck2 className="w-5 h-5 text-indigo-600" />
        </Link>
      </div>
    </div>
  );
}

export default FarmDetailsPage;
