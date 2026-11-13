// client/src/pages/public/TermsPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookCheck } from 'lucide-react';

export function TermsPage() {
  return (
    <div className="min-h-screen bg-agri-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-agri-green hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-900 text-agri-leaf flex items-center justify-center">
              <BookCheck className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Terms of Agricultural Service & Disclaimer</h1>
              <p className="text-xs text-gray-500">Effective: November 2026</p>
            </div>
          </div>

          <div className="prose prose-sm text-gray-600 leading-relaxed space-y-4">
            <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
              <strong className="block font-bold mb-1">Mandatory Agronomic Disclaimer:</strong>
              AgriAssist AI is an artificial intelligence-powered agricultural decision-support tool. Recommendations for crop varieties, fertilizer dosages, pest management, and cultivation schedules are indicative estimates based on user-provided inputs and public agricultural data. They do not constitute guaranteed yields, insured revenues, or replacements for certified agronomic inspection.
            </div>

            <h3 className="font-bold text-gray-900 text-sm">1. Use of Chemical Pest Controls</h3>
            <p>
              Users must exercise professional care when handling synthetic chemical fertilizers or agro-chemicals. Always inspect local manufacturer labels, pre-harvest intervals (PHI), and safety datasheets, and consult your local agricultural extension officer prior to field application.
            </p>

            <h3 className="font-bold text-gray-900 text-sm">2. Weather & Environmental Data</h3>
            <p>
              Weather observations and forecasts are sourced from third-party meteorological services. Microclimatic variations may occur; farmers should monitor actual field conditions before executing sensitive sowing or spraying operations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TermsPage;
