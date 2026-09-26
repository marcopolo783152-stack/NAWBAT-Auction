import React, { useEffect, useMemo, useState } from 'react';
import { AuctionLot, CategoryId, Language, Province } from '../types/auction';
import { translations } from '../translations';
import {
  Search, MapPin, Clock3, Heart, SlidersHorizontal, ChevronDown,
  Truck, Store, Gavel, X, CheckCircle2
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

type SortOption = 'ending_soonest' | 'newest' | 'price_low' | 'price_high' | 'most_bids';

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

  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId>(initialCategory);
  const [province, setProvince] = useState<Province>(initialProvince);
  const [sortBy, setSortBy] = useState<SortOption>('ending_soonest');
  const [showActive, setShowActive] = useState(true);
  const [showEnded, setShowEnded] = useState(false);
  const [pickupOnly, setPickupOnly] = useState(false);
  const [deliveryOnly, setDeliveryOnly] = useState(false);
  const [reserveMetOnly, setReserveMetOnly] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState<Record<string, number>>({});

  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const next: Record<string, number> = {};
      lots.forEach((lot) => { next[lot.id] = Math.max(0, lot.endTime - now); });
      setTimeRemaining(next);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [lots]);

  const categories: { id: CategoryId; label: string }[] = [
    { id: 'all', label: currentLang === 'en' ? 'All Categories' : 'همه دسته‌ها' },
    { id: 'cars', label: t.vehicles },
    { id: 'carpets', label: t.carpets },
    { id: 'jewelry', label: t.jewelry },
    { id: 'antiques', label: t.antiques },
    { id: 'electronics', label: t.electronics },
    { id: 'machinery', label: t.machinery },
  ];

  const provinces: Province[] = ['همه ولایات','کابل','هرات','مزارشریف','قندهار','جلال‌آباد','کندز','بامیان'];

  const formatRemaining = (ms = 0) => {
    if (ms <= 0) return currentLang === 'en' ? 'Ended' : 'پایان یافته';
    const totalMinutes = Math.floor(ms / 60000);
    if (totalMinutes < 60) return currentLang === 'en' ? `${totalMinutes} minutes left` : `${totalMinutes} دقیقه باقی`;
    const hours = Math.floor(totalMinutes / 60);
    if (hours < 24) return currentLang === 'en' ? `${hours} hours left` : `${hours} ساعت باقی`;
    const days = Math.floor(hours / 24);
    return currentLang === 'en' ? `${days} days left` : `${days} روز باقی`;
  };

  const visibleLots = useMemo(() => {
    const now = Date.now();
    const result = lots.filter((lot) => {
      const ended = lot.endTime <= now;
      if (ended && !showEnded) return false;
      if (!ended && !showActive) return false;
      if (category !== 'all' && lot.category !== category) return false;
      if (province !== 'همه ولایات' && lot.province !== province) return false;
      if (reserveMetOnly && !lot.isReserveMet) return false;
      if (pickupOnly && !lot.province) return false;
      if (deliveryOnly && !lot.province) return false;

      if (query.trim()) {
        const q = query.toLowerCase();
        const haystack = [lot.title, lot.titleEn, lot.lotNumber, lot.categoryLabel, lot.province].join(' ').toLowerCase();
        if (!haystack.includes(q)) return false;
      }
      return true;
    });

    return [...result].sort((a, b) => {
      if (sortBy === 'ending_soonest') return a.endTime - b.endTime;
      if (sortBy === 'price_low') return a.currentBidAFN - b.currentBidAFN;
      if (sortBy === 'price_high') return b.currentBidAFN - a.currentBidAFN;
      if (sortBy === 'most_bids') return b.totalBids - a.totalBids;
      return b.endTime - a.endTime;
    });
  }, [lots, category, province, query, reserveMetOnly, pickupOnly, deliveryOnly, showActive, showEnded, sortBy]);

  return (
    <section className="w-full bg-white min-h-[75vh]" dir={isRtl ? 'rtl' : 'ltr'}>
      <div className="max-w-[1500px] mx-auto px-4 lg:px-6 py-7">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 border-b border-[#dfe6e2] pb-5">
            <div>
              <div className="text-xs text-[#77827d] mb-1">
                {currentLang === 'en' ? 'Marketplace / Active Auctions' : 'بازار / مزایده‌های فعال'}
              </div>
              <div className="flex items-baseline gap-3 flex-wrap">
                <h1 className="font-serif text-2xl sm:text-3xl font-black text-[#111d27]">
                  {query ? (currentLang === 'en' ? `Search for “${query}”` : `نتایج جستجو برای «${query}»`) : (currentLang === 'en' ? 'Browse Auctions' : 'مرور مزایده‌ها')}
                </h1>
                <span className="text-sm text-[#326286] font-semibold">{visibleLots.length} {currentLang === 'en' ? 'items' : 'کالا'}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start lg:self-auto">
              <button className="inline-flex items-center gap-2 border border-[#0b5345]/35 text-[#0b5345] px-3 py-2 rounded-lg text-xs font-bold bg-white hover:bg-[#f0f7f4]">
                <Heart className="w-4 h-4" />
                <span>{currentLang === 'en' ? 'Save This Search' : 'ذخیره این جستجو'}</span>
              </button>
              <div className="flex items-center gap-2 text-xs text-[#4e5c56]">
                <span>{currentLang === 'en' ? 'Sort by' : 'مرتب‌سازی'}</span>
                <div className="relative">
                  <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="appearance-none bg-[#f5f7f6] border border-[#d8e0dc] rounded-lg pl-8 pr-3 rtl:pr-3 rtl:pl-8 py-2 text-xs font-bold text-[#25332e] focus:outline-none">
                    <option value="ending_soonest">{currentLang === 'en' ? 'Ending Soonest' : 'نزدیک‌ترین به پایان'}</option>
                    <option value="newest">{currentLang === 'en' ? 'Newest' : 'جدیدترین'}</option>
                    <option value="most_bids">{currentLang === 'en' ? 'Most Bids' : 'بیشترین پیشنهاد'}</option>
                    <option value="price_low">{currentLang === 'en' ? 'Price: Low to High' : 'قیمت: کم به زیاد'}</option>
                    <option value="price_high">{currentLang === 'en' ? 'Price: High to Low' : 'قیمت: زیاد به کم'}</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 absolute top-2.5 left-2 rtl:left-2 text-[#6c7973] pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-[230px_minmax(0,1fr)] gap-7 items-start">
            <aside className="hidden lg:block sticky top-[210px] self-start text-sm">
              <div className="space-y-6">
                <div>
                  <h3 className="text-xs font-black text-[#3f4e48] uppercase tracking-wide mb-3">{currentLang === 'en' ? 'Categories' : 'دسته‌ها'}</h3>
                  <div className="space-y-1.5">
                    {categories.map((cat) => (
                      <button key={cat.id} onClick={() => setCategory(cat.id)} className={`w-full flex items-center justify-between py-1.5 text-start text-xs rounded-md px-2 ${category === cat.id ? 'bg-[#eef6f2] text-[#003a2f] font-bold' : 'text-[#56635e] hover:bg-[#f7f9f8]'}`}>
                        <span>{cat.label}</span>
                        <span className="text-[10px] text-[#83908a]">{cat.id === 'all' ? lots.length : lots.filter(l => l.category === cat.id).length}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="border-t border-[#e4e9e6] pt-5">
                  <h3 className="text-xs font-black text-[#3f4e48] uppercase tracking-wide mb-3">{currentLang === 'en' ? 'Item Location' : 'موقعیت کالا'}</h3>
                  <div className="relative">
                    <MapPin className="w-4 h-4 absolute top-2.5 right-2 rtl:right-2 text-[#6e7b75]" />
                    <select value={province} onChange={(e) => setProvince(e.target.value as Province)} className="w-full bg-[#f7f9f8] border border-[#dde4e0] rounded-lg py-2 pr-8 pl-2 text-xs focus:outline-none">
                      {provinces.map((p) => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>
                </div>

                <div className="border-t border-[#e4e9e6] pt-5">
                  <h3 className="text-xs font-black text-[#3f4e48] uppercase tracking-wide mb-3">{currentLang === 'en' ? 'Delivery Options' : 'روش تحویل'}</h3>
                  <label className="flex items-center gap-2 py-1.5 text-xs text-[#53615b] cursor-pointer">
                    <input type="checkbox" checked={deliveryOnly} onChange={(e) => setDeliveryOnly(e.target.checked)} />
                    <Truck className="w-3.5 h-3.5" />
                    <span>{currentLang === 'en' ? 'Ship to me' : 'ارسال برای من'}</span>
                  </label>
                  <label className="flex items-center gap-2 py-1.5 text-xs text-[#53615b] cursor-pointer">
                    <input type="checkbox" checked={pickupOnly} onChange={(e) => setPickupOnly(e.target.checked)} />
                    <Store className="w-3.5 h-3.5" />
                    <span>{currentLang === 'en' ? 'Pick up' : 'تحویل حضوری'}</span>
                  </label>
                </div>

                <div className="border-t border-[#e4e9e6] pt-5">
                  <h3 className="text-xs font-black text-[#3f4e48] uppercase tracking-wide mb-3">{currentLang === 'en' ? 'Show Only' : 'نمایش'}</h3>
                  <label className="flex items-center gap-2 py-1.5 text-xs"><input type="checkbox" checked={showActive} onChange={(e) => setShowActive(e.target.checked)} />{currentLang === 'en' ? 'Active Items' : 'مزایده‌های فعال'}</label>
                  <label className="flex items-center gap-2 py-1.5 text-xs"><input type="checkbox" checked={showEnded} onChange={(e) => setShowEnded(e.target.checked)} />{currentLang === 'en' ? 'Ended Items' : 'پایان‌یافته'}</label>
                  <label className="flex items-center gap-2 py-1.5 text-xs"><input type="checkbox" checked={reserveMetOnly} onChange={(e) => setReserveMetOnly(e.target.checked)} />{currentLang === 'en' ? 'Reserve Met' : 'ذخیره تکمیل شده'}</label>
                </div>
              </div>
            </aside>

            <div className="min-w-0">
              <div className="flex gap-2 mb-4 lg:hidden overflow-x-auto pb-1">
                <select value={category} onChange={(e) => setCategory(e.target.value as CategoryId)} className="border rounded-lg px-3 py-2 text-xs bg-white">
                  {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                </select>
                <select value={province} onChange={(e) => setProvince(e.target.value as Province)} className="border rounded-lg px-3 py-2 text-xs bg-white">
                  {provinces.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <div className="relative mb-5">
                <Search className="absolute w-4 h-4 top-3 right-3 rtl:right-3 text-[#7a8681]" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={currentLang === 'en' ? 'Search current auctions...' : 'جستجو در مزایده‌های فعلی...'} className="w-full bg-[#f8faf9] border border-[#dce3df] rounded-xl py-2.5 pr-10 pl-10 text-sm outline-none focus:border-[#0b5345]/50" />
                {query && <button onClick={() => setQuery('')} className="absolute top-2.5 left-3 rtl:left-3"><X className="w-4 h-4 text-[#77827d]" /></button>}
              </div>

              {visibleLots.length === 0 ? (
                <div className="border border-dashed border-[#cbd6d0] rounded-2xl py-16 text-center text-sm text-[#6f7d77]">
                  {currentLang === 'en' ? 'No auctions match these filters.' : 'مزایده‌ای با این فیلترها پیدا نشد.'}
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-5">
                  {visibleLots.map((lot) => {
                    const followed = watchlist.includes(lot.id);
                    const ended = (timeRemaining[lot.id] || 0) <= 0;
                    return (
                      <article key={lot.id} className="group border border-[#e1e6e3] bg-[#f8f9f9] hover:bg-white hover:shadow-[0_10px_28px_rgba(0,58,47,0.09)] transition-all overflow-hidden">
                        <button onClick={() => onSelectLot(lot)} className="block w-full text-start">
                          <div className="aspect-[1.05/1] bg-white overflow-hidden border-b border-[#e3e8e5]">
                            <img src={lot.imageUrl} alt={lot.title} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                          </div>
                          <div className="px-2.5 pt-2.5">
                            <h3 className="font-serif font-bold text-xs sm:text-sm text-[#202b27] line-clamp-2 min-h-[2.5rem]">{currentLang === 'en' ? lot.titleEn : lot.title}</h3>
                          </div>
                        </button>

                        <div className="px-2.5 pb-2.5">
                          <div className="flex items-end justify-between gap-2 mt-2">
                            <div>
                              <div className="text-[10px] text-[#6c7873]">{currentLang === 'en' ? 'Current Bid' : 'پیشنهاد فعلی'}</div>
                              <div className="font-black text-sm text-[#111d27]">{lot.currentBidAFN.toLocaleString('en-US')} <span className="text-[10px] font-semibold">AFN</span></div>
                            </div>
                            <button
                              onClick={() => onToggleWatchlist(lot.id)}
                              className={`inline-flex items-center gap-1 px-2 py-1.5 border text-[10px] font-bold rounded-sm ${followed ? 'bg-[#0b5345] text-white border-[#0b5345]' : 'bg-white text-[#0b5345] border-[#0b5345]/50'}`}
                            >
                              <span>{followed ? (currentLang === 'en' ? 'Following' : 'دنبال می‌شود') : (currentLang === 'en' ? 'Follow' : 'دنبال کردن')}</span>
                              <Heart className={`w-3 h-3 ${followed ? 'fill-current' : ''}`} />
                            </button>
                          </div>

                          <div className="mt-2 pt-2 border-t border-[#dde4e0] flex items-center justify-between gap-2">
                            <div className={`flex items-center gap-1 text-[10px] font-semibold ${ended ? 'text-[#7a7a7a]' : 'text-[#9c281e]'}`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${ended ? 'bg-[#909090]' : 'bg-[#d94132]'}`} />
                              <span>{formatRemaining(timeRemaining[lot.id])}</span>
                            </div>
                            <div className="text-[10px] text-[#6a7771] flex items-center gap-1"><Gavel className="w-3 h-3" />{lot.totalBids}</div>
                          </div>

                          {!ended && (
                            <button onClick={() => onQuickBid(lot)} className="w-full mt-2 bg-[#003a2f] hover:bg-[#0b5345] text-white text-[11px] font-bold py-2 rounded-md">
                              {currentLang === 'en' ? 'Place Bid' : 'ثبت پیشنهاد'}
                            </button>
                          )}

                          {lot.isReserveMet && (
                            <div className="mt-2 flex items-center gap-1 text-[10px] text-[#0b5345] font-semibold">
                              <CheckCircle2 className="w-3 h-3" />{currentLang === 'en' ? 'Reserve met' : 'قیمت احتیاطی تکمیل شده'}
                            </div>
                          )}
                        </div>
                      </article>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
