import React from 'react';
import { ShieldCheck, CheckCircle2, Truck } from 'lucide-react';
import { Language } from '../types/auction';
import { translations } from '../translations';

interface TrustRibbonProps {
  currentLang: Language;
}

export const TrustRibbon: React.FC<TrustRibbonProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  return (
    <section className="w-full bg-[#003a2f] text-white px-4 lg:px-8 py-2 relative overflow-hidden shadow-xs">
      <div className="absolute inset-0 bg-gradient-to-r from-[#003a2f] via-[#0b5345] to-[#003a2f] opacity-70 pointer-events-none" />
      <div className="relative z-10 max-w-7xl mx-auto flex flex-col xl:flex-row items-center justify-between gap-2 text-center xl:text-right">
        {/* Left message & protocol badge */}
        <div className="flex flex-wrap items-center justify-center xl:justify-start gap-2">
          <span className="inline-flex items-center gap-1.5 bg-white/15 px-2.5 py-0.5 rounded-full text-[#afefdc] text-xs font-semibold backdrop-blur-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#afefdc]" />
            {t.trustNoticeTitle}
          </span>
          <span className="text-xs text-[#dde9f9] leading-relaxed">
            {t.trustNoticeDesc}
          </span>
        </div>

        {/* Real-time stats indicators */}
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-[#dde9f9]">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#cce5ff] animate-ping" />
            <strong className="text-white font-bold">{t.activeLotsCount}</strong>
          </span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#ffe085]" />
            <strong className="text-white font-bold">{t.satisfactionRate}</strong>
          </span>
          <span className="text-white/40 hidden sm:inline">|</span>
          <span className="flex items-center gap-1.5">
            <Truck className="w-3.5 h-3.5 text-[#afefdc]" />
            <span>{t.shippingCoverage}</span>
          </span>
        </div>
      </div>
    </section>
  );
};
