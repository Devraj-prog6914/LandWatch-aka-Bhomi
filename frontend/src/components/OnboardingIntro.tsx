import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Layers,
  AlertTriangle,
  SlidersHorizontal,
  ShieldCheck,
  ChevronRight,
  ChevronLeft,
  Volume2,
  VolumeX,
  Sparkles,
  ArrowRight,
  Scale,
  Database,
  MapPin,
  CheckCircle2,
  X
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface OnboardingIntroProps {
  isOpen: boolean;
  onClose: () => void;
}

export const OnboardingIntro: React.FC<OnboardingIntroProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio synthesizer for pristine, zero-dependency browser audio
  const getAudioContext = () => {
    if (!audioCtxRef.current) {
      const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtxClass) {
        audioCtxRef.current = new AudioCtxClass();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  };

  const playTone = (freq: number, type: OscillatorType, duration: number, gainVal: number = 0.05) => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch {
      // Gracefully ignore browser audio policy restrictions
    }
  };

  const playTransitionSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch {
      // Audio fallback
    }
  };

  const playLaunchSound = () => {
    if (!soundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        setTimeout(() => {
          playTone(freq, 'sine', 0.4, 0.06);
        }, idx * 70);
      });
    } catch {
      // Audio fallback
    }
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      } else if (e.key === 'Escape') {
        handleComplete();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, currentSlide]);

  if (!isOpen) return null;

  const slides = [
    {
      id: 'surveillance',
      badge: 'PILLAR I • GEO-SPATIAL INTELLIGENCE',
      title: 'National Infrastructure Geo-Surveillance',
      subtitle: 'Continuous georeferenced monitoring of 2,750+ corridor requisitions with cadastral parcel geofencing.',
      icon: Layers,
      color: 'blue',
      metrics: [
        { label: 'Monitored Capital', value: '₹2,85,000 Cr' },
        { label: 'Georeferenced Parcels', value: '100% Vector GIS' },
        { label: 'States & UTs Covered', value: '28 Jurisdictions' }
      ],
      points: [
        'DILRMP cadastral vector overlay integration with State Bhulekh / Bhoomi portals.',
        'High-precision drone orthomosaic boundary verification preventing right-of-way overlap.',
        'Automated spatial buffer detection around wildlife reserves, wetlands, and defense assets.'
      ]
    },
    {
      id: 'early-warning',
      badge: 'PILLAR II • PREDICTIVE STATUTORY RISK',
      title: 'Predictive Statutory Delay Early-Warning',
      subtitle: 'Flagging judicial injunctions, Section 19 sunset lapses, and clearance bottlenecks before deadlines expire.',
      icon: AlertTriangle,
      color: 'rose',
      metrics: [
        { label: 'Slippage Flagged', value: '1,130 Projects' },
        { label: 'Capital at Risk', value: '₹1,42,500 Cr' },
        { label: 'Avg Pre-Warning', value: '14.2 Mos Ahead' }
      ],
      points: [
        'Automatic tracking of RFCTLARR Section 19(1) 12-month statutory sunset clause to avoid lapse.',
        'Real-time NJDG e-Courts synchronization for title disputes, High Court writs, and stay orders.',
        'PARIVESH 2.0 MoEFCC telemetry alerting officers to pending Stage-II forest diversion approvals.'
      ]
    },
    {
      id: 'intervention-studio',
      badge: 'PILLAR III • WHAT-IF POLICY STUDIO',
      title: 'Interactive Administrative Intervention Studio',
      subtitle: 'Counterfactual policy evaluation enabling District Collectors & Ministries to quantify saved calendar days.',
      icon: SlidersHorizontal,
      color: 'amber',
      metrics: [
        { label: 'Avg Risk Reduction', value: 'Up to -64.2%' },
        { label: 'Timeline Saved', value: '~180 Calendar Days' },
        { label: 'Remedy Directives', value: 'Statutory Prescriptions' }
      ],
      points: [
        'Simulate Section 23 consent awards and Special Lok Adalat camps before executive deployment.',
        'Model the acceleration of PFMS direct benefit transfer (DBT) and Aadhaar seeding rates.',
        'Receive instant legal prescriptions citing specific sections of RFCTLARR Act 2013.'
      ]
    },
    {
      id: 'governance',
      badge: 'PILLAR IV • EMPIRICAL INTEGRITY',
      title: 'Calibrated Analytics & Audit Integrity',
      subtitle: 'Peer-reviewed machine learning accuracy with zero data leakage and immutable administrative audit trails.',
      icon: ShieldCheck,
      color: 'emerald',
      metrics: [
        { label: 'Holdout Accuracy', value: '89.45%' },
        { label: 'ROC-AUC Area', value: '0.9412' },
        { label: 'Attribution Engine', value: 'TreeSHAP Audited' }
      ],
      points: [
        'Strictly zero target leakage: feature encoders fitted purely on sterile train splits.',
        'TreeSHAP explainability maps every risk score to transparent, human-auditable friction drivers.',
        'Full compliance with National Data Governance Framework and immutable action logs.'
      ]
    }
  ];

  const slide = slides[currentSlide];

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      playTransitionSound();
      setCurrentSlide(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      playTransitionSound();
      setCurrentSlide(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    playLaunchSound();
    localStorage.setItem('landwatch_intro_completed', 'true');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md transition-all duration-300">
      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-[#0b1329] border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Background Radiant Glow Accents */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-amber-500/15 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Bar with National Branding and Audio Controls */}
        <div className="relative z-10 px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 backdrop-blur-xs">
          <div className="flex items-center gap-3">
            {/* National Insignia Emblem Badge */}
            <div className="relative h-10 w-10 rounded-xl bg-gradient-to-b from-amber-400/20 to-amber-600/20 border border-amber-400/40 flex items-center justify-center shadow-inner">
              <Shield className="h-5 w-5 text-amber-400" />
              <div className="absolute -inset-1 rounded-xl bg-amber-400/10 blur-xs -z-10 animate-pulse"></div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-wider text-white">LANDWATCH</span>
                <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-amber-500/30">
                  {t('brand.name', 'Land Acquisition Monitoring')}
                </span>
                <span className="text-[10px] font-mono text-slate-400 hidden sm:inline-block">
                  GovTech 2026
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium truncate max-w-xs sm:max-w-md">
                PM GatiShakti National Master Plan • Ministry of Rural Development
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Synthesis Toggle */}
            <button
              onClick={() => {
                setSoundEnabled(!soundEnabled);
                if (!soundEnabled) playTone(600, 'sine', 0.15, 0.05);
              }}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors text-xs flex items-center gap-1.5"
              title={soundEnabled ? 'Mute Interface Chimes' : 'Enable Interface Chimes'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-amber-400" /> : <VolumeX className="h-4 w-4 text-slate-500" />}
              <span className="text-[10px] hidden sm:inline-block">{soundEnabled ? 'Audio ON' : 'Muted'}</span>
            </button>

            {/* Skip / Close */}
            <button
              onClick={handleComplete}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-colors"
              title="Skip intro and enter portal"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Slide Progress Stepper Header */}
        <div className="px-6 pt-5 pb-2 bg-slate-900/40 border-b border-slate-800/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            {slides.map((s, idx) => (
              <button
                key={s.id}
                onClick={() => {
                  playTransitionSound();
                  setCurrentSlide(idx);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide
                    ? 'w-10 bg-gradient-to-r from-blue-500 to-amber-400'
                    : idx < currentSlide
                    ? 'w-3 bg-blue-500/60'
                    : 'w-3 bg-slate-700'
                }`}
                title={`Slide ${idx + 1}: ${s.title}`}
              />
            ))}
          </div>

          <span className="text-[11px] font-mono text-slate-400">
            Capability <span className="text-white font-bold">{currentSlide + 1}</span> of {slides.length}
          </span>
        </div>

        {/* Main Interactive Slide Content Area */}
        <div className="p-6 sm:p-8 flex-1 overflow-y-auto space-y-6">
          {/* Badge & Title */}
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-950/70 border border-blue-700/50 text-[11px] font-mono font-semibold text-blue-300 tracking-wider mb-3">
              <Sparkles className="h-3 w-3 text-amber-400" />
              <span>{slide.badge}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-slate-800/90 border border-slate-700 text-amber-400">
                <slide.icon className="h-6 w-6" />
              </div>
              <span>{slide.title}</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 mt-2 max-w-2xl leading-relaxed">
              {slide.subtitle}
            </p>
          </div>

          {/* Key Metric Spotlight Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
            {slide.metrics.map((m, idx) => (
              <div
                key={idx}
                className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 shadow-sm relative overflow-hidden group hover:border-slate-700 transition-colors"
              >
                <div className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {m.label}
                </div>
                <div className="text-xl sm:text-2xl font-bold font-mono text-white mt-1">
                  {m.value}
                </div>
                <div className="absolute top-0 right-0 h-full w-1 bg-gradient-to-b from-blue-500 to-amber-500 opacity-60"></div>
              </div>
            ))}
          </div>

          {/* Key Operational Features Checklist */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-3">
            <h3 className="text-xs uppercase font-bold tracking-wider text-slate-400 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400" />
              <span>Core Architectural Highlights</span>
            </h3>

            <div className="space-y-2.5 text-xs sm:text-sm text-slate-200">
              {slide.points.map((pt, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-amber-400 mt-2 shrink-0"></div>
                  <p className="leading-relaxed">{pt}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Controls & Enter Button */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            onClick={handlePrev}
            disabled={currentSlide === 0}
            className={`px-4 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              currentSlide === 0
                ? 'opacity-30 cursor-not-allowed border-slate-800 text-slate-500'
                : 'border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <button
              onClick={handleComplete}
              className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Skip to Portal
            </button>

            {currentSlide < slides.length - 1 ? (
              <button
                onClick={handleNext}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md hover:shadow-blue-600/30 flex items-center gap-2 transition-all"
              >
                <span>Next Feature</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 hover:from-amber-400 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-orange-500/25 flex items-center gap-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] animate-pulse"
              >
                <span>Enter National Command Center</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
