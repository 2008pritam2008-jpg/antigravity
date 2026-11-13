// client/src/components/disease/DiseaseAnalysisResult.jsx
import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2, ShieldCheck, Sprout, AlertCircle } from 'lucide-react';

export function DiseaseAnalysisResult({ result }) {
  if (!result) return null;

  const conditions = result.possible_conditions || [];
  const actions = result.recommended_actions || [];
  const preventions = result.preventive_measures || [];

  const likelihoodBadge = {
    high: 'bg-rose-100 text-rose-800 border-rose-200',
    moderate: 'bg-amber-100 text-amber-800 border-amber-200',
    low: 'bg-blue-100 text-blue-800 border-blue-200',
    inconclusive: 'bg-gray-100 text-gray-800 border-gray-200',
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="border-b border-gray-100 pb-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-agri-leaf">
          Pathology Inspection Report
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mt-0.5">
          Diagnosis for {result.crop_name}
        </h2>
        <p className="text-sm text-gray-600 mt-1 leading-relaxed">{result.analysis_summary}</p>
      </div>

      {/* Identified Conditions List */}
      <div>
        <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600" />
          Probable Pathological / Entomological Causes
        </h4>

        <div className="space-y-3">
          {conditions.map((cond, idx) => (
            <div key={idx} className="p-4 rounded-xl border border-gray-200 bg-gray-50/60">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-base text-gray-900">{cond.name}</span>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-white border border-gray-200 text-gray-600 capitalize">
                    {cond.category}
                  </span>
                </div>
                <span className={`self-start sm:self-auto px-2.5 py-0.5 rounded-full text-xs font-bold border capitalize ${likelihoodBadge[cond.likelihood] || likelihoodBadge.moderate}`}>
                  {cond.likelihood} Likelihood
                </span>
              </div>

              {cond.visible_evidence?.length > 0 && (
                <div className="text-xs text-gray-600 mt-2">
                  <span className="font-semibold text-gray-800">Visual Evidence:</span>
                  <ul className="list-disc pl-4 mt-0.5 space-y-0.5">
                    {cond.visible_evidence.map((ev, i) => (
                      <li key={i}>{ev}</li>
                    ))}
                  </ul>
                </div>
              )}

              {cond.alternative_explanations?.length > 0 && (
                <div className="text-xs text-gray-500 mt-2">
                  <span className="font-medium text-gray-700">Differential / Alternative Explanations:</span>
                  <p className="mt-0.5 italic">{cond.alternative_explanations.join(', ')}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Remediation & Integrated Pest Management (IPM) */}
      {actions.length > 0 && (
        <div>
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Recommended Integrated Management Actions (IPM)
          </h4>
          <div className="grid grid-cols-1 gap-2.5">
            {actions.map((act, idx) => (
              <div key={idx} className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 flex items-start gap-3">
                <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider mt-0.5 ${
                  act.priority === 'high' ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {act.priority}
                </div>
                <div className="flex-1 text-xs">
                  <p className="font-medium text-gray-900">{act.action}</p>
                  <span className="text-[11px] text-emerald-800 font-semibold uppercase mt-0.5 inline-block">
                    Method: {act.type?.replace('_', ' ')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Long-term Preventive Measures */}
      {preventions.length > 0 && (
        <div className="p-4 rounded-xl bg-gray-50 border border-gray-200">
          <h5 className="text-xs font-bold text-gray-800 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Sprout className="w-4 h-4 text-forest-900" />
            Proactive Agronomic Sanitation & Crop Hygiene
          </h5>
          <ul className="list-disc pl-5 space-y-1 text-xs text-gray-600">
            {preventions.map((p, idx) => (
              <li key={idx}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Mandatory Inspection Notice & Disclaimer */}
      <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
        <AlertCircle className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">Preliminary AI Assessment Notice</p>
          <p className="text-[11px] opacity-90 mt-0.5 leading-relaxed">
            {result.disclaimer || 'Image-based crop identification is an indicative tool. Before applying synthetic chemical pesticides, consult your local Krishi Vigyan Kendra (KVK) or agricultural extension officer to verify target pathogens.'}
          </p>
        </div>
      </div>
    </div>
  );
}

