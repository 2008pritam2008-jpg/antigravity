// client/src/components/common/MetricBadge.jsx
import React from 'react';

export function MetricBadge({ label, value, unit, status = 'default' }) {
  const statusStyles = {
    default: 'bg-gray-100 text-gray-800 border-gray-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-50 text-amber-800 border-amber-200',
    danger: 'bg-rose-50 text-rose-800 border-rose-200',
    info: 'bg-sky-50 text-sky-800 border-sky-200',
  };

  return (
    <div className={`px-3 py-2 rounded-lg border flex flex-col ${statusStyles[status] || statusStyles.default}`}>
      <span className="text-xs font-medium uppercase tracking-wider opacity-75">{label}</span>
      <span className="text-lg font-bold">
        {value ?? '—'} {unit && <span className="text-xs font-normal opacity-80">{unit}</span>}
      </span>
    </div>
  );
}
