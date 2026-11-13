// client/src/pages/public/AboutPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Sprout, ArrowLeft, Award, Users, BookOpen } from 'lucide-react';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-agri-bg py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <Link to="/" className="inline-flex items-center gap-2 text-xs font-semibold text-agri-green hover:underline">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="bg-white rounded-2xl border border-gray-200 p-8 shadow-sm space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-900 text-agri-leaf flex items-center justify-center">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">About AgriAssist AI</h1>
              <p className="text-xs text-gray-500">Bridging agronomic science and machine intelligence</p>
            </div>
          </div>

          <div className="prose prose-sm text-gray-600 leading-relaxed space-y-4">
            <p>
              AgriAssist AI is an intelligent agricultural advisory assistant engineered to empower smallholder farmers, farming cooperatives, agronomists, and agricultural students with instant, hyper-localized agronomic guidance.
            </p>
            <p>
              Developed under strict agronomic frameworks guided by the Indian Council of Agricultural Research (ICAR), State Agricultural Universities (SAUs), and the Food and Agriculture Organization (FAO), our platform converts complex soil chemistry, meteorological alerts, and crop symptoms into actionable field interventions.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 not-prose">
              <div className="p-4 rounded-xl bg-forest-50 border border-forest-100">
                <Award className="w-6 h-6 text-agri-green mb-2" />
                <h4 className="font-bold text-gray-900 text-sm">Agronomic Integrity</h4>
                <p className="text-xs text-gray-600 mt-1">Grounded in verified packages of practices; avoids unverified chemicals.</p>
              </div>

              <div className="p-4 rounded-xl bg-forest-50 border border-forest-100">
                <Users className="w-6 h-6 text-agri-green mb-2" />
                <h4 className="font-bold text-gray-900 text-sm">Farmer-First Accessibility</h4>
                <p className="text-xs text-gray-600 mt-1">Multi-language support with simple, vernacular explanation.</p>
              </div>

              <div className="p-4 rounded-xl bg-forest-50 border border-forest-100">
                <BookOpen className="w-6 h-6 text-agri-green mb-2" />
                <h4 className="font-bold text-gray-900 text-sm">Continuous Learning</h4>
                <p className="text-xs text-gray-600 mt-1">Dynamic integration with real-time weather and seasonal crop timelines.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AboutPage;
