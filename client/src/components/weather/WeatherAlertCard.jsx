// client/src/components/weather/WeatherAlertCard.jsx
import React from 'react';
import { AlertTriangle, ShieldAlert, CheckCircle2 } from 'lucide-react';

export function WeatherAlertCard({ alert }) {
  const severityStyles = {
    critical: 'bg-rose-50 border-rose-300 text-rose-950',
    high: 'bg-amber-50 border-amber-300 text-amber-950',
    moderate: 'bg-yellow-50 border-yellow-300 text-yellow-950',
    low: 'bg-blue-50 border-blue-200 text-blue-950',
  }[alert.severity] || 'bg-amber-50 border-amber-300 text-amber-950';

  return (
    <div className={`p-4 rounded-xl border shadow-sm flex items-start gap-3 ${severityStyles}`}>
      <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
      <div className="flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <h4 className="font-bold text-sm">{alert.title}</h4>
          <span className="text-[10px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-white/70 border border-current">
            {alert.severity} Risk
          </span>
        </div>
        <p className="text-xs leading-relaxed opacity-90">{alert.description}</p>
        {alert.action && (
          <div className="mt-2.5 pt-2 border-t border-current/20 flex items-start gap-1.5 text-xs font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
            <span>Recommended Intervention: {alert.action}</span>
          </div>
        )}
      </div>
    </div>
  );
}

