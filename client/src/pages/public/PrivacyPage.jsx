// client/src/pages/public/PrivacyPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Shield } from 'lucide-react';

export function PrivacyPage() {
  return (
    <div className="min-h-screen bg-agri-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-agri-green hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-900 text-agri-leaf flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Privacy & Data Governance Policy</h1>
              <p className="text-xs text-gray-500">Last updated: November 2026</p>
            </div>
          </div>

          <div className="prose prose-sm text-gray-600 leading-relaxed space-y-4">
            <p>
              Your agricultural land details, soil measurements, and plant pathology images are personal farmer records. AgriAssist AI enforces strict Row Level Security (RLS) within our PostgreSQL database to ensure that only you can view and modify your farm records.
            </p>
            <h3 className="font-bold text-gray-900 text-sm">1. Information We Collect</h3>
            <p>
              We collect farmer profile details (name, preferred language, state, district), plot coordinates (for weather data ingestion), soil test measurements, and uploaded plant photographs for visual diagnosis.
            </p>
            <h3 className="font-bold text-gray-900 text-sm">2. AI Inference & Storage</h3>
            <p>
              Uploaded leaf photographs and field descriptions are transmitted securely to Google Gemini models via backend servers solely for real-time pathology and crop advisory generation. We do not use your private farm data for unauthorized model training.
            </p>
            <h3 className="font-bold text-gray-900 text-sm">3. Data Deletion</h3>
            <p>
              You maintain full ownership of your data. You may delete any farm plot, advisory history record, or your entire farmer account at any time directly through the platform.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PrivacyPage;
