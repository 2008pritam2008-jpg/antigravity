// client/src/components/crops/CropRecommendationCard.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, AlertTriangle, ShieldAlert, ArrowRight, Droplets, Clock, Calendar } from 'lucide-react';

export function CropRecommendationCard({ recommendation, farmId }) {
  const navigate = useNavigate();

  const suitabilityBadge = {
    high: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    moderate: 'bg-amber-100 text-amber-800 border-amber-200',
    low: 'bg-rose-100 text-rose-800 border-rose-200',
    insufficient_data: 'bg-gray-100 text-gray-800 border-gray-200',
  }[recommendation.suitability_level] || 'bg-emerald-100 text-emerald-800 border-emerald-200';

  const handleCreatePlan = () => {
    navigate('/cultivation-plans/new', {
      state: {
        cropName: recommendation.crop_name,
        farmId,
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-agri-leaf">
              {recommendation.category}
            </span>
            <h3 className="text-xl font-bold text-gray-900 mt-0.5">{recommendation.crop_name}</h3>
          </div>

          <div className="flex flex-col items-end">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold border capitalize ${suitabilityBadge}`}>
              {recommendation.suitability_level} Suitability
            </span>
            <span className="text-[11px] text-gray-400 mt-1">
              Score: <strong>{recommendation.suitability_score}/100</strong>*
            </span>
          </div>
        </div>

        <p className="text-sm text-gray-600 leading-relaxed mb-4">{recommendation.reasoning}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 py-3 border-y border-gray-100 text-xs mb-4">
          <div className="flex items-center gap-2 text-gray-700">
            <Droplets className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span className="truncate">{recommendation.water_requirement}</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="w-4 h-4 text-indigo-500 flex-shrink-0" />
            <span>{recommendation.growth_duration_days} Days to Harvest</span>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Calendar className="w-4 h-4 text-amber-500 flex-shrink-0" />
            <span className="truncate">{recommendation.sowing_window}</span>
          </div>
        </div>

        {/* Agronomic Details */}
        <div className="space-y-2.5 text-xs">
          <div>
            <span className="font-semibold text-gray-800">Soil Compatibility:</span>
            <p className="text-gray-600 mt-0.5">{recommendation.soil_compatibility}</p>
          </div>

          {recommendation.nutrient_considerations?.length > 0 && (
            <div>
              <span className="font-semibold text-gray-800">Nutrient Considerations:</span>
              <ul className="list-disc pl-4 text-gray-600 mt-0.5 space-y-0.5">
                {recommendation.nutrient_considerations.map((n, idx) => (
                  <li key={idx}>{n}</li>
                ))}
              </ul>
            </div>
          )}

          {recommendation.risks?.length > 0 && (
            <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 mt-2">
              <div className="flex items-center gap-1.5 font-semibold text-amber-800 mb-0.5">
                <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Identified Environmental & Pest Risks:</span>
              </div>
              <ul className="list-disc pl-4 space-y-0.5 text-[11px] opacity-90">
                {recommendation.risks.map((r, idx) => (
                  <li key={idx}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
        <span className="text-[10px] text-gray-400 italic">*AI indicative assessment</span>
        <button
          onClick={handleCreatePlan}
          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-forest-900 hover:bg-forest-950 text-white font-medium text-xs transition shadow-sm"
        >
          <span>Generate Cultivation Plan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}

