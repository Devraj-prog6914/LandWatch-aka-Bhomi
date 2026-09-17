import React from 'react';
import { WaterfallStep } from '../types';
import { TrendingUp, TrendingDown, Scale } from 'lucide-react';

interface ShapWaterfallProps {
  steps: WaterfallStep[];
  baselineRisk?: number;
  finalRisk?: number;
}

export const ShapWaterfall: React.FC<ShapWaterfallProps> = ({
  steps,
  baselineRisk = 0.42,
  finalRisk = 0.88
}) => {
  if (!steps || steps.length === 0) {
    return <div className="text-xs text-slate-500 italic p-4">No risk driver data computed.</div>;
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span>Statutory Factor Analysis: Risk Driver Breakdown</span>
            <span className="text-[10px] bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded border border-slate-200">
              Factor Decomposition
            </span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Stepwise decomposition showing how statutory, legal, and operational factors drive project delay risk above national baseline.
          </p>
        </div>
        <div className="text-right">
          <div className="text-xs text-slate-500">Calculated Delay Risk</div>
          <div className="font-mono text-lg font-bold text-slate-900">
            {(finalRisk * 100).toFixed(1)}%
          </div>
        </div>
      </div>

      <div className="space-y-2.5 pt-1">
        {steps.map((step, idx) => {
          const isBaseline = step.type === 'baseline';
          const isTotal = step.type === 'total';
          const isIncrease = step.type === 'risk_increase';
          const isDecrease = step.type === 'risk_decrease';

          let barColor = 'bg-slate-400';
          let textColor = 'text-slate-700';
          let Icon = Scale;

          if (isIncrease) {
            barColor = 'bg-rose-500';
            textColor = 'text-rose-700';
            Icon = TrendingUp;
          } else if (isDecrease) {
            barColor = 'bg-emerald-500';
            textColor = 'text-emerald-700';
            Icon = TrendingDown;
          } else if (isTotal) {
            barColor = 'bg-slate-800';
            textColor = 'text-slate-900 font-bold';
          } else if (isBaseline) {
            barColor = 'bg-slate-400';
            textColor = 'text-slate-600';
          }

          const widthPct = Math.min(100, Math.max(8, Math.abs(step.delta) * 120));

          return (
            <div key={idx} className="flex items-center gap-3 text-xs">
              <div className="w-56 shrink-0 truncate font-medium text-slate-700 flex items-center gap-1.5" title={step.step}>
                <Icon className={`h-3.5 w-3.5 shrink-0 ${textColor}`} />
                <span className="truncate">{step.step}</span>
              </div>

              {/* Graphical Bar */}
              <div className="flex-1 bg-slate-100 h-4 rounded-full overflow-hidden relative flex items-center px-1">
                <div
                  className={`h-2.5 rounded-full ${barColor} transition-all duration-500`}
                  style={{ width: `${widthPct}%` }}
                ></div>
              </div>

              {/* Delta Value */}
              <div className={`w-20 text-right font-mono font-semibold ${textColor}`}>
                {isBaseline || isTotal ? (
                  <span>{(step.final_value * 100).toFixed(1)}%</span>
                ) : (
                  <span>
                    {step.delta > 0 ? `+${(step.delta * 100).toFixed(1)}%` : `${(step.delta * 100).toFixed(1)}%`}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="border-t border-slate-100 pt-3 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-rose-500 inline-block"></span>
            Delay Escalators (+ Risk)
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block"></span>
            Mitigating Buffers (- Risk)
          </span>
        </div>
        <span className="italic">Calibrated against RFCTLARR Act 2013 statutory timelines</span>
      </div>
    </div>
  );
};
