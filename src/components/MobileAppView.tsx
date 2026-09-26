import React, { useState } from 'react';
import { AuctionLot, CategoryId, Language, Province } from '../types/auction';
import { translations } from '../translations';
import { Logo } from './Logo';
import { 
  Home, 
  Search, 
  Flame, 
  Bookmark, 
  User, 
  Bell, 
  MapPin, 
  Gavel, 
  ShieldCheck, 
  Clock, 
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Wifi,
  Battery,
  Sparkles,
  Car,
  Gem,
  Tractor,
  Smartphone,
  Landmark,
  Plus,
  Monitor
} from 'lucide-react';

interface MobileAppViewProps {
  lots: AuctionLot[];
  currentLang: Language;
  selectedProvince: Province;
  onProvinceSelect: (p: Province) => void;
  selectedCategory: CategoryId;
  onCategorySelect: (c: CategoryId) => void;
  onSelectLot: (lot: AuctionLot) => void;
  onQuickBid: (lot: AuctionLot) => void;
  watchlist: string[];
  onToggleWatchlist: (lotId: string) => void;
  onOpenSubmitLot: () => void;
  onSwitchToWeb: () => void;
  onOpenProfile?: () => void;
}

export const MobileAppView: React.FC<MobileAppViewProps> = ({
  lots,
  currentLang,
  selectedProvince,
  onProvinceSelect,
  selectedCategory,
  onCategorySelect,
  onSelectLot,
  onQuickBid,
  watchlist,
  onToggleWatchlist,
  onOpenSubmitLot,
  onSwitchToWeb,
  onOpenProfile,
}) => {
  const t = translations[currentLang];
  const [mobileTab, setMobileTab] = useState<'home' | 'search' | 'live' | 'saved' | 'profile'>('home');
  const [searchFilter, setSearchFilter] = useState('');

  // Notification toggles in mobile profile
  const [emailOutbid, setEmailOutbid] = useState<boolean>(() => {
    const saved = localStorage.getItem('nawbat_email_outbid');
    return saved !== null ? saved === 'true' : true;
  });
  const [emailClosingSoon, setEmailClosingSoon] = useState<boolean>(() => {
    const saved = localStorage.getItem('nawbat_email_closing_soon');
    return saved !== null ? saved === 'true' : true;
  });

  const filteredLots = lots.filter((lot) => {
    const matchesProv = selectedProvince === 'همه ولایات' || lot.province === selectedProvince;
    const matchesCat = selectedCategory === 'all' || lot.category === selectedCategory;
    const matchesSearch = !searchFilter.trim() || 
      lot.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      lot.lotNumber.toLowerCase().includes(searchFilter.toLowerCase());
    
    if (mobileTab === 'saved') {
      return watchlist.includes(lot.id) && matchesProv && matchesCat;
    }
    if (mobileTab === 'live') {
      return lot.isClosingSoon && matchesProv && matchesCat;
    }
    return matchesProv && matchesCat && matchesSearch;
  });

  const categories = [
    { id: 'all' as CategoryId, label: 'همه', icon: Sparkles },
    { id: 'cars' as CategoryId, label: 'موترها', icon: Car },
    { id: 'carpets' as CategoryId, label: 'قالین', icon: Sparkles },
    { id: 'jewelry' as CategoryId, label: 'زمرد و طلا', icon: Gem },
    { id: 'machinery' as CategoryId, label: 'ماشین‌آلات', icon: Tractor },
    { id: 'antiques' as CategoryId, label: 'عتیقه‌جات', icon: Landmark },
    { id: 'electronics' as CategoryId, label: 'موبایل', icon: Smartphone },
  ];

  return (
    <div className="w-full min-h-screen bg-[#111d27]/90 py-6 px-2 sm:px-4 flex flex-col items-center justify-center">
      {/* Switcher Banner */}
      <div className="mb-4 flex items-center justify-between w-full max-w-sm px-2 text-white text-xs">
        <span className="font-semibold flex items-center gap-1.5 text-[#afefdc]">
          <Smartphone className="w-4 h-4" />
          شبیه‌ساز اپلیکیشن نوبت (NAWBAT Mobile)
        </span>
        <button
          onClick={onSwitchToWeb}
          className="bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
        >
          <Monitor className="w-3.5 h-3.5 text-[#afefdc]" />
          <span>بازگشت به نمای وب</span>
        </button>
      </div>

      {/* Smartphone Device Frame */}
      <div className="w-full max-w-[400px] h-[840px] bg-black rounded-[48px] p-3 shadow-2xl border-4 border-[#3f4945] relative flex flex-col overflow-hidden">
        {/* Dynamic Island / Speaker */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-6 bg-black rounded-full z-50 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-[#111d27] mr-3" />
          <div className="w-2 h-2 rounded-full bg-[#003a2f]/80" />
        </div>

        {/* Screen Area */}
        <div className="w-full h-full bg-[#f7f9ff] rounded-[38px] overflow-hidden flex flex-col relative text-[#111d27] font-sans">
          {/* iOS / Android Status Bar */}
          <div className="h-10 w-full px-6 flex items-center justify-between text-[11px] font-mono font-bold text-[#111d27] z-40 bg-[#f7f9ff]">
            <span>10:50</span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] font-bold">5G</span>
              <Wifi className="w-3.5 h-3.5" />
              <Battery className="w-4 h-4" />
            </div>
          </div>

          {/* App Top Bar */}
          <div className="px-4 py-2 bg-white/95 backdrop-blur-md border-b border-[#003a2f]/10 flex items-center justify-between z-30">
            <div className="flex items-center gap-2">
              <Logo size="sm" />
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onOpenSubmitLot}
                className="w-8 h-8 rounded-full bg-[#003a2f] text-white flex items-center justify-center shadow-xs cursor-pointer"
                title="ثبت لوط جدید"
              >
                <Plus className="w-4 h-4" />
              </button>
              <div className="w-8 h-8 rounded-full bg-[#ecf4ff] text-[#326286] flex items-center justify-center relative">
                <Bell className="w-4 h-4" />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#ba1a1a]" />
              </div>
            </div>
          </div>

          {/* Scrollable Screen Content */}
          <div className="flex-1 overflow-y-auto pb-20">
            {mobileTab === 'profile' ? (
              /* Profile Screen */
              <div className="p-4 flex flex-col gap-4">
                <div className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-[#003a2f] text-white flex items-center justify-center font-serif text-xl font-bold ring-4 ring-[#afefdc]/50">
                    NA
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif font-bold text-sm text-[#111d27]">مهمان</h3>
                    <span className="text-[11px] text-[#326286] font-medium block">حساب کاربری هنوز وارد نشده</span>
                    <span className="inline-flex items-center gap-1 bg-[#afefdc] text-[#065043] text-[10px] px-2 py-0.5 rounded-full font-bold mt-1">
                      <ShieldCheck className="w-3 h-3 text-[#003a2f]" />
                      ورود کاربر لازم است
                    </span>
                  </div>
                </div>

                <div className="bg-[#ecf4ff] p-4 rounded-2xl border border-[#326286]/20">
                  <span className="text-xs text-[#3f4945] block mb-1">موجودی HesabPay پس از اتصال:</span>
                  <div className="flex items-baseline justify-between">
                    <span className="font-mono text-2xl font-bold text-[#003a2f]">0</span>
                    <span className="text-xs text-[#3f4945]">AFN</span>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#326286]/20 flex items-center justify-between text-xs text-[#326286] font-semibold">
                    <span>مبالغ در وضعیت نگهداری:</span>
                    <span className="font-mono font-bold text-[#ba1a1a]">0 AFN</span>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-[#003a2f]/10 overflow-hidden divide-y divide-[#003a2f]/5 text-xs">
                  <div className="p-3.5 flex items-center justify-between hover:bg-[#f7f9ff] cursor-pointer">
                    <span>پیشنهادهای فعال من ({lots.length})</span>
                    <ChevronLeft className="w-4 h-4 text-[#707975] rtl:rotate-0 ltr:rotate-180" />
                  </div>
                  <div className="p-3.5 flex items-center justify-between hover:bg-[#f7f9ff] cursor-pointer">
                    <span>نشان‌شده‌ها ({watchlist.length})</span>
                    <ChevronLeft className="w-4 h-4 text-[#707975] rtl:rotate-0 ltr:rotate-180" />
                  </div>
                  <div className="p-3.5 flex items-center justify-between hover:bg-[#f7f9ff] cursor-pointer">
                    <span>تاریخچه پرداخت‌ها (پس از ورود)</span>
                    <ChevronLeft className="w-4 h-4 text-[#707975] rtl:rotate-0 ltr:rotate-180" />
                  </div>
                  <div className="p-3.5 flex items-center justify-between hover:bg-[#f7f9ff] cursor-pointer">
                    <span>قوانین و شرایط پرداخت</span>
                    <ChevronLeft className="w-4 h-4 text-[#707975] rtl:rotate-0 ltr:rotate-180" />
                  </div>
                </div>

                {/* Email Notification Toggles Section in Mobile */}
                <div className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs flex flex-col gap-3">
                  <div className="flex items-center justify-between border-b border-[#003a2f]/10 pb-2">
                    <div className="flex items-center gap-1.5 font-bold text-xs text-[#003a2f]">
                      <Bell className="w-3.5 h-3.5" />
                      <span>{currentLang === 'en' ? 'Email Notification Toggles' : 'تنظیمات اعلانات ایمیل'}</span>
                    </div>
                    {onOpenProfile && (
                      <button
                        onClick={onOpenProfile}
                        className="text-[10px] text-[#326286] font-bold hover:underline"
                      >
                        {currentLang === 'en' ? 'Full Profile' : 'پروفایل کامل'}
                      </button>
                    )}
                  </div>

                  {/* Outbid Alert Toggle */}
                  <div className="flex items-center justify-between gap-2 py-1">
                    <div>
                      <span className="font-bold text-xs text-[#111d27] block">
                        {currentLang === 'en' ? 'Outbid Alerts' : 'هشدار پیشی‌گرفتن پیشنهاد (Outbid)'}
                      </span>
                      <span className="text-[10px] text-[#707975] block mt-0.5">
                        {currentLang === 'en' ? 'Email when another bidder tops your bid' : 'ایمیل در صورت ثبت پیشنهاد بالاتر توسط دیگران'}
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={emailOutbid}
                      onClick={() => {
                        const val = !emailOutbid;
                        setEmailOutbid(val);
                        localStorage.setItem('nawbat_email_outbid', String(val));
                      }}
                      className={`w-11 h-6 shrink-0 rounded-full p-0.5 cursor-pointer transition-colors duration-200 flex items-center ${
                        emailOutbid ? 'bg-[#003a2f] justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>

                  {/* Closing Alert Toggle */}
                  <div className="flex items-center justify-between gap-2 py-1 border-t border-[#003a2f]/5">
                    <div>
                      <span className="font-bold text-xs text-[#111d27] block">
                        {currentLang === 'en' ? 'Closing Alerts' : 'هشدار دقایق پایانی مزایده (Closing)'}
                      </span>
                      <span className="text-[10px] text-[#707975] block mt-0.5">
                        {currentLang === 'en' ? 'Email reminder 15 min before auction closes' : 'یادآوری ایمیل در ۱۵ دقیقه پایانی حراج'}
                      </span>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={emailClosingSoon}
                      onClick={() => {
                        const val = !emailClosingSoon;
                        setEmailClosingSoon(val);
                        localStorage.setItem('nawbat_email_closing_soon', String(val));
                      }}
                      className={`w-11 h-6 shrink-0 rounded-full p-0.5 cursor-pointer transition-colors duration-200 flex items-center ${
                        emailClosingSoon ? 'bg-[#003a2f] justify-end' : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <span className="w-5 h-5 rounded-full bg-white shadow-xs" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <>
                {/* Search & Location Pill Bar */}
                <div className="p-3 pb-1 flex flex-col gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-white rounded-xl border border-[#003a2f]/15 p-2 flex items-center gap-2 shadow-2xs">
                      <Search className="w-4 h-4 text-[#707975]" />
                      <input
                        type="text"
                        value={searchFilter}
                        onChange={(e) => setSearchFilter(e.target.value)}
                        placeholder="جستجوی مزایده، موتر، قالین..."
                        className="w-full bg-transparent text-xs text-[#111d27] placeholder:text-[#707975] focus:outline-none"
                      />
                    </div>

                    <select
                      value={selectedProvince}
                      onChange={(e) => onProvinceSelect(e.target.value as Province)}
                      className="bg-[#ecf4ff] border border-[#d7e4f3] rounded-xl px-2.5 py-2 text-[11px] font-bold text-[#003a2f] focus:outline-none"
                    >
                      <option value="همه ولایات">همه ولایات</option>
                      <option value="کابل">کابل</option>
                      <option value="هرات">هرات</option>
                      <option value="مزارشریف">مزار</option>
                      <option value="قندهار">قندهار</option>
                      <option value="جلال‌آباد">جلال‌آباد</option>
                    </select>
                  </div>

                  {/* Category Pill Carousel */}
                  <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
                    {categories.map((c) => {
                      const Icon = c.icon;
                      const isSelected = selectedCategory === c.id;
                      return (
                        <button
                          key={c.id}
                          onClick={() => onCategorySelect(c.id)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs whitespace-nowrap transition-colors cursor-pointer shrink-0 ${
                            isSelected
                              ? 'bg-[#003a2f] text-white font-bold shadow-xs'
                              : 'bg-white border border-[#003a2f]/10 text-[#3f4945]'
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{c.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Live Closing Banner */}
                {mobileTab === 'home' && (
                  <div className="px-3 py-2">
                    <div className="bg-gradient-to-r from-[#003a2f] to-[#0b5345] rounded-2xl p-3.5 text-white flex items-center justify-between shadow-md">
                      <div>
                        <span className="text-[10px] text-[#afefdc] font-bold flex items-center gap-1">
                          <Flame className="w-3 h-3 text-[#ba1a1a]" />
                          مزایده‌های دقایق پایانی
                        </span>
                        <h4 className="font-serif font-bold text-sm mt-0.5">تمدید ضدقیچی فعال است</h4>
                        <span className="text-[10px] text-[#dde9f9] block mt-1">+3 دقیقه تمدید در پیشنهادات آخر</span>
                      </div>
                      <button
                        onClick={() => setMobileTab('live')}
                        className="bg-[#afefdc] text-[#003a2f] text-[11px] font-bold px-3 py-1.5 rounded-lg shadow-xs cursor-pointer"
                      >
                        مشاهده همه
                      </button>
                    </div>
                  </div>
                )}

                {/* Mobile Cards Feed */}
                <div className="p-3 flex flex-col gap-3">
                  <div className="flex items-center justify-between text-xs text-[#3f4945] px-1">
                    <span className="font-bold">
                      {mobileTab === 'saved'
                        ? 'اقلام نشان شده'
                        : mobileTab === 'live'
                        ? 'فرصت‌های فوری'
                        : 'مزایده‌های تصدیق‌شده'} ({filteredLots.length})
                    </span>
                    <span className="text-[11px] text-[#326286]">ضمانت امانی HesabPay</span>
                  </div>

                  {filteredLots.length === 0 ? (
                    <div className="p-8 text-center bg-white rounded-2xl border border-[#003a2f]/10">
                      <p className="text-xs text-[#707975]">هیچ مزایده‌ای یافت نشد.</p>
                    </div>
                  ) : (
                    filteredLots.map((lot) => {
                      const isBookmarked = watchlist.includes(lot.id);
                      return (
                        <div
                          key={lot.id}
                          className="bg-white rounded-2xl border border-[#003a2f]/10 shadow-xs overflow-hidden flex flex-col"
                        >
                          <div className="relative aspect-16/9 bg-[#e3effe]">
                            <img
                              src={lot.imageUrl}
                              alt={lot.title}
                              className="w-full h-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2 left-2 right-2 flex items-center justify-between">
                              <span className="bg-[#111d27]/75 backdrop-blur-xs text-white text-[10px] px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                <MapPin className="w-2.5 h-2.5 text-[#afefdc]" />
                                {lot.province}
                              </span>
                              <button
                                onClick={() => onToggleWatchlist(lot.id)}
                                className={`p-1.5 rounded-full ${
                                  isBookmarked ? 'bg-[#cea701] text-[#231b00]' : 'bg-[#111d27]/60 text-white'
                                }`}
                              >
                                <Bookmark className="w-3.5 h-3.5 fill-current" />
                              </button>
                            </div>

                            <div className="absolute bottom-2 right-2 left-2 flex items-center justify-between">
                              <span className="bg-[#ba1a1a] text-white text-[10px] font-mono font-bold px-2 py-0.5 rounded flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                در حال اتمام
                              </span>
                              <span className="bg-white/90 text-[#003a2f] text-[10px] font-mono font-bold px-1.5 py-0.5 rounded">
                                {lot.lotNumber}
                              </span>
                            </div>
                          </div>

                          <div className="p-3 flex flex-col gap-2">
                            <h4
                              onClick={() => onSelectLot(lot)}
                              className="font-serif font-bold text-xs text-[#111d27] line-clamp-2 hover:text-[#003a2f] cursor-pointer"
                            >
                              {lot.title}
                            </h4>

                            <div className="bg-[#f7f9ff] p-2 rounded-lg flex items-center justify-between text-xs">
                              <span className="text-[11px] text-[#707975]">{t.currentBid}</span>
                              <div className="text-right">
                                <span className="font-mono text-sm font-bold text-[#003a2f]">
                                  {lot.currentBidAFN.toLocaleString('en-US')}
                                </span>
                                <span className="text-[10px] text-[#707975] mr-1">AFN</span>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-1">
                              <button
                                onClick={() => onQuickBid(lot)}
                                className="w-full bg-[#003a2f] hover:bg-[#0b5345] text-white py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1 shadow-xs cursor-pointer min-h-[44px]"
                              >
                                <Gavel className="w-3.5 h-3.5 text-[#afefdc]" />
                                <span>{t.quickBid}</span>
                              </button>

                              <button
                                onClick={() => onSelectLot(lot)}
                                className="w-full bg-[#ecf4ff] hover:bg-[#dde9f9] text-[#003a2f] py-2 rounded-xl text-xs font-semibold flex items-center justify-center cursor-pointer min-h-[44px]"
                              >
                                <span>{t.viewDetails}</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </>
            )}
          </div>

          {/* Fixed Mobile Bottom Tab Bar (Thumb Zone) */}
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-white/95 backdrop-blur-md border-t border-[#003a2f]/10 grid grid-cols-5 items-center z-40 px-1 pb-safe">
            <button
              onClick={() => setMobileTab('home')}
              className={`flex flex-col items-center justify-center py-1 cursor-pointer ${
                mobileTab === 'home' ? 'text-[#003a2f]' : 'text-[#707975]'
              }`}
            >
              <Home className="w-5 h-5" />
              <span className="text-[10px] font-bold mt-0.5">{t.home}</span>
            </button>

            <button
              onClick={() => setMobileTab('search')}
              className={`flex flex-col items-center justify-center py-1 cursor-pointer ${
                mobileTab === 'search' ? 'text-[#003a2f]' : 'text-[#707975]'
              }`}
            >
              <Search className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">جستجو</span>
            </button>

            <button
              onClick={() => setMobileTab('live')}
              className={`flex flex-col items-center justify-center py-1 cursor-pointer ${
                mobileTab === 'live' ? 'text-[#ba1a1a]' : 'text-[#707975]'
              }`}
            >
              <Flame className="w-5 h-5 text-[#ba1a1a]" />
              <span className="text-[10px] font-medium mt-0.5">زنده</span>
            </button>

            <button
              onClick={() => setMobileTab('saved')}
              className={`flex flex-col items-center justify-center py-1 cursor-pointer relative ${
                mobileTab === 'saved' ? 'text-[#003a2f]' : 'text-[#707975]'
              }`}
            >
              <Bookmark className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">نشان‌ها</span>
              {watchlist.length > 0 && (
                <span className="absolute top-1 right-5 w-4 h-4 rounded-full bg-[#cea701] text-white text-[9px] font-bold flex items-center justify-center">
                  {watchlist.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setMobileTab('profile')}
              className={`flex flex-col items-center justify-center py-1 cursor-pointer ${
                mobileTab === 'profile' ? 'text-[#003a2f]' : 'text-[#707975]'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] font-medium mt-0.5">پروفایل</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
