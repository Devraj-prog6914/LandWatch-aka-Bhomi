import React from 'react';

/**
 * Official Indian Government Emblems, Badges & Seals
 * Designed to adhere to the State Emblem of India (Prohibition of Improper Use) Act, 2005
 * and official National Portal of India & PM GatiShakti NMP design guidelines.
 */

// 1. National Emblem of India (Ashoka Lion Capital with Satyameva Jayate)
export const StateEmblem: React.FC<{
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'gold' | 'monochrome' | 'dark';
}> = ({ className = '', size = 'md', variant = 'gold' }) => {
  const sizeMap = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12',
    lg: 'h-16 w-16',
    xl: 'h-24 w-24'
  };

  const colorMap = {
    gold: {
      lions: '#D97706',
      accent: '#B45309',
      wheel: '#1E3A8A',
      base: '#92400E',
      text: '#78350F'
    },
    monochrome: {
      lions: '#334155',
      accent: '#1E293B',
      wheel: '#0F172A',
      base: '#475569',
      text: '#1E293B'
    },
    dark: {
      lions: '#FCD34D',
      accent: '#F59E0B',
      wheel: '#60A5FA',
      base: '#D97706',
      text: '#FDE68A'
    }
  }[variant];

  return (
    <div className={`inline-flex flex-col items-center justify-center select-none ${className}`}>
      <svg
        viewBox="0 0 100 120"
        className={`${sizeMap[size]} transition-transform hover:scale-105`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="State Emblem of India"
      >
        {/* Four Lions Crown Abacus (Front, Left, Right visible) */}
        <g id="lions-capital">
          {/* Central Lion Head */}
          <path
            d="M50 14 C44 14 41 18 41 23 C41 27 43 31 46 33 C44 36 44 41 46 45 C47 47 48 49 50 49 C52 49 53 47 54 45 C56 41 56 36 54 33 C57 31 59 27 59 23 C59 18 56 14 50 14 Z"
            fill={colorMap.lions}
            stroke={colorMap.accent}
            strokeWidth="1.2"
          />
          {/* Central Mane & Ears */}
          <path d="M42 20 C39 21 38 24 39 27 C40 29 42 30 43 31" stroke={colorMap.accent} strokeWidth="1.2" fill="none" />
          <path d="M58 20 C61 21 62 24 61 27 C60 29 58 30 57 31" stroke={colorMap.accent} strokeWidth="1.2" fill="none" />
          {/* Lion Eyes & Muzzle */}
          <circle cx="47" cy="22" r="1.2" fill={colorMap.accent} />
          <circle cx="53" cy="22" r="1.2" fill={colorMap.accent} />
          <ellipse cx="50" cy="26" rx="2.5" ry="1.5" fill={colorMap.accent} />
          <path d="M48 29 Q50 31 52 29" stroke={colorMap.accent} strokeWidth="1" fill="none" />

          {/* Left Lion Profile */}
          <path
            d="M38 23 C34 23 30 26 29 30 C28 34 30 38 33 41 C32 44 33 48 35 51 C37 54 40 55 42 53 C41 49 40 45 40 42 C38 39 37 35 38 31 C39 28 39 25 38 23 Z"
            fill={colorMap.lions}
            stroke={colorMap.accent}
            strokeWidth="1"
          />
          <circle cx="33" cy="29" r="1" fill={colorMap.accent} />

          {/* Right Lion Profile */}
          <path
            d="M62 23 C66 23 70 26 71 30 C72 34 70 38 67 41 C68 44 67 48 65 51 C63 54 60 55 58 53 C59 49 60 45 60 42 C62 39 63 35 62 31 C61 28 61 25 62 23 Z"
            fill={colorMap.lions}
            stroke={colorMap.accent}
            strokeWidth="1"
          />
          <circle cx="67" cy="29" r="1" fill={colorMap.accent} />

          {/* Chest & Posture Pedestal */}
          <path
            d="M36 52 C36 48 40 46 50 46 C60 46 64 48 64 52 C64 56 61 60 58 64 L42 64 C39 60 36 56 36 52 Z"
            fill={colorMap.lions}
            stroke={colorMap.accent}
            strokeWidth="1.2"
          />
        </g>

        {/* Circular Abacus Base */}
        <rect x="22" y="65" width="56" height="15" rx="2" fill={colorMap.base} stroke={colorMap.accent} strokeWidth="1" />

        {/* Central Ashoka Chakra on Abacus */}
        <circle cx="50" cy="72.5" r="5.5" fill="#FFFFFF" stroke={colorMap.wheel} strokeWidth="1" />
        <circle cx="50" cy="72.5" r="1.2" fill={colorMap.wheel} />
        {/* 12 radial spokes (simplified 24 for high clarity) */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
          <line
            key={deg}
            x1="50"
            y1="72.5"
            x2={50 + 4.5 * Math.cos((deg * Math.PI) / 180)}
            y2={72.5 + 4.5 * Math.sin((deg * Math.PI) / 180)}
            stroke={colorMap.wheel}
            strokeWidth="0.7"
          />
        ))}

        {/* Galloping Horse (Left of Abacus) */}
        <path
          d="M28 73 C30 71 33 71 34 73 C34 74 32 75 30 75 C29 76 28 76 27 75 Z"
          fill="#FFFFFF"
        />

        {/* Bull (Right of Abacus) */}
        <path
          d="M66 73 C68 71 71 71 72 73 C72 74 70 75 68 75 C67 76 66 76 65 75 Z"
          fill="#FFFFFF"
        />

        {/* Bell-Shaped Inverted Lotus Base */}
        <path
          d="M26 80 Q50 83 74 80 Q76 90 70 94 Q50 96 30 94 Q24 90 26 80 Z"
          fill={colorMap.lions}
          stroke={colorMap.accent}
          strokeWidth="1"
        />
        {/* Lotus Petal Ridges */}
        <path d="M38 82 Q40 92 37 94" stroke={colorMap.accent} strokeWidth="0.8" fill="none" />
        <path d="M46 82 Q48 93 47 95" stroke={colorMap.accent} strokeWidth="0.8" fill="none" />
        <path d="M54 82 Q52 93 53 95" stroke={colorMap.accent} strokeWidth="0.8" fill="none" />
        <path d="M62 82 Q60 92 63 94" stroke={colorMap.accent} strokeWidth="0.8" fill="none" />

        {/* Plinth Pedestal Base */}
        <rect x="20" y="95" width="60" height="4" rx="1" fill={colorMap.base} />

        {/* Satyameva Jayate Devnagari Script */}
        <text
          x="50"
          y="108"
          textAnchor="middle"
          fontSize="7.5"
          fontWeight="900"
          fontFamily="'Noto Sans Devanagari', 'Mangal', 'Yatra One', 'Arial Unicode MS', sans-serif"
          fill={colorMap.text}
          letterSpacing="0.5"
        >
          सत्यमेव जयते
        </text>
      </svg>
    </div>
  );
};

