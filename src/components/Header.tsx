import React from 'react';
import { Logo } from './Logo';
import { CategoryId, Language, Province, ViewMode, ActiveTab } from '../types/auction';
import { translations } from '../translations';
import { NawbatUser } from '../services/authApi';
import {
  Search, MapPin, PlusCircle, ShieldCheck, User, Smartphone, Monitor,
  Bookmark, Gavel, Menu, X, LogIn, LogOut, FileText
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
  currentUser: NawbatUser | null;
  onOpenProfile: () => void;
  onLogout: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentLang, onLanguageChange, selectedProvince, onProvinceChange,
  selectedCategory, onCategoryChange, searchQuery, onSearchChange,
  onSearchSubmit, onOpenSubmitLot, viewMode, onToggleViewMode,
  activeTab, onTabChange, myBidsCount, watchlistCount, currentUser,
  onOpenProfile, onLogout,
}) => {
  const t = translations[currentLang];
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const isStaff = currentUser?.userType === 'staff';

  const provinces: Province[] = ['همه ولایات','کابل','هرات','مزارشریف','قندهار','جلال‌آباد','کندز','بامیان'];

  const roleLabel = (() => {
    if (!currentUser) return '';
    if (currentUser.role === 'superadmin') return currentLang === 'en' ? 'Super Admin' : 'مدیر ارشد';
    if (currentUser.role === 'admin') return currentLang === 'en' ? 'Admin' : 'مدیر';
    if (currentUser.userType === 'staff') return currentUser.roleName || (currentLang === 'en' ? 'Staff' : 'کارمند');
    if (currentUser.userType === 'seller') return currentLang === 'en' ? 'Seller' : 'فروشنده';
    if (currentUser.userType === 'business') return currentLang === 'en' ? 'Business Seller' : 'فروشنده تجارتی';
    if (currentUser.userType === 'customer') return currentLang === 'en' ? 'Customer' : 'مشتری';
    return currentLang === 'en' ? 'Buyer' : 'خریدار';
  })();

  const navItems: { id: ActiveTab; label: string; catId?: CategoryId }[] = [
    { id: 'home', label: t.home, catId: 'all' },
    { id: 'browse', label: currentLang === 'en' ? 'Browse' : currentLang === 'ps' ? 'کتنه' : 'مرور مزایده‌ها' },
    { id: 'categories', label: t.vehicles, catId: 'cars' },
    { id: 'categories', label: t.carpets, catId: 'carpets' },
    { id: 'categories', label: t.jewelry, catId: 'jewelry' },
    { id: 'categories', label: t.electronics, catId: 'electronics' },
    { id: 'categories', label: t.machinery, catId: 'machinery' },
    { id: 'fees', label: currentLang === 'en' ? 'Fees & Rules' : currentLang === 'ps' ? 'فیسونه او اصول' : 'هزینه‌ها و قوانین' },
    ...(isStaff ? [{ id: 'admin' as ActiveTab, label: currentLang === 'en' ? 'Management' : 'مدیریت' }] : []),
  ];

  return (
    <header className="sticky top-0 w-full z-40 bg-white/95 backdrop-blur-xl border-b border-[#003a2f]/10 shadow-[0_8px_30px_rgba(0,58,47,0.08)]">
      <div className="nawbat-brand-banner">
        <div className="nawbat-brand-orb nawbat-brand-orb-one" />
        <div className="nawbat-brand-orb nawbat-brand-orb-two" />
        <button
          type="button"
          onClick={() => onTabChange('home')}
          className="relative z-10 w-full max-w-[1500px] mx-auto px-4 lg:px-8 py-3.5 md:py-4 flex items-center justify-between gap-4 text-start group"
        >
          <div className="nawbat-logo-panel"><Logo size="lg" /></div>
          <div className="hidden lg:flex flex-col items-end text-white/95 max-w-xl">
            <span className="text-[11px] uppercase tracking-[0.24em] font-semibold text-[#d8fff2]">Afghanistan Online Auction Marketplace</span>
            <span className="text-sm xl:text-base font-bold mt-1 leading-relaxed">
              {currentLang === 'en' ? 'Buy, sell and bid through one trusted marketplace'
                : currentLang === 'ps' ? 'پېرود، پلور او لیلام په یوه باوري بازار کې'
                : 'خرید، فروش و مزایده در یک بازار واحد و قابل اعتماد'}
            </span>
          </div>
          <div className="hidden md:flex items-center gap-2 px-3 py-2 rounded-full bg-white/10 border border-white/15 text-white text-[11px] font-semibold backdrop-blur">
            <span className="w-2 h-2 rounded-full bg-[#afefdc]" />
            <span>{currentLang === 'en' ? 'Dari • Pashto • English' : 'دری • پښتو • English'}</span>
          </div>
        </button>
      </div>

      <div className="w-full px-4 lg:px-8 py-2.5">
        <div className="flex items-center justify-between gap-3">
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-[#f4f8f6] rounded-xl border border-[#d8e3de]">
            <MapPin className="w-4 h-4 text-[#326286]" />
            <select value={selectedProvince} onChange={(e) => onProvinceChange(e.target.value as Province)} className="bg-transparent text-xs font-medium focus:outline-none">
              {provinces.map((prov) => <option key={prov} value={prov}>{prov}</option>)}
            </select>
          </div>

          <div className="flex-1 max-w-2xl mx-2 hidden md:flex items-center bg-[#fbfdfc] rounded-xl p-1.5 border border-[#003a2f]/15 shadow-sm">
            <select
              value={selectedCategory}
              onChange={(e) => {
                onCategoryChange(e.target.value as CategoryId);
                if (e.target.value !== 'all') onTabChange('categories');
              }}
              className="bg-transparent px-2.5 text-xs text-[#3f4945] font-medium focus:outline-none border-l rtl:border-l-0 rtl:border-r border-[#bfc9c4]"
            >
              <option value="all">{t.allCategories}</option>
              <option value="cars">{t.vehicles}</option><option value="carpets">{t.carpets}</option>
              <option value="jewelry">{t.jewelry}</option><option value="antiques">{t.antiques}</option>
              <option value="electronics">{t.electronics}</option><option value="machinery">{t.machinery}</option>
            </select>
            <input
              value={searchQuery} onChange={(e) => onSearchChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit()}
              className="flex-1 bg-transparent px-3 text-xs outline-none"
              placeholder={t.searchPlaceholder}
            />
            <button onClick={onSearchSubmit} className="bg-[#003a2f] hover:bg-[#0b5345] text-white px-4 py-2 rounded-lg text-xs font-semibold">
              <Search className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={onToggleViewMode} className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border border-[#326286]/20 text-[#326286] bg-[#ecf4ff]">
              {viewMode === 'mobile_app' ? <Monitor className="w-3.5 h-3.5" /> : <Smartphone className="w-3.5 h-3.5" />}
            </button>

            <button onClick={onOpenSubmitLot} className="hidden sm:inline-flex items-center gap-1.5 bg-[#c9953f] hover:bg-[#b48635] text-[#1d1508] px-4 py-2 rounded-lg text-xs font-black shadow-sm">
              <PlusCircle className="w-3.5 h-3.5" /><span>{t.sellItem}</span>
            </button>

            {currentUser ? (
              <>
                {isStaff && (
                  <button onClick={() => onTabChange('admin')} className="inline-flex items-center gap-1.5 bg-[#003a2f] text-white px-3 py-2 rounded-xl text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#afefdc]" />
                    <span className="hidden lg:inline">{currentLang === 'en' ? 'Management' : 'مدیریت'}</span>
                  </button>
                )}
                <button onClick={onOpenProfile} className="flex items-center gap-2 p-1.5 hover:bg-[#edf5f1] rounded-xl text-start">
                  <div className="hidden xl:block">
                    <div className="text-xs font-bold text-[#172720] max-w-[145px] truncate">{currentUser.fullName}</div>
                    <div className="text-[10px] text-[#326286]">{roleLabel}</div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#003a2f] text-white flex items-center justify-center"><User className="w-4 h-4" /></div>
                </button>
                <button onClick={onLogout} title={currentLang === 'en' ? 'Sign out' : 'خروج'} className="hidden md:flex p-2 rounded-xl text-[#63716c] hover:bg-[#fff2f1] hover:text-[#9c1c1c]">
                  <LogOut className="w-4 h-4" />
                </button>
              </>
            ) : (
              <button onClick={() => onTabChange('login')} className="inline-flex items-center gap-1.5 bg-[#003a2f] hover:bg-[#0b5345] text-white px-4 py-2 rounded-xl text-xs font-bold">
                <LogIn className="w-4 h-4" />
                <span>{currentLang === 'en' ? 'Login / Register' : currentLang === 'ps' ? 'ننوتل / ثبت' : 'ورود / ثبت‌نام'}</span>
              </button>
            )}

            <div className="hidden lg:flex items-center gap-1 text-xs text-[#3f4945]">
              <button onClick={() => onLanguageChange('fa')} className={currentLang === 'fa' ? 'font-bold text-[#003a2f]' : ''}>دری</button>
              <span>|</span><button onClick={() => onLanguageChange('ps')} className={currentLang === 'ps' ? 'font-bold text-[#003a2f]' : ''}>پښتو</button>
              <span>|</span><button onClick={() => onLanguageChange('en')} className={currentLang === 'en' ? 'font-bold text-[#003a2f]' : ''}>EN</button>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 rounded-lg">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="md:hidden mt-2 pt-2 border-t border-[#d7e4f3] flex gap-2">
          <input value={searchQuery} onChange={(e) => onSearchChange(e.target.value)} className="flex-1 bg-white border rounded-lg px-3 py-2 text-xs" placeholder={t.searchPlaceholder} />
          <button onClick={onSearchSubmit} className="bg-[#003a2f] text-white px-3 rounded-lg"><Search className="w-4 h-4" /></button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden mt-2 rounded-xl border border-[#dce6e1] bg-white p-2 shadow-lg">
            <button onClick={() => { onTabChange('fees'); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 p-2 text-xs font-semibold rounded-lg hover:bg-[#f1f6f4]">
              <FileText className="w-4 h-4" />{currentLang === 'en' ? 'Fees & Rules' : 'هزینه‌ها و قوانین'}
            </button>
            <button onClick={() => { onOpenSubmitLot(); setMobileMenuOpen(false); }} className="w-full flex items-center gap-2 p-2 text-xs font-semibold rounded-lg hover:bg-[#f1f6f4]">
              <PlusCircle className="w-4 h-4" />{t.sellItem}
            </button>
            {currentUser && <button onClick={onLogout} className="w-full flex items-center gap-2 p-2 text-xs font-semibold text-[#9c1c1c]"><LogOut className="w-4 h-4" />{currentLang === 'en' ? 'Sign out' : 'خروج'}</button>}
          </div>
        )}
      </div>

      <nav className="w-full px-4 lg:px-8 border-t border-black/10 bg-[#0c0f0e] text-white">
        <div className="flex items-center justify-between gap-3 overflow-x-auto py-1.5">
          <div className="flex items-center gap-1.5 whitespace-nowrap">
            {navItems.map((item, idx) => {
              const isActive =
                (item.id === 'home' && activeTab === 'home' && selectedCategory === 'all') ||
                (item.id === 'browse' && activeTab === 'browse') ||
                (item.id === 'fees' && activeTab === 'fees') ||
                (item.id === 'admin' && activeTab === 'admin') ||
                (selectedCategory === item.catId && activeTab === 'categories');
              return (
                <button
                  key={idx}
                  onClick={() => {
                    if (item.catId) {
                      onCategoryChange(item.catId);
                      onTabChange(item.catId === 'all' ? 'home' : 'categories');
                    } else onTabChange(item.id);
                  }}
                  className={`text-xs px-3 py-2 rounded-md transition-colors ${isActive ? 'bg-[#c9953f] text-[#1f1607] font-black' : 'text-white/88 hover:bg-white/10 hover:text-white'}`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {currentUser && (
            <div className="hidden md:flex items-center gap-2 whitespace-nowrap">
              <button onClick={() => onTabChange('my-bids')} className="text-xs px-2.5 py-1.5 flex items-center gap-1.5 text-white/90 hover:text-white">
                <Gavel className="w-3 h-3 text-[#d7a958]" />{t.myBids}
                {myBidsCount > 0 && <span className="bg-[#0b5345] text-white text-[10px] px-1.5 rounded-full">{myBidsCount}</span>}
              </button>
              <button onClick={() => onTabChange('watchlist')} className="text-xs px-2.5 py-1.5 flex items-center gap-1.5 text-white/90 hover:text-white">
                <Bookmark className="w-3 h-3 text-[#d7a958]" />{t.watchlist}
                {watchlistCount > 0 && <span className="bg-[#cea701] text-[#231b00] text-[10px] px-1.5 rounded-full">{watchlistCount}</span>}
              </button>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
