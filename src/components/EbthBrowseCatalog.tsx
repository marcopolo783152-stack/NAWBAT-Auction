import React, { useState, useMemo, useEffect } from 'react';
import { AuctionLot, CategoryId, Language, Province } from '../types/auction';
import { translations } from '../translations';
import {
  Search,
  Filter,
  SlidersHorizontal,
  ArrowUpDown,
  Clock,
  Flame,
  ShieldCheck,
  MapPin,
  Gavel,
  Eye,
  Bookmark,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  Tag,
  Check,
  X,
  ChevronRight,
  Info,
  Car,
  Gem,
  Tractor,
  Landmark,
  Smartphone
} from 'lucide-react';

interface EbthBrowseCatalogProps {
  lots: AuctionLot[];
  currentLang: Language;
  onSelectLot: (lot: AuctionLot) => void;
  onQuickBid: (lot: AuctionLot) => void;
  watchlist: string[];
  onToggleWatchlist: (lotId: string) => void;
  initialCategory?: CategoryId;
  initialProvince?: Province;
}

type SortOption = 'ending_soonest' | 'most_bids' | 'price_low' | 'price_high' | 'newest';

export const EbthBrowseCatalog: React.FC<EbthBrowseCatalogProps> = ({
  lots,
  currentLang,
  onSelectLot,
  onQuickBid,
  watchlist,
  onToggleWatchlist,
  initialCategory = 'all',
  initialProvince = 'همه ولایات',
}) => {
  const t = translations[currentLang];
  const isRtl = currentLang !== 'en';

  // Filters & State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState<CategoryId>(initialCategory);
  const [selectedProv, setSelectedProv] = useState<Province>(initialProvince);
  const [sortBy, setSortBy] = useState<SortOption>('ending_soonest');
  const [onlyReserveMet, setOnlyReserveMet] = useState(false);
  const [onlyGradeAPlus, setOnlyGradeAPlus] = useState(false);
  const [underOneMillion, setUnderOneMillion] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(true);

  // Live countdown ticker
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});

  useEffect(() => {
    const updateTimers = () => {
      const now = Date.now();
      const updated: Record<string, number> = {};
      lots.forEach((lot) => {
        const diff = Math.max(0, lot.endTime - now);
        updated[lot.id] = diff;
      });
      setTimeRemaining(updated);
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [lots]);

  const formatTime = (ms: number | undefined) => {
    if (ms === undefined || ms <= 0) return '00:00:00';
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    const pad = (n: number) => n.toString().padStart(2, '0');
    if (hours > 0) {
      return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
    }
    return `${pad(minutes)}:${pad(seconds)}`;
  };

  // Categories list with counts
  const categoryOptions: { id: CategoryId; label: string; icon: any }[] = [
    { id: 'all', label: currentLang === 'en' ? 'All Items' : 'همه اقلام', icon: Sparkles },
    { id: 'cars', label: t.vehicles, icon: Car },
    { id: 'carpets', label: t.carpets, icon: Tag },
    { id: 'jewelry', label: t.jewelry, icon: Gem },
    { id: 'machinery', label: t.machinery, icon: Tractor },
    { id: 'antiques', label: t.antiques, icon: Landmark },
    { id: 'electronics', label: t.electronics, icon: Smartphone },
  ];

  const provinces: Province[] = [
    'همه ولایات',
    'کابل',
    'هرات',
    'مزارشریف',
    'قندهار',
    'جلال‌آباد',
    'کندز',
    'بامیان',
  ];

  // Filter & Sort Logic
  const filteredAndSortedLots = useMemo(() => {
    let result = lots.filter((lot) => {
      // Category filter
      if (selectedCat !== 'all' && lot.category !== selectedCat) return false;
      // Province filter
      if (selectedProv !== 'همه ولایات' && lot.province !== selectedProv) return false;
      // Search query filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = lot.title.toLowerCase().includes(query) || lot.titleEn.toLowerCase().includes(query);
        const matchesLotNum = lot.lotNumber.toLowerCase().includes(query);
        const matchesProv = lot.province.toLowerCase().includes(query);
        const matchesCat = lot.categoryLabel.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLotNum && !matchesProv && !matchesCat) return false;
      }
      // Quick toggles
      if (onlyReserveMet && !lot.isReserveMet) return false;
      if (onlyGradeAPlus && lot.inspectionGrade !== 'A+') return false;
      if (underOneMillion && lot.currentBidAFN >= 1000000) return false;

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'ending_soonest') {
        return a.endTime - b.endTime;
      }
      if (sortBy === 'most_bids') {
        return b.totalBids - a.totalBids;
      }
      if (sortBy === 'price_low') {
        return a.currentBidAFN - b.currentBidAFN;
      }
      if (sortBy === 'price_high') {
        return b.currentBidAFN - a.currentBidAFN;
      }
      return 0;
    });

    return result;
  }, [lots, selectedCat, selectedProv, searchQuery, onlyReserveMet, onlyGradeAPlus, underOneMillion, sortBy]);

  return (
    <section className="w-full bg-[#fbfcfe] py-8 border-b border-[#003a2f]/10" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col gap-6">
        
        {/* Breadcrumb & Catalog Title (EBTH Style) */}
        <div className="flex flex-col gap-2">
          <div className="flex items-center gap-2 text-xs text-[#707975]">
            <span>{currentLang === 'en' ? 'Home' : 'صفحه اصلی'}</span>
            <ChevronRight className={`w-3 h-3 ${isRtl ? 'rotate-180' : ''}`} />
            <span className="font-semibold text-[#003a2f]">{currentLang === 'en' ? 'Browse Auctions' : 'کاتالوگ مزایده‌ها'}</span>
            <span className="text-[#bfc9c4]">|</span>
            <span className="bg-[#afefdc]/30 text-[#003a2f] font-mono font-bold px-2 py-0.5 rounded text-[11px]">
              {filteredAndSortedLots.length} {currentLang === 'en' ? 'Items Available' : 'کالای آماده پیشنهاد'}
            </span>
          </div>

          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl font-extrabold text-[#111d27] tracking-tight">
                {currentLang === 'en' ? 'Browse All Auctions & Estate Sales' : 'مرور و کاتالوگ تمام مزایده‌ها و اموال'}
              </h1>
              <p className="text-xs sm:text-sm text-[#3f4945] mt-1 max-w-2xl">
                {currentLang === 'en' 
                  ? 'Discover authenticated vehicles, heirloom carpets, certified jewelry, and machinery. Protected by HesabPay escrow.'
                  : 'خرید آسان و شفاف اقلام تصدیق‌شده با ضمانت رسمی حساب‌پی، همراه با بازرسی فنی و تحویل حضوری یا ارسال به سراسر کشور.'}
              </p>
            </div>

            {/* Beginner Guide Toggle */}
            <button
              onClick={() => setShowHowItWorks(!showHowItWorks)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#003a2f]/20 bg-white text-xs font-semibold text-[#003a2f] hover:bg-[#f7f9ff] transition-colors shadow-2xs self-start cursor-pointer"
            >
              <HelpCircle className="w-4 h-4 text-[#326286]" />
              <span>{showHowItWorks ? (currentLang === 'en' ? 'Hide Beginner Guide' : 'بستن راهنما') : (currentLang === 'en' ? 'How Bidding Works (Easy)' : 'راهنمای ساده پیشنهاددهی')}</span>
            </button>
          </div>
        </div>

        {/* EBTH Beginner Friendly 'How It Works' 3-Step Banner */}
        {showHowItWorks && (
          <div className="bg-gradient-to-r from-[#eef7f4] via-[#f7f9ff] to-[#ecf4ff] rounded-2xl p-4 sm:p-5 border border-[#003a2f]/15 shadow-xs relative overflow-hidden animate-in fade-in duration-300">
            <button
              onClick={() => setShowHowItWorks(false)}
              className="absolute top-3 left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto text-[#707975] hover:text-[#111d27] p-1 cursor-pointer"
              title="Close guide"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-[#003a2f]" />
              <h3 className="font-serif font-bold text-xs sm:text-sm text-[#003a2f]">
                {currentLang === 'en' ? '🔰 New to Nawbat? 3 Super Easy Steps to Bid & Win' : '🔰 راهنمای فوق‌العاده ساده برای شرکت در حراج (3 مرحله آسان)'}
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-[#003a2f]/10 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#003a2f] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  1
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs text-[#111d27]">
                    {currentLang === 'en' ? '1. Browse & Inspect' : '1. انتخاب و بررسی کالا'}
                  </h4>
                  <p className="text-[11px] text-[#3f4945] mt-0.5 leading-snug">
                    {currentLang === 'en'
                      ? 'Check verified photos, inspector report grades (Grade A+), and clear starting prices.'
                      : 'تصاویر واضح، مشخصات فنی و تاییدیه کارشناس رسمی را با خیال راحت مشاهده نمایید.'}
                  </p>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-[#003a2f]/10 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#0b5345] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  2
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs text-[#111d27]">
                    {currentLang === 'en' ? '2. Place Bid (No Risk)' : '2. ثبت پیشنهاد با مبالغ آماده'}
                  </h4>
                  <p className="text-[11px] text-[#3f4945] mt-0.5 leading-snug">
                    {currentLang === 'en'
                      ? 'Click quick-bid buttons (+20,000 AFN). Your funds remain 100% secure in HesabPay escrow.'
                      : 'با دکمه‌های آماده (+20,000 AFN) بدون نیاز به محاسبات ریاضی پیشنهاد ثبت کنید.'}
                  </p>
                </div>
              </div>

              <div className="bg-white/90 backdrop-blur-xs p-3 rounded-xl border border-[#003a2f]/10 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#326286] text-white flex items-center justify-center font-bold text-sm shrink-0">
                  3
                </div>
                <div>
                  <h4 className="font-serif font-bold text-xs text-[#111d27]">
                    {currentLang === 'en' ? '3. Win & Collect Safely' : '3. دریافت با اطمینان کامل'}
                  </h4>
                  <p className="text-[11px] text-[#3f4945] mt-0.5 leading-snug">
                    {currentLang === 'en'
                      ? 'Pick up locally at the warehouse with QR verification, or get safe delivery in any province.'
                      : 'کالا را در گدام تحویل بگیرید یا با بارنامه مطمئن در ولایت خود تحویل بگیرید.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter Controls Bar (EBTH Style) */}
        <div className="bg-white rounded-2xl p-4 border border-[#003a2f]/10 shadow-xs flex flex-col gap-4">
          
          {/* Top row: Search input + Province + Sort Dropdown */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
            
            {/* Instant Search Box */}
            <div className="sm:col-span-6 relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={currentLang === 'en' ? 'Search by title, lot number, or item name...' : 'جستجو بر اساس نام کالا، شناسه لوط (LOT-...)، یا مشخصات...'}
                className="w-full bg-[#f7f9ff] border border-[#bfc9c4] focus:border-[#003a2f] rounded-xl py-2.5 px-9 text-xs text-[#111d27] placeholder-[#707975] focus:outline-none shadow-2xs"
              />
              <Search className={`w-4 h-4 text-[#707975] absolute top-3 ${isRtl ? 'right-3' : 'left-3'}`} />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className={`absolute top-2.5 ${isRtl ? 'left-3' : 'right-3'} text-[#707975] hover:text-[#111d27] p-1`}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Province Filter */}
            <div className="sm:col-span-3">
              <div className="flex items-center gap-1.5 bg-[#f7f9ff] border border-[#bfc9c4] rounded-xl px-3 py-2 text-xs">
                <MapPin className="w-3.5 h-3.5 text-[#326286] shrink-0" />
                <select
                  value={selectedProv}
                  onChange={(e) => setSelectedProv(e.target.value as Province)}
                  className="bg-transparent text-xs text-[#111d27] w-full focus:outline-none cursor-pointer"
                >
                  {provinces.map((prov) => (
                    <option key={prov} value={prov}>
                      {prov}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="sm:col-span-3">
              <div className="flex items-center gap-1.5 bg-[#f7f9ff] border border-[#bfc9c4] rounded-xl px-3 py-2 text-xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-[#003a2f] shrink-0" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="bg-transparent text-xs text-[#111d27] w-full focus:outline-none cursor-pointer font-medium"
                >
                  <option value="ending_soonest">
                    {currentLang === 'en' ? 'Sort: Ending Soonest' : 'مرتب‌سازی: نزدیک‌ترین به پایان'}
                  </option>
                  <option value="most_bids">
                    {currentLang === 'en' ? 'Sort: Most Bids' : 'مرتب‌سازی: بیشترین پیشنهاد'}
                  </option>
                  <option value="price_low">
                    {currentLang === 'en' ? 'Sort: Price Low to High' : 'مرتب‌سازی: ارزان‌ترین به گران‌ترین'}
                  </option>
                  <option value="price_high">
                    {currentLang === 'en' ? 'Sort: Price High to Low' : 'مرتب‌سازی: گران‌ترین به ارزان‌ترین'}
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Middle row: Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categoryOptions.map((cat) => {
              const isSelected = selectedCat === cat.id;
              const Icon = cat.icon;
              const count = cat.id === 'all' 
                ? lots.length 
                : lots.filter((l) => l.category === cat.id).length;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCat(cat.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                    isSelected
                      ? 'bg-[#003a2f] text-white shadow-xs'
                      : 'bg-[#f7f9ff] text-[#3f4945] hover:bg-[#ecf4ff] border border-[#003a2f]/10'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{cat.label}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-black/5 text-[#707975]'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Bottom row: Quick Filter Pills (Reserve Met, Grade A+, Under 1M) */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#003a2f]/5 text-xs">
            <span className="text-[#707975] text-[11px] font-medium flex items-center gap-1">
              <SlidersHorizontal className="w-3 h-3 text-[#003a2f]" />
              {currentLang === 'en' ? 'Quick Toggles:' : 'فیلترهای سریع:'}
            </span>

            <button
              onClick={() => setOnlyReserveMet(!onlyReserveMet)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                onlyReserveMet
                  ? 'bg-[#afefdc] text-[#003a2f] font-bold border border-[#003a2f]/30'
                  : 'bg-[#f7f9ff] text-[#3f4945] border border-[#003a2f]/10 hover:bg-[#ecf4ff]'
              }`}
            >
              {onlyReserveMet && <Check className="w-3 h-3 text-[#003a2f]" />}
              <span>{currentLang === 'en' ? 'Reserve Met Only' : 'فقط قیمت احتیاطی تکمیل شده'}</span>
            </button>

            <button
              onClick={() => setOnlyGradeAPlus(!onlyGradeAPlus)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                onlyGradeAPlus
                  ? 'bg-[#afefdc] text-[#003a2f] font-bold border border-[#003a2f]/30'
                  : 'bg-[#f7f9ff] text-[#3f4945] border border-[#003a2f]/10 hover:bg-[#ecf4ff]'
              }`}
            >
              {onlyGradeAPlus && <Check className="w-3 h-3 text-[#003a2f]" />}
              <span>{currentLang === 'en' ? 'Grade A+ Inspection Only' : 'فقط درجه کیفیت عالی (A+)'}</span>
            </button>

            <button
              onClick={() => setUnderOneMillion(!underOneMillion)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 transition-colors cursor-pointer ${
                underOneMillion
                  ? 'bg-[#afefdc] text-[#003a2f] font-bold border border-[#003a2f]/30'
                  : 'bg-[#f7f9ff] text-[#3f4945] border border-[#003a2f]/10 hover:bg-[#ecf4ff]'
              }`}
            >
              {underOneMillion && <Check className="w-3 h-3 text-[#003a2f]" />}
              <span>{currentLang === 'en' ? 'Under 1,000,000 AFN' : 'کمتر از 1,000,000 AFN'}</span>
            </button>

            {(searchQuery || selectedCat !== 'all' || selectedProv !== 'همه ولایات' || onlyReserveMet || onlyGradeAPlus || underOneMillion) && (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCat('all');
                  setSelectedProv('همه ولایات');
                  setOnlyReserveMet(false);
                  setOnlyGradeAPlus(false);
                  setUnderOneMillion(false);
                }}
                className="text-[11px] text-[#ba1a1a] hover:underline mr-auto ltr:mr-0 ltr:ml-auto cursor-pointer font-medium"
              >
                {currentLang === 'en' ? 'Reset All Filters' : 'پاک کردن تمام فیلترها'}
              </button>
            )}
          </div>
        </div>

        {/* Lots Grid (Clean EBTH Style Cards) */}
        {filteredAndSortedLots.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-[#003a2f]/10 shadow-xs flex flex-col items-center justify-center gap-3">
            <div className="w-12 h-12 rounded-full bg-[#ecf4ff] flex items-center justify-center text-[#326286]">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif font-bold text-base text-[#111d27]">
              {currentLang === 'en' ? 'No items found matching your filters' : 'هیچ مزایده‌ای مطابق با فیلترهای انتخابی یافت نشد'}
            </h3>
            <p className="text-xs text-[#707975] max-w-sm">
              {currentLang === 'en' 
                ? 'Try broadening your search or resetting the active category/price filters.' 
                : 'لطفاً عبارت جستجو را تغییر دهید یا دکمه پاک کردن فیلترها را انتخاب فرمایید.'}
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCat('all');
                setSelectedProv('همه ولایات');
                setOnlyReserveMet(false);
                setOnlyGradeAPlus(false);
                setUnderOneMillion(false);
              }}
              className="bg-[#003a2f] text-white px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
            >
              {currentLang === 'en' ? 'Show All Auctions' : 'نمایش تمام مزایده‌ها'}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {filteredAndSortedLots.map((lot) => {
              const msLeft = timeRemaining[lot.id] || 0;
              const isUrgent = msLeft < 15 * 60 * 1000 && msLeft > 0;
              const isExpired = msLeft <= 0;
              const isBookmarked = watchlist.includes(lot.id);

              return (
                <div
                  key={lot.id}
                  className="bg-white rounded-2xl border border-[#003a2f]/12 shadow-xs hover:shadow-lg transition-all flex flex-col overflow-hidden group hover:border-[#003a2f]/30"
                >
                  {/* Image Container with Badges */}
                  <div className="relative aspect-4/3 overflow-hidden bg-[#e3effe]">
                    <img
                      src={lot.imageUrl}
                      alt={lot.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Top Row on Image: Province & Watchlist Heart */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                      <span className="inline-flex items-center gap-1 bg-[#111d27]/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-0.5 rounded-full font-medium shadow-xs">
                        <MapPin className="w-3 h-3 text-[#afefdc]" />
                        {lot.province}
                      </span>

                      <button
                        onClick={() => onToggleWatchlist(lot.id)}
                        className={`p-2 rounded-full backdrop-blur-xs transition-colors cursor-pointer shadow-sm ${
                          isBookmarked
                            ? 'bg-[#cea701] text-[#231b00]'
                            : 'bg-[#111d27]/60 hover:bg-[#111d27]/90 text-white'
                        }`}
                        title={t.watchlist}
                      >
                        <Bookmark className="w-3.5 h-3.5 fill-current" />
                      </button>
                    </div>

                    {/* Bottom Row on Image: Live Countdown Timer & Lot ID */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                      <div
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-mono font-bold tracking-wider backdrop-blur-md shadow-xs ${
                          isExpired
                            ? 'bg-[#3f4945]/90 text-white'
                            : isUrgent
                            ? 'bg-[#ba1a1a] text-white animate-pulse'
                            : 'bg-[#111d27]/85 text-[#afefdc]'
                        }`}
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>{isExpired ? (currentLang === 'en' ? 'Closed' : 'پایان یافته') : formatTime(msLeft)}</span>
                      </div>

                      <span className="text-[11px] bg-white/95 text-[#003a2f] font-mono px-2 py-0.5 rounded font-bold shadow-xs">
                        {lot.lotNumber}
                      </span>
                    </div>
                  </div>

                  {/* Card Content (EBTH Style) */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      {/* Category & Verified Inspector */}
                      <div className="flex items-center justify-between text-[11px] text-[#707975] mb-1.5">
                        <span className="font-medium text-[#326286]">{lot.categoryLabel}</span>
                        <span className="flex items-center gap-0.5 text-[#003a2f] font-bold text-[10px] bg-[#afefdc]/30 px-1.5 py-0.5 rounded">
                          <ShieldCheck className="w-3 h-3 text-[#003a2f]" />
                          Grade {lot.inspectionGrade}
                        </span>
                      </div>

                      {/* Title */}
                      <h3
                        onClick={() => onSelectLot(lot)}
                        className="font-serif font-bold text-sm text-[#111d27] line-clamp-2 hover:text-[#003a2f] transition-colors cursor-pointer mb-3 leading-snug"
                      >
                        {currentLang === 'en' ? lot.titleEn : currentLang === 'ps' ? lot.titlePs : lot.title}
                      </h3>

                      {/* Pricing Information (EBTH Style: Current Bid + Bid Count + Reserve) */}
                      <div className="bg-[#f7f9ff] p-3 rounded-xl border border-[#003a2f]/8 mb-3">
                        <div className="flex items-baseline justify-between mb-1">
                          <span className="text-[11px] text-[#3f4945] font-medium">
                            {currentLang === 'en' ? 'Current Bid:' : 'پیشنهاد فعلی:'}
                          </span>
                          <div className="text-right">
                            <span className="font-mono text-lg font-bold text-[#003a2f] tabular-nums">
                              {lot.currentBidAFN.toLocaleString('en-US')}
                            </span>
                            <span className="text-[10px] text-[#3f4945] mr-1">AFN</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-[11px] text-[#707975] pt-1 border-t border-[#003a2f]/5">
                          <span className="flex items-center gap-1 font-medium">
                            <Gavel className="w-3.5 h-3.5 text-[#326286]" />
                            <strong className="font-mono text-[#111d27]">{lot.totalBids}</strong> {currentLang === 'en' ? 'bids' : 'پیشنهاد'}
                          </span>

                          {lot.isReserveMet ? (
                            <span className="flex items-center gap-0.5 text-[#0b5345] font-semibold text-[10px]">
                              <CheckCircle2 className="w-3 h-3" />
                              {currentLang === 'en' ? 'Reserve Met' : 'قیمت احتیاطی تکمیل'}
                            </span>
                          ) : (
                            <span className="flex items-center gap-0.5 text-[#735c00] font-semibold text-[10px]">
                              <Info className="w-3 h-3" />
                              {currentLang === 'en' ? 'No Reserve Met' : 'زیر قیمت احتیاطی'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons: Bid Now (Primary) & View Item (Secondary) */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#003a2f]/8">
                      <button
                        onClick={() => onQuickBid(lot)}
                        disabled={isExpired}
                        className="w-full bg-[#003a2f] hover:bg-[#0b5345] disabled:bg-[#bfc9c4] text-white py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs cursor-pointer min-h-[38px]"
                      >
                        <Gavel className="w-3.5 h-3.5 text-[#afefdc]" />
                        <span>{currentLang === 'en' ? 'Place Bid' : 'ثبت پیشنهاد'}</span>
                      </button>

                      <button
                        onClick={() => onSelectLot(lot)}
                        className="w-full bg-[#ecf4ff] hover:bg-[#dde9f9] text-[#003a2f] py-2 px-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer min-h-[38px]"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#326286]" />
                        <span>{currentLang === 'en' ? 'View Details' : 'مشاهده جزئیات'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
};