// 2. Official Indian Tricolor Ribbon Strip
export const TricolorRibbon: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`w-full h-1.5 flex shadow-xs select-none ${className}`}>
    <div className="flex-1 bg-[#FF9933]"></div>
    <div className="flex-1 bg-[#FFFFFF] flex items-center justify-center relative overflow-hidden">
      <div className="h-1.5 w-1.5 rounded-full border border-[#000080]/60"></div>
    </div>
    <div className="flex-1 bg-[#138808]"></div>
  </div>
);

// 3. PM GatiShakti National Master Plan Emblem
export const PMGatiShaktiLogo: React.FC<{ className?: string; size?: 'sm' | 'md' | 'lg' }> = ({
  className = '',
  size = 'md'
}) => {
  const sizeMap = {
    sm: 'h-8',
    md: 'h-11',
    lg: 'h-16'
  };

  return (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      <svg
        viewBox="0 0 160 50"
        className={`${sizeMap[size]} transition-all`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 7 Multimodal Synergy Petals / Hexagonal Gears */}
        <g id="gati-wheel">
          <circle cx="25" cy="25" r="21" fill="#0F172A" />
          <circle cx="25" cy="25" r="19" fill="#1E293B" stroke="#F59E0B" strokeWidth="1.5" />
          {/* 7 Synergy Arrows (Roads, Railways, Ports, Airports, Waterways, Mass Transport, Logistics) */}
          {[0, 51.4, 102.8, 154.2, 205.6, 257, 308.4].map((deg, i) => (
            <path
              key={i}
              d={`M25 25 L${25 + 14 * Math.cos((deg * Math.PI) / 180)} ${25 + 14 * Math.sin((deg * Math.PI) / 180)}`}
              stroke={i % 2 === 0 ? '#38BDF8' : '#F59E0B'}
              strokeWidth="2"
              strokeLinecap="round"
            />
          ))}
          <circle cx="25" cy="25" r="5" fill="#FFFFFF" />
          <circle cx="25" cy="25" r="2.5" fill="#0F172A" />
        </g>
        {/* GatiShakti Text Logo */}
        <text x="54" y="22" fill="#0F172A" fontSize="13" fontWeight="900" fontFamily="system-ui, sans-serif" letterSpacing="0.8">
          PM GatiShakti
        </text>
        <text x="54" y="34" fill="#64748B" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif" letterSpacing="0.5">
          NATIONAL MASTER PLAN
        </text>
        <rect x="54" y="38" width="80" height="2" fill="#F59E0B" rx="1" />
      </svg>
    </div>
  );
};

