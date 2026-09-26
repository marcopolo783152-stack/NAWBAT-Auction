import React, { useEffect, useState } from 'react';
import { AuctionLot, Language } from '../types/auction';
import { translations } from '../translations';
import { 
  Flame, 
  Clock, 
  Gavel, 
  Eye, 
  Bookmark, 
  ShieldCheck, 
  MapPin, 
  CheckCircle,
  AlertCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

interface ClosingSoonSectionProps {
  lots: AuctionLot[];
  currentLang: Language;
  onSelectLot: (lot: AuctionLot) => void;
  onQuickBid: (lot: AuctionLot) => void;
  watchlist: string[];
  onToggleWatchlist: (lotId: string) => void;
}

export const ClosingSoonSection: React.FC<ClosingSoonSectionProps> = ({
  lots,
  currentLang,
  onSelectLot,
  onQuickBid,
  watchlist,
  onToggleWatchlist,
}) => {
  const t = translations[currentLang];
  const isRtl = currentLang !== 'en';

  // Live timer tick mechanism
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

  return (
    <section className="w-full px-4 lg:px-8 py-10 lg:py-16 bg-[#ecf4ff] border-b border-[#003a2f]/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#ba1a1a] animate-ping" />
              <span className="text-xs font-bold text-[#ba1a1a] tracking-wider flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-[#ba1a1a]" />
                {t.closingSoonEyebrow}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111d27] flex items-center gap-2">
              <span>{t.closingSoonTitle}</span>
              <span className="text-xs text-[#735c00] bg-[#ffe085]/40 px-2.5 py-0.5 rounded-full font-mono font-medium">
                Ending Soon
              </span>
            </h2>

            <p className="text-xs sm:text-sm text-[#3f4945]">
              {t.antiSnipingRule}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#326286] bg-white px-3 py-1.5 rounded-lg border border-[#326286]/20 shadow-2xs">
              {t.activeLotsCount}
            </span>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {lots.map((lot) => {
            const msLeft = timeRemaining[lot.id] || 0;
            const isUrgent = msLeft < 10 * 60 * 1000 && msLeft > 0;
            const isExpired = msLeft <= 0;
            const isBookmarked = watchlist.includes(lot.id);

            return (
              <div
                key={lot.id}
                className="bg-white rounded-xl border border-[#003a2f]/10 shadow-xs hover:shadow-md transition-all flex flex-col overflow-hidden group"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-4/3 overflow-hidden bg-[#e3effe]">
                  <img
                    src={lot.imageUrl}
                    alt={lot.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.currentTarget as HTMLElement).style.opacity = '0.5';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                  {/* Top Bar on Image: Province & Watchlist */}
                  <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                    <span className="inline-flex items-center gap-1 bg-[#111d27]/75 backdrop-blur-xs text-white text-[11px] px-2 py-0.5 rounded font-medium">
                      <MapPin className="w-3 h-3 text-[#afefdc]" />
                      {lot.province}
                    </span>

                    <button
                      onClick={() => onToggleWatchlist(lot.id)}
                      className={`p-1.5 rounded-full backdrop-blur-xs transition-colors cursor-pointer ${
                        isBookmarked
                          ? 'bg-[#cea701] text-[#231b00]'
                          : 'bg-[#111d27]/60 hover:bg-[#111d27]/90 text-white'
                      }`}
                      title={t.watchlist}
                    >
                      <Bookmark className="w-3.5 h-3.5 fill-current" />
                    </button>
                  </div>

                  {/* Bottom Bar on Image: Dynamic Live Countdown Timer */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between z-10">
                    <div
                      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-mono font-bold tracking-wider backdrop-blur-md shadow-xs ${
                        isExpired
                          ? 'bg-[#3f4945]/90 text-white'
                          : isUrgent
                          ? 'bg-[#ba1a1a] text-white animate-pulse'
                          : 'bg-[#111d27]/85 text-[#afefdc]'
                      }`}
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{isExpired ? 'پایان یافته' : formatTime(msLeft)}</span>
                    </div>

                    <span className="text-[11px] bg-white/90 text-[#003a2f] font-mono px-1.5 py-0.5 rounded font-bold">
                      {lot.lotNumber}
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Category & Verified Seller */}
                    <div className="flex items-center justify-between text-[11px] text-[#707975] mb-1">
                      <span>{lot.categoryLabel}</span>
                      <span className="flex items-center gap-0.5 text-[#003a2f] font-medium">
                        <ShieldCheck className="w-3 h-3 text-[#0b5345]" />
                        {lot.sellerName}
                      </span>
                    </div>

                    {/* Title */}
                    <h3
                      onClick={() => onSelectLot(lot)}
                      className="font-serif font-bold text-sm text-[#111d27] line-clamp-2 hover:text-[#003a2f] transition-colors cursor-pointer mb-2.5 leading-snug"
                    >
                      {currentLang === 'en' ? lot.titleEn : currentLang === 'ps' ? lot.titlePs : lot.title}
                    </h3>

                    {/* Pricing Information */}
                    <div className="bg-[#f7f9ff] p-2.5 rounded-lg border border-[#003a2f]/5 mb-3">
                      <div className="flex items-baseline justify-between mb-1">
                        <span className="text-[11px] text-[#3f4945]">{t.currentBid}</span>
                        <div className="text-right">
                          <span className="font-mono text-base font-bold text-[#003a2f] tabular-nums">
                            {lot.currentBidAFN.toLocaleString('en-US')}
                          </span>
                          <span className="text-[10px] text-[#3f4945] mr-1">AFN</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-[10px] text-[#707975]">
                        <span className="flex items-center gap-1">
                          <Gavel className="w-3 h-3 text-[#326286]" />
                          <strong className="font-mono text-[#111d27]">{lot.totalBids}</strong> {t.bidsCount}
                        </span>

                        {lot.isReserveMet ? (
                          <span className="flex items-center gap-0.5 text-[#0b5345] font-medium">
                            <CheckCircle className="w-3 h-3" />
                            {t.reserveMet}
                          </span>
                        ) : (
                          <span className="flex items-center gap-0.5 text-[#735c00] font-medium">
                            <AlertCircle className="w-3 h-3" />
                            {t.reserveNotMet}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1 border-t border-[#003a2f]/5">
                    <button
                      onClick={() => onQuickBid(lot)}
                      disabled={isExpired}
                      className="w-full bg-[#003a2f] hover:bg-[#0b5345] disabled:bg-[#bfc9c4] text-white py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Gavel className="w-3 h-3 text-[#afefdc]" />
                      <span>{t.quickBid}</span>
                    </button>

                    <button
                      onClick={() => onSelectLot(lot)}
                      className="w-full bg-[#e3effe] hover:bg-[#dde9f9] text-[#003a2f] py-1.5 px-2 rounded text-xs font-semibold flex items-center justify-center gap-1 transition-colors cursor-pointer"
                    >
                      <Eye className="w-3 h-3 text-[#326286]" />
                      <span>{t.viewDetails}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
