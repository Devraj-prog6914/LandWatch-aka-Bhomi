import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  TrendingUp,
  AlertTriangle,
  Clock,
  IndianRupee,
  Layers,
  ArrowUpRight,
  ShieldCheck,
  Activity,
  CheckCircle2,
  FileCheck2,
  SlidersHorizontal,
  ChevronRight,
  Gavel,
  Calendar,
  Users,
  Building2,
  Cpu,
  BadgeCheck,
  Download
} from 'lucide-react';
import { api } from '../services/api';
import { DashboardKPIs, SectorItem, Project } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { useLanguage } from '../context/LanguageContext';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie
} from 'recharts';
import { useAuth } from '../context/AuthContext';

export const Dashboard: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [kpis, setKpis] = useState<DashboardKPIs | null>(null);
  const [sectors, setSectors] = useState<SectorItem[]>([]);
  const [topProjects, setTopProjects] = useState<Project[]>([]);
  const [bottlenecks, setBottlenecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Officer jurisdiction
  const isDistrictScoped = (user?.role === 'DISTRICT_COLLECTOR' || user?.role === 'SLAO') && !!user?.district;
  const isStateScoped = user?.role === 'STATE_OFFICER' && !!user?.state && user.state !== 'All India';
  const officerDistrict = isDistrictScoped ? user?.district?.replace(/Corridor Division|District|National HQ/gi, '').trim() : undefined;
  const officerState = isStateScoped ? user?.state : undefined;

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [kpiData, sectorData, projectData, bottleneckData] = await Promise.all([
          api.getDashboardKPIs(),
          api.getSectorBreakdown(),
          api.getProjects({
            state: officerState || (isDistrictScoped ? 'Maharashtra' : undefined),
            district: officerDistrict || undefined,
            limit: 8
          }),
          api.getBottlenecks()
        ]);
        setKpis(kpiData);
        setSectors(sectorData);
        setTopProjects(projectData);
        setBottlenecks(bottleneckData.slice(0, 5));
      } catch (err) {
        console.error('Failed to load dashboard data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.role, user?.district, user?.state, officerDistrict, officerState, isDistrictScoped]);

  const riskPieData = kpis ? [
    { name: t('risk.high', 'Critical High Risk'), value: kpis.high_risk_count, color: '#f43f5e' },
    { name: t('risk.medium', 'Moderate Risk'), value: kpis.medium_risk_count, color: '#f59e0b' },
    { name: t('risk.low', 'On Track / Low'), value: kpis.low_risk_count, color: '#10b981' },
  ] : [
    { name: 'Critical High Risk', value: 540, color: '#f43f5e' },
    { name: 'Moderate Risk', value: 920, color: '#f59e0b' },
    { name: 'On Track / Low', value: 1290, color: '#10b981' }
  ];

  const safeTotalProjects = kpis?.total_projects ? kpis.total_projects.toLocaleString() : '2,750';
  const safeDelayedProjects = kpis?.delayed_projects ? kpis.delayed_projects.toLocaleString() : '1,130';
  const safeDelayedPct = kpis?.delayed_pct ?? '41.1';
  const safeBudgetAtRisk = kpis?.budget_at_risk_cr ? kpis.budget_at_risk_cr.toLocaleString() : '1,42,500';
  const safeTotalBudget = kpis?.total_budget_cr ? kpis.total_budget_cr.toLocaleString() : '2,85,000';
  const safeAvgDelay = kpis?.avg_delay_months ?? '14.2';

  // Current active role with guaranteed fallback
  const currentRole = (user?.role && ['ADMIN', 'STATE_OFFICER', 'DISTRICT_COLLECTOR', 'SLAO', 'VIEWER'].includes(user.role))
    ? user.role
    : 'ADMIN';

  // 1. Role-specific Telemetry bar info
  const telemetryConfig: Record<string, any> = {
    DISTRICT_COLLECTOR: {
      statusText: 'DISTRICT MAGISTRATE JURISDICTION ACTIVE:',
      badge: 'Pune District • Maharashtra | RFCTLARR Act 2013 Statutory Authority',
      nodes: [
        { label: 'e-MahaBhumi 7/12 Land Records', color: 'bg-emerald-400' },
        { label: 'District Court e-Courts NJDG (Pune)', color: 'bg-blue-400' },
        { label: 'Collector Escrow PFMS Account', color: 'bg-purple-400' },
        { label: 'JMS Cadastral Survey Cell', color: 'bg-amber-400' }
      ]
    },
    STATE_OFFICER: {
      statusText: 'STATE APEX INFRASTRUCTURE SURVEILLANCE ACTIVE:',
      badge: 'Maharashtra State Apex Cell • Mantralaya, Mumbai',
      nodes: [
        { label: 'MoEFCC PARIVESH 2.0 (Forest/Wildlife)', color: 'bg-emerald-400' },
        { label: 'State Revenue & Forest Dept GIS', color: 'bg-blue-400' },
        { label: 'Maharashtra High Court Bombay NJDG', color: 'bg-amber-400' },
        { label: 'Cabinet Committee Infrastructure Desk', color: 'bg-purple-400' }
      ]
    },
    SLAO: {
      statusText: 'FIELD CALA OPERATIONAL NODE ACTIVE:',
      badge: 'Special Land Acquisition Office • NHAI/MoRTH Division Pune',
      nodes: [
        { label: 'PFMS-SLAO DBT Disbursement Portal', color: 'bg-emerald-400' },
        { label: 'Drone Photogrammetry & Cadastre Sync', color: 'bg-blue-400' },
        { label: 'NPCI Aadhaar Payment Bridge (APB)', color: 'bg-purple-400' },
        { label: 'Village Gram Sabha Public Notices', color: 'bg-amber-400' }
      ]
    },
    VIEWER: {
      statusText: 'PUBLIC POLICY & XAI BENCHMARK ACTIVE:',
      badge: 'NITI Aayog Infrastructure Governance & Explainable AI Audit',
      nodes: [
        { label: 'TreeSHAP Model Explainability Engine', color: 'bg-indigo-400' },
        { label: 'RFCTLARR Statutory Compliance Index', color: 'bg-emerald-400' },
        { label: 'Macroeconomic Delay Cost Predictor', color: 'bg-amber-400' },
        { label: 'Open Gov Transparency Telemetry', color: 'bg-blue-400' }
      ]
    },
    ADMIN: {
      statusText: 'NATIONAL SURVEILLANCE ACTIVE:',
      badge: `${safeTotalProjects} Monitored Corridors Across India`,
      nodes: [
        { label: 'PFMS-SLAO DBT Gateway', color: 'bg-emerald-400' },
        { label: 'e-Courts NJDG (28 High Courts)', color: 'bg-blue-400' },
        { label: 'PARIVESH 2.0 MoEFCC', color: 'bg-amber-400' },
        { label: 'DILRMP Bhoomi GIS', color: 'bg-purple-400' }
      ]
    }
  };
  const activeTelemetry = telemetryConfig[currentRole] || telemetryConfig.ADMIN;

  // 2. Role-specific Banner Configuration
  const bannerConfig: Record<string, any> = {
    DISTRICT_COLLECTOR: {
      tag: 'Office of the District Magistrate & Collector • Pune District',
      title: 'Pune District Land Acquisition Command Center (RFCTLARR 2013)',
      desc: 'Statutory oversight of Sec 11 gazetted notifications, Sec 19 sunset lapse clocks, Lok Adalat consent resolutions, and direct PFMS compensation disbursements.',
      primaryBtn: { label: 'Trigger Lok Adalat Simulator', to: '/simulator' },
      secondaryBtn: { label: 'District Cadastral Map', to: '/gis-map' }
    },
    STATE_OFFICER: {
      tag: 'State High-Powered Infrastructure Committee • Mantralaya, Mumbai',
      title: 'Maharashtra State Infrastructure Land Reforms Portal',
      desc: 'Multi-district corridor monitoring, PARIVESH Stage-II Forest & Wildlife clearances, inter-departmental ROW escalation, and state compensation allocation.',
      primaryBtn: { label: 'Inter-District Slippage Matrix', to: '/projects' },
      secondaryBtn: { label: 'Statewide GIS Corridors', to: '/gis-map' }
    },
    SLAO: {
      tag: 'Competent Authority for Land Acquisition (CALA) • Field Command Desk',
      title: 'SLAO Field Operations & Award Disbursement Center',
      desc: 'Micro-level cadastral parcel ground verification, Joint Measurement Surveys (JMS), 7/12 land titleholder validation, and direct bank account disbursement.',
      primaryBtn: { label: 'Field Valuation Simulator', to: '/simulator' },
      secondaryBtn: { label: 'Cadastral GIS Overlays', to: '/gis-map' }
    },
    VIEWER: {
      tag: 'NITI Aayog Infrastructure Governance • Explainable AI Policy Audit',
      title: 'National Land Acquisition Governance & Model Transparency Dashboard',
      desc: 'Evaluation of machine learning early-warning models, RFCTLARR compliance indices, and macroeconomic fiscal protection impact across 2,750 corridors.',
      primaryBtn: { label: 'Audit TreeSHAP Attribution', to: '/governance' },
      secondaryBtn: { label: 'National Corridor GIS', to: '/gis-map' }
    },
    ADMIN: {
      tag: 'PM GatiShakti National Master Plan • Integrated Decision Support System',
      title: 'National Land Acquisition Monitoring & Risk Command Center',
      desc: 'Real-time statutory tracking, milestone slippage early warnings, and administrative intervention workflows across all central ministries.',
      primaryBtn: { label: 'Intervention Simulator', to: '/simulator' },
      secondaryBtn: { label: 'GIS Map View', to: '/gis-map' }
    }
  };
  const activeBanner = bannerConfig[currentRole] || bannerConfig.ADMIN;

  // 3. Role-specific KPI metrics
  const roleKPIs: Record<string, any[]> = {
    DISTRICT_COLLECTOR: [
      {
        title: 'District Monitored Corridors',
        value: '3 Projects',
        sub: '1,245.5 Ha Land under Acquisition',
        icon: <Layers className="h-6 w-6" />,
        color: 'blue'
      },
      {
        title: 'Sec 19 Sunset Lapse Alert',
        value: '94 Days',
        sub: 'Pune Ring Road East (Sec 11 gazetted)',
        icon: <Calendar className="h-6 w-6" />,
        color: 'rose',
        highlight: true
      },
      {
        title: 'PFMS Direct Benefit Disbursed',
        value: '62.6%',
        sub: '₹3,750 Cr disbursed of ₹5,990 Cr',
        icon: <IndianRupee className="h-6 w-6" />,
        color: 'amber'
      },
      {
        title: 'Active Court Disputes',
        value: '38 Suits',
        sub: '22 Consent-ready for Lok Adalat bench',
        icon: <Gavel className="h-6 w-6" />,
        color: 'emerald'
      }
    ],
    STATE_OFFICER: [
      {
        title: 'State Priority Corridors',
        value: '6 Mega Corridors',
        sub: 'Covering 14 districts across Maharashtra',
        icon: <Building2 className="h-6 w-6" />,
        color: 'blue'
      },
      {
        title: 'Corridors Facing Slippage',
        value: '3 Corridors (50%)',
        sub: 'Thane & Pune divisions experiencing delay',
        icon: <AlertTriangle className="h-6 w-6" />,
        color: 'rose',
        highlight: true
      },
      {
        title: 'State Capital Monitored',
        value: '₹48,200 Cr',
        sub: '₹12,400 Cr capital exposed to delay risk',
        icon: <IndianRupee className="h-6 w-6" />,
        color: 'amber'
      },
      {
        title: 'PARIVESH Forest Clearances',
        value: '2 Stage-II Pending',
        sub: 'MoEFCC file pending with DFO Thane/Pune',
        icon: <Clock className="h-6 w-6" />,
        color: 'emerald'
      }
    ],
    SLAO: [
      {
        title: 'Cadastral Land Parcels',
        value: '2,820 Plots',
        sub: '100% Georeferenced on Bhoomi GIS',
        icon: <Layers className="h-6 w-6" />,
        color: 'blue'
      },
      {
        title: 'Aadhaar-Bank Seeded Rate',
        value: '88.0%',
        sub: '338 titleholders pending NPCI bank re-KYC',
        icon: <Users className="h-6 w-6" />,
        color: 'amber',
        highlight: true
      },
      {
        title: 'Joint Measurement Surveys',
        value: '92.4%',
        sub: '2,606 parcels measured & verified on ground',
        icon: <CheckCircle2 className="h-6 w-6" />,
        color: 'emerald'
      },
      {
        title: 'Possession Ready for Handover',
        value: '1,940 Plots (68.8%)',
        sub: 'Unencumbered land handed over to NHAI',
        icon: <ShieldCheck className="h-6 w-6" />,
        color: 'slate'
      }
    ],
    VIEWER: [
      {
        title: 'Evaluated Corridors',
        value: '2,750 Corridors',
        sub: 'National Master Plan infrastructure registry',
        icon: <Layers className="h-6 w-6" />,
        color: 'blue'
      },
      {
        title: 'AI Model ROC-AUC Score',
        value: '89.45%',
        sub: 'Gradient Boosted Trees (TreeSHAP audited)',
        icon: <Cpu className="h-6 w-6" />,
        color: 'indigo',
        highlight: true
      },
      {
        title: 'Statutory Compliance Index',
        value: '78.2% Score',
        sub: 'RFCTLARR Act 2013 procedural compliance',
        icon: <BadgeCheck className="h-6 w-6" />,
        color: 'emerald'
      },
      {
        title: 'Fiscal Protection Potential',
        value: '₹18,400 Cr',
        sub: 'Avoidable interest & inflation delay cost',
        icon: <IndianRupee className="h-6 w-6" />,
        color: 'amber'
      }
    ],
    ADMIN: [
      {
        title: t('dash.kpi_total_projects', 'Total Monitored Projects'),
        value: safeTotalProjects,
        sub: t('dash.kpi_cadastre_note', '100% Georeferenced Cadastre'),
        icon: <Layers className="h-6 w-6" />,
        color: 'blue'
      },
      {
        title: t('dash.kpi_delayed_projects', 'Projects Facing Slippage'),
        value: `${safeDelayedProjects} (${safeDelayedPct}%)`,
        sub: `${kpis?.high_risk_count ?? '540'} High Risk Escalations`,
        icon: <Clock className="h-6 w-6" />,
        color: 'rose',
        highlight: true
      },
      {
        title: t('dash.kpi_budget_at_risk', 'Public Capital at Risk'),
        value: `₹${safeBudgetAtRisk} Cr`,
        sub: `Total Portfolio: ₹${safeTotalBudget} Cr`,
        icon: <IndianRupee className="h-6 w-6" />,
        color: 'amber'
      },
      {
        title: t('dash.kpi_avg_delay', 'Avg Projected Delay'),
        value: `${safeAvgDelay} Months`,
        sub: `~${Math.round(Number(safeAvgDelay) * 30)} Calendar Days / project`,
        icon: <TrendingUp className="h-6 w-6" />,
        color: 'slate'
      }
    ]
  };
  const activeKPIs = roleKPIs[currentRole] || roleKPIs.ADMIN;

  return (
    <div className="space-y-6 pb-12">
      {/* Real-time Telemetry Strip (Dynamically Adapts to Role) */}
      <div className="bg-slate-900 text-slate-200 px-4 py-2.5 rounded-2xl border border-slate-800 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-white tracking-wide">
            {activeTelemetry.statusText}
          </span>
          <span className="text-slate-300 font-mono">
            {activeTelemetry.badge}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400">
          {activeTelemetry.nodes?.map((node: any, i: number) => (
            <div key={i} className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${node.color}`}></span>
              <span>{node.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Role-Specific Top Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-blue-700 font-semibold text-xs uppercase tracking-wider">
            <span className="h-2 w-2 rounded-full bg-blue-600"></span>
            {activeBanner.tag}
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1">
            {activeBanner.title}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
            {activeBanner.desc}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            to={activeBanner.secondaryBtn.to}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs border border-slate-200 shadow-xs transition-all flex items-center gap-1.5"
          >
            <Layers className="h-3.5 w-3.5 text-blue-700" />
            <span>{activeBanner.secondaryBtn.label}</span>
          </Link>
          <Link
            to={activeBanner.primaryBtn.to}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs shadow-sm transition-all flex items-center gap-1.5"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>{activeBanner.primaryBtn.label}</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>

      {/* Role-Tailored KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeKPIs.map((kpi, idx) => (
          <div
            key={idx}
            className={`bg-white p-5 rounded-2xl border ${
              kpi.highlight ? 'border-rose-300 bg-rose-50/20' : 'border-slate-200'
            } shadow-sm flex items-center justify-between hover:shadow-md hover:-translate-y-0.5 transition-all`}
          >
            <div>
              <p className="text-xs font-medium text-slate-500">{kpi.title}</p>
              <h3 className={`text-2xl font-bold mt-1 ${kpi.highlight ? 'text-rose-600' : 'text-slate-900'}`}>
                {kpi.value}
              </h3>
              <p className={`text-[11px] flex items-center gap-1 mt-1 font-medium ${
                kpi.highlight ? 'text-rose-700' : 'text-slate-500'
              }`}>
                {kpi.highlight ? <AlertTriangle className="h-3.5 w-3.5 text-rose-600" /> : <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />}
                <span>{kpi.sub}</span>
              </p>
            </div>
            <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${
              kpi.color === 'rose'
                ? 'bg-rose-50 border border-rose-100 text-rose-600'
                : kpi.color === 'amber'
                ? 'bg-amber-50 border border-amber-100 text-amber-600'
                : kpi.color === 'emerald'
                ? 'bg-emerald-50 border border-emerald-100 text-emerald-600'
                : kpi.color === 'indigo'
                ? 'bg-indigo-50 border border-indigo-100 text-indigo-600'
                : 'bg-blue-50 border border-blue-100 text-blue-700'
            }`}>
              {kpi.icon}
            </div>
          </div>
        ))}
      </div>

      {/* ========================================================================= */}
      {/* DEDICATED ROLE-SPECIFIC TACTICAL COMMAND MODULE */}
      {/* ========================================================================= */}

      {/* 1. DISTRICT COLLECTOR TACTICAL DESK */}
      {currentRole === 'DISTRICT_COLLECTOR' && (
        <div className="bg-gradient-to-br from-blue-900 via-slate-900 to-indigo-950 text-white p-6 rounded-2xl border border-blue-800 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-blue-800/60 pb-4">
            <div>
              <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs tracking-wider uppercase">
                <Gavel className="h-4 w-4" />
                <span>Statutory Authority: RFCTLARR Act 2013 • Collectorate Purview</span>
              </div>
              <h2 className="text-lg font-bold mt-1 text-white">
                Pune District Magistrate Statutory Priority Desk
              </h2>
              <p className="text-xs text-blue-200 mt-0.5">
                Immediate administrative actions required to prevent Section 19 statutory lapse and resolve active land acquisition court suits.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/simulator"
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-all flex items-center gap-1.5 shadow-sm"
              >
                <SlidersHorizontal className="h-3.5 w-3.5" />
                <span>Run Lok Adalat Settlement Simulator</span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            {/* Sec 19 Sunset Box */}
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-rose-300 flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  Sec 19 Sunset Lapse Countdown
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/30 text-rose-200 border border-rose-400/40">
                  Critical
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black font-mono text-white">94 Calendar Days</div>
                <p className="text-[11px] text-blue-200 mt-1">
                  <strong>Pune Greenfield Ring Road (Sec 1)</strong>: Sec 11 notification expires in 94 days. Gazetted Sec 19 declaration must be published or entire acquisition will lapse under Sec 19(7).
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-slate-300">Target Gazetted Deadline:</span>
                <span className="text-xs font-mono font-bold text-amber-300">15 Dec 2026</span>
              </div>
            </div>

            {/* Lok Adalat Resolution Box */}
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                  <Gavel className="h-4 w-4" />
                  District Lok Adalat Consent Bench
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/30 text-emerald-200 border border-emerald-400/40">
                  Ready
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black font-mono text-white">22 / 38 Suits Ready</div>
                <p className="text-[11px] text-blue-200 mt-1">
                  22 titleholders in Haveli and Khed tehsils agreed to special solatium settlement. Fast-tracking this bench prevents an estimated <strong>11 months of litigation delay</strong>.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-slate-300">Bench Convening Date:</span>
                <span className="text-xs font-mono font-bold text-emerald-300">Saturday, 19 Sept 2026</span>
              </div>
            </div>

            {/* PFMS Disbursement Escrow */}
            <div className="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-300 flex items-center gap-1.5">
                  <IndianRupee className="h-4 w-4" />
                  PFMS Collector Escrow Clearance
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/30 text-amber-200 border border-amber-400/40">
                  Action
                </span>
              </div>
              <div className="mt-2">
                <div className="text-2xl font-black font-mono text-white">₹2,240 Cr Pending</div>
                <p className="text-[11px] text-blue-200 mt-1">
                  1,420 titleholder payment vouchers are verified by SLAO and await District Collector digital token signature for direct Aadhaar-NPCI credit.
                </p>
              </div>
              <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[10px] text-slate-300">Aadhaar Linkage Rate:</span>
                <span className="text-xs font-mono font-bold text-amber-300">88.0% Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. STATE OFFICER TACTICAL DESK */}
      {currentRole === 'STATE_OFFICER' && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-blue-400 font-semibold text-xs tracking-wider uppercase">
                <Building2 className="h-4 w-4" />
                <span>Maharashtra State High-Powered Committee • Inter-District Surveillance</span>
              </div>
              <h2 className="text-lg font-bold mt-1 text-white">
                Inter-District Land Acquisition Slippage Matrix (Maharashtra)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Comparative analysis of land acquisition progress, judicial disputes, and PARIVESH clearances across key districts.
              </p>
            </div>
            <Link
              to="/projects"
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <span>View All 6 Maharashtra Corridors</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-5">
            {[
              { district: 'Pune', status: 'High Attention', dbt: '62.6%', disputes: 38, forest: 'Stage-I Cleared', color: 'border-amber-500/40 bg-amber-500/10' },
              { district: 'Thane', status: 'Critical Delay', dbt: '44.1%', disputes: 52, forest: 'Stage-II Pending', color: 'border-rose-500/40 bg-rose-500/10' },
              { district: 'Nagpur', status: 'Ahead of Pace', dbt: '89.2%', disputes: 6, forest: 'Cleared', color: 'border-emerald-500/40 bg-emerald-500/10' },
              { district: 'Palghar', status: 'Moderate Risk', dbt: '58.0%', disputes: 28, forest: 'CRZ Clearance In-Review', color: 'border-blue-500/40 bg-blue-500/10' }
            ].map((d, i) => (
              <div key={i} className={`p-4 rounded-xl border ${d.color} backdrop-blur-sm space-y-2`}>
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-white text-sm">{d.district} District</h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/40 text-slate-200">
                    {d.status}
                  </span>
                </div>
                <div className="space-y-1 text-xs pt-1">
                  <div className="flex justify-between text-slate-300">
                    <span>PFMS DBT Disbursed:</span>
                    <span className="font-mono font-bold text-white">{d.dbt}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>Active Court Disputes:</span>
                    <span className="font-mono font-bold text-white">{d.disputes}</span>
                  </div>
                  <div className="flex justify-between text-slate-300">
                    <span>MoEFCC Clearance:</span>
                    <span className="text-[11px] font-medium text-amber-300">{d.forest}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. SLAO TACTICAL DESK */}
      {currentRole === 'SLAO' && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs tracking-wider uppercase">
                <Users className="h-4 w-4" />
                <span>Field Operations • Competent Authority for Land Acquisition (CALA)</span>
              </div>
              <h2 className="text-lg font-bold mt-1 text-white">
                SLAO Field Execution & Titleholder Reconciliations Desk
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Field ground surveys, 7/12 land registry verification, and NPCI Aadhaar bank mapper reconciliations.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => alert('Exporting PFMS Direct Benefit Transfer Requisition Batch (CSV)...')}
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center gap-1.5"
              >
                <Download className="h-3.5 w-3.5" />
                <span>Export PFMS Payment CSV</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-amber-300">Aadhaar NPCI Mapper Exceptions</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-200">338 Titleholders</span>
              </div>
              <p className="text-xs text-slate-300">
                Bank accounts rejected due to missing NPCI Aadhaar seeding. Special Gram Sabha शिविर (camp) scheduled this Friday in Haveli tehsil.
              </p>
              <div className="text-[11px] text-emerald-400 font-medium">
                Action: Push SMS Alert & Village Camp Notice
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-blue-300">Joint Measurement Surveys (JMS)</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-200">214 Survey Nos</span>
              </div>
              <p className="text-xs text-slate-300">
                Joint ground inspection with Forest & Revenue officials completed for 2,606 parcels. Final 214 survey numbers underway.
              </p>
              <div className="text-[11px] text-blue-300 font-medium">
                Action: Validate DILRMP Bhoomi Boundary Vector
              </div>
            </div>

            <div className="bg-white/5 p-4 rounded-xl border border-white/10 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-300">Possession Certificates Ready</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-200">1,940 Plots</span>
              </div>
              <p className="text-xs text-slate-300">
                Compensation disbursed, encumbrance certificates issued, ready for NHAI contractor civil works deployment.
              </p>
              <div className="text-[11px] text-emerald-300 font-medium">
                Action: Issue Formal Possession Handover Memorandum
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. VIEWER / NITI AAYOG TACTICAL DESK */}
      {currentRole === 'VIEWER' && (
        <div className="bg-slate-900 text-white p-6 rounded-2xl border border-slate-800 shadow-md">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs tracking-wider uppercase">
                <Cpu className="h-4 w-4" />
                <span>NITI Aayog Infrastructure Governance • Explainable AI Audit</span>
              </div>
              <h2 className="text-lg font-bold mt-1 text-white">
                Explainable AI (TreeSHAP) Delay Risk Attribution Engine
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Global feature importance weights driving the machine learning land acquisition delay early warning models.
              </p>
            </div>
            <Link
              to="/governance"
              className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition-all flex items-center gap-1.5"
            >
              <span>Inspect AI Model Governance</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-5 text-xs">
            {[
              { feature: 'Litigation in District / High Courts', weight: '34.2%', color: 'bg-rose-500' },
              { feature: 'PFMS Compensation Disbursement Lag', weight: '26.1%', color: 'bg-amber-500' },
              { feature: 'PARIVESH Stage-II Forest Clearances', weight: '18.9%', color: 'bg-indigo-500' },
              { feature: 'Cadastral GIS Boundary Inaccuracies', weight: '13.8%', color: 'bg-blue-500' },
              { feature: 'Utility Shifting / Pipeline ROW', weight: '7.0%', color: 'bg-emerald-500' }
            ].map((f, i) => (
              <div key={i} className="bg-white/5 p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="font-bold text-white text-xs">{f.weight}</div>
                <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${f.color}`} style={{ width: f.weight }}></div>
                </div>
                <div className="text-[11px] text-slate-300">{f.feature}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ROLE-SPECIFIC ANALYTICS & OPERATIONAL WORKSPACES */}
      {/* ========================================================================= */}

      {/* 1. DISTRICT COLLECTOR WORKSPACE (Pune Tehsil breakdown + Solatium Ledger) */}
      {currentRole === 'DISTRICT_COLLECTOR' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tehsil Land Acquisition Progress */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Pune District Tehsil-Wise Acquisition Delivery</h2>
                <p className="text-xs text-slate-500">Physical land acquired (Hectares) across sub-divisions for Ring Road & High-Speed Rail.</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
                District Magistrate Purview
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { tehsil: 'Haveli Tehsil', acquired_ha: 520, target_ha: 640 },
                    { tehsil: 'Khed Tehsil', acquired_ha: 380, target_ha: 490 },
                    { tehsil: 'Mulshi Tehsil', acquired_ha: 210, target_ha: 360 },
                    { tehsil: 'Shirur Tehsil', acquired_ha: 135, target_ha: 155 },
                  ]}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" unit=" Ha" stroke="#94a3b8" fontSize={11} domain={[0, 700]} />
                  <YAxis dataKey="tehsil" type="category" stroke="#64748b" fontSize={11} width={100} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#ffffff',
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                    }}
                    formatter={(val: any, name: any) => [`${val} Hectares`, name === 'acquired_ha' ? 'Acquired on Ground' : 'Target Required']}
                  />
                  <Bar dataKey="acquired_ha" name="Acquired on Ground" fill="#10b981" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="target_ha" name="Target Required" fill="#cbd5e1" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span>Haveli tehsil has fastest delivery (81.2%); Mulshi requires CALA field inspection.</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-emerald-500 rounded-sm"></span> Acquired</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-slate-300 rounded-sm"></span> Target</span>
              </div>
            </div>
          </div>

          {/* District Solatium & Escrow Ledger */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Collector Escrow Account Ledger</h2>
                <p className="text-xs text-slate-500">PFMS Direct Beneficiary balance</p>
              </div>
              <span className="text-[10px] bg-purple-50 text-purple-700 font-bold px-2 py-0.5 rounded border border-purple-200">
                SBI Escrow
              </span>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-1">
                <span className="text-slate-500 font-medium">Total Sanctioned Award:</span>
                <div className="text-xl font-black text-slate-900 font-mono">₹5,990.00 Cr</div>
                <span className="text-[10px] text-slate-400">Sanctioned under RFCTLARR Section 23</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span> Disbursed to Bank A/Cs:
                </span>
                <span className="font-mono font-bold text-emerald-700">₹3,750.00 Cr (62.6%)</span>
              </div>

              <div className="flex justify-between items-center py-1.5 border-b border-slate-100">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span> Pending Collector Signature:
                </span>
                <span className="font-mono font-bold text-amber-700">₹1,760.00 Cr</span>
              </div>

              <div className="flex justify-between items-center py-1.5">
                <span className="text-slate-600 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-rose-500"></span> Held in District Court:
                </span>
                <span className="font-mono font-bold text-rose-700">₹480.00 Cr (Disputed)</span>
              </div>

              <button
                onClick={() => alert('Opening District Collector Digital Signature Token gateway...')}
                className="w-full mt-2 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <FileCheck2 className="h-4 w-4" />
                <span>e-Sign Pending PFMS Batch (₹1,760 Cr)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. STATE OFFICER WORKSPACE (Inter-District Performance Matrix + PARIVESH Dossier) */}
      {currentRole === 'STATE_OFFICER' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inter-District Delivery Matrix */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Maharashtra Inter-District Land Handover Index</h2>
                <p className="text-xs text-slate-500">Comparative pace of possession handover to implementing agencies (NHAI/MSRDC).</p>
              </div>
              <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-semibold">
                Mantralaya Apex Cell
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { district: 'Nagpur', delivery_pct: 89, disputes: 6 },
                    { district: 'Pune', delivery_pct: 63, disputes: 38 },
                    { district: 'Palghar', delivery_pct: 58, disputes: 28 },
                    { district: 'Thane', delivery_pct: 44, disputes: 52 },
                    { district: 'Nashik', delivery_pct: 41, disputes: 31 },
                  ]}
                  margin={{ top: 10, right: 20, left: 0, bottom: 5 }}
                >
                  <XAxis dataKey="district" stroke="#64748b" fontSize={11} />
                  <YAxis unit="%" stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#ffffff',
                    }}
                    formatter={(val: any) => [`${val}% Handed Over`, 'Land Delivery Rate']}
                  />
                  <Bar dataKey="delivery_pct" radius={[6, 6, 0, 0]}>
                    {[89, 63, 58, 44, 41].map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry > 75 ? '#10b981' : entry > 50 ? '#3b82f6' : '#f43f5e'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span>Thane & Nashik require State High-Powered Committee intervention due to forest overlaps.</span>
              <span className="font-semibold text-rose-600">Thane: 52 Court Disputes Pending</span>
            </div>
          </div>

          {/* PARIVESH 2.0 Forest Dossier */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">MoEFCC PARIVESH Clearances</h2>
                <p className="text-xs text-slate-500">Maharashtra Forest Clearance Stage</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                MoEFCC Sync
              </span>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              {[
                { title: 'Stage-II Forest Clearances Approved', count: 8, status: 'Cleared', color: 'text-emerald-700 bg-emerald-50' },
                { title: 'Stage-I In-Principle Approvals', count: 4, status: 'Complied', color: 'text-blue-700 bg-blue-50' },
                { title: 'FAC Committee Review (Thane/Pune)', count: 2, status: 'Lagging', color: 'text-rose-700 bg-rose-50' },
                { title: 'Eco-Sensitive Zone (ESZ) Clearances', count: 1, status: 'In-Review', color: 'text-amber-700 bg-amber-50' },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-100">
                  <span className="font-medium text-slate-700 truncate pr-2">{c.title}</span>
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs shrink-0 ${c.color}`}>
                    {c.count} Files
                  </span>
                </div>
              ))}

              <button
                onClick={() => alert('Drafting State Chief Secretary Directive to MoEFCC Regional Office...')}
                className="w-full mt-2 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <Building2 className="h-4 w-4" />
                <span>Issue State Directive to DFO Thane/Pune</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 3. SLAO WORKSPACE (Cadastral Pegging + NPCI Aadhaar Exception Resolution) */}
      {currentRole === 'SLAO' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Joint Measurement Surveys Field Chart */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">Joint Measurement Survey (JMS) & Boundary Pegging</h2>
                <p className="text-xs text-slate-500">Parcels surveyed on ground with Electronic Total Station vs remaining.</p>
              </div>
              <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 font-semibold">
                CALA Field Division
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { section: 'Ring Road Sec-1 (Haveli)', measured: 1320, remaining: 100 },
                    { section: 'Ring Road Sec-2 (Khed)', measured: 840, remaining: 64 },
                    { section: 'Pune-Nashik Rail Sec-A', measured: 446, remaining: 50 },
                  ]}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" stroke="#94a3b8" fontSize={11} />
                  <YAxis dataKey="section" type="category" stroke="#64748b" fontSize={10} width={135} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#ffffff',
                    }}
                  />
                  <Bar dataKey="measured" name="Measured Parcels" fill="#10b981" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="remaining" name="Remaining / Disputed" fill="#f59e0b" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span>Total 2,606 parcels verified; 214 boundary overlaps undergoing talathi reconciliation.</span>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-emerald-500 rounded-sm"></span> Measured</span>
                <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 bg-amber-500 rounded-sm"></span> Boundary Overlap</span>
              </div>
            </div>
          </div>

          {/* NPCI Bank Account Re-KYC Queue */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">NPCI Aadhaar Re-KYC Queue</h2>
                <p className="text-xs text-slate-500">Failed direct benefit transactions</p>
              </div>
              <span className="text-[10px] bg-rose-50 text-rose-700 font-bold px-2 py-0.5 rounded border border-rose-200">
                338 Titleholders
              </span>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">7/12 Name Mismatch with Bank:</span>
                <span className="font-mono font-bold text-amber-700">184 Cases</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Unlinked Aadhaar NPCI Bridge:</span>
                <span className="font-mono font-bold text-rose-700">154 Cases</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-slate-100">
                <span className="text-slate-600">Joint Landholding Dispute:</span>
                <span className="font-mono font-bold text-slate-700">46 Cases</span>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
                <span className="font-bold text-amber-900">Gram Sabha Re-KYC Camp:</span>
                <p className="text-[11px] text-amber-800">
                  Special camp scheduled for Friday at Haveli Panchayat Hall with local Lead Bank Officer.
                </p>
              </div>

              <button
                onClick={() => alert('Generating Gram Sabha Notice & SMS broadcast batch in Marathi...')}
                className="w-full mt-2 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <Users className="h-4 w-4" />
                <span>Broadcast Gram Sabha Camp SMS Notice</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4. VIEWER / NITI AAYOG WORKSPACE (Explainable AI Attribution + Compliance Scorecard) */}
      {currentRole === 'VIEWER' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* TreeSHAP Feature Attribution Bar Chart */}
          <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">TreeSHAP Global Feature Importance (Delay Drivers)</h2>
                <p className="text-xs text-slate-500">Mathematical attribution of delay probabilities across 2,750 national corridors.</p>
              </div>
              <span className="text-[10px] font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-200 font-semibold">
                Explainable AI (XAI)
              </span>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={[
                    { factor: 'Court Litigation (e-Courts)', weight: 34.2 },
                    { factor: 'PFMS Compensation Lag', weight: 26.1 },
                    { factor: 'PARIVESH Forest Clearances', weight: 18.9 },
                    { factor: 'Cadastral GIS Boundary Error', weight: 13.8 },
                    { factor: 'Utility / Pipeline Shifting', weight: 7.0 },
                  ]}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 40, bottom: 5 }}
                >
                  <XAxis type="number" unit="%" stroke="#94a3b8" fontSize={11} domain={[0, 40]} />
                  <YAxis dataKey="factor" type="category" stroke="#64748b" fontSize={10} width={150} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#0f172a',
                      borderColor: '#334155',
                      borderRadius: '10px',
                      fontSize: '12px',
                      color: '#ffffff',
                    }}
                    formatter={(val: any) => [`${val}% Attribution Weight`, 'TreeSHAP Contribution']}
                  />
                  <Bar dataKey="weight" radius={[0, 4, 4, 0]}>
                    <Cell fill="#f43f5e" />
                    <Cell fill="#f59e0b" />
                    <Cell fill="#6366f1" />
                    <Cell fill="#3b82f6" />
                    <Cell fill="#10b981" />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-100">
              <span>Court disputes and compensation delays account for 60.3% of total project completion slippage.</span>
              <span className="font-semibold text-indigo-600">Model ROC-AUC: 89.45%</span>
            </div>
          </div>

          {/* Statutory RFCTLARR Compliance Audit */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">RFCTLARR 2013 Compliance Audit</h2>
                <p className="text-xs text-slate-500">Statutory Milestone Scorecard</p>
              </div>
              <span className="text-[10px] bg-emerald-50 text-emerald-700 font-bold px-2 py-0.5 rounded border border-emerald-200">
                Audited
              </span>
            </div>

            <div className="space-y-3 pt-1 text-xs">
              {[
                { title: 'Sec 4 Social Impact Assessment (SIA)', score: '92.4%', color: 'text-emerald-700' },
                { title: 'Sec 15 Hearing of Objections Disposal', score: '84.0%', color: 'text-emerald-700' },
                { title: 'Sec 19 Declaration within 12 Months', score: '71.2%', color: 'text-amber-700' },
                { title: 'Sec 31 R&R Package Delivery', score: '68.5%', color: 'text-amber-700' },
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-slate-50">
                  <span className="text-slate-600 font-medium">{c.title}</span>
                  <span className={`font-mono font-bold ${c.color}`}>{c.score}</span>
                </div>
              ))}

              <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-200 space-y-1">
                <span className="font-bold text-indigo-900">Demographic Parity Index:</span>
                <p className="text-[11px] text-indigo-800">
                  Disparate impact ratio = 0.98 (statistically zero bias between tribal/rural and peri-urban landholders).
                </p>
              </div>

              <button
                onClick={() => alert('Downloading NITI Aayog Infrastructure Governance Policy Brief (PDF)...')}
                className="w-full mt-2 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-xs flex items-center justify-center gap-1.5"
              >
                <Download className="h-4 w-4" />
                <span>Download NITI Aayog Policy Report (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. NATIONAL ADMINISTRATOR WORKSPACE (Macro PM GatiShakti National Master Plan) */}
      {currentRole === 'ADMIN' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Sector Risk Breakdown Bar Chart */}
            <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <h2 className="font-bold text-slate-900 text-sm">{t('dash.sector_title', 'Sector-Wise Land Acquisition Delay Exposure')}</h2>
                  <p className="text-xs text-slate-500">{t('dash.sector_desc', 'Percentage of sector portfolio flagged with projected completion slippage.')}</p>
                </div>
                <span className="text-[10px] font-mono text-blue-700 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200 font-semibold">
                  PM GatiShakti NMP
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={sectors} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                    <XAxis type="number" unit="%" stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                    <YAxis dataKey="sector" type="category" stroke="#64748b" fontSize={10} width={135} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '10px',
                        fontSize: '12px',
                        color: '#ffffff',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                      }}
                      formatter={(val: any) => [`${val}% Delay Exposure`, 'Sector Portfolio Slippage']}
                    />
                    <Bar dataKey="delay_rate_pct" radius={[0, 6, 6, 0]}>
                      {sectors.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.delay_rate_pct > 50 ? '#f43f5e' : entry.delay_rate_pct > 35 ? '#f59e0b' : '#3b82f6'}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Portfolio Risk Tier Composition Donut */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="border-b border-slate-100 pb-3">
                <h2 className="font-bold text-slate-900 text-sm">{t('dash.risk_class_title', 'National Risk Classification')}</h2>
                <p className="text-xs text-slate-500">{t('dash.risk_class_desc', 'Distribution of projects across multi-tier risk thresholds.')}</p>
              </div>

              <div className="h-52 w-full flex items-center justify-center relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={riskPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={58}
                      outerRadius={84}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {riskPieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '10px',
                        fontSize: '12px',
                        color: '#ffffff',
                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)'
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-2 pt-1 text-xs">
                {riskPieData.map((item, idx) => (
                  <div key={idx} className="flex items-center justify-between text-slate-700 bg-slate-50 px-2.5 py-1.5 rounded-lg border border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }}></span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <span className="font-mono font-bold text-slate-900">{item.value ? item.value.toLocaleString() : '0'}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Primary Bottlenecks ranking */}
          <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
              <div>
                <h2 className="font-bold text-slate-900 text-sm">{t('dash.bottlenecks_title', 'Primary Statutory Bottlenecks')}</h2>
                <p className="text-xs text-slate-500">Root causes driving delayed milestones across central infrastructure ministries</p>
              </div>
              <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded border border-slate-200">
                {t('dash.national_registry', 'National Registry')}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-1 text-xs">
              {bottlenecks.map((b, idx) => (
                <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="truncate pr-1 font-semibold">{b.bottleneck}</span>
                    <span className="font-mono text-amber-700 font-bold shrink-0">{b.share_pct}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-rose-500 h-full rounded-full"
                      style={{ width: `${Math.min(100, b.share_pct * 2.6)}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Role-Filtered Corridors / Priority Action Queue */}
      <div className="grid grid-cols-1 gap-6">

        {/* High Risk Escalation Queue Snippet */}
        <div className="w-full bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-slate-900 text-sm">
                  {isDistrictScoped
                    ? `Corridors Under Purview (${officerDistrict || 'Pune'} Jurisdiction)`
                    : isStateScoped
                    ? `Maharashtra Priority Infrastructure Corridors`
                    : t('dash.escalation_title', 'Projects Flagged for Administrative Escalation')}
                </h2>
                {(isDistrictScoped || isStateScoped) && (
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded border border-blue-200">
                    Active Purview
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {isDistrictScoped
                  ? `Active corridor projects located within ${officerDistrict || 'Pune'} district requiring direct CALA / DM intervention.`
                  : isStateScoped
                  ? `High-priority corridors monitored by the Maharashtra State Infrastructure Cell.`
                  : t('dash.escalation_desc', 'Ranked by calculated delay risk and active judicial / statutory disputes.')}
              </p>
            </div>
            <Link
              to="/projects"
              className="text-xs font-semibold text-blue-700 hover:text-blue-800 flex items-center gap-1"
            >
              <span>{t('dash.view_full_registry', 'View Full Registry')}</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 uppercase text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">{t('dash.th_project', 'Project')}</th>
                  <th className="py-2.5 px-3">{t('dash.th_location', 'State / District')}</th>
                  <th className="py-2.5 px-3">{t('dash.th_risk', 'Risk Level')}</th>
                  <th className="py-2.5 px-3">{t('dash.th_disputes', 'Disputes')}</th>
                  <th className="py-2.5 px-3">{t('dash.th_pfms', 'PFMS DBT')}</th>
                  <th className="py-2.5 px-3 text-right">{t('dash.th_action', 'Action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topProjects.map((p) => (
                  <tr key={p.project_id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-slate-900 truncate max-w-xs">{p.project_name}</div>
                      <div className="text-[10px] font-mono text-slate-400">{p.project_id} • {p.sector}</div>
                    </td>
                    <td className="py-2.5 px-3 text-slate-700">
                      {p.district}, {p.state}
                    </td>
                    <td className="py-2.5 px-3">
                      <RiskBadge tier={p.risk_tier} probability={p.delay_probability} showProb size="sm" />
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      <span className={p.active_court_disputes > 15 ? 'text-rose-700 font-bold' : 'text-slate-700'}>
                        {p.active_court_disputes}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-slate-700">
                      <span className={p.compensation_disbursed_pct < 45 ? 'text-amber-700 font-semibold' : 'text-emerald-700 font-semibold'}>
                        {p.compensation_disbursed_pct}%
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right space-x-1">
                      <Link
                        to={`/projects/${p.project_id}`}
                        className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-[11px] border border-slate-200 transition-colors inline-block"
                      >
                        {t('dash.btn_inspect', 'Inspect')}
                      </Link>
                      <Link
                        to={`/simulator?projectId=${p.project_id}`}
                        className="px-2.5 py-1 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 font-medium text-[11px] border border-blue-200 transition-colors inline-block"
                      >
                        {t('dash.btn_simulate', 'Simulate')}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