// 4. Digital India Logo Badge
export const DigitalIndiaBadge: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-white text-[10px] font-bold select-none ${className}`}>
    <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
    <span className="text-amber-400">Digital</span>
    <span className="text-white">India</span>
    <span className="text-[8px] px-1 py-0.5 rounded bg-blue-600 text-white font-mono uppercase">DPI</span>
  </div>
);

// 5. Ministry & Department Official Masthead
export const MinistryMasthead: React.FC<{
  showEmblem?: boolean;
  variant?: 'light' | 'dark';
  className?: string;
}> = ({ showEmblem = true, variant = 'light', className = '' }) => {
  const isDark = variant === 'dark';

  return (
    <div className={`flex items-center gap-3.5 select-none ${className}`}>
      {showEmblem && (
        <StateEmblem size="md" variant={isDark ? 'dark' : 'gold'} />
      )}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className={`text-[11px] font-black uppercase tracking-wider ${isDark ? 'text-amber-400' : 'text-slate-900'}`}>
            भारत सरकार
          </span>
          <span className={`text-[11px] font-semibold uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            | Government of India
          </span>
        </div>
        <div className={`text-xs font-bold ${isDark ? 'text-white' : 'text-slate-900'} leading-snug`}>
          ग्रामीण विकास मंत्रालय • Ministry of Rural Development
        </div>
        <div className={`text-[10px] font-semibold ${isDark ? 'text-blue-300' : 'text-blue-800'}`}>
          भूमि संसाधन विभाग (DoLR) • Department of Land Resources
        </div>
      </div>
    </div>
  );
};

// 6. Official Digital Signature & Verification Seal
export const OfficialGovSeal: React.FC<{
  title?: string;
  role?: string;
  code?: string;
  className?: string;
}> = ({
  title = 'Government of India',
  role = 'Authorized Land Acquisition Officer',
  code = 'RFCTLARR-ACT-2013',
  className = ''
}) => (
  <div className={`relative inline-flex flex-col items-center justify-center p-3 rounded-2xl border-2 border-dashed border-amber-500/50 bg-amber-500/5 text-amber-900 select-none ${className}`}>
    <div className="text-[9px] uppercase tracking-widest font-black text-amber-800">सत्यमेव जयते</div>
    <div className="text-xs font-black uppercase tracking-wider text-slate-900 mt-0.5">{title}</div>
    <div className="text-[10px] font-semibold text-slate-600">{role}</div>
    <div className="text-[8px] font-mono text-emerald-700 font-bold mt-1 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300">
      AUTHENTICATED CADRE NODE • {code}
    </div>
  </div>
);
