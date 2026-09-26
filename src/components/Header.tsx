import React from 'react';
import { Logo } from './Logo';
import { CategoryId, Language, Province, ViewMode, ActiveTab } from '../types/auction';
import { translations } from '../translations';
import { 
  Search, 
  MapPin, 
  PlusCircle, 
  ShieldCheck, 
  CheckCircle2, 
  User, 
  Smartphone, 
  Monitor, 
  Bookmark, 
  Gavel,
  Menu,
  X
} from 'lucide-react';

interface HeaderProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
  selectedProvince: Province;
  onProvinceChange: (province: Province) => void;
  selectedCategory: CategoryId;
  onCategoryChange: (cat: CategoryId) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSearchSubmit: () => void;
  onOpenSubmitLot: () => void;
  viewMode: ViewMode;
  onToggleViewMode: () => void;
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  myBidsCount: number;
  watchlistCount: number;
  isAdminLoggedIn?: boolean;
  onOpenAdminLogin?: () => void;
  onOpenProfile?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang,
  onLanguageChange,
  selectedProvince,
  onProvinceChange,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  onSearchChange,
  onSearchSubmit,
  onOpenSubmitLot,
  viewMode,
  onToggleViewMode,
  activeTab,
  onTabChange,
  myBidsCount,
  watchlistCount,
  isAdminLoggedIn = false,
  onOpenAdminLogin,
  onOpenProfile,
}) => {
  const t = translations[currentLang];
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

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

  const navItems: { id: ActiveTab; label: string; catId?: CategoryId }[] = [
    { id: 'home', label: t.home, catId: 'all' },
    { id: 'browse', label: currentLang === 'en' ? 'Browse Catalog' : currentLang === 'ps' ? 'د ټولو کتنه' : 'کاتالوگ و مرور مزایده‌ها' },
    { id: 'categories', label: t.vehicles, catId: 'cars' },
    { id: 'categories', label: t.carpets, catId: 'carpets' },
    { id: 'categories', label: t.jewelry, catId: 'jewelry' },
    { id: 'categories', label: t.antiques, catId: 'antiques' },
    { id: 'categories', label: t.electronics, catId: 'electronics' },
    { id: 'categories', label: t.machinery, catId: 'machinery' },
    { id: 'categories', label: t.corporateAuctions, catId: 'corporate' },
    ...(isAdminLoggedIn ? [{ id: 'admin' as ActiveTab, label: currentLang === 'en' ? '⚙️ Admin Operations' : '⚙️ مرکز مدیریت و نظارت' }] : []),
  ];

  return (
    <header className="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-xl border-b border-[#003a2f]/10 shadow-[0_8px_30px_rgba(0,58,47,0.08)]">
      {/* NAWBAT Brand Banner */}
      <div className="nawbat-brand-banner">
        <div className="nawbat-brand-orb nawbat-brand-orb-one" />
        <div className="nawbat-brand-orb nawbat-brand-orb-two" />
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className="relative z-10 w-full max-w-[1500px] mx-auto px-4 lg:px-8 py-3.5 md:py-4 flex items-center justify-between gap-4 text-start group"
          aria-label={currentLang === 'en' ? 'Go to NAWBAT home' : 'رفتن به صفحه اصلی نوبت'}
        >
          <div className="nawbat-logo-panel">
            <Logo size="lg" />
          </div>

          <div className="hidden lg:flex flex-col items-end text-white/95 max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[#d8fff2]">
              Afghanistan Online Auction Marketplace
            </span>
            <span className="text-sm xl:text-base font-bold mt-1 leading-relaxed">
              {currentLang === 'en'
                ? 'A simple, trusted place to discover and bid on auctions across Afghanistan'
                : currentLang === 'ps'
                ? 'په افغانستان کې د آنلاین لیلامونو لپاره ساده او باوري بازار'
                : 'بازار ساده و قابل اعتماد برای دیدن و پیشنهاد دادن در مزایده‌های افغانستان'}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-white/15 text-white text-[11px] font-semibold backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-[#afefdc] shadow-[0_0_12px_rgba(175,239,220,0.9)]" />
            <span>{currentLang === 'en' ? 'Dari • Pashto • English' : 'دری • پښتو • English'}</span>
          </div>
        </button>
      </div>

      {/* Top Bar Row */}
      <div className="w-full px-4 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3">
          {/* Province Quick Filter */}
          <div className="flex items-center gap-3">
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-[#f4f8f6] rounded-xl text-[#111d27] border border-[#d8e3de] shadow-xs">
              <MapPin className="w-4 h-4 text-[#326286]" />
              <select
                value={selectedProvince}
                onChange={(e) => onProvinceChange(e.target.value as Province)}
                className="bg-transparent text-xs font-medium text-[#111d27] focus:outline-none cursor-pointer"
              >
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Desktop Search Command Input */}
          <div className="flex-1 max-w-2xl mx-2 hidden md:flex items-center bg-[#fbfdfc] rounded-xl p-1.5 border border-[#003a2f]/15 shadow-[0_4px_18px_rgba(0,58,47,0.05)] focus-within:border-[#0b5345]/40 focus-within:shadow-[0_6px_24px_rgba(0,58,47,0.10)] transition-all">
            <select
              value={selectedCategory}
              onChange={(e) => {
                onCategoryChange(e.target.value as CategoryId);
                if (activeTab !== 'categories' && e.target.value !== 'all') {
                  onTabChange('categories');
                }
              }}
              className="bg-transparent px-2.5 text-xs text-[#3f4945] font-medium focus:outline-none cursor-pointer border-l rtl:border-l-0 rtl:border-r border-[#bfc9c4]"
            >
              <option value="all">{t.allCategories}</option>
              <option value="cars">{t.vehicles}</option>
              <option value="carpets">{t.carpets}</option>
              <option value="jewelry">{t.jewelry}</option>
              <option value="antiques">{t.antiques}</option>
              <option value="electronics">{t.electronics}</option>
              <option value="machinery">{t.machinery}</option>
            </select>

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
              className="flex-1 bg-transparent px-3 text-xs text-[#111d27] placeholder:text-[#707975] focus:outline-none"
              placeholder={t.searchPlaceholder}
            />

            <button
              onClick={onSearchSubmit}
              className="flex items-center gap-1.5 bg-[#003a2f] hover:bg-[#0b5345] active:scale-[0.98] text-white px-4 py-2 rounded-lg text-xs font-semibold transition-all shadow-sm"
            >
              <Search className="w-3.5 h-3.5" />
              <span>{t.searchBtn}</span>
            </button>
          </div>

          {/* Header Action Controls */}
          <div className="flex items-center gap-2.5">
            {/* View Mode Switcher (Web vs App view) */}
            <button
              onClick={onToggleViewMode}
              title={viewMode === 'web' ? t.viewSwitcherApp : t.viewSwitcherWeb}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                viewMode === 'mobile_app'
                  ? 'bg-[#326286] text-white border-[#326286] shadow-sm'
                  : 'bg-[#ecf4ff] hover:bg-[#dde9f9] text-[#326286] border-[#326286]/30'
              }`}
            >
              {viewMode === 'mobile_app' ? (
                <>
                  <Monitor className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.viewSwitcherWeb}</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.viewSwitcherApp}</span>
                </>
              )}
            </button>

            {/* HesabPay Trust Pill */}
            <div className="hidden 2xl:flex items-center gap-1 px-3 py-1 bg-[#afefdc]/80 text-[#065043] rounded-full text-xs font-semibold border border-[#065043]/20">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0b5345]" />
              <span>{t.hesabPayBadge}</span>
            </div>

            {/* Sell a Lot CTA */}
            <button
              onClick={onOpenSubmitLot}
              className="inline-flex items-center gap-1.5 bg-[#0b5345] hover:bg-[#003a2f] active:scale-[0.98] text-white transition-all px-4 py-2 rounded-xl text-xs font-semibold shadow-sm cursor-pointer"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>{t.sellItem}</span>
            </button>

            {/* Admin Portal / Login Button */}
            {isAdminLoggedIn ? (
              <button
                onClick={() => onTabChange('admin')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs ${
                  activeTab === 'admin'
                    ? 'bg-[#afefdc] text-[#003a2f]'
                    : 'bg-[#003a2f] text-white hover:bg-[#0b5345]'
                }`}
                title="پنل مدیریت سامانه نوبت"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#afefdc]" />
                <span>{currentLang === 'en' ? 'Admin Portal' : 'پنل مدیریت'}</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="inline-flex items-center gap-1 bg-white hover:bg-[#ecf4ff] text-[#003a2f] border border-[#003a2f]/20 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer shadow-2xs"
                title="ورود مدیران رسمی سامانه"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-[#326286]" />
                <span>{currentLang === 'en' ? 'Admin Login' : 'ورود مدیر'}</span>
              </button>
            )}

            {/* Language Selector */}
            <div className="hidden sm:flex items-center gap-1 text-xs px-1 text-[#3f4945]">
              <button
                onClick={() => onLanguageChange('fa')}
                className={`px-1 py-0.5 rounded ${currentLang === 'fa' ? 'text-[#003a2f] font-bold underline' : 'hover:text-[#111d27]'}`}
              >
                دری
              </button>
              <span className="text-[#bfc9c4]">|</span>
              <button
                onClick={() => onLanguageChange('ps')}
                className={`px-1 py-0.5 rounded ${currentLang === 'ps' ? 'text-[#003a2f] font-bold underline' : 'hover:text-[#111d27]'}`}
              >
                پښتو
              </button>
              <span className="text-[#bfc9c4]">|</span>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-1 py-0.5 rounded ${currentLang === 'en' ? 'text-[#003a2f] font-bold underline' : 'hover:text-[#111d27]'}`}
              >
                EN
              </button>
            </div>

            {/* Verified User Profile Pill */}
            <button
              onClick={onOpenProfile}
              className="flex items-center gap-2 pl-1 rtl:pl-0 rtl:pr-1 p-1 hover:bg-[#ecf4ff] rounded-xl transition-all cursor-pointer group text-right rtl:text-right ltr:text-left focus:outline-none"
              title={currentLang === 'en' ? 'Click to open User Profile & Notification Settings' : 'مشاهده پروفایل کاربری و تنظیمات اعلانات ایمیل'}
            >
              <div className="hidden xl:flex flex-col text-left rtl:text-right">
                <div className="flex items-center gap-1">
                  <span className="text-xs font-bold text-[#111d27] group-hover:text-[#003a2f] transition-colors">{t.userProfileName}</span>
                  <CheckCircle2 className="w-3 h-3 text-[#003a2f] fill-[#afefdc]" />
                </div>
                <span className="text-[10px] text-[#326286] font-medium">{t.userProfileKyc}</span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#003a2f] group-hover:bg-[#0b5345] flex items-center justify-center text-white ring-2 ring-[#afefdc]/60 transition-all shadow-2xs">
                <User className="w-4 h-4" />
              </div>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-1.5 text-[#111d27] hover:bg-[#ecf4ff] rounded-lg"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar dropdown if needed */}
        <div className="md:hidden mt-2 pt-2 border-t border-[#d7e4f3] flex items-center gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="flex-1 bg-white border border-[#bfc9c4] rounded px-3 py-1.5 text-xs text-[#111d27]"
            placeholder={t.searchPlaceholder}
          />
          <button
            onClick={onSearchSubmit}
            className="bg-[#003a2f] text-white px-3 py-1.5 rounded text-xs"
          >
            <Search className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Second Row: Navigation links */}
      <nav className="w-full px-4 lg:px-8 border-t border-[#003a2f]/8 bg-white/80 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 overflow-x-auto py-1.5">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            {navItems.map((item, idx) => {
              const isActive =
                (item.id === 'home' && activeTab === 'home' && selectedCategory === 'all') ||
                (item.id === 'browse' && activeTab === 'browse') ||
                (selectedCategory === item.catId && activeTab === 'categories');

              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.catId) {
                      onCategoryChange(item.catId);
                      onTabChange(item.catId === 'all' ? 'home' : 'categories');
                    } else {
                      onTabChange(item.id);
                    }
                  }}
                  className={`text-xs px-3 py-1 rounded-md transition-colors cursor-pointer ${
                    isActive
                      ? 'bg-[#dde9f9] text-[#003a2f] font-bold shadow-xs'
                      : 'text-[#3f4945] hover:text-[#111d27] hover:bg-[#ecf4ff]'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* Quick Ledger Links */}
          <div className="hidden md:flex items-center gap-2 whitespace-nowrap">
            <button
              onClick={() => onTabChange('my-bids')}
              className={`text-xs px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'my-bids'
                  ? 'bg-[#dde9f9] text-[#003a2f] font-bold'
                  : 'text-[#3f4945] hover:text-[#111d27]'
              }`}
            >
              <Gavel className="w-3 h-3 text-[#326286]" />
              <span>{t.myBids}</span>
              {myBidsCount > 0 && (
                <span className="bg-[#0b5345] text-white text-[10px] px-1.5 py-0.2 rounded-full font-mono">
                  {myBidsCount}
                </span>
              )}
            </button>

            <button
              onClick={() => onTabChange('watchlist')}
              className={`text-xs px-2.5 py-1 rounded transition-colors flex items-center gap-1.5 ${
                activeTab === 'watchlist'
                  ? 'bg-[#dde9f9] text-[#003a2f] font-bold'
                  : 'text-[#3f4945] hover:text-[#111d27]'
              }`}
            >
              <Bookmark className="w-3 h-3 text-[#735c00]" />
              <span>{t.watchlist}</span>
              {watchlistCount > 0 && (
                <span className="bg-[#cea701] text-[#231b00] text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold">
                  {watchlistCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
};
