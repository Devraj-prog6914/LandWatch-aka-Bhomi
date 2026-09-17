import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  SlidersHorizontal,
  Scale,
  IndianRupee,
  Trees,
  FileCheck2,
  Calendar,
  AlertCircle,
  ShieldCheck
} from 'lucide-react';
import { api } from '../services/api';
import { ProjectDetail as IProjectDetail } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { ShapWaterfall } from '../components/ShapWaterfall';
import { PredictiveGantt } from '../components/PredictiveGantt';

export const ProjectDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<IProjectDetail | null>(null);
  const [govSync, setGovSync] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const [projData, govData] = await Promise.all([
          api.getProjectDetail(id),
          api.getGovIntegrations(id)
        ]);
        setProject(projData);
        setGovSync(govData);
      } catch (err) {
        console.error('Failed to load project detail', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="py-16 text-center text-slate-500 italic font-medium">
        Loading project inspection dossier...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="py-16 text-center text-rose-600 space-y-3">
        <p className="text-base font-semibold">Project record not found.</p>
        <Link to="/projects" className="text-xs text-blue-700 underline font-medium">
          Return to Escalation Queue
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-16">
      {/* Top Navigation & Action Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/projects"
            className="p-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 transition-colors shadow-sm"
            title="Back to Projects"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-mono text-xs text-slate-500">{project.project_id}</span>
              <span className="text-slate-300">•</span>
              <span className="text-xs font-semibold text-blue-700">{project.implementing_agency}</span>
              <span className="text-slate-300">•</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[11px] font-mono font-semibold" title="Bhu-Aadhaar Unique Land Parcel Identification Number (14 digits)">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-600"></span>
                ULPIN: {project.id ? `27${String(project.id).padStart(3, '0')}${String(project.parcels_count || 108).padStart(4, '0')}${project.district.slice(0, 2).toUpperCase()}` : '27048108420914'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">{project.project_name}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to={`/simulator?projectId=${project.project_id}`}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Simulate Interventions</span>
          </Link>
        </div>
      </div>

      {/* Primary Risk & Slippage Summary Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <div className="text-xs font-medium text-slate-500">Risk Classification</div>
          <div className="mt-1.5">
            <RiskBadge tier={project.risk_tier} probability={project.delay_probability} showProb size="lg" />
          </div>
          <div className="text-[11px] text-slate-600 mt-1.5">
            Primary Bottleneck: <span className="text-slate-900 font-semibold">{project.primary_bottleneck}</span>
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-slate-500">Projected Timeline Slippage</div>
          <div className="font-mono text-2xl font-bold text-rose-600 mt-1">
            {project.delay_months_predicted > 0 ? `+${project.delay_months_predicted} Mos` : '0 Mos (On Track)'}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            Original: {project.target_duration_months} mos | Elapsed: {project.elapsed_months} mos
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-slate-500">Land Acquisition Outlay</div>
          <div className="font-mono text-2xl font-bold text-slate-900 mt-1">
            ₹{project.budget_inr_cr.toLocaleString()}{' '}
            <span className="text-xs text-slate-500 font-normal">Cr</span>
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5">
            PFMS Disbursed: <span className="font-semibold text-slate-800">{project.compensation_disbursed_pct}%</span>
          </div>
        </div>

        <div>
          <div className="text-xs font-medium text-slate-500">Jurisdiction & Location</div>
          <div className="text-base font-bold text-slate-900 mt-1">
            {project.district}, {project.state}
          </div>
          <div className="text-[11px] font-mono text-slate-500 mt-0.5">
            Lat: {project.latitude.toFixed(4)} | Lng: {project.longitude.toFixed(4)}
          </div>
        </div>
      </div>

      {/* Key Risk Parameters 6-Card Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs space-y-1">
          <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
            <Scale className="h-3 w-3 text-rose-600" />
            <span>Court Litigations</span>
          </div>
          <div className="font-mono text-lg font-bold text-slate-900">
            {project.active_court_disputes} <span className="text-xs font-normal text-slate-500">suits</span>
          </div>
          <div className="text-[10px] text-slate-500">Injunction stay risk</div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs space-y-1">
          <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
            <Trees className="h-3 w-3 text-emerald-600" />
            <span>Forest Clearance</span>
          </div>
          <div className="font-semibold text-slate-900 truncate" title={project.forest_clearance_status}>
            {project.forest_clearance_status}
          </div>
          <div className="text-[10px] text-slate-500">{project.forest_land_ha} ha forest land</div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs space-y-1">
          <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
            <IndianRupee className="h-3 w-3 text-amber-600" />
            <span>PFMS DBT Release</span>
          </div>
          <div className="font-mono text-lg font-bold text-slate-900">
            {project.compensation_disbursed_pct}%
          </div>
          <div className="text-[10px] text-slate-500">Aadhaar seeded: {project.aadhaar_seeded_pct}%</div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs space-y-1">
          <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
            <FileCheck2 className="h-3 w-3 text-blue-600" />
            <span>Cadastral GIS</span>
          </div>
          <div className="font-mono text-lg font-bold text-slate-900">
            {project.cadastral_digitized_pct}%
          </div>
          <div className="text-[10px] text-slate-500">DILRMP georeferenced</div>
        </div>

        {/* Metric 5 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs space-y-1">
          <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-amber-600" />
            <span>SIA Objections</span>
          </div>
          <div className="font-mono text-lg font-bold text-slate-900">
            {project.sia_objection_rate_pct}%
          </div>
          <div className="text-[10px] text-slate-500">R&R Pending: {project.rr_packages_pending_pct}%</div>
        </div>

        {/* Metric 6 */}
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm text-xs space-y-1">
          <div className="text-slate-500 text-[10px] uppercase font-bold flex items-center gap-1">
            <Calendar className="h-3 w-3 text-indigo-600" />
            <span>DC Review Cadence</span>
          </div>
          <div className="font-mono text-lg font-bold text-slate-900">
            {project.collector_meetings_last_quarter} <span className="text-xs font-normal text-slate-500">meets</span>
          </div>
          <div className="text-[10px] text-slate-500">Past 90 days reviews</div>
        </div>
      </div>

      {/* Visual Analytics Row: Factor Breakdown & Predictive Gantt */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ShapWaterfall
          steps={project.waterfall_steps}
          baselineRisk={0.42}
          finalRisk={project.delay_probability}
        />
        <PredictiveGantt
          milestones={project.timeline_milestones}
          predictedDelayMonths={project.delay_months_predicted}
        />
      </div>

      {/* Prioritized Statutory Recommendations */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-blue-700" />
              <span>Prioritized Administrative & Statutory Action Directives</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Actionable legal directives mapping friction factors to statutory remedies under RFCTLARR Act 2013 and PM GatiShakti.
            </p>
          </div>
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
            {project.recommendations.length} Action Directives
          </span>
        </div>

        <div className="space-y-3 pt-1">
          {project.recommendations.map((rec, idx) => {
            const isCritical = rec.priority.toLowerCase().includes('critical') || rec.priority.toLowerCase().includes('urgent');
            const isHigh = rec.priority.toLowerCase().includes('high');

            return (
              <div
                key={idx}
                className={`p-4 rounded-xl border transition-all ${
                  isCritical
                    ? 'bg-rose-50/40 border-rose-200'
                    : isHigh
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-slate-50/70 border-slate-200'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : isHigh
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {rec.priority}
                    </span>
                    <h4 className="font-semibold text-slate-900 text-sm">{rec.action_title}</h4>
                  </div>

                  <div className="flex items-center gap-3 text-xs font-mono shrink-0">
                    <span className="text-emerald-700 font-bold">
                      -{rec.expected_risk_reduction_pct}% Risk
                    </span>
                    <span className="text-slate-700 font-semibold">
                      Save ~{rec.estimated_delay_saved_days} Days
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">{rec.description}</p>

                <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                  <div>
                    <span className="font-medium text-slate-700">Statutory Authority:</span>{' '}
                    <span>{rec.responsible_authority}</span>
                  </div>
                  <div className="font-mono text-slate-600 font-medium">
                    <span>{rec.statutory_reference}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Live Government Gateway Data Feeds */}
      {govSync && (
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                <span>Interoperable Government Data Gateways</span>
                <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
              </h3>
              <p className="text-xs text-slate-500">Active telemetry synced from National Judicial Data Grid, PFMS, Bhoomi, and PARIVESH.</p>
            </div>
            <span className="text-[10px] font-mono bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200">
              Gateway v2.6 Synced
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            {/* PFMS */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-semibold text-amber-800">PFMS SLAO Gateway</div>
              <div className="text-[11px] text-slate-700">Scheme: {govSync.integrations.pfms_dbt.scheme_code}</div>
              <div className="text-[11px] text-slate-700">NPCI Match: {govSync.integrations.pfms_dbt.npci_aadhaar_match_rate_pct}%</div>
              <div className="text-[10px] text-slate-500">{govSync.integrations.pfms_dbt.action_required}</div>
            </div>

            {/* e-Courts */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-semibold text-blue-800">e-Courts NJDG / RCMS</div>
              <div className="text-[11px] text-slate-700">District: {govSync.integrations.ecourts_njdg.district_jurisdiction}</div>
              <div className="text-[11px] text-slate-700">Stay Orders: {govSync.integrations.ecourts_njdg.injunction_stay_orders_active}</div>
              <div className="text-[10px] text-slate-500">{govSync.integrations.ecourts_njdg.next_lok_adalat_schedule}</div>
            </div>

            {/* Bhoomi */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-semibold text-emerald-800">DILRMP Cadastral GIS</div>
              <div className="text-[11px] text-slate-700">Vector GIS: {govSync.integrations.dilrmp_bhoomi.georeferenced_vector_layer_available ? 'Available' : 'Pending'}</div>
              <div className="text-[11px] text-slate-700">Drone Survey: {govSync.integrations.dilrmp_bhoomi.drone_orthomosaic_status}</div>
              <div className="text-[10px] text-slate-500">{govSync.integrations.dilrmp_bhoomi.state_portal}</div>
            </div>

            {/* PARIVESH */}
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
              <div className="font-semibold text-indigo-800">PARIVESH 2.0 MoEFCC</div>
              <div className="text-[11px] text-slate-700">Tracking: {govSync.integrations.parivesh_moefcc.proposal_tracking_no}</div>
              <div className="text-[11px] text-slate-700">Comp. Afforestation: {govSync.integrations.parivesh_moefcc.compensatory_afforestation_land_identified}</div>
              <div className="text-[10px] text-slate-500">{govSync.integrations.parivesh_moefcc.regional_empowered_committee_meeting_status}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
