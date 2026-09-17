import React from 'react';
import { useLanguage } from '../context/LanguageContext';

interface RiskBadgeProps {
  tier: 'High' | 'Medium' | 'Low' | string;
  probability?: number;
  showProb?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const RiskBadge: React.FC<RiskBadgeProps> = ({
  tier,
  probability,
  showProb = false,
  size = 'md'
}) => {
  const { t } = useLanguage();
  const normalizedTier = tier?.toLowerCase() || 'low';

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-medium',
    lg: 'text-xs px-3 py-1.5 font-semibold'
  }[size];

  if (normalizedTier === 'high') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200 ${sizeClasses}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-rose-500"></span>
        {t('risk.high', 'High Risk')}
        {showProb && probability !== undefined && (
          <span className="font-mono text-rose-800 font-semibold ml-0.5">({(probability * 100).toFixed(1)}%)</span>
        )}
      </span>
    );
  }

  if (normalizedTier === 'medium') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 ${sizeClasses}`}>
        <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
        {t('risk.medium', 'Medium Risk')}
        {showProb && probability !== undefined && (
          <span className="font-mono text-amber-800 font-semibold ml-0.5">({(probability * 100).toFixed(1)}%)</span>
        )}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 ${sizeClasses}`}>
      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
      {t('risk.low', 'Low Risk / On Track')}
      {showProb && probability !== undefined && (
        <span className="font-mono text-emerald-800 font-semibold ml-0.5">({(probability * 100).toFixed(1)}%)</span>
      )}
    </span>
  );
};
