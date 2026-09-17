import React, { useEffect, useState } from 'react';
import { ShieldAlert, CheckCircle2, Clock, Check, X, AlertTriangle } from 'lucide-react';
import { api } from '../services/api';
import { AlertItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export const Alerts: React.FC = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<AlertItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [selectedAlertForResolve, setSelectedAlertForResolve] = useState<AlertItem | null>(null);
  const [resolutionNotes, setResolutionNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Officer jurisdiction scoping
  const isDistrictScoped = (user?.role === 'DISTRICT_COLLECTOR' || user?.role === 'SLAO') && !!user?.district;
  const isStateScoped = user?.role === 'STATE_OFFICER' && !!user?.state && user.state !== 'All India';
  const officerDistrict = isDistrictScoped ? user?.district?.replace(/Corridor Division|District|National HQ/gi, '').trim() : undefined;
  const officerState = isStateScoped ? user?.state : undefined;

  const loadAlerts = async () => {
    setLoading(true);
    try {
      let data = await api.getAlerts(statusFilter || undefined);
      if (officerDistrict) {
        data = data.filter(a => a.district?.toLowerCase().includes(officerDistrict.toLowerCase()));
      } else if (officerState) {
        data = data.filter(a => a.state?.toLowerCase().includes(officerState.toLowerCase()));
      }
      setAlerts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlerts();
  }, [statusFilter, user?.role, user?.district, user?.state]);

  const handleAcknowledge = async (id: number) => {
    try {
      await api.actOnAlert(id, 'ACKNOWLEDGE');
      loadAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleResolveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAlertForResolve) return;
    setSubmitting(true);
    try {
      await api.actOnAlert(selectedAlertForResolve.id, 'RESOLVE', resolutionNotes);
      setSelectedAlertForResolve(null);
      setResolutionNotes('');
      loadAlerts();
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="h-6 w-6 text-rose-600" />
            <span>{t('alerts.title', 'Statutory Early-Warning Notices')}</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            {t('alerts.desc', 'Automated statutory triggers monitoring RFCTLARR statutory deadlines, judicial stay orders, and environmental clearances.')}
          </p>
        </div>

        {/* Filter */}
        <div className="flex items-center gap-2 text-xs">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-1.5 text-slate-700 focus:outline-none focus:border-blue-600 shadow-sm"
          >
            <option value="">{t('alerts.filter_all', 'All Statuses')}</option>
            <option value="OPEN">{t('alerts.filter_open', 'Open Notices')}</option>
            <option value="ACKNOWLEDGED">{t('alerts.filter_ack', 'Acknowledged')}</option>
            <option value="RESOLVED">{t('alerts.filter_res', 'Resolved')}</option>
          </select>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-slate-500 italic">
            Scanning portfolio for statutory triggers...
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500 shadow-sm">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-900">{t('alerts.empty', 'No active notices matching current filter.')}</p>
            <p className="text-xs mt-1">{t('alerts.empty_sub', 'All monitored infrastructure parameters are operating within statutory thresholds.')}</p>
          </div>
        ) : (
          alerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isOpen = alert.status === 'OPEN';
            const isAck = alert.status === 'ACKNOWLEDGED';
            const isResolved = alert.status === 'RESOLVED';

            return (
              <div
                key={alert.id}
                className={`p-5 rounded-2xl border transition-all ${
                  isOpen && isCritical
                    ? 'bg-rose-50/40 border-rose-200'
                    : isOpen
                    ? 'bg-amber-50/40 border-amber-200'
                    : 'bg-white border-slate-200 shadow-sm'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase ${
                        isCritical
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {alert.severity}
                    </span>
                    <span
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${
                        isOpen
                          ? 'bg-rose-100 text-rose-800'
                          : isAck
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {alert.status}
                    </span>
                    <h3 className="font-semibold text-slate-900 text-sm">{alert.title}</h3>
                  </div>

                  <div className="text-[11px] font-mono text-slate-500 shrink-0">
                    {alert.project_name} ({alert.district}, {alert.state})
                  </div>
                </div>

                <p className="text-xs text-slate-700 mt-1 leading-relaxed">{alert.description}</p>

                {alert.recommended_action && (
                  <div className="mt-3 p-3 rounded-xl bg-white border border-slate-200 text-xs flex items-start gap-2 shadow-xs">
                    <AlertTriangle className="h-4 w-4 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-900">Statutory Remedy: </span>
                      <span className="text-slate-700">{alert.recommended_action}</span>
                    </div>
                  </div>
                )}

                {/* Footer and Workflow Actions */}
                <div className="mt-3 pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="text-[11px] text-slate-400 font-mono">
                    Logged: {new Date(alert.created_at).toLocaleDateString()}
                    {alert.acknowledged_by && ` • Ack: ${alert.acknowledged_by}`}
                    {alert.resolved_by && ` • Resolved: ${alert.resolved_by}`}
                  </div>

                  <div className="flex items-center gap-2">
                    {isOpen && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        className="px-3 py-1 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium flex items-center gap-1 shadow-sm transition-colors"
                      >
                        <Clock className="h-3 w-3 text-slate-500" />
                        <span>{t('alerts.btn_ack', 'Acknowledge')}</span>
                      </button>
                    )}
                    {!isResolved && (
                      <button
                        onClick={() => setSelectedAlertForResolve(alert)}
                        className="px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 text-xs font-semibold flex items-center gap-1 transition-colors"
                      >
                        <Check className="h-3 w-3 text-emerald-600" />
                        <span>{t('alerts.btn_resolve', 'Record Resolution')}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resolution Modal */}
      {selectedAlertForResolve && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl border border-slate-200 shadow-xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Record Statutory Resolution for Notice #{selectedAlertForResolve.id}
              </h3>
              <button
                onClick={() => setSelectedAlertForResolve(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleResolveSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">
                  Administrative Action Taken & Notes
                </label>
                <textarea
                  rows={4}
                  required
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  placeholder="e.g. Convened Special Lok Adalat camp on 12-Aug. Consent awards executed with 14 affected landholders under Section 23; stay vacated."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-blue-600"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAlertForResolve(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Check className="h-4 w-4" />
                  <span>{submitting ? 'Saving...' : 'Resolve Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
