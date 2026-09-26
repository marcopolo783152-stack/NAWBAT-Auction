import React from 'react';
import { Building2, FileCheck, ShieldCheck, Banknote, PhoneCall, Send } from 'lucide-react';
import { Language } from '../types/auction';
import { translations } from '../translations';

interface CorporateBannerProps {
  currentLang: Language;
  onOpenConsultation: () => void;
}

export const CorporateBanner: React.FC<CorporateBannerProps> = ({ currentLang, onOpenConsultation }) => {
  const t = translations[currentLang];

  return (
    <section className="w-full px-4 lg:px-8 py-8 bg-[#f7f9ff]">
      <div className="max-w-7xl mx-auto bg-gradient-to-r from-[#0b5345] via-[#003a2f] to-[#002019] rounded-2xl p-6 lg:p-10 text-white shadow-xl relative overflow-hidden flex flex-col lg:flex-row items-center justify-between gap-8 border border-[#afefdc]/20">
        {/* Soft decorative glow */}
        <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-[#afefdc]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex-1 flex flex-col gap-3 relative z-10 text-center lg:text-right">
          <div className="inline-flex items-center gap-2 bg-white/15 px-3.5 py-1 rounded-full text-[#afefdc] text-xs font-semibold w-fit mx-auto lg:mx-0 backdrop-blur-xs">
            <Building2 className="w-4 h-4" />
            <span>{t.corporateEyebrow}</span>
          </div>

          <h2 className="font-serif text-2xl lg:text-3xl font-bold text-white tracking-tight leading-snug">
            {t.corporateTitle}
          </h2>

          <p className="text-xs sm:text-sm text-[#dde9f9] max-w-2xl leading-relaxed">
            {t.corporateDesc}
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2 text-xs font-medium text-[#afefdc]">
            <span className="flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5 text-[#ffe085]" />
              {t.corporateFeature1}
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#ffe085]" />
              {t.corporateFeature2}
            </span>
            <span className="flex items-center gap-1.5">
              <Banknote className="w-3.5 h-3.5 text-[#ffe085]" />
              {t.corporateFeature3}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="relative z-10 flex flex-col sm:flex-row lg:flex-col gap-2.5 w-full lg:w-auto shrink-0">
          <button
            onClick={onOpenConsultation}
            className="bg-[#a5d4fd] hover:bg-[#cce5ff] text-[#001e31] px-6 py-3 rounded-lg text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-md transition-colors text-center cursor-pointer"
          >
            <Send className="w-4 h-4 text-[#001e31]" />
            <span>{t.reqCorporateBtn}</span>
          </button>

          <button
            onClick={onOpenConsultation}
            className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors text-center cursor-pointer border border-white/20"
          >
            <PhoneCall className="w-4 h-4 text-[#afefdc]" />
            <span>{t.consultBtn}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
