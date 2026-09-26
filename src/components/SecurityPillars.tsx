import React from 'react';
import { UserCheck, Bot, Timer, QrCode, Landmark, CheckCircle } from 'lucide-react';
import { Language } from '../types/auction';
import { translations } from '../translations';

interface SecurityPillarsProps {
  currentLang: Language;
}

export const SecurityPillars: React.FC<SecurityPillarsProps> = ({ currentLang }) => {
  const t = translations[currentLang];

  const pillars = [
    {
      layer: 'لایه اول',
      layerEn: 'Tier 1',
      title: t.layer1Title,
      desc: t.layer1Desc,
      badge: t.layer1Badge,
      icon: UserCheck,
      color: 'bg-[#afefdc]',
      textColor: 'text-[#003a2f]',
    },
    {
      layer: 'لایه دوم',
      layerEn: 'Tier 2',
      title: t.layer2Title,
      desc: t.layer2Desc,
      badge: t.layer2Badge,
      icon: Bot,
      color: 'bg-[#cce5ff]',
      textColor: 'text-[#001e31]',
    },
    {
      layer: 'لایه سوم',
      layerEn: 'Tier 3',
      title: t.layer3Title,
      desc: t.layer3Desc,
      badge: t.layer3Badge,
      icon: Timer,
      color: 'bg-[#ffe085]',
      textColor: 'text-[#231b00]',
    },
    {
      layer: 'لایه چهارم',
      layerEn: 'Tier 4',
      title: t.layer4Title,
      desc: t.layer4Desc,
      badge: t.layer4Badge,
      icon: QrCode,
      color: 'bg-[#93d3c1]',
      textColor: 'text-[#002019]',
    },
  ];

  return (
    <section className="w-full px-4 lg:px-8 py-12 lg:py-16 bg-[#ecf4ff] border-b border-[#003a2f]/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto flex flex-col items-center gap-2">
          <span className="text-xs font-bold text-[#003a2f] tracking-wide">
            {t.securitySubtitle}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111d27]">
            {t.securityTitle}
          </h2>
          <p className="text-xs sm:text-sm text-[#3f4945] leading-relaxed">
            {t.securityDesc}
          </p>
        </div>

        {/* 4 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-5 rounded-xl border border-[#003a2f]/10 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div
                    className={`w-12 h-12 rounded-lg ${item.color} flex items-center justify-center ${item.textColor} mb-4 shadow-2xs`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>

                  <div className="text-xs font-bold text-[#326286] mb-1">
                    {currentLang === 'en' ? item.layerEn : item.layer}
                  </div>

                  <h3 className="font-serif font-bold text-base text-[#111d27] mb-2 leading-snug">
                    {item.title}
                  </h3>

                  <p className="text-xs text-[#3f4945] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-4 pt-2.5 bg-[#f7f9ff] px-2.5 py-1.5 rounded text-[11px] font-medium text-[#003a2f] flex items-center gap-1.5 border border-[#003a2f]/5">
                  <CheckCircle className="w-3.5 h-3.5 text-[#0b5345]" />
                  <span>{item.badge}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Banking & Escrow Settlement Strip */}
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-[#003a2f]/10 shadow-xs flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#003a2f] flex items-center justify-center text-white shrink-0 shadow-xs">
              <Landmark className="w-6 h-6" />
            </div>
            <div className="flex flex-col text-right rtl:text-right ltr:text-left">
              <h4 className="font-serif text-sm sm:text-base font-bold text-[#111d27]">
                پرداخت و تسویه قابل پیگیری
              </h4>
              <p className="text-xs text-[#3f4945]">
                اتصال ارائه‌دهندگان پرداخت فقط پس از تایید فنی، تجارتی و قراردادی فعال می‌شود.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="px-3 py-1.5 bg-[#ecf4ff] rounded text-xs font-semibold text-[#111d27] flex items-center gap-1.5 border border-[#326286]/20">
              <CheckCircle className="w-3.5 h-3.5 text-[#003a2f]" />
              HesabPay — integration pending
            </span>
            <span className="px-3 py-1.5 bg-[#ecf4ff] rounded text-xs font-semibold text-[#111d27] flex items-center gap-1.5 border border-[#326286]/20">
              <CheckCircle className="w-3.5 h-3.5 text-[#003a2f]" />
              روش‌های پرداخت — پس از تایید
            </span>
            <span className="px-3 py-1.5 bg-[#ecf4ff] rounded text-xs font-semibold text-[#111d27] flex items-center gap-1.5 border border-[#326286]/20">
              <CheckCircle className="w-3.5 h-3.5 text-[#003a2f]" />
              گزینه‌های تسویه — پس از تایید
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
