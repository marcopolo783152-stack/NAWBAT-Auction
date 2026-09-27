import React from 'react';
import { Search, ArrowLeft, ArrowRight, TrendingUp, SlidersHorizontal } from 'lucide-react';
import { CategoryId, Language, Province } from '../types/auction';
import { translations } from '../translations';
import { Logo } from './Logo';

interface HeroSectionProps {
  currentLang: Language;
  selectedProvince: Province;
  onProvinceSelect: (p: Province) => void;
  selectedCategory: CategoryId;
  onCategorySelect: (c: CategoryId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  currentLang,
  selectedProvince,
  onProvinceSelect,
  selectedCategory,
  onCategorySelect,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
}) => {
  const t = translations[currentLang];
  const isRtl = currentLang !== 'en';

  const provincePills: { name: Province; count: number }[] = [
    { name: 'همه ولایات', count: 482 },
    { name: 'کابل', count: 214 },
    { name: 'هرات', count: 89 },
    { name: 'مزارشریف', count: 64 },
    { name: 'قندهار', count: 42 },
    { name: 'جلال‌آباد', count: 31 },
    { name: 'بامیان', count: 18 },
  ];

  const trendingTags = [
    'تویوتا کرولا',
    'قالین قزاق موری',
    'زمرد پنجشیر',
    'تراکتور فرگوسن',
    'آیفون 15 پرو مکس',
    'لاجورد بدخشان',
  ];

  return (
    <section className="w-full bg-[linear-gradient(180deg,#ffffff_0%,#f7fbf9_58%,#f7f9ff_100%)] border-b border-[#003a2f]/5">
      {/* Resolution-independent NAWBAT cover banner */}
      <div className="relative w-full min-h-[250px] sm:min-h-[310px] lg:min-h-[360px] overflow-hidden border-b border-[#003a2f]/10 bg-[linear-gradient(118deg,#f6f0e4_0%,#fbfaf7_38%,#ffffff_62%,#edf3f9_100%)]">
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          <div className="absolute -left-24 top-8 w-[420px] h-[420px] rounded-full border-[3px] border-[#c99a3e]/20" />
          <div className="absolute -left-8 top-24 w-[320px] h-[320px] rounded-full border-[2px] border-[#c99a3e]/18" />
          <div className="absolute left-[12%] -bottom-44 w-[520px] h-[520px] rounded-full border border-[#003a2f]/8" />
          <div className="absolute right-[-12%] top-[-40%] w-[620px] h-[620px] rounded-full bg-[#dfeaf4]/55 blur-3xl" />
          <svg className="absolute inset-0 w-full h-full opacity-35" viewBox="0 0 1600 480" preserveAspectRatio="none">
            <path d="M0 420 C280 220 450 520 760 315 C1040 130 1220 350 1600 165" fill="none" stroke="#c99a3e" strokeWidth="2"/>
            <path d="M0 455 C310 270 500 555 830 345 C1110 165 1320 385 1600 240" fill="none" stroke="#0b5345" strokeOpacity="0.18" strokeWidth="1.5"/>
          </svg>
        </div>

        <div className="relative z-10 max-w-[1500px] mx-auto min-h-[250px] sm:min-h-[310px] lg:min-h-[360px] px-5 sm:px-8 lg:px-14 py-10 flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">
          <div className="flex-1 flex justify-center md:justify-start">
            <div className="bg-white/72 backdrop-blur-sm border border-white/80 rounded-[2rem] px-6 sm:px-8 lg:px-10 py-6 sm:py-8 shadow-[0_22px_60px_rgba(0,58,47,0.12)]">
              <Logo size="xl" showTagline={true} />
            </div>
          </div>

          <div className="flex-1 text-center md:text-end">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#c99a3e]/25 bg-white/65 text-[#735c00] text-[10px] sm:text-xs font-bold uppercase tracking-[0.18em] mb-4">
              Afghanistan Online Auction Marketplace
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-6xl font-black tracking-tight text-[#17362d] leading-[1.05]">
              YOUR TURN
              <span className="block text-[#b8892f]">TO WIN</span>
            </h1>
            <p className="mt-4 max-w-xl md:ms-auto text-sm sm:text-base text-[#53615b] leading-7 font-medium">
              {currentLang === 'en'
                ? 'A trusted marketplace to discover, bid, sell and win across Afghanistan.'
                : currentLang === 'ps'
                ? 'په ټول افغانستان کې د موندلو، داوطلبۍ، پلور او ګټلو لپاره یو باوري بازار.'
                : 'بازار قابل اعتماد برای کشف، پیشنهاد، فروش و برنده‌شدن در سراسر افغانستان.'}
            </p>
          </div>
        </div>
      </div>

      <div className="relative overflow-hidden px-4 lg:px-8 py-7 lg:py-10">
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#afefdc]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-[#a5d4fd]/30 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
          {/* Search Command Box */}
          <div className="w-full max-w-4xl bg-white rounded-2xl shadow-[0_12px_34px_rgba(0,58,47,0.10)] border border-[#003a2f]/10 p-2.5 mb-7">
            <div className="flex flex-col sm:flex-row items-stretch gap-2">
              <div className="flex-1 flex items-center px-3 bg-[#ecf4ff] rounded-lg">
                <Search className="w-5 h-5 text-[#707975] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
                  placeholder={t.searchPlaceholder}
                  className="w-full bg-transparent py-2.5 px-3 text-xs sm:text-sm text-[#111d27] placeholder:text-[#707975] focus:outline-none"
                />
              </div>

              <div className="flex items-center bg-[#ecf4ff] px-3 rounded-lg">
                <select
                  value={selectedCategory}
                  onChange={(e) => onCategorySelect(e.target.value as CategoryId)}
                  className="bg-transparent text-xs sm:text-sm font-semibold text-[#111d27] py-2.5 focus:outline-none cursor-pointer"
                >
                  <option value="all">{t.allCategories}</option>
                  <option value="cars">{t.vehicles}</option>
                  <option value="carpets">{t.carpets}</option>
                  <option value="jewelry">{t.jewelry}</option>
                  <option value="antiques">{t.antiques}</option>
                  <option value="electronics">{t.electronics}</option>
                  <option value="machinery">{t.machinery}</option>
                </select>
              </div>

              <button
                onClick={onSearchSubmit}
                className="bg-[#003a2f] hover:bg-[#0b5345] text-white px-6 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm shrink-0 cursor-pointer"
              >
                <span>{t.findAuction}</span>
                {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 mt-3 px-1 text-right">
              <span className="text-xs text-[#707975] flex items-center gap-1 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-[#326286]" />
                {t.trendingSearches}
              </span>
              {trendingTags.map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    onSearchChange(tag);
                    onSearchSubmit();
                  }}
                  className="bg-[#e3effe] hover:bg-[#dde9f9] px-2.5 py-0.5 rounded text-[#3f4945] hover:text-[#111d27] text-xs transition-colors cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          <div className="w-full flex items-center justify-center gap-1.5 flex-wrap">
            <span className="text-xs text-[#3f4945] flex items-center gap-1 font-medium ml-1">
              <SlidersHorizontal className="w-3.5 h-3.5 text-[#326286]" />
              {t.filterProvince}
            </span>
            {provincePills.map((pill) => {
              const isSelected = selectedProvince === pill.name;
              return (
                <button
                  key={pill.name}
                  onClick={() => onProvinceSelect(pill.name)}
                  className={`text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#003a2f] text-white font-bold shadow-xs'
                      : 'bg-[#e3effe] hover:bg-[#dde9f9] text-[#111d27]'
                  }`}
                >
                  <span>{pill.name}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isSelected ? 'bg-white/20 text-[#afefdc]' : 'bg-[#d7e4f3] text-[#326286]'
                    }`}
                  >
                    {pill.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
