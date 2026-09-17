import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  SlidersHorizontal,
  ArrowRight,
  TrendingDown,
  Clock,
  RotateCcw,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Calculator
} from 'lucide-react';
import { api } from '../services/api';
import { Project, SimulationResponse } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const Simulator: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Intervention control state
  const [compensationPct, setCompensationPct] = useState<number>(50);
  const [courtDisputes, setCourtDisputes] = useState<number>(10);
  const [cadastralPct, setCadastralPct] = useState<number>(60);
  const [aadhaarPct, setAadhaarPct] = useState<number>(75);
  const [forestStatus, setForestStatus] = useState<string>('Stage 1 Pending');
  const [dcMeetings, setDcMeetings] = useState<number>(2);
  const [utilityPending, setUtilityPending] = useState<number>(5);

  const [simulationResult, setSimulationResult] = useState<SimulationResponse | null>(null);
  const [simulating, setSimulating] = useState(false);

  useEffect(() => {
    const loadInitial = async () => {
      try {
        const isDistrict = (user?.role === 'DISTRICT_COLLECTOR' || user?.role === 'SLAO') && !!user?.district;
        const targetDist = isDistrict ? user?.district?.replace(/Corridor Division|District|National HQ/gi, '').trim() : undefined;
        const list = await api.getProjects({
          district: targetDist || undefined,
          state: user?.role === 'STATE_OFFICER' && user?.state && user.state !== 'All India' ? user.state : undefined,
          limit: 50
        });
        setProjects(list);
        
        const qId = searchParams.get('projectId');
        const defaultProj = qId ? list.find(p => p.project_id === qId) : list[0];
        if (defaultProj) {
          selectProject(defaultProj);
        } else if (list.length > 0) {
          selectProject(list[0]);
        }
      } catch (err) {
        console.error(err);
      }
    };
    loadInitial();
  }, [user?.role, user?.district, user?.state]);

  const selectProject = (p: Project) => {
    setSelectedProjectId(p.project_id);
    setSelectedProject(p);
    setCompensationPct(p.compensation_disbursed_pct);
    setCourtDisputes(p.active_court_disputes);
    setCadastralPct(p.cadastral_digitized_pct);
    setAadhaarPct(p.aadhaar_seeded_pct);
    setForestStatus(p.forest_clearance_status);
    setDcMeetings(p.collector_meetings_last_quarter);
    setUtilityPending(p.utility_shifting_pending);
    setSimulationResult(null);
  };

  const handleRunSimulation = async () => {
    if (!selectedProjectId) return;
    setSimulating(true);
    try {
      const res = await api.simulateIntervention(selectedProjectId, {
        compensation_disbursed_pct: compensationPct,
        active_court_disputes: courtDisputes,
        cadastral_digitized_pct: cadastralPct,
        aadhaar_seeded_pct: aadhaarPct,
        forest_clearance_status: forestStatus,
        collector_meetings_last_quarter: dcMeetings,
        utility_shifting_pending: utilityPending
      });
      setSimulationResult(res);
    } catch (err) {
      console.error('Simulation error', err);
    } finally {
      setSimulating(false);
    }
  };

  const handleReset = () => {
    if (selectedProject) {
      selectProject(selectedProject);
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs uppercase tracking-wider">
            <Calculator className="h-4 w-4 text-blue-700" />
            <span>{t('sim.badge', 'Policy Intervention Simulator')}</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {t('sim.title', 'Administrative Intervention Simulator')}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('sim.desc', 'Model and quantify the delay risk impact of targeted statutory remedies (Lok Adalat consent awards, PFMS DBT acceleration, Stage-II clearances) before administrative deployment.')}
          </p>
        </div>

        {/* Project Selector Dropdown */}
        <div className="w-full md:w-80">
          <label className="block text-[11px] font-semibold text-slate-600 uppercase mb-1">
            {t('sim.target_label', 'Target Infrastructure Project')}
          </label>
          <select
            value={selectedProjectId}
            onChange={(e) => {
              const found = projects.find(p => p.project_id === e.target.value);
              if (found) selectProject(found);
            }}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800 focus:outline-none focus:bg-white focus:border-blue-600 font-medium"
          >
            {projects.map((p) => (
              <option key={p.project_id} value={p.project_id}>
                [{p.risk_tier}] {p.project_name} ({p.district})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Intervention Sliders (5 cols) */}
        <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4 text-blue-700" />
                <span>{t('sim.levers_title', 'Intervention Levers')}</span>
              </h2>
              <p className="text-[11px] text-slate-500">{t('sim.levers_desc', 'Adjust parameters to simulate administrative remedies.')}</p>
            </div>
            <button
              onClick={handleReset}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs flex items-center gap-1 transition-colors"
              title="Reset to project baseline"
            >
              <RotateCcw className="h-3 w-3" />
              <span>{t('sim.btn_reset', 'Reset')}</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            {/* Slider 1: Court Disputes */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700">{t('sim.slider_disputes', 'Active Judicial Disputes (Lok Adalat Mediated)')}</span>
                <span className="font-mono text-slate-900 font-bold">{courtDisputes} suits</span>
              </div>
              <input
                type="range"
                min="0"
                max="50"
                value={courtDisputes}
                onChange={(e) => setCourtDisputes(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 (Full Mediation)</span>
                <span>Baseline: {selectedProject?.active_court_disputes}</span>
                <span>50 (High Litigation)</span>
              </div>
            </div>

            {/* Slider 2: PFMS DBT Compensation */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700">{t('sim.slider_dbt', 'PFMS Direct Benefit Transfer Disbursed %')}</span>
                <span className="font-mono text-slate-900 font-bold">{compensationPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={compensationPct}
                onChange={(e) => setCompensationPct(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0% (Disbursement Stalled)</span>
                <span>Baseline: {selectedProject?.compensation_disbursed_pct}%</span>
                <span>100% (Fully Disbursed)</span>
              </div>
            </div>

            {/* Dropdown: Forest Clearance */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700">{t('sim.dropdown_forest', 'MoEFCC Forest Stage-II Clearance Status')}</span>
              </div>
              <select
                value={forestStatus}
                onChange={(e) => setForestStatus(e.target.value)}
                className="w-full bg-white border border-slate-200 rounded-lg p-2 text-slate-800 text-xs focus:outline-none focus:border-blue-600"
              >
                <option value="Stage 1 Pending">Stage 1 Pending</option>
                <option value="Stage 1 In-Review">Stage 1 In-Review</option>
                <option value="Stage 2 Pending">Stage 2 Pending</option>
                <option value="Stage 2 Approved">Stage 2 Approved (Clearance Granted)</option>
                <option value="Not Applicable">Not Applicable (Zero Forest Land)</option>
              </select>
            </div>

            {/* Slider 3: Cadastral Digitization */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700">{t('sim.slider_cadastral', 'DILRMP Cadastral Map Digitization %')}</span>
                <span className="font-mono text-slate-900 font-bold">{cadastralPct}%</span>
              </div>
              <input
                type="range"
                min="20"
                max="100"
                value={cadastralPct}
                onChange={(e) => setCadastralPct(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>20% (Paper Records)</span>
                <span>Baseline: {selectedProject?.cadastral_digitized_pct}%</span>
                <span>100% (Drone Georeferenced)</span>
              </div>
            </div>

            {/* Slider 4: District Collector Reviews */}
            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex justify-between font-medium">
                <span className="text-slate-700">{t('sim.slider_dc', 'District Collector Review Meetings (Quarterly)')}</span>
                <span className="font-mono text-slate-900 font-bold">{dcMeetings} meets</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                value={dcMeetings}
                onChange={(e) => setDcMeetings(Number(e.target.value))}
                className="w-full accent-blue-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>0 (No Reviews)</span>
                <span>Baseline: {selectedProject?.collector_meetings_last_quarter}</span>
                <span>12 (Weekly Review Taskforce)</span>
              </div>
            </div>

            <button
              onClick={handleRunSimulation}
              disabled={simulating}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm flex items-center justify-center gap-2 transition-all mt-2"
            >
              <Calculator className="h-4 w-4" />
              <span>{simulating ? t('sim.btn_evaluating', 'Calculating Projected Impact...') : t('sim.btn_evaluate', 'Evaluate Intervention Scenario')}</span>
            </button>
          </div>
        </div>

        {/* Right Column: Outcomes & Impact Evaluation (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {simulationResult ? (
            <div className="space-y-5">
              {/* Impact KPI Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Risk Reduction */}
                <div className="bg-emerald-50/70 p-4 rounded-2xl border border-emerald-200 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase">{t('sim.kpi_reduction', 'Risk Reduction')}</div>
                  <div className="font-mono text-2xl font-bold text-emerald-800 flex items-center gap-1">
                    <TrendingDown className="h-6 w-6" />
                    <span>-{simulationResult.delay_probability_reduction_pct}%</span>
                  </div>
                  <div className="text-[10px] text-emerald-700">
                    Prob: {(simulationResult.baseline.delay_probability * 100).toFixed(1)}% ➔ {(simulationResult.simulated.delay_probability * 100).toFixed(1)}%
                  </div>
                </div>

                {/* Delay Months Saved */}
                <div className="bg-blue-50/70 p-4 rounded-2xl border border-blue-200 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold text-blue-800 uppercase">{t('sim.kpi_timeline_saved', 'Timeline Saved')}</div>
                  <div className="font-mono text-2xl font-bold text-blue-900 flex items-center gap-1">
                    <Clock className="h-6 w-6" />
                    <span>~{simulationResult.delay_months_saved} Mos</span>
                  </div>
                  <div className="text-[10px] text-blue-700">
                    Equivalent to ~{simulationResult.delay_months_saved * 30} calendar days
                  </div>
                </div>

                {/* Risk Tier Transition */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 shadow-sm space-y-1">
                  <div className="text-[11px] font-bold text-slate-600 uppercase">{t('sim.kpi_shift', 'Classification Shift')}</div>
                  <div className="text-sm font-bold text-slate-900 pt-1">
                    {simulationResult.risk_tier_transition}
                  </div>
                  <div className="text-[10px] text-emerald-700 flex items-center gap-1 font-medium">
                    <CheckCircle2 className="h-3.5 w-3.5" />
                    <span>{t('sim.de_escalation', 'De-escalation achieved')}</span>
                  </div>
                </div>
              </div>

              {/* Executive Narrative Summary */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-800 text-xs uppercase tracking-wider">
                  <FileText className="h-4 w-4 text-blue-700" />
                  <span>{t('sim.exec_note', 'Executive Administrative Note')}</span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                  {simulationResult.narrative_summary}
                </p>
              </div>

              {/* Statutory Factor Deltas Breakdown */}
              <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">
                  {t('sim.factor_breakdown', 'Quantified Factor Impact Breakdown')}
                </h3>
                <div className="space-y-2 text-xs">
                  {simulationResult.shap_deltas.map((delta, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                      <span className="font-medium text-slate-800 capitalize">
                        {delta.feature.replace(/_/g, ' ')}
                      </span>
                      <div className="flex items-center gap-4 font-mono">
                        <span className="text-slate-500 text-[11px]">
                          Base: {delta.baseline_impact > 0 ? `+${(delta.baseline_impact*100).toFixed(1)}%` : `${(delta.baseline_impact*100).toFixed(1)}%`}
                        </span>
                        <ArrowRight className="h-3 w-3 text-slate-400" />
                        <span className="text-slate-700 text-[11px]">
                          Sim: {delta.simulated_impact > 0 ? `+${(delta.simulated_impact*100).toFixed(1)}%` : `${(delta.simulated_impact*100).toFixed(1)}%`}
                        </span>
                        <span className="text-emerald-700 font-bold text-[11px]">
                          -{ (delta.net_impact_reduction * 100).toFixed(1) }% Impact
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-white p-12 rounded-2xl border border-slate-200 shadow-sm text-center space-y-4">
              <div className="h-14 w-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto text-blue-700">
                <SlidersHorizontal className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-900">{t('sim.ready_title', 'Ready for Administrative Evaluation')}</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
                  {t('sim.ready_desc', 'Adjust policy levers on the left and click "Evaluate Intervention Scenario" to calculate delay risk reduction and saved calendar days.')}
                </p>
              </div>
              <button
                onClick={handleRunSimulation}
                className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm inline-flex items-center gap-2 transition-colors"
              >
                <span>{t('sim.btn_run_baseline', 'Run Baseline Evaluation')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
