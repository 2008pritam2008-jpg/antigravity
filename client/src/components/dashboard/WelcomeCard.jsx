// client/src/components/dashboard/WelcomeCard.jsx
import React from 'react';
import { Sparkles, Calendar } from 'lucide-react';

export function WelcomeCard({ farmerName, state, district }) {
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-agri-green text-white p-6 sm:p-8 rounded-2xl shadow-md relative overflow-hidden">
      <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none">
        <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-current">
          <path d="M45.7,-77.8C58.9,-71.3,69.1,-58.8,76.5,-44.7C83.9,-30.5,88.4,-15.3,86.6,-0.9C84.8,13.4,76.6,26.8,68,39C59.4,51.1,50.3,61.9,38.8,69.5C27.2,77.2,13.6,81.7,-0.7,82.9C-15,84,-30,81.7,-42.6,74.5C-55.2,67.3,-65.4,55.1,-72.6,41.2C-79.8,27.3,-84,13.6,-83.4,0.3C-82.9,-13,-77.6,-25.9,-69.5,-37.4C-61.4,-48.9,-50.5,-59,-38.1,-65.8C-25.7,-72.6,-12.9,-76.1,1,-77.8C14.9,-79.6,29.8,-79.5,45.7,-77.8Z" transform="translate(100 100)" />
        </svg>
      </div>

      <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/15 text-agri-sand text-xs font-medium mb-3 backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            AI Precision Farming Assistant
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Namaste, {farmerName || 'Farmer'}!
          </h2>
          <p className="text-sm text-forest-100 mt-1 max-w-xl leading-relaxed">
            {district && state
              ? `Real-time agricultural intelligence configured for ${district}, ${state}.`
              : 'Empowering your farm with multimodal pathology, soil analytics, and dynamic crop scheduling.'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-forest-200 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm self-start sm:self-auto">
          <Calendar className="w-4 h-4 text-agri-yellow" />
          <span>{today}</span>
        </div>
      </div>
    </div>
  );
}
