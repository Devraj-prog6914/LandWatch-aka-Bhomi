import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Layers, MapPin, ArrowUpRight, ShieldAlert, CheckCircle2, SlidersHorizontal } from 'lucide-react';
import { api } from '../services/api';
import { Project } from '../types';
import { RiskBadge } from '../components/RiskBadge';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

// Clean custom leaflet icon for government GIS
const createCustomIcon = (tier: string) => {
  let color = '#10b981';
  let pulseClass = '';
  if (tier === 'High') {
    color = '#f43f5e';
    pulseClass = 'ring-2 ring-rose-400/50';
  } else if (tier === 'Medium') {
    color = '#f59e0b';
    pulseClass = 'ring-2 ring-amber-400/40';
  }

  return L.divIcon({
    className: 'custom-leaflet-icon',
    html: `
      <div style="position: relative; width: 22px; height: 22px; display: flex; align-items: center; justify-content: center;">
        <div class="${pulseClass}" style="width: 14px; height: 14px; border-radius: 50%; background-color: ${color}; border: 2.5px solid #ffffff; box-shadow: 0 2px 6px rgba(0,0,0,0.35);"></div>
      </div>
    `,
    iconSize: [22, 22],
    iconAnchor: [11, 11]
  });
};

export const GisMap: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedRisk, setSelectedRisk] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [showCadastralOverlays, setShowCadastralOverlays] = useState(true);
  const [loading, setLoading] = useState(true);

  // Officer jurisdiction
  const isDistrictScoped = (user?.role === 'DISTRICT_COLLECTOR' || user?.role === 'SLAO') && !!user?.district;
  const isStateScoped = user?.role === 'STATE_OFFICER' && !!user?.state && user.state !== 'All India';
  const officerDistrict = isDistrictScoped ? user?.district?.replace(/Corridor Division|District|National HQ/gi, '').trim() : undefined;
  const officerState = isStateScoped ? user?.state : undefined;

  useEffect(() => {
    const fetchProjects = async () => {
      setLoading(true);
      try {
        const data = await api.getProjects({
          risk_tier: selectedRisk || undefined,
          state: selectedState || officerState || undefined,
          district: officerDistrict || undefined,
          limit: 150
        });
        setProjects(data);
      } catch (err) {
        console.error('Failed to load GIS project markers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, [selectedRisk, selectedState, user?.role, user?.district, user?.state]);

  const highRiskCount = projects.filter(p => p.risk_tier === 'High').length;
  const mediumRiskCount = projects.filter(p => p.risk_tier === 'Medium').length;
  const lowRiskCount = projects.filter(p => p.risk_tier === 'Low').length;

  return (
    <div className="space-y-4 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <MapPin className="h-6 w-6 text-blue-700" />
            <span>{t('gis.title', 'Cadastral GIS Spatial Surveillance')}</span>
          </h1>
          <p className="text-xs text-slate-500">
            {t('gis.desc', 'Georeferenced cadastral boundaries, RoW corridors, and statutory risk classification across national infrastructure projects.')}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <select
            value={selectedRisk}
            onChange={(e) => setSelectedRisk(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:border-blue-600 shadow-xs font-medium"
          >
            <option value="">{t('projects.filter_risk_all', 'All Risk Tiers')} ({projects.length})</option>
            <option value="High">{t('projects.filter_risk_high', 'Critical High Risk')} ({highRiskCount})</option>
            <option value="Medium">{t('projects.filter_risk_med', 'Moderate Risk')} ({mediumRiskCount})</option>
            <option value="Low">{t('projects.filter_risk_low', 'Low Risk / On Track')} ({lowRiskCount})</option>
          </select>

          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:border-blue-600 shadow-xs font-medium"
          >
            <option value="">{t('projects.filter_all_states', 'All States')}</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Uttar Pradesh">Uttar Pradesh</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Madhya Pradesh">Madhya Pradesh</option>
            <option value="Rajasthan">Rajasthan</option>
            <option value="Odisha">Odisha</option>
            <option value="Andhra Pradesh">Andhra Pradesh</option>
            <option value="Haryana">Haryana</option>
            <option value="West Bengal">West Bengal</option>
            <option value="Bihar">Bihar</option>
          </select>

          <button
            onClick={() => setShowCadastralOverlays(!showCadastralOverlays)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 shadow-xs transition-colors ${
              showCadastralOverlays
                ? 'bg-blue-50 text-blue-800 border-blue-200'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>{t('gis.buffer_btn', 'Cadastral Buffer')} ({showCadastralOverlays ? 'ACTIVE' : 'OFF'})</span>
          </button>
        </div>
      </div>

      {/* Quick Status Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
        <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <span className="text-slate-500 font-medium">{t('gis.mapped_count', 'Mapped Requisitions')}</span>
          <span className="font-mono font-bold text-slate-900">{projects.length}</span>
        </div>
        <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <span className="text-rose-600 font-medium flex items-center gap-1">
            <ShieldAlert className="h-3.5 w-3.5" /> {t('gis.high_risk_buffer', 'High Risk Buffer')}
          </span>
          <span className="font-mono font-bold text-rose-600">{highRiskCount}</span>
        </div>
        <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <span className="text-amber-600 font-medium">{t('gis.moderate_slippage', 'Moderate Slippage')}</span>
          <span className="font-mono font-bold text-amber-600">{mediumRiskCount}</span>
        </div>
        <div className="bg-white px-3.5 py-2.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
          <span className="text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="h-3.5 w-3.5" /> {t('gis.on_schedule', 'On Schedule')}
          </span>
          <span className="font-mono font-bold text-emerald-700">{lowRiskCount}</span>
        </div>
      </div>

      {/* Interactive Leaflet Map Container */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-[630px] relative z-0">
        <MapContainer
          center={[22.5937, 78.9629]}
          zoom={5}
          scrollWheelZoom={true}
          style={{ height: '100%', width: '100%' }}
        >
          {/* Reliable OpenStreetMap tile layer without API keys */}
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Ministry of Rural Development'
          />

          {projects.map((p) => {
            const icon = createCustomIcon(p.risk_tier);
            const radius = Math.min(26000, Math.max(6000, p.total_land_required_ha * 16));
            let circleColor = '#10b981';
            if (p.risk_tier === 'High') circleColor = '#f43f5e';
            else if (p.risk_tier === 'Medium') circleColor = '#f59e0b';

            return (
              <React.Fragment key={p.project_id}>
                {showCadastralOverlays && (
                  <Circle
                    center={[p.latitude, p.longitude]}
                    radius={radius}
                    pathOptions={{
                      color: circleColor,
                      fillColor: circleColor,
                      fillOpacity: 0.14,
                      weight: 1.5,
                      dashArray: '5, 5'
                    }}
                  />
                )}

                <Marker position={[p.latitude, p.longitude]} icon={icon}>
                  <Popup>
                    <div className="text-xs space-y-2 p-1.5 min-w-[240px] font-sans">
                      <div>
                        <div className="font-bold text-slate-900 text-sm leading-snug">{p.project_name}</div>
                        <div className="text-[10px] font-mono text-slate-500 mt-0.5">{p.project_id} • {p.implementing_agency}</div>
                        <div className="text-[9px] font-mono text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200 mt-1 inline-block">
                          ULPIN: 27{String(p.id || 1).padStart(3, '0')}{String(p.parcels_count || 120).padStart(4, '0')}{p.district.slice(0, 2).toUpperCase()}
                        </div>
                      </div>

                      <div className="flex items-center justify-between border-y border-slate-100 py-1.5">
                        <RiskBadge tier={p.risk_tier} probability={p.delay_probability} showProb size="sm" />
                        <span className="font-mono text-[11px] text-slate-900 font-semibold">
                          {p.delay_months_predicted > 0 ? `+${p.delay_months_predicted} mos slippage` : t('projects.on_schedule', 'On Schedule')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                        <div>Disputes: <span className="font-semibold text-slate-900">{p.active_court_disputes}</span></div>
                        <div>PFMS DBT: <span className="font-semibold text-slate-900">{p.compensation_disbursed_pct}%</span></div>
                        <div>Land Area: <span className="font-semibold text-slate-900">{p.total_land_required_ha} ha</span></div>
                        <div>Cadastral: <span className="font-semibold text-slate-900">{p.cadastral_digitized_pct}%</span></div>
                      </div>

                      <div className="text-[10px] text-slate-500 pt-0.5">
                        Primary Bottleneck: <span className="font-medium text-slate-800">{p.primary_bottleneck}</span>
                      </div>

                      <div className="pt-1.5 flex items-center justify-between border-t border-slate-100">
                        <Link
                          to={`/projects/${p.project_id}`}
                          className="text-blue-700 hover:text-blue-800 font-semibold text-[11px] flex items-center gap-1"
                        >
                          <span>{t('gis.popup_dossier', 'Full Inspection Dossier')}</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                        <Link
                          to={`/simulator?projectId=${p.project_id}`}
                          className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-[10px] font-medium hover:bg-slate-800 transition-colors flex items-center gap-1"
                        >
                          <SlidersHorizontal className="h-3 w-3" />
                          <span>{t('gis.popup_simulate', 'Simulate')}</span>
                        </Link>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              </React.Fragment>
            );
          })}
        </MapContainer>
      </div>
    </div>
  );
};
