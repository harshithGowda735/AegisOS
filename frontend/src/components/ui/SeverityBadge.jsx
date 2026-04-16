import React from 'react';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

const SeverityBadge = ({ severity, className = '' }) => {
  const configs = {
    High: {
      bg: 'bg-rose-50',
      text: 'text-rose-600',
      border: 'border-rose-100',
      icon: AlertCircle,
      label: 'Critical Priority'
    },
    Moderate: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      icon: AlertTriangle,
      label: 'Moderate Priority'
    },
    Low: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      icon: Info,
      label: 'Standard Priority'
    }
  };

  const config = configs[severity] || configs.Moderate;
  const Icon = config.icon;

  return (
    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${config.bg} ${config.text} ${config.border} font-black text-[10px] uppercase tracking-wider shadow-sm ${className}`}>
      <Icon className="w-3.5 h-3.5" />
      {config.label}
    </div>
  );
};

export default SeverityBadge;
