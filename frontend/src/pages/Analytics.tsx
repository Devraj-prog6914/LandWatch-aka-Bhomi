import React, { useEffect, useState } from 'react';
import { BarChart3, MapPin } from 'lucide-react';
import { api } from '../services/api';
import { StateSlippageItem, SectorItem } from '../types';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from 'recharts';

export const Analytics: React.FC = () => {
  const [stateData, setStateData] = useState<StateSlippageItem[]>([]);
  const [sectorData, setSectorData] = useState<SectorItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [states, sectors] = await Promise.all([
          api.getStateSlippage(),
          api.getSectorBreakdown()
        ]);
        setStateData(states);
        setSectorData(sectors);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-blue-700" />
          <span>Cross-State & Agency Comparative Analytics</span>
        </h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Benchmark infrastructure delay indicators, court litigations, and PFMS disbursement rates across Indian states and central agencies.
        </p>
      </div>

      {/* Chart: State Slippage vs Compensation */}
      <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h2 className="font-bold text-slate-900 text-sm">State Land Governance Performance Matrix</h2>
            <p className="text-xs text-slate-500">Comparing Average Slippage (Months) against PFMS DBT Compensation Disbursement Rate (%).</p>
          </div>
          <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
            DILRMP & MoRTH Feeds
          </span>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stateData} margin={{ top: 10, right: 20, left: 0, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="state" stroke="#64748b" fontSize={11} angle={-25} textAnchor="end" />
              <YAxis stroke="#64748b" fontSize={11} />
              <Tooltip
                contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e2e8f0', borderRadius: '8px', fontSize: '12px', color: '#0f172a', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              <Bar dataKey="avg_slippage_months" name="Avg Slippage (Months)" fill="#f43f5e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="avg_compensation_pct" name="PFMS Compensation Rate (%)" fill="#10b981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* State Breakdown Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-sm">State Comparative League Table</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">State</th>
                <th className="py-3 px-4">Total Requisitions</th>
                <th className="py-3 px-4">High-Risk Flagged</th>
                <th className="py-3 px-4">Active Judicial Litigations</th>
                <th className="py-3 px-4">Avg Projected Slippage</th>
                <th className="py-3 px-4">Avg PFMS DBT %</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {stateData.map((st) => (
                <tr key={st.state} className="hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 font-semibold text-slate-900 flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-blue-700" />
                    <span>{st.state}</span>
                  </td>
                  <td className="py-3 px-4 font-mono text-slate-700">{st.total_projects}</td>
                  <td className="py-3 px-4 font-mono text-rose-700 font-bold">{st.high_risk_projects}</td>
                  <td className="py-3 px-4 font-mono text-slate-700">{st.total_disputes}</td>
                  <td className="py-3 px-4 font-mono font-semibold text-amber-700">{st.avg_slippage_months} mos</td>
                  <td className="py-3 px-4 font-mono text-emerald-700 font-bold">{st.avg_compensation_pct}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
