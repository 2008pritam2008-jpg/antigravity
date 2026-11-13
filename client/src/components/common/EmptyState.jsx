// client/src/components/common/EmptyState.jsx
import React from 'react';
import { Sprout } from 'lucide-react';

export function EmptyState({ icon: Icon, title, description, actionText, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center p-12 bg-white rounded-2xl border border-dashed border-gray-200">
      <div className="w-16 h-16 rounded-full bg-green-50 text-green-700 flex items-center justify-center mb-4">
        {Icon ? <Icon className="w-8 h-8" /> : <Sprout className="w-8 h-8" />}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
      <p className="text-sm text-gray-500 max-w-md mb-6">{description}</p>
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="px-5 py-2.5 bg-green-700 hover:bg-green-800 text-white font-medium rounded-xl text-sm transition shadow-sm"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
