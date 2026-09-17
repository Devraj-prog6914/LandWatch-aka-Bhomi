import React from 'react';
import { LifecycleMilestone } from '../types';
import { CheckCircle2, Clock, AlertCircle } from 'lucide-react';

interface PredictiveGanttProps {
  milestones: LifecycleMilestone[];
  predictedDelayMonths: number;
}

export const PredictiveGantt: React.FC<PredictiveGanttProps> = ({
  milestones,
  predictedDelayMonths
}) => {
  if (!milestones || milestones.length === 0) {
    return <div className="text-xs text-slate-500 italic p-4">No lifecycle milestones loaded.</div>;
  }

  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div>
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <span>Statutory Lifecycle & Milestone Slippage Timeline</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            RFCTLARR statutory stages comparing gazetted baseline vs statutory projected milestone completion.
          </p>
        </div>
        {predictedDelayMonths > 0 ? (
          <div className="px-2.5 py-1 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono font-medium flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            +{(predictedDelayMonths * 30)} Days Projected Slippage (~{predictedDelayMonths} mos)
          </div>
        ) : (
          <div className="px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-medium flex items-center gap-1.5">
            <CheckCircle2 className="h-3.5 w-3.5" />
            Zero Projected Slippage (On Schedule)
          </div>
        )}
      </div>

      <div className="space-y-2.5 pt-1">
        {milestones.map((m, idx) => {
          const isCompleted = m.status === 'Completed';
          const isInProgress = m.status === 'In Progress';
          const hasSlippage = m.delay_variance_days > 0;

          return (
            <div
              key={idx}
              className={`p-3 rounded-xl border transition-all ${
                isInProgress
                  ? 'bg-amber-50/50 border-amber-200'
                  : isCompleted
                  ? 'bg-slate-50 border-slate-200'
                  : 'bg-white border-slate-100'
              }`}
            >
              <div className="flex items-center justify-between text-xs mb-2">
                <div className="flex items-center gap-2 font-medium text-slate-800">
                  {isCompleted && <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                  {isInProgress && <Clock className="h-4 w-4 text-amber-600" />}
                  {!isCompleted && !isInProgress && (
                    <div className="h-4 w-4 rounded-full border border-slate-300 flex items-center justify-center text-[9px] font-mono text-slate-400">
                      {idx + 1}
                    </div>
                  )}
                  <span>{m.stage_name}</span>
                </div>
                <div>
                  <span
                    className={`text-[10px] font-medium px-2 py-0.5 rounded ${
                      isCompleted
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : isInProgress
                        ? 'bg-amber-50 text-amber-700 border border-amber-200'
                        : 'bg-slate-100 text-slate-500 border border-slate-200'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>
              </div>

              {/* Date Comparison Bar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono">
                <div className="bg-white px-2.5 py-1 rounded border border-slate-100 text-slate-500 flex justify-between">
                  <span>Scheduled Date:</span>
                  <span className="text-slate-800 font-medium">{m.scheduled_date}</span>
                </div>
                <div
                  className={`px-2.5 py-1 rounded flex justify-between ${
                    hasSlippage
                      ? 'bg-rose-50 text-rose-700 border border-rose-200'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  }`}
                >
                  <span>Projected Date:</span>
                  <span className="font-semibold">{m.projected_date} {hasSlippage && `(+${m.delay_variance_days}d)`}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
