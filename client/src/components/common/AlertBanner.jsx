// client/src/components/common/AlertBanner.jsx
import React from 'react';
import { AlertTriangle, AlertCircle, Info, CheckCircle2, X } from 'lucide-react';

export function AlertBanner({ type = 'warning', title, message, actionText, onAction, onClose, onDismiss }) {
  const handleClose = onClose || onDismiss;

  const styles = {
    warning: {
      container: 'bg-amber-50 border-amber-300 text-amber-900',
      icon: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
      btn: 'bg-amber-600 hover:bg-amber-700 text-white',
    },
    danger: {
      container: 'bg-rose-50 border-rose-300 text-rose-900',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
      btn: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
    error: {
      container: 'bg-rose-50 border-rose-300 text-rose-900',
      icon: <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
      btn: 'bg-rose-600 hover:bg-rose-700 text-white',
    },
    info: {
      container: 'bg-blue-50 border-blue-300 text-blue-900',
      icon: <Info className="w-5 h-5 text-blue-600 flex-shrink-0" />,
      btn: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    success: {
      container: 'bg-emerald-50 border-emerald-300 text-emerald-900',
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
      btn: 'bg-emerald-600 hover:bg-emerald-700 text-white',
    },
  };

  const current = styles[type] || styles.warning;

  return (
    <div className={`p-4 rounded-xl border flex items-start gap-3 shadow-sm ${current.container}`}>
      {current.icon}
      <div className="flex-1 min-w-0">
        {title && <h4 className="font-semibold text-sm mb-0.5">{title}</h4>}
        <div className="text-sm leading-relaxed">{message}</div>
        {actionText && onAction && (
          <button
            onClick={onAction}
            className={`mt-2 px-3 py-1 rounded-md text-xs font-medium transition ${current.btn}`}
          >
            {actionText}
          </button>
        )}
      </div>
      {handleClose && (
        <button
          onClick={handleClose}
          className="text-gray-400 hover:text-gray-600 transition flex-shrink-0 p-1"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

export default AlertBanner;
