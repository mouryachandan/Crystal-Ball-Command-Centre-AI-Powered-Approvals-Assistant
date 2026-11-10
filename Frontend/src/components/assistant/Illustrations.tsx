import React from 'react';

/**
 * High-fidelity vector illustrations recreating the 4 cards and avatar
 * from the OomniEye Approvals reference panel.
 */

export const ApprovalsAvatar: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg viewBox="0 0 40 40" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="40" height="40" rx="8" fill="#F59E0B" />
    {/* Head */}
    <circle cx="20" cy="18" r="9" fill="#1E293B" />
    <circle cx="20" cy="18" r="7.5" fill="#FDE68A" />
    {/* Hair/Headset */}
    <path d="M12 18C12 13 16 10 20 10C24 10 28 13 28 18" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
    <rect x="10" y="16" width="3" height="6" rx="1.5" fill="#1E293B" />
    <rect x="27" y="16" width="3" height="6" rx="1.5" fill="#1E293B" />
    {/* Face */}
    <circle cx="17.5" cy="18" r="1" fill="#1E293B" />
    <circle cx="22.5" cy="18" r="1" fill="#1E293B" />
    <path d="M18.5 21C19 22 21 22 21.5 21" stroke="#1E293B" strokeWidth="1" strokeLinecap="round" />
    {/* Body / Yellow Shirt */}
    <path d="M11 36C11 29 15 27 20 27C25 27 29 29 29 36" fill="#FBBF24" />
    <path d="M17 27L20 31L23 27" stroke="#1E293B" strokeWidth="1.5" />
  </svg>
);

export const SummaryIllustration: React.FC = () => (
  <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
    {/* Soft background aura */}
    <circle cx="60" cy="60" r="46" fill="#FEF3C7" opacity="0.6" />
    {/* Papers in hand */}
    <rect x="62" y="38" width="26" height="34" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1.5" transform="rotate(8 62 38)" />
    <line x1="68" y1="46" x2="82" y2="48" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="67" y1="52" x2="81" y2="54" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
    <line x1="66" y1="58" x2="76" y2="60" stroke="#64748B" strokeWidth="1.5" strokeLinecap="round" />
    {/* Character Head & Hair */}
    <circle cx="48" cy="38" r="14" fill="#FDE68A" />
    <path d="M36 34C37 24 45 22 54 24C62 26 62 34 60 38" fill="#1E293B" />
    {/* Glasses / Eyes */}
    <circle cx="44" cy="37" r="3" stroke="#1E293B" strokeWidth="1.2" />
    <circle cx="52" cy="37" r="3" stroke="#1E293B" strokeWidth="1.2" />
    <line x1="47" y1="37" x2="49" y2="37" stroke="#1E293B" strokeWidth="1.2" />
    {/* Yellow Top */}
    <path d="M34 84C34 62 40 54 48 54C56 54 64 62 64 84H34Z" fill="#F59E0B" />
    {/* Arms holding paper */}
    <path d="M38 60L54 68L68 56" stroke="#D97706" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
    {/* Collar */}
    <path d="M44 54L48 62L52 54" stroke="#1E293B" strokeWidth="1.5" fill="#FFF" />
  </svg>
);

export const TalkIllustration: React.FC = () => (
  <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="46" fill="#EEF2FF" opacity="0.6" />
    {/* Soundwaves / Speech ripples */}
    <path d="M78 36C83 40 83 48 78 52" stroke="#6366F1" strokeWidth="2" strokeLinecap="round" />
    <path d="M84 32C92 38 92 50 84 56" stroke="#818CF8" strokeWidth="2" strokeLinecap="round" strokeDasharray="1 1" />
    {/* Microphone on boom */}
    <rect x="68" y="44" width="4" height="7" rx="2" fill="#4338CA" />
    <path d="M66 48C66 52 74 52 74 48" stroke="#4338CA" strokeWidth="1.2" />
    <line x1="70" y1="52" x2="70" y2="58" stroke="#4338CA" strokeWidth="1.2" />
    {/* Character with Headset */}
    <circle cx="50" cy="40" r="14" fill="#FDE68A" />
    <path d="M37 38C38 26 48 24 57 26C63 28 64 36 62 42" fill="#1E293B" />
    {/* Headset band */}
    <path d="M38 38C38 28 48 24 58 32" stroke="#4338CA" strokeWidth="2.5" strokeLinecap="round" />
    <circle cx="38" cy="38" r="3.5" fill="#4338CA" />
    {/* Body */}
    <path d="M36 84C36 64 42 56 50 56C58 56 66 64 66 84H36Z" fill="#312E81" />
    {/* Laptop on desk */}
    <rect x="52" y="70" width="28" height="14" rx="2" fill="#E2E8F0" stroke="#94A3B8" strokeWidth="1" />
    <line x1="46" y1="84" x2="86" y2="84" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const HelpIllustration: React.FC = () => (
  <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="46" fill="#FEF3C7" opacity="0.6" />
    {/* Big floating question mark */}
    <text x="66" y="34" fill="#F59E0B" fontSize="26" fontWeight="bold" fontFamily="sans-serif">
      ?
    </text>
    {/* Character head tilted */}
    <circle cx="48" cy="44" r="14" fill="#FDE68A" />
    <path d="M36 40C37 28 46 26 56 28C62 30 63 38 61 44" fill="#1E293B" />
    {/* Thinking gesture (hand to chin) */}
    <circle cx="45" cy="43" r="1.2" fill="#1E293B" />
    <circle cx="53" cy="43" r="1.2" fill="#1E293B" />
    {/* Body in Yellow */}
    <path d="M34 84C34 66 40 60 48 60C56 60 64 66 64 84H34Z" fill="#F59E0B" />
    {/* Hand under chin */}
    <path d="M38 78L48 68L50 54" stroke="#D97706" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export const TeachIllustration: React.FC = () => (
  <svg viewBox="0 0 120 120" className="w-20 h-20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="60" cy="60" r="46" fill="#F3E8FF" opacity="0.6" />
    {/* Graduation mortarboard cap hovering */}
    <path d="M60 16L78 24L60 32L42 24L60 16Z" fill="#4338CA" />
    <rect x="52" y="29" width="16" height="5" rx="1.5" fill="#312E81" />
    <path d="M74 25V35L77 37" stroke="#F59E0B" strokeWidth="1.5" strokeLinecap="round" />
    {/* Person 1 (Learner) */}
    <circle cx="42" cy="48" r="11" fill="#FDE68A" />
    <path d="M32 46C33 36 40 34 48 36" fill="#1E293B" />
    <path d="M30 84C30 68 36 62 42 62C48 62 52 68 52 84H30Z" fill="#F59E0B" />
    {/* Person 2 (Mentor) */}
    <circle cx="70" cy="46" r="11" fill="#FDE68A" />
    <path d="M62 44C63 34 72 32 78 35" fill="#1E293B" />
    <path d="M60 84C60 66 65 60 72 60C79 60 84 66 84 84H60Z" fill="#1E293B" />
    {/* Collaboration desk */}
    <line x1="26" y1="84" x2="94" y2="84" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

