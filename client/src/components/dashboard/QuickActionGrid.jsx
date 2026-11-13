// client/src/components/dashboard/QuickActionGrid.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ScanLine, FlaskConical, Droplets, CalendarCheck2, BotMessageSquare } from 'lucide-react';

export function QuickActionGrid() {
  const actions = [
    {
      to: '/crop-recommendation',
      title: 'Recommend Crops',
      desc: 'Soil & climate matching for upcoming season',
      icon: Sparkles,
      color: 'bg-emerald-500 text-white',
      border: 'hover:border-emerald-500',
    },
    {
      to: '/disease-detection',
      title: 'Scan Plant Disease',
      desc: 'Multimodal leaf diagnosis & IPM remedies',
      icon: ScanLine,
      color: 'bg-rose-500 text-white',
      border: 'hover:border-rose-500',
    },
    {
      to: '/soil-analysis',
      title: 'Analyze Soil Health',
      desc: 'pH & NPK fertility interpretation',
      icon: FlaskConical,
      color: 'bg-amber-500 text-white',
      border: 'hover:border-amber-500',
    },
    {
      to: '/fertilizer-advisor',
      title: 'Fertilizer Advisory',
      desc: 'Stage-by-stage 4R nutrient schedule',
      icon: Droplets,
      color: 'bg-blue-500 text-white',
      border: 'hover:border-blue-500',
    },
    {
      to: '/cultivation-plans/new',
      title: 'Create Crop Plan',
      desc: 'Sowing to harvest operational timeline',
      icon: CalendarCheck2,
      color: 'bg-indigo-500 text-white',
      border: 'hover:border-indigo-500',
    },
    {
      to: '/ai-assistant',
      title: 'Ask AI Assistant',
      desc: 'Natural language agricultural Q&A',
      icon: BotMessageSquare,
      color: 'bg-forest-900 text-agri-leaf',
      border: 'hover:border-forest-900',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {actions.map((act) => {
        const Icon = act.icon;
        return (
          <Link
            key={act.to}
            to={act.to}
            className={`bg-white p-5 rounded-2xl border border-gray-200 shadow-sm transition hover:shadow-md flex items-start gap-4 ${act.border}`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm ${act.color}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-gray-900 text-sm">{act.title}</h4>
              <p className="text-xs text-gray-500 mt-1 leading-relaxed">{act.desc}</p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
