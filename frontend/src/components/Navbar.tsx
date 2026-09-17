import React, { useState } from 'react';
import { Shield, Bell, User as UserIcon, ChevronDown, LogOut, CheckCircle2, Sparkles, Building2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';
import { UserRole } from '../types';
import { StateEmblem, TricolorRibbon } from './GovernmentEmblem';

interface NavbarProps {
  openAlertsCount?: number;
  onShowIntro?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ openAlertsCount = 4, onShowIntro }) => {
  const { user, quickLogin, logout } = useAuth();
  const { t } = useLanguage();
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const [switchFeedback, setSwitchFeedback] = useState<string | null>(null);

  const handleRoleSwitch = async (role: UserRole) => {
    await quickLogin(role);
    setRoleMenuOpen(false);
    setSwitchFeedback(`Switched to ${role}`);
    setTimeout(() => setSwitchFeedback(null), 2500);
  };

  return (
    <header className="relative bg-[#0a192f] border-b border-slate-800 sticky top-0 z-50 shadow-md">
      {/* Official Government Tricolor Micro Ribbon */}
      <TricolorRibbon className="h-[3px]" />

      <div className="h-16 flex items-center justify-between px-4 sm:px-6">
        {/* Brand & Subtitle with Official Lion Capital */}
        <div className="flex items-center gap-3.5">
          <div className="h-11 w-11 rounded-lg bg-slate-900/90 border border-amber-500/30 flex items-center justify-center p-1 shadow-inner shrink-0">
            <StateEmblem size="sm" variant="dark" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-base sm:text-lg tracking-wider text-white font-serif">LANDWATCH</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">
                National DPI
              </span>
              <span className="text-[10px] font-mono text-slate-400 hidden lg:inline-block">
                PM GatiShakti • PS-26017
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-400 font-medium truncate max-w-[280px] sm:max-w-md">
              भारत सरकार • Dept. of Land Resources (DoLR), MoRD
            </p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-3">
          {switchFeedback && (
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold animate-pulse">
              <CheckCircle2 className="h-3.5 w-3.5" />
              <span>{switchFeedback}</span>
            </div>
          )}

          {/* National Portal / Overview Button */}
          {onShowIntro && (
            <button
              onClick={onShowIntro}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-amber-500/30 text-amber-400 hover:text-amber-300 transition-colors text-xs flex items-center gap-2 shadow-xs"
              title="View National Overview & Legal Architecture"
            >
              <Building2 className="h-3.5 w-3.5 text-amber-400" />
              <span className="hidden md:inline-block font-semibold text-[11px] text-slate-200">National Portal</span>
            </button>
          )}

          {/* Global Language Selector (Native Scripts) */}
          <LanguageSelector variant="dark" />

          {/* Alerts Bell */}
          <a
            href="/alerts"
            className="relative p-2 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700 text-slate-300 hover:text-white transition-colors"
            title={t('nav.statutory_alerts', 'Statutory Alerts')}
          >
            <Bell className="h-4 w-4" />
            {openAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-rose-600 text-white font-mono text-[10px] flex items-center justify-center font-bold">
                {openAlertsCount}
              </span>
            )}
          </a>

          {/* User Profile & Role Switcher */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2.5 bg-slate-800/90 hover:bg-slate-700/90 px-3 py-1.5 rounded-lg border border-slate-700 transition-all text-left"
            >
              <div className="h-7 w-7 rounded-full bg-slate-700 border border-slate-600 flex items-center justify-center text-amber-400 font-bold text-xs">
                <UserIcon className="h-3.5 w-3.5" />
              </div>
              <div className="hidden sm:block">
                <div className="text-xs font-semibold text-white leading-tight">{user?.full_name || t('nav.authorized_officer', 'Authorized Officer')}</div>
                <div className="text-[10px] text-amber-400 font-mono font-medium">{user?.role} • {user?.district || user?.state}</div>
              </div>
              <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
            </button>

            {/* Role Switcher Dropdown */}
            {roleMenuOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl border border-slate-200 shadow-xl z-50 p-2 text-xs text-slate-800">
                <div className="px-2 py-1.5 border-b border-slate-100 mb-1">
                  <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{t('nav.role_verification', 'Role-Based Access Verification')}</p>
                </div>

                <button
                  onClick={() => handleRoleSwitch('ADMIN')}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between hover:bg-slate-50 ${user?.role === 'ADMIN' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700'}`}
                >
                  <div>
                    <div className="font-medium">National Administrator</div>
                    <div className="text-[10px] text-slate-500">Dr. Rajeshwari Sen (Mission Director)</div>
                  </div>
                  {user?.role === 'ADMIN' && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />}
                </button>

                <button
                  onClick={() => handleRoleSwitch('STATE_OFFICER')}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between hover:bg-slate-50 ${user?.role === 'STATE_OFFICER' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700'}`}
                >
                  <div>
                    <div className="font-medium">State Nodal Officer (Maharashtra)</div>
                    <div className="text-[10px] text-slate-500">Vikramaditya Shinde (Principal Secy)</div>
                  </div>
                  {user?.role === 'STATE_OFFICER' && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />}
                </button>

                <button
                  onClick={() => handleRoleSwitch('DISTRICT_COLLECTOR')}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between hover:bg-slate-50 ${user?.role === 'DISTRICT_COLLECTOR' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700'}`}
                >
                  <div>
                    <div className="font-medium">District Collector (Pune)</div>
                    <div className="text-[10px] text-slate-500">Dr. Suhas Diwase (DM Pune)</div>
                  </div>
                  {user?.role === 'DISTRICT_COLLECTOR' && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />}
                </button>

                <button
                  onClick={() => handleRoleSwitch('SLAO')}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between hover:bg-slate-50 ${user?.role === 'SLAO' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700'}`}
                >
                  <div>
                    <div className="font-medium">Special Land Acquisition Officer (SLAO)</div>
                    <div className="text-[10px] text-slate-500">Anand K. Verma (NHAI / MoRTH Node)</div>
                  </div>
                  {user?.role === 'SLAO' && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />}
                </button>

                <button
                  onClick={() => handleRoleSwitch('VIEWER')}
                  className={`w-full text-left p-2 rounded-lg flex items-center justify-between hover:bg-slate-50 ${user?.role === 'VIEWER' ? 'bg-blue-50 text-blue-800 font-semibold' : 'text-slate-700'}`}
                >
                  <div>
                    <div className="font-medium">Statutory Policy Observer</div>
                    <div className="text-[10px] text-slate-500">NITI Aayog Infrastructure Division</div>
                  </div>
                  {user?.role === 'VIEWER' && <CheckCircle2 className="h-3.5 w-3.5 text-blue-600" />}
                </button>

                <div className="border-t border-slate-100 mt-1 pt-1 space-y-0.5">
                  {onShowIntro && (
                    <button
                      onClick={() => {
                        setRoleMenuOpen(false);
                        onShowIntro();
                      }}
                      className="w-full text-left p-2 rounded-lg flex items-center gap-2 text-slate-700 hover:bg-slate-50"
                    >
                      <Shield className="h-3.5 w-3.5 text-amber-600" />
                      <span>View National Intro & Seal</span>
                    </button>
                  )}
                  <button
                    onClick={logout}
                    className="w-full text-left p-2 rounded-lg flex items-center gap-2 text-rose-600 hover:bg-rose-50"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>{t('nav.logout', 'Log Out')}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

