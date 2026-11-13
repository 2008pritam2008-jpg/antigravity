// client/src/components/cultivation/CultivationTimeline.jsx
import React from 'react';
import { CheckCircle2, Circle, Clock, Droplets, AlertTriangle, Calendar, Sparkles } from 'lucide-react';

export function CultivationTimeline({ plan, onToggleTask }) {
  if (!plan) return null;

  const planData = plan.plan_data || {};
  const stages = planData.stages || [];
  const tasks = plan.tasks || [];

  return (
    <div className="space-y-6">
      {/* Header Summary */}
      <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-agri-leaf">
              Active Production Plan
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mt-0.5">
              {plan.crop_name} Cultivation Timeline
            </h2>
            <p className="text-xs text-gray-500 mt-1">
              Plot Area: {plan.land_area} {plan.area_unit} · Sowing Date: {plan.sowing_date} · Expected Harvest: {plan.expected_harvest_date || 'Calculated'}
            </p>
          </div>

          <div className="bg-forest-50 border border-forest-100 p-3 rounded-xl flex items-center gap-3">
            <Clock className="w-5 h-5 text-agri-green" />
            <div>
              <span className="text-xs text-forest-800 font-semibold block">Total Crop Cycle</span>
              <span className="text-base font-extrabold text-forest-900">{planData.expected_duration_days || 120} Days</span>
            </div>
          </div>
        </div>

        {planData.plan_summary && (
          <p className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-100 leading-relaxed">
            {planData.plan_summary}
          </p>
        )}
      </div>

      {/* Stepper Timeline */}
      <div className="space-y-4">
        {stages.map((stage, idx) => (
          <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-sm relative overflow-hidden">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-full bg-forest-900 text-white flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {idx + 1}
                </span>
                <div>
                  <h4 className="font-bold text-gray-900 text-sm sm:text-base">{stage.stage_name}</h4>
                  <span className="text-xs text-gray-500">
                    Day {stage.day_from_sowing} to {stage.day_from_sowing + stage.duration_days} ({stage.duration_days} days)
                  </span>
                </div>
              </div>

              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-700">
                Phase {idx + 1} of {stages.length}
              </span>
            </div>

            <p className="text-xs text-gray-600 mt-2 leading-relaxed">{stage.description}</p>

            {/* Activities Checklist */}
            {stage.activities?.length > 0 && (
              <div className="mt-3.5 pt-3 border-t border-gray-100">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500 block mb-2">
                  Key Operational Tasks
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {stage.activities.map((act, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-gray-700 bg-gray-50 p-2 rounded-lg">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span className="leading-tight">{act}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Irrigation & Nutrient Guidance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3 text-xs">
              {stage.irrigation_guidance && (
                <div className="p-2.5 rounded-xl bg-blue-50/70 border border-blue-100 text-blue-950 flex items-start gap-2">
                  <Droplets className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[11px] block">Water Management:</span>
                    <p className="text-[11px] leading-tight opacity-90 mt-0.5">{stage.irrigation_guidance}</p>
                  </div>
                </div>
              )}

              {stage.nutrient_guidance && (
                <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-950 flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-[11px] block">Fertilizer Application:</span>
                    <p className="text-[11px] leading-tight opacity-90 mt-0.5">{stage.nutrient_guidance}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Risk Warnings */}
            {stage.risk_factors?.length > 0 && (
              <div className="mt-3 p-2.5 rounded-xl bg-amber-50/60 border border-amber-200/60 text-amber-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-[11px] leading-tight">
                  <strong>Critical Watchout:</strong> {stage.risk_factors.join('; ')}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default CultivationTimeline;


