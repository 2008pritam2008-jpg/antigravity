// client/src/components/fertilizer/FertilizerResultCard.jsx
import React from 'react';
import { Droplets, ShieldCheck, AlertTriangle, Leaf, Calendar, CheckCircle2 } from 'lucide-react';

export function FertilizerResultCard({ advisory }) {
  if (!advisory) return null;

  const assessment = advisory.nutrient_assessment || [];
  const organic = advisory.organic_options || [];
  const timing = advisory.application_timing || [];
  const safety = advisory.safety_precautions || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="border-b border-gray-100 pb-4 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-agri-leaf">
            Nutrient Stewardship Plan
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
            Fertilizer Protocol: {advisory.crop}
          </h2>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{advisory.summary}</p>
        </div>

        <div className="bg-forest-50 border border-forest-100 px-3.5 py-2 rounded-xl text-left sm:text-right flex-shrink-0">
          <span className="text-xs text-forest-800 font-semibold block">Growth Stage</span>
          <span className="text-sm font-bold text-forest-900 capitalize">{advisory.growth_stage?.replace('_', ' ')}</span>
        </div>
      </div>

      {/* Nutrient Split Assessment */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <Droplets className="w-4 h-4 text-blue-500" />
          Primary Nutrient Allocation & Recommendations
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {assessment.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-bold text-gray-800 uppercase tracking-wider">{item.nutrient}</span>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{item.observation}</p>
              </div>
              <div className="mt-3 pt-2.5 border-t border-gray-200">
                <span className="text-[11px] font-semibold text-agri-green block">Recommended Application:</span>
                <p className="text-xs font-medium text-gray-900 mt-0.5">{item.recommendation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Organic & Bio-fertilizer Alternatives */}
      {organic.length > 0 && (
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
            <Leaf className="w-4 h-4 text-emerald-600" />
            Organic & Biological Nutrient Supplements
          </h4>
          <ul className="list-disc pl-5 space-y-1 text-xs leading-relaxed">
            {organic.map((o, idx) => (
              <li key={idx}>{o}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Timing and Safety Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {timing.length > 0 && (
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-agri-green" />
              Timing & Placement Guidelines
            </h5>
            <ul className="list-disc pl-4 space-y-1 text-xs text-gray-600">
              {timing.map((t, idx) => (
                <li key={idx}>{t}</li>
              ))}
            </ul>
          </div>
        )}

        {safety.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 text-amber-950">
            <h5 className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Safety & Environmental Protection
            </h5>
            <ul className="list-disc pl-4 space-y-1 text-xs text-amber-900/90">
              {safety.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Disclaimer */}
      <div className="text-[11px] text-gray-400 italic pt-2 border-t border-gray-100 flex items-start gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
        <span>{advisory.disclaimer || 'Nutrient management advice is educational. Always verify dosages with state agricultural university Package of Practices.'}</span>
      </div>
    </div>
  );
}

