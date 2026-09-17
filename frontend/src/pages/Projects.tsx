import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Download, SlidersHorizontal, MapPin, Building2, Shield, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import { Project } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const Projects: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedRisk, setSelectedRisk] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [viewAllJurisdictions, setViewAllJurisdictions] = useState(false);

  // Compute officer jurisdiction
  const isDistrictScoped = !viewAllJurisdictions && (user?.role === 'DISTRICT_COLLECTOR' || user?.role === 'SLAO') && !!user?.district;
  const isStateScoped = !viewAllJurisdictions && user?.role === 'STATE_OFFICER' && !!user?.state && user.state !== 'All India';
  
  const officerDistrict = isDistrictScoped ? (user?.district?.replace(/Corridor Division|District|National HQ/gi, '').trim()) : undefined;
  const officerState = isStateScoped ? user?.state : undefined;

  const loadProjects = async () => {
    setLoading(true);
    try {
      const data = await api.getProjects({
        search: search || undefined,
        risk_tier: selectedRisk || undefined,
        sector: selectedSector || undefined,
        state: selectedState || officerState || undefined,
        district: officerDistrict || undefined,
        limit: 100
      });
      setProjects(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // React immediately whenever user role, jurisdiction or filters change!
  useEffect(() => {
    loadProjects();
  }, [selectedRisk, selectedSector, selectedState, user?.role, user?.district, user?.state, viewAllJurisdictions]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadProjects();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            {t('projects.title', 'Escalation Queue: High-Risk Requisitions')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('projects.desc', 'Monitor, prioritize, and escalate infrastructure requisitions flagged with statutory slippage or litigation friction.')}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const csvData = projects.map(p => ({
                id: p.project_id,
                name: p.project_name,
                state: p.state,
                risk: p.risk_tier,
                prob: p.delay_probability,
                delay_months: p.delay_months_predicted
              }));
              const blob = new Blob([JSON.stringify(csvData, null, 2)], { type: 'application/json' });
              const url = URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.href = url;
              a.download = 'landwatch_escalation_queue.json';
              a.click();
            }}
            className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Download className="h-3.5 w-3.5 text-slate-500" />
            <span>{t('projects.btn_export', 'Export Registry')}</span>
          </button>
        </div>
      </div>

      {/* Active Role Jurisdiction Banner */}
      {isDistrictScoped && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-blue-50/90 border border-blue-200 text-xs text-blue-900 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-blue-600 animate-pulse shrink-0" />
            <div>
              <span className="font-bold">Active District Jurisdiction: </span>
              <span>{user?.district} ({user?.role}) — Showing {projects.length} local corridor requisitions under your statutory purview.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setViewAllJurisdictions(true)}
            className="text-[11px] font-semibold text-blue-700 hover:text-blue-900 underline self-start sm:self-auto cursor-pointer"
          >
            View Pan-India National Queue →
          </button>
        </div>
      )}

      {isStateScoped && (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 rounded-2xl bg-amber-50/90 border border-amber-200 text-xs text-amber-900 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-600 animate-pulse shrink-0" />
            <div>
              <span className="font-bold">Active State Jurisdiction: </span>
              <span>{user?.state} ({user?.role}) — Showing {projects.length} state-wide corridor requisitions.</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setViewAllJurisdictions(true)}
            className="text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline self-start sm:self-auto cursor-pointer"
          >
            View Pan-India National Queue →
          </button>
        </div>
      )}

      {viewAllJurisdictions && (
        <div className="flex items-center justify-between gap-3 p-3 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-700">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-slate-500" />
            <span>Viewing Pan-India National Queue (Unrestricted)</span>
          </div>
          <button
            type="button"
            onClick={() => setViewAllJurisdictions(false)}
            className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
          >
            Reset to My Jurisdiction ({user?.district || user?.state})
          </button>
        </div>
      )}

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
          <div className="flex-1 relative">
            <Search className="h-4 w-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder={t('projects.search_placeholder', 'Search by project name, ID, district or state...')}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={selectedRisk}
              onChange={(e) => setSelectedRisk(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:bg-white focus:border-blue-600"
            >
              <option value="">{t('projects.filter_risk_all', 'All Risk Tiers')}</option>
              <option value="High">{t('projects.filter_risk_high', 'Critical High Risk')}</option>
              <option value="Medium">{t('projects.filter_risk_med', 'Moderate Risk')}</option>
              <option value="Low">{t('projects.filter_risk_low', 'Low Risk / On Track')}</option>
            </select>

            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:bg-white focus:border-blue-600"
            >
              <option value="">{t('projects.filter_sector_all', 'All Sectors')}</option>
              <option value="Expressway / Highway">Expressway / Highway</option>
              <option value="High Speed Rail / Rail">High Speed Rail / Rail</option>
              <option value="Metro Rail Transit">Metro Rail Transit</option>
              <option value="Renewable Energy / Solar Park">Renewable Energy / Solar Park</option>
              <option value="Irrigation & Water Resources">Irrigation & Water Resources</option>
              <option value="Industrial Corridors / Logistics">Industrial Corridors</option>
            </select>

            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-700 focus:outline-none focus:bg-white focus:border-blue-600"
            >
              <option value="">{t('projects.filter_state_all', 'All States')}</option>
              <option value="Maharashtra">Maharashtra</option>
              <option value="Uttar Pradesh">Uttar Pradesh</option>
              <option value="Gujarat">Gujarat</option>
              <option value="Karnataka">Karnataka</option>
              <option value="Tamil Nadu">Tamil Nadu</option>
              <option value="Madhya Pradesh">Madhya Pradesh</option>
              <option value="Rajasthan">Rajasthan</option>
              <option value="Odisha">Odisha</option>
            </select>

            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs shadow-sm transition-colors"
            >
              {t('projects.btn_apply', 'Apply Filters')}
            </button>
          </div>
        </form>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">{t('projects.th_agency', 'Project / Agency')}</th>
                <th className="py-3 px-4">{t('dash.th_location', 'Location')}</th>
                <th className="py-3 px-4">{t('projects.th_stage', 'Current Statutory Stage')}</th>
                <th className="py-3 px-4">{t('projects.th_risk', 'Risk Classification')}</th>
                <th className="py-3 px-4">{t('projects.th_slippage', 'Delay Slippage')}</th>
                <th className="py-3 px-4">{t('projects.th_disputes', 'Court Litigations')}</th>
                <th className="py-3 px-4">{t('projects.th_dbt', 'PFMS DBT %')}</th>
                <th className="py-3 px-4 text-right">{t('projects.th_actions', 'Actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                    {t('projects.loading', 'Loading infrastructure requisitions...')}
                  </td>
                </tr>
              ) : projects.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-500 italic">
                    {t('projects.empty', 'No projects found matching current criteria.')}
                  </td>
                </tr>
              ) : (
                projects.map((p) => (
                  <tr key={p.project_id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 max-w-xs truncate">{p.project_name}</div>
                      <div className="text-[10px] font-mono text-slate-400">
                        {p.project_id} • {p.implementing_agency}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div>{p.district}</div>
                      <div className="text-[10px] text-slate-400">{p.state}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-[11px] font-medium border border-slate-200">
                        {p.current_stage}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <RiskBadge tier={p.risk_tier} probability={p.delay_probability} showProb size="sm" />
                    </td>
                    <td className="py-3 px-4 font-mono">
                      {p.delay_months_predicted > 0 ? (
                        <span className="text-rose-700 font-semibold">
                          +{p.delay_months_predicted} mos (~{p.delay_months_predicted * 30}d)
                        </span>
                      ) : (
                        <span className="text-emerald-700 font-semibold">{t('projects.on_schedule', 'On Schedule')}</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      <span className={p.active_court_disputes > 15 ? 'text-rose-700 font-semibold' : 'text-slate-700'}>
                        {p.active_court_disputes}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-700">
                      <span className={p.compensation_disbursed_pct < 40 ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                        {p.compensation_disbursed_pct}%
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <Link
                        to={`/projects/${p.project_id}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 font-medium text-[11px] transition-colors"
                      >
                        {t('dash.btn_inspect', 'Inspect')}
                      </Link>
                      <Link
                        to={`/simulator?projectId=${p.project_id}`}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-medium text-[11px] transition-colors"
                      >
                        {t('dash.btn_simulate', 'Simulate')}
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
