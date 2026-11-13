// client/src/components/soil/SoilAnalysisResult.jsx
import React from 'react';
import { FlaskConical, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export function SoilAnalysisResult({ result, farmId }) {
  if (!result) return null;

  const assessment = result.soil_assessment || {};
  const nutrients = assessment.nutrient_observations || [];
  const suggestions = result.soil_improvement_suggestions || [];
  const crops = result.crop_suitability || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 pb-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-agri-leaf">
            Soil Health Assessment
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
            {assessment.soil_type || 'Agricultural Soil'} Analysis
          </h2>
          <p className="text-sm text-gray-600 mt-1 leading-relaxed">{result.summary}</p>
        </div>

        <div className="flex flex-col items-start sm:items-end bg-forest-50 p-3 rounded-xl border border-forest-100 flex-shrink-0">
          <span className="text-xs text-forest-800 font-semibold">pH Level Status</span>
          <span className="text-lg font-extrabold text-forest-900">{assessment.ph_level || 'Neutral (7.0)'}</span>
        </div>
      </div>

      {/* Nutrient Rating Table */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <FlaskConical className="w-4 h-4 text-agri-green" />
          Primary Macronutrient Observations
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {nutrients.map((n, idx) => (
            <div key={idx} className="p-3.5 rounded-xl border border-gray-200 bg-gray-50 flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold text-gray-500 uppercase">{n.nutrient}</span>
                <p className="text-base font-bold text-gray-900 mt-0.5">{n.reported_value || 'Not tested'}</p>
              </div>
              <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-200/60 leading-tight">
                {n.interpretation}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Soil Improvement Suggestions */}
      {suggestions.length > 0 && (
        <div className="p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-emerald-950">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Recommended Soil Improvement & Remediation Protocols
          </h4>
          <ul className="list-disc pl-5 space-y-1.5 text-xs leading-relaxed">
            {suggestions.map((s, idx) => (
              <li key={idx}>{s}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Crop Suitability & Next Steps */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {crops.length > 0 && (
          <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
            <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2">
              Naturally Compatible Crops
            </h5>
            <div className="flex flex-wrap gap-1.5">
              {crops.map((c, idx) => (
                <span key={idx} className="px-2.5 py-1 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700">
                  {c}
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 flex flex-col justify-between">
          <div>
            <h5 className="text-xs font-bold text-blue-900 uppercase tracking-wider mb-1">
              Ready for Crop Selection?
            </h5>
            <p className="text-xs text-blue-800 leading-relaxed">
              Use these verified soil parameters to receive seasonal, climate-matched crop variety recommendations.
            </p>
          </div>
          <Link
            to="/crop-recommendation"
            className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-blue-700 hover:text-blue-900"
          >
            <span>Proceed to Crop Advisory</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Scientific Disclaimer */}
      <div className="text-[11px] text-gray-400 italic pt-2 border-t border-gray-100 flex items-start gap-1.5">
        <ShieldCheck className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 mt-0.5" />
        <span>{result.disclaimer || 'Soil health interpretation is educational and preliminary. Always conduct periodic laboratory testing under government Soil Health Card schemes.'}</span>
      </div>
    </div>
  );
}

