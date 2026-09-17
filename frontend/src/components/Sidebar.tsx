import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Layers,
  SlidersHorizontal,
  MapPin,
  AlertTriangle,
  ShieldCheck,
  History
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const Sidebar: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();

  const allNavItems = [
    { to: '/', label: t('sidebar.overview', 'Overview'), icon: LayoutDashboard, roles: ['ADMIN', 'STATE_OFFICER', 'DISTRICT_COLLECTOR', 'SLAO', 'VIEWER'] },
    { to: '/projects', label: t('sidebar.escalation_queue', 'Escalation Queue'), icon: Layers, roles: ['ADMIN', 'STATE_OFFICER', 'DISTRICT_COLLECTOR', 'SLAO', 'VIEWER'] },
    { to: '/simulator', label: t('sidebar.simulator', 'Intervention Simulator'), icon: SlidersHorizontal, roles: ['ADMIN', 'STATE_OFFICER', 'DISTRICT_COLLECTOR', 'SLAO'] },
    { to: '/gis-map', label: t('sidebar.gis_map', 'Cadastral GIS Map'), icon: MapPin, roles: ['ADMIN', 'STATE_OFFICER', 'DISTRICT_COLLECTOR', 'SLAO', 'VIEWER'] },
    { to: '/alerts', label: t('sidebar.alerts', 'Statutory Alerts'), icon: AlertTriangle, roles: ['ADMIN', 'STATE_OFFICER', 'DISTRICT_COLLECTOR', 'SLAO'] },
    { to: '/governance', label: t('sidebar.model_validation', 'Model Validation & Accuracy'), icon: ShieldCheck, roles: ['ADMIN', 'VIEWER'] },
    { to: '/audit-logs', label: t('sidebar.audit_trail', 'Activity Audit Trail'), icon: History, roles: ['ADMIN', 'STATE_OFFICER'] },
  ];

  const navItems = allNavItems.filter(item => !user?.role || item.roles.includes(user.role));

  return (
    <aside className="w-64 bg-white border-r border-slate-200 flex flex-col justify-between p-4 min-h-[calc(100vh-4rem)] shadow-sm">
      <div className="space-y-1">
        <div className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
          <span>{t('sidebar.core_operations', 'Core Operations')}</span>
          <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-700 font-mono font-semibold">
            {user?.role === 'ADMIN' ? 'ALL-INDIA' : user?.district || user?.state}
          </span>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-800 border border-blue-200 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50 border border-transparent'
                }`
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>

      {/* Gov Portal Integrations Status Footer */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-[11px] space-y-2">
        <div className="flex items-center justify-between font-semibold text-slate-800">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>{t('sidebar.gateways', 'DPI Gateways Status')}</span>
          </div>
          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">LIVE</span>
        </div>
        <div className="space-y-1 font-mono text-[10px] text-slate-600">
          <div className="flex justify-between">
            <span>PFMS DBT:</span>
            <span className="text-emerald-700 font-semibold">{t('sidebar.synced', 'SYNCED')}</span>
          </div>
          <div className="flex justify-between">
            <span>e-Courts NJDG:</span>
            <span className="text-emerald-700 font-semibold">{t('sidebar.connected', 'CONNECTED')}</span>
          </div>
          <div className="flex justify-between">
            <span>DILRMP Bhoomi:</span>
            <span className="text-emerald-700 font-semibold">{t('sidebar.online', 'ONLINE')}</span>
          </div>
          <div className="flex justify-between">
            <span>PARIVESH 2.0:</span>
            <span className="text-emerald-700 font-semibold">{t('sidebar.active', 'ACTIVE')}</span>
          </div>
        </div>

        <div className="pt-2 border-t border-slate-200/80 flex items-center justify-between text-[9px] text-slate-500 font-sans">
          <span>NIC Cloud MeghRaj</span>
          <span className="text-amber-700 font-medium">PM GatiShakti NMP</span>
        </div>
      </div>
    </aside>
  );
};
