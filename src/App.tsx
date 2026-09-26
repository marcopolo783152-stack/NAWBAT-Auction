import React, { useState, useEffect } from 'react';
import { AuctionLot, CategoryId, Language, Province, ViewMode, ActiveTab } from './types/auction';
import { INITIAL_AUCTION_LOTS } from './data/mockLots';
import { translations } from './translations';
import { Header } from './components/Header';
import { TrustRibbon } from './components/TrustRibbon';
import { HeroSection } from './components/HeroSection';
import { ClosingSoonSection } from './components/ClosingSoonSection';
import { CategoryMatrix } from './components/CategoryMatrix';
import { CorporateBanner } from './components/CorporateBanner';
import { SecurityPillars } from './components/SecurityPillars';
import { Footer } from './components/Footer';
import { BidModal } from './components/BidModal';
import { LotDetailModal } from './components/LotDetailModal';
import { SubmitLotModal } from './components/SubmitLotModal';
import { MobileAppView } from './components/MobileAppView';
import { EbthBrowseCatalog } from './components/EbthBrowseCatalog';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { UserProfileModal } from './components/UserProfileModal';
import { adminAuth } from './services/adminApi';
import { ShieldCheck, CheckCircle2, Clock, X } from 'lucide-react';

export default function App() {
  const [currentLang, setCurrentLang] = useState<Language>('fa');
  const [viewMode, setViewMode] = useState<ViewMode>('web');
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedProvince, setSelectedProvince] = useState<Province>('همه ولایات');
  const [selectedCategory, setSelectedCategory] = useState<CategoryId>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [lots, setLots] = useState<AuctionLot[]>(INITIAL_AUCTION_LOTS);
  const [watchlist, setWatchlist] = useState<string[]>(['lot-2', 'lot-3']);
  const [myBiddedLotIds, setMyBiddedLotIds] = useState<string[]>(['lot-1']);

  // Modals state
  const [selectedLot, setSelectedLot] = useState<AuctionLot | null>(null);
  const [bidModalLot, setBidModalLot] = useState<AuctionLot | null>(null);
  const [isSubmitLotOpen, setIsSubmitLotOpen] = useState(false);
  const [consultationModalOpen, setConsultationModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => adminAuth.hasSession());
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  // Live Toast Notification
  const [toastMessage, setToastMessage] = useState<{ title: string; subtitle: string } | null>(null);

  // Synchronize document dir and lang with currentLang
  useEffect(() => {
    document.documentElement.dir = currentLang === 'en' ? 'ltr' : 'rtl';
    document.documentElement.lang = currentLang;
  }, [currentLang]);

  useEffect(() => {
    const handleExpired = () => {
      setIsAdminLoggedIn(false);
      setActiveTab('home');
      setToastMessage({
        title: currentLang === 'en' ? 'Admin session expired' : 'نشست مدیریت پایان یافت',
        subtitle: currentLang === 'en' ? 'Please sign in again.' : 'برای ادامه دوباره وارد حساب مدیریت شوید.',
      });
    };
    window.addEventListener('nawbat-admin-session-expired', handleExpired);
    return () => window.removeEventListener('nawbat-admin-session-expired', handleExpired);
  }, [currentLang]);

  // Handle Search Submission
  const handleSearchSubmit = () => {
    if (activeTab !== 'categories' && activeTab !== 'home') {
      setActiveTab('home');
    }
  };

  // Watchlist toggle
  const handleToggleWatchlist = (lotId: string) => {
    setWatchlist((prev) => {
      const exists = prev.includes(lotId);
      const updated = exists ? prev.filter((id) => id !== lotId) : [...prev, lotId];
      setToastMessage({
        title: exists ? 'از نشان‌شده‌ها حذف شد' : 'به نشان‌شده‌ها اضافه شد',
        subtitle: 'وضعیت تغییرات این مزایده برای شما مانیتور می‌شود.',
      });
      return updated;
    });
  };

  // Handle Bid Placement
  const handleBidSubmit = (lotId: string, amountAFN: number, isProxy: boolean, maxProxyAFN?: number) => {
    setLots((prevLots) => {
      return prevLots.map((l) => {
        if (l.id === lotId) {
          const now = Date.now();
          const msLeft = Math.max(0, l.endTime - now);
          let newEndTime = l.endTime;
          let antiSniped = false;

          // Anti-Sniping rule: if bid placed in final 2 minutes, extend by 3 minutes!
          if (msLeft < 2 * 60 * 1000) {
            newEndTime = now + 3 * 60 * 1000;
            antiSniped = true;
          }

          const newBidHistory = [
            {
              id: `bid-${Date.now()}`,
              bidderName: 'احمدشاه رضایی (شما)',
              bidderMaskedId: 'شما (Bidder ***84)',
              amountAFN,
              timestamp: 'هم‌اکنون',
              isWinning: true,
            },
            ...l.bidHistory.map((b) => ({ ...b, isWinning: false })),
          ];

          if (antiSniped) {
            setToastMessage({
              title: 'قانون ضدقیچی اعمال شد! (+3 دقیقه)',
              subtitle: `ساعت حراج لوط ${l.lotNumber} به دلیل ثبت پیشنهاد در دقایق پایانی تمدید شد.`,
            });
          } else {
            setToastMessage({
              title: 'پیشنهاد شما با موفقیت ثبت شد!',
              subtitle: `مبلغ ${amountAFN.toLocaleString('en-US')} AFN در این نشست مزایده ثبت شد. تایید پرداخت فقط پس از پاسخ رسمی حساب‌پی انجام می‌شود.`,
            });
          }

          const updatedLot: AuctionLot = {
            ...l,
            currentBidAFN: amountAFN,
            totalBids: l.totalBids + 1,
            isReserveMet: amountAFN >= l.reservePriceAFN,
            endTime: newEndTime,
            bidHistory: newBidHistory,
          };

          if (selectedLot && selectedLot.id === lotId) {
            setSelectedLot(updatedLot);
          }

          return updatedLot;
        }
        return l;
      });
    });

    if (!myBiddedLotIds.includes(lotId)) {
      setMyBiddedLotIds((prev) => [...prev, lotId]);
    }
  };

  // Handle new lot creation
  const handleLotCreated = (newLot: AuctionLot) => {
    setLots((prev) => [newLot, ...prev]);
    setToastMessage({
      title: 'لوط جدید منتشر گردید',
      subtitle: `مزایده ${newLot.title} با شناسه ${newLot.lotNumber} وارد شبکه شد.`,
    });
  };

  // Filter lots based on active tab, province, category, search
  const displayedLots = lots.filter((lot) => {
    if (activeTab === 'watchlist') {
      return watchlist.includes(lot.id);
    }
    if (activeTab === 'my-bids') {
      return myBiddedLotIds.includes(lot.id);
    }
    const matchesProvince = selectedProvince === 'همه ولایات' || lot.province === selectedProvince;
    const matchesCategory = selectedCategory === 'all' || lot.category === selectedCategory;
    const matchesQuery =
      !searchQuery.trim() ||
      lot.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.titleEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.lotNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lot.province.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesProvince && matchesCategory && matchesQuery;
  });

  return (
    <div className="min-h-screen bg-[#f7f9ff] text-[#111d27] font-sans antialiased flex flex-col selection:bg-[#003a2f] selection:text-[#afefdc]">
      {/* Toast Notification Box */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-[#003a2f] text-white p-4 rounded-xl shadow-2xl border border-[#afefdc]/30 max-w-sm flex items-start justify-between gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-[#afefdc] shrink-0 mt-0.5" />
            <div>
              <h4 className="font-serif font-bold text-xs text-white">{toastMessage.title}</h4>
              <p className="text-[11px] text-[#dde9f9] mt-0.5 leading-snug">{toastMessage.subtitle}</p>
            </div>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white p-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Main View Router: Web Experience vs Smartphone Mobile App Experience */}
      {viewMode === 'mobile_app' ? (
        <MobileAppView
          lots={lots}
          currentLang={currentLang}
          selectedProvince={selectedProvince}
          onProvinceSelect={setSelectedProvince}
          selectedCategory={selectedCategory}
          onCategorySelect={setSelectedCategory}
          onSelectLot={setSelectedLot}
          onQuickBid={setBidModalLot}
          watchlist={watchlist}
          onToggleWatchlist={handleToggleWatchlist}
          onOpenSubmitLot={() => setIsSubmitLotOpen(true)}
          onSwitchToWeb={() => setViewMode('web')}
          onOpenProfile={() => setIsUserProfileOpen(true)}
        />
      ) : (
        /* Full Desktop / Responsive Web Platform */
        <>
          {/* Institutional Header */}
          <Header
            currentLang={currentLang}
            onLanguageChange={setCurrentLang}
            selectedProvince={selectedProvince}
            onProvinceChange={setSelectedProvince}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            onSearchSubmit={handleSearchSubmit}
            onOpenSubmitLot={() => setIsSubmitLotOpen(true)}
            viewMode={viewMode}
            onToggleViewMode={() => setViewMode(viewMode === 'web' ? 'mobile_app' : 'web')}
            activeTab={activeTab}
            onTabChange={setActiveTab}
            myBidsCount={myBiddedLotIds.length}
            watchlistCount={watchlist.length}
            isAdminLoggedIn={isAdminLoggedIn}
            onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
            onOpenProfile={() => setIsUserProfileOpen(true)}
          />

          {/* Announcement & System Trust Ribbon */}
          <TrustRibbon currentLang={currentLang} />

          {/* Body Content */}
          <main className="flex-1 w-full">
            {activeTab === 'admin' ? (
              /* Dedicated Admin Dashboard View */
              <AdminDashboard
                lots={lots}
                onAddLot={(newLot) => {
                  setLots((prev) => [newLot, ...prev]);
                  setToastMessage({
                    title: 'لوط سازمانی جدید اضافه شد',
                    subtitle: `لوط ${newLot.lotNumber} در سراسر سامانه منتشر گردید.`,
                  });
                }}
                onDeleteLot={(lotId) => {
                  setLots((prev) => prev.filter((l) => l.id !== lotId));
                  setToastMessage({
                    title: 'لوط با موفقیت حذف گردید',
                    subtitle: 'این کالا از چرخه مزایده برداشته شد.',
                  });
                }}
                onExtendTime={(lotId) => {
                  setLots((prev) =>
                    prev.map((l) =>
                      l.id === lotId ? { ...l, endTime: l.endTime + 3 * 60 * 1000 } : l
                    )
                  );
                  setToastMessage({
                    title: 'تمدید زمان با موفقیت اعمال شد (+3 دقیقه)',
                    subtitle: 'زمان پایان حراج برای اعمال قانون ضدقیچی افزایش یافت.',
                  });
                }}
                onLogout={() => {
                  adminAuth.clearToken();
                  setIsAdminLoggedIn(false);
                  setActiveTab('home');
                  setToastMessage({
                    title: 'خروج از حساب مدیریت',
                    subtitle: 'شما به حالت کاربر عادی بازگشتید.',
                  });
                }}
                currentLang={currentLang}
              />
            ) : activeTab === 'browse' ? (
              /* Dedicated EBTH Browse Catalog View */
              <EbthBrowseCatalog
                lots={lots}
                currentLang={currentLang}
                onSelectLot={setSelectedLot}
                onQuickBid={setBidModalLot}
                watchlist={watchlist}
                onToggleWatchlist={handleToggleWatchlist}
                initialCategory={selectedCategory}
                initialProvince={selectedProvince}
              />
            ) : activeTab === 'my-bids' ? (
              /* My Bids Page View */
              <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#003a2f]/10">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#003a2f]">مزایده‌های تحت پیشنهاد من</h2>
                    <p className="text-xs text-[#3f4945]">لیست اقلامی که با سپرده امانی HesabPay پیشنهاد ثبت نموده‌اید.</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="text-xs font-semibold text-[#326286] hover:underline"
                  >
                    بازگشت به همه مزایده‌ها
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedLots.map((lot) => (
                    <div key={lot.id} className="bg-white rounded-xl border border-[#003a2f]/15 p-4 shadow-xs flex flex-col justify-between">
                      <div className="flex gap-3">
                        <img src={lot.imageUrl} alt={lot.title} className="w-20 h-20 rounded-lg object-cover" />
                        <div>
                          <span className="text-[10px] text-[#326286] font-mono">{lot.lotNumber}</span>
                          <h4 className="font-serif font-bold text-xs text-[#111d27] line-clamp-2">{lot.title}</h4>
                          <span className="text-xs font-bold text-[#003a2f] block mt-1">
                            پیشنهاد فعلی: {lot.currentBidAFN.toLocaleString('en-US')} AFN
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#003a2f]/10 flex items-center justify-between">
                        <span className="text-[11px] text-[#065043] bg-[#afefdc] px-2 py-0.5 rounded font-bold">
                          پیشنهاد شما ثبت است ✓
                        </span>
                        <button
                          onClick={() => setSelectedLot(lot)}
                          className="bg-[#003a2f] text-white px-3 py-1 rounded text-xs font-semibold"
                        >
                          مشاهده
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : activeTab === 'watchlist' ? (
              /* Watchlist Page View */
              <div className="max-w-7xl mx-auto px-4 lg:px-8 py-10">
                <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#003a2f]/10">
                  <div>
                    <h2 className="font-serif text-2xl font-bold text-[#003a2f]">لوط‌های نشان‌شده (Watchlist)</h2>
                    <p className="text-xs text-[#3f4945]">پیگیری لحظه‌ای تغییرات و پیشنهادات نهایی اقلام منتخب شما</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('home')}
                    className="text-xs font-semibold text-[#326286] hover:underline"
                  >
                    بازگشت به صفحه نخست
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {displayedLots.map((lot) => (
                    <div key={lot.id} className="bg-white rounded-xl border border-[#003a2f]/15 p-4 shadow-xs flex flex-col justify-between">
                      <div className="flex gap-3">
                        <img src={lot.imageUrl} alt={lot.title} className="w-20 h-20 rounded-lg object-cover" />
                        <div>
                          <span className="text-[10px] text-[#326286] font-mono">{lot.lotNumber}</span>
                          <h4 className="font-serif font-bold text-xs text-[#111d27] line-clamp-2">{lot.title}</h4>
                          <span className="text-xs font-bold text-[#003a2f] block mt-1">
                            {lot.currentBidAFN.toLocaleString('en-US')} AFN
                          </span>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-[#003a2f]/10 flex items-center justify-between">
                        <button
                          onClick={() => handleToggleWatchlist(lot.id)}
                          className="text-xs text-[#ba1a1a] hover:underline"
                        >
                          حذف از نشان‌شده‌ها
                        </button>
                        <button
                          onClick={() => setBidModalLot(lot)}
                          className="bg-[#003a2f] text-white px-3 py-1 rounded text-xs font-semibold"
                        >
                          ثبت پیشنهاد
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Default Full Homepage Flow */
              <>
                {/* Hero Section */}
                <HeroSection
                  currentLang={currentLang}
                  selectedProvince={selectedProvince}
                  onProvinceSelect={setSelectedProvince}
                  selectedCategory={selectedCategory}
                  onCategorySelect={(cat) => {
                    setSelectedCategory(cat);
                  }}
                  searchQuery={searchQuery}
                  onSearchChange={setSearchQuery}
                  onSearchSubmit={handleSearchSubmit}
                />

                {/* Closing Soon Section */}
                <ClosingSoonSection
                  lots={displayedLots}
                  currentLang={currentLang}
                  onSelectLot={setSelectedLot}
                  onQuickBid={setBidModalLot}
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                />

                {/* EBTH Style Interactive Browse Catalog */}
                <EbthBrowseCatalog
                  lots={lots}
                  currentLang={currentLang}
                  onSelectLot={setSelectedLot}
                  onQuickBid={setBidModalLot}
                  watchlist={watchlist}
                  onToggleWatchlist={handleToggleWatchlist}
                  initialCategory={selectedCategory}
                  initialProvince={selectedProvince}
                />

                {/* Featured Categories Bento Matrix */}
                <CategoryMatrix
                  currentLang={currentLang}
                  onSelectCategory={(cat) => {
                    setSelectedCategory(cat);
                    window.scrollTo({ top: 350, behavior: 'smooth' });
                  }}
                />

                {/* Corporate & Estate Liquidation Banner */}
                <CorporateBanner
                  currentLang={currentLang}
                  onOpenConsultation={() => setConsultationModalOpen(true)}
                />

                {/* 4-Tier Security System */}
                <SecurityPillars currentLang={currentLang} />
              </>
            )}
          </main>

          {/* Institutional Footer */}
          <Footer currentLang={currentLang} onLanguageChange={setCurrentLang} />
        </>
      )}

      {/* Lot Detail Modal */}
      <LotDetailModal
        lot={selectedLot}
        isOpen={!!selectedLot}
        onClose={() => setSelectedLot(null)}
        onOpenBidModal={(lot) => {
          setSelectedLot(null);
          setBidModalLot(lot);
        }}
        isBookmarked={selectedLot ? watchlist.includes(selectedLot.id) : false}
        onToggleWatchlist={handleToggleWatchlist}
        currentLang={currentLang}
      />

      {/* Instant Quick Bid Dialog */}
      <BidModal
        lot={bidModalLot}
        isOpen={!!bidModalLot}
        onClose={() => setBidModalLot(null)}
        onSubmitBid={handleBidSubmit}
        currentLang={currentLang}
      />

      {/* Submit Lot Wizard */}
      <SubmitLotModal
        isOpen={isSubmitLotOpen}
        onClose={() => setIsSubmitLotOpen(false)}
        onLotCreated={handleLotCreated}
        currentLang={currentLang}
      />

      {/* Corporate Inquiry Modal */}
      {consultationModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 border border-[#003a2f]/20 shadow-2xl flex flex-col gap-4 text-right">
            <div className="flex items-center justify-between pb-3 border-b border-[#003a2f]/10">
              <h3 className="font-serif font-bold text-base text-[#003a2f]">درخواست مشاوره مزایده اختصاصی و شرکتی</h3>
              <button onClick={() => setConsultationModalOpen(false)}>
                <X className="w-5 h-5 text-[#707975]" />
              </button>
            </div>
            <p className="text-xs text-[#3f4945]">
              جهت اعزام هیئت کارشناسی و ارزیابی دارایی‌های منقول و غیرمنقول شرکت‌ها یا ورثه محترم، اطلاعات تماس خود را وارد نمایید.
            </p>
            <input
              type="text"
              placeholder="نام نهاد، شرکت یا متولی دارایی"
              className="bg-[#f7f9ff] border border-[#bfc9c4] rounded-lg p-2.5 text-xs"
            />
            <input
              type="text"
              placeholder="شماره تماس مستقیم (کابل یا ولایات)"
              className="bg-[#f7f9ff] border border-[#bfc9c4] rounded-lg p-2.5 text-xs font-mono"
            />
            <button
              onClick={() => {
                setConsultationModalOpen(false);
                setToastMessage({
                  title: 'درخواست شما ثبت گردید',
                  subtitle: 'تیم کارشناسی مزایده افغانستان ظرف حداکثر 24 ساعت کاری با شما تماس خواهد گرفت.',
                });
              }}
              className="bg-[#003a2f] text-white py-2.5 rounded-xl font-bold text-xs"
            >
              ارسال درخواست به مدیریت اموال
            </button>
          </div>
        </div>
      )}

      {/* Admin Login Modal */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
        onLoginSuccess={() => {
          setIsAdminLoggedIn(true);
          setActiveTab('admin');
          setToastMessage({
            title: 'ورود موفق مدیر ارشد',
            subtitle: 'به پنل نظارت و مدیریت سامانه نوبت خوش آمدید.',
          });
        }}
        currentLang={currentLang}
      />

      {/* User Profile & Email Notifications Modal */}
      <UserProfileModal
        isOpen={isUserProfileOpen}
        onClose={() => setIsUserProfileOpen(false)}
        currentLang={currentLang}
      />
    </div>
  );
}
