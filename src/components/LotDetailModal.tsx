import React, { useState, useMemo } from 'react';
import { AuctionLot, Language } from '../types/auction';
import { translations } from '../translations';
import { 
  X, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Gavel, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  UserCheck, 
  Bookmark,
  Share2,
  TrendingUp,
  Activity,
  Check,
  BarChart3,
  List,
  Crown,
  CheckCircle2,
  Users,
  HelpCircle,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ReferenceLine
} from 'recharts';

interface LotDetailModalProps {
  lot: AuctionLot | null;
  isOpen: boolean;
  onClose: () => void;
  onOpenBidModal: (lot: AuctionLot) => void;
  isBookmarked: boolean;
  onToggleWatchlist: (lotId: string) => void;
  currentLang: Language;
}

export const LotDetailModal: React.FC<LotDetailModalProps> = ({
  lot,
  isOpen,
  onClose,
  onOpenBidModal,
  isBookmarked,
  onToggleWatchlist,
  currentLang,
}) => {
  if (!isOpen || !lot) return null;

  const t = translations[currentLang];
  const isRtl = currentLang !== 'en';
  const [copied, setCopied] = useState(false);
  const [ledgerViewMode, setLedgerViewMode] = useState<'table' | 'chart'>('table');

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Build chronological price progression data for the Line Chart
  const chartData = useMemo(() => {
    if (!lot) return [];

    // Reverse bid history (latest is first in array, we need earliest first for chronological progression)
    const reversedBids = [...(lot.bidHistory || [])].reverse();

    // Start with starting price point
    const points = [
      {
        step: 'Start',
        stepIndex: 0,
        time: 'Opening',
        bidder: 'Starting Price',
        price: lot.startingPriceAFN,
        formattedPrice: `${lot.startingPriceAFN.toLocaleString('en-US')} AFN`,
      },
      ...reversedBids.map((bid, idx) => ({
        step: `Bid ${idx + 1}`,
        stepIndex: idx + 1,
        time: bid.timestamp || `Bid ${idx + 1}`,
        bidder: bid.bidderMaskedId || bid.bidderName || `Bidder #${idx + 1}`,
        price: bid.amountAFN,
        formattedPrice: `${bid.amountAFN.toLocaleString('en-US')} AFN`,
      }))
    ];

    return points;
  }, [lot]);

  // Extract the last 5 bidders from bid history
  const last5Bidders = useMemo(() => {
    if (!lot || !lot.bidHistory) return [];
    return lot.bidHistory.slice(0, 5);
  }, [lot]);

  // Calculate analytical metrics
  const priceGrowthPercent = useMemo(() => {
    if (!lot || lot.startingPriceAFN === 0) return '0.0';
    const growth = ((lot.currentBidAFN - lot.startingPriceAFN) / lot.startingPriceAFN) * 100;
    return growth.toFixed(1);
  }, [lot]);

  const netGrowthAFN = useMemo(() => {
    if (!lot) return 0;
    return Math.max(0, lot.currentBidAFN - lot.startingPriceAFN);
  }, [lot]);

  // Custom English tooltip for Recharts Line Chart
  const CustomChartTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-[#003a2f] text-white p-3 rounded-xl shadow-xl border border-[#afefdc]/30 text-xs z-50">
          <div className="flex items-center justify-between gap-4 mb-1 border-b border-white/10 pb-1">
            <span className="font-bold text-[#afefdc]">{data.step}</span>
            <span className="text-[11px] text-[#dde9f9] font-mono">{data.time}</span>
          </div>
          <div className="text-sm font-mono font-bold text-white mb-1">
            {Number(data.price).toLocaleString('en-US')} AFN
          </div>
          <div className="text-[11px] text-[#dde9f9] flex items-center justify-between gap-2">
            <span>Bidder:</span>
            <span className="font-semibold text-white font-mono">{data.bidder}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/65 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-4xl w-full border border-[#003a2f]/20 shadow-2xl overflow-hidden flex flex-col text-[#111d27] my-auto max-h-[92vh]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Top Header */}
        <div className="bg-[#003a2f] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="font-mono text-xs bg-[#afefdc]/20 text-[#afefdc] px-2.5 py-1 rounded font-bold">
              {lot.lotNumber}
            </span>
            <span className="text-xs text-[#dde9f9] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#afefdc]" />
              {lot.province}
            </span>
            <span className="hidden sm:inline text-white/40">|</span>
            <span className="hidden sm:inline text-xs text-[#dde9f9]">{lot.categoryLabel}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleWatchlist(lot.id)}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                isBookmarked ? 'bg-[#cea701] text-[#231b00]' : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
              title={t.watchlist}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
            <button
              onClick={handleShare}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="اشتراک‌گذاری"
            >
              {copied ? <Check className="w-4 h-4 text-[#afefdc]" /> : <Share2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Gallery & Condition Column */}
            <div className="lg:col-span-7 flex flex-col gap-4">
              <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-[#e3effe] border border-[#003a2f]/10 shadow-xs group">
                <img
                  src={lot.imageUrl}
                  alt={lot.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-3 right-3 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto bg-[#003a2f]/90 backdrop-blur-md text-white text-xs px-3 py-1 rounded-full font-semibold flex items-center gap-1.5 shadow-sm">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#afefdc]" />
                  <span>درجه کیفیت: {lot.inspectionGrade}</span>
                </div>

                <div className="absolute bottom-3 left-3 rtl:left-3 rtl:right-auto ltr:right-3 ltr:left-auto bg-[#111d27]/85 backdrop-blur-md text-[#afefdc] text-xs px-3 py-1 rounded-md font-mono font-bold shadow-sm">
                  {lot.escrowStatus}
                </div>
              </div>

              {/* Inspector Provenance Box */}
              <div className="p-3.5 bg-[#f7f9ff] rounded-xl border border-[#003a2f]/10 flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-[#003a2f]">
                  <span className="flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-[#0b5345]" />
                    گزارش تفتیش و کارشناسی رسمی
                  </span>
                  <span className="text-[11px] text-[#326286] font-mono">KYC Level {lot.sellerKycTier}</span>
                </div>
                <div className="text-xs text-[#3f4945] flex flex-col gap-1">
                  <div>
                    <strong className="text-[#111d27]">کارشناس ارزیاب:</strong> {lot.inspectorName}
                  </div>
                  <div>
                    <strong className="text-[#111d27]">موقعیت بازرسی حضوری:</strong> {lot.locationDetails}
                  </div>
                  <div>
                    <strong className="text-[#111d27]">فروشنده معتبر:</strong> {lot.sellerName} (تایید هویت شده با تذکره الکترونیکی)
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="flex flex-col gap-1.5">
                <h4 className="font-serif font-bold text-sm text-[#111d27] flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#326286]" />
                  شرح کامل کالا و سابقه مالکیت
                </h4>
                <p className="text-xs text-[#3f4945] leading-relaxed bg-[#f7f9ff] p-3 rounded-lg border border-[#003a2f]/5">
                  {currentLang === 'en' ? lot.descriptionEn : lot.description}
                </p>
              </div>

              {/* Specifications Table */}
              <div className="flex flex-col gap-2">
                <h4 className="font-serif font-bold text-sm text-[#111d27]">
                  مشخصات فنی و استانداردهای ثبتی
                </h4>
                <div className="border border-[#003a2f]/10 rounded-lg overflow-hidden text-xs">
                  {Object.entries(lot.specs).map(([key, val], idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between p-2.5 ${
                        idx % 2 === 0 ? 'bg-white' : 'bg-[#ecf4ff]/50'
                      }`}
                    >
                      <span className="text-[#707975] font-medium">{key}</span>
                      <span className="text-[#111d27] font-semibold font-mono">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bidding & Live Ladder Column */}
            <div className="lg:col-span-5 flex flex-col gap-4">
              {/* Title & Stats */}
              <div>
                <h2 className="font-serif text-lg font-bold text-[#111d27] leading-snug mb-1">
                  {currentLang === 'en' ? lot.titleEn : currentLang === 'ps' ? lot.titlePs : lot.title}
                </h2>
                <div className="flex items-center gap-2 text-xs text-[#707975]">
                  <span>شناسه لوط: {lot.lotNumber}</span>
                  <span>·</span>
                  <span className="font-mono font-bold text-[#003a2f]">{lot.totalBids}</span>
                  <span>پیشنهاد ثبت شده</span>
                </div>
              </div>

              {/* Price & Timer Box (EBTH High-Contrast Clean Style) */}
              <div className="bg-[#ecf4ff] p-4 rounded-xl border border-[#326286]/20 flex flex-col gap-3 shadow-xs">
                <div className="flex items-baseline justify-between">
                  <span className="text-xs text-[#3f4945] font-medium">{t.currentBid}</span>
                  <div className="text-right">
                    <span className="font-mono text-2xl font-extrabold text-[#003a2f] tabular-nums">
                      {lot.currentBidAFN.toLocaleString('en-US')}
                    </span>
                    <span className="text-xs text-[#3f4945] mr-1">AFN</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-[#326286]/10">
                  <span className="text-[#707975]">
                    {t.startingBid} <strong className="font-mono text-[#111d27]">{lot.startingPriceAFN.toLocaleString('en-US')} AFN</strong>
                  </span>
                  {lot.isReserveMet ? (
                    <span className="flex items-center gap-1 text-[#0b5345] font-semibold">
                      <CheckCircle className="w-3.5 h-3.5" />
                      {t.reserveMet}
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-[#735c00] font-semibold">
                      <AlertCircle className="w-3.5 h-3.5" />
                      {t.reserveNotMet}
                    </span>
                  )}
                </div>

                {/* Primary Bid Action Button */}
                <button
                  onClick={() => onOpenBidModal(lot)}
                  className="w-full bg-[#003a2f] hover:bg-[#0b5345] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mt-1"
                >
                  <Gavel className="w-4 h-4 text-[#afefdc]" />
                  <span>{t.bidNow} (+{lot.minIncrementAFN.toLocaleString('en-US')} AFN)</span>
                </button>

                {/* Easy Quick-Bid Buttons (For people without mental math hassle) */}
                <div className="pt-2 border-t border-[#326286]/15 flex flex-col gap-1.5">
                  <span className="text-[10px] text-[#326286] font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#cea701]" />
                    پیشنهاد فوری بدون معطلی (Easy 1-Click Increment):
                  </span>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => onOpenBidModal(lot)}
                      className="bg-white hover:bg-[#dde9f9] text-[#003a2f] border border-[#003a2f]/15 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-colors cursor-pointer shadow-2xs text-center"
                    >
                      +{lot.minIncrementAFN.toLocaleString('en-US')}
                    </button>
                    <button
                      onClick={() => onOpenBidModal(lot)}
                      className="bg-white hover:bg-[#dde9f9] text-[#003a2f] border border-[#003a2f]/15 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-colors cursor-pointer shadow-2xs text-center"
                    >
                      +{(lot.minIncrementAFN * 2).toLocaleString('en-US')}
                    </button>
                    <button
                      onClick={() => onOpenBidModal(lot)}
                      className="bg-white hover:bg-[#dde9f9] text-[#003a2f] border border-[#003a2f]/15 py-1.5 rounded-lg text-[11px] font-mono font-bold transition-colors cursor-pointer shadow-2xs text-center"
                    >
                      +{(lot.minIncrementAFN * 5).toLocaleString('en-US')}
                    </button>
                  </div>
                </div>
              </div>

              {/* HesabPay Escrow Security Box */}
              <div className="p-3 bg-[#afefdc]/30 rounded-xl border border-[#065043]/20 flex flex-col gap-1.5 text-xs text-[#065043]">
                <div className="flex items-center gap-1.5 font-bold">
                  <ShieldCheck className="w-4 h-4 text-[#003a2f]" />
                  <span>پروتکل تضمین امانی HesabPay</span>
                </div>
                <p className="text-[11px] leading-relaxed">
                  مبلغ معامله تا زمان تایید فیزیکی کالا و تحویل مدارک در حساب امانی محفوظ خواهد بود. تحویل کالا با اسکن کد QR اختصاصی در گدام انجام می‌شود.
                </p>
              </div>

              {/* Live Bid Ladder & Mini View Switcher */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-serif font-bold text-xs text-[#111d27] flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-[#003a2f]" />
                    <span>جدول لحظه‌ای پیشنهادات (Live Bid Ledger)</span>
                  </h4>

                  {/* Toggle between Table Ledger and Quick Trend view */}
                  <div className="inline-flex rounded-lg bg-[#f7f9ff] p-0.5 border border-[#003a2f]/10">
                    <button
                      onClick={() => setLedgerViewMode('table')}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                        ledgerViewMode === 'table' ? 'bg-[#003a2f] text-white' : 'text-[#707975] hover:text-[#111d27]'
                      }`}
                    >
                      <List className="w-3 h-3" />
                      <span>جدول</span>
                    </button>
                    <button
                      onClick={() => setLedgerViewMode('chart')}
                      className={`px-2 py-1 rounded-md text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                        ledgerViewMode === 'chart' ? 'bg-[#003a2f] text-white' : 'text-[#707975] hover:text-[#111d27]'
                      }`}
                    >
                      <TrendingUp className="w-3 h-3" />
                      <span>روند</span>
                    </button>
                  </div>
                </div>

                {ledgerViewMode === 'table' ? (
                  <div className="border border-[#003a2f]/10 rounded-xl overflow-hidden text-xs shadow-2xs">
                    <div className="bg-[#f7f9ff] px-3 py-2 text-[11px] font-bold text-[#707975] grid grid-cols-12 border-b border-[#003a2f]/10">
                      <span className="col-span-5">شناسه پیشنهاددهنده</span>
                      <span className="col-span-4 text-center">زمان</span>
                      <span className="col-span-3 text-left rtl:text-left ltr:text-right">مبلغ (AFN)</span>
                    </div>

                    <div className="divide-y divide-[#003a2f]/5 max-h-44 overflow-y-auto">
                      {lot.bidHistory.map((b, idx) => (
                        <div
                          key={`${lot.id}-${b.id || idx}`}
                          className={`px-3 py-2 grid grid-cols-12 items-center ${
                            idx === 0 ? 'bg-[#afefdc]/20 font-bold text-[#003a2f]' : 'text-[#3f4945]'
                          }`}
                        >
                          <div className="col-span-5 flex items-center gap-1 truncate">
                            {idx === 0 && <span className="w-2 h-2 rounded-full bg-[#003a2f]" />}
                            <span className="font-mono">{b.bidderMaskedId}</span>
                          </div>
                          <span className="col-span-4 text-center text-[11px] text-[#707975] font-mono">
                            {b.timestamp}
                          </span>
                          <span className="col-span-3 text-left rtl:text-left ltr:text-right font-mono tabular-nums font-bold">
                            {b.amountAFN.toLocaleString('en-US')}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="border border-[#003a2f]/10 rounded-xl p-3 bg-white shadow-2xs">
                    <div className="h-44 w-full" dir="ltr">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                          <XAxis 
                            dataKey="step" 
                            tick={{ fontSize: 9, fill: '#707975' }} 
                            stroke="#cbd5e1" 
                          />
                          <YAxis 
                            tick={{ fontSize: 9, fill: '#707975' }} 
                            stroke="#cbd5e1"
                            tickFormatter={(v) => `${(v / 1000).toLocaleString('en-US')}k`}
                            domain={['dataMin - 10000', 'dataMax + 10000']}
                          />
                          <Tooltip content={<CustomChartTooltip />} />
                          {lot.reservePriceAFN && (
                            <ReferenceLine 
                              y={lot.reservePriceAFN} 
                              stroke="#cea701" 
                              strokeDasharray="3 3" 
                            />
                          )}
                          <Line
                            type="monotone"
                            dataKey="price"
                            stroke="#003a2f"
                            strokeWidth={2.5}
                            dot={{ r: 3, fill: '#003a2f', strokeWidth: 1, stroke: '#fff' }}
                            activeDot={{ r: 5, fill: '#0b5345', stroke: '#afefdc', strokeWidth: 2 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Dedicated Full-Width Price Evolution & Bidding Trends Section */}
          <div className="bg-[#f7f9ff] rounded-2xl p-4 sm:p-5 border border-[#003a2f]/15 shadow-xs flex flex-col gap-4">
            
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#003a2f]/10 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#003a2f] text-[#afefdc] rounded-xl">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-sm sm:text-base text-[#111d27]">
                    تحلیل روند تکامل قیمت در طول زمان (Price Evolution Over Time)
                  </h3>
                  <p className="text-xs text-[#3f4945]">
                    بررسی نمودار رشد پیشنهادات، نقطه عبور از قیمت احتیاطی و نرخ رقابت خریداران
                  </p>
                </div>
              </div>

              {/* Status Badge */}
              <div className="flex items-center gap-2 self-start sm:self-auto">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#afefdc]/30 text-[#003a2f] text-xs font-bold font-mono">
                  <span className="w-2 h-2 rounded-full bg-[#003a2f] animate-pulse" />
                  Live Evolution
                </span>
              </div>
            </div>

            {/* Metric KPI Cards with English Numerals */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="bg-white p-3 rounded-xl border border-[#003a2f]/10 flex flex-col shadow-2xs">
                <span className="text-[11px] text-[#707975] font-medium">قیمت پایه (Opening)</span>
                <span className="font-mono text-sm sm:text-base font-bold text-[#111d27] mt-0.5">
                  {lot.startingPriceAFN.toLocaleString('en-US')} AFN
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#003a2f]/10 flex flex-col shadow-2xs">
                <span className="text-[11px] text-[#707975] font-medium">پیشنهاد برتر کنونی (Current High)</span>
                <span className="font-mono text-sm sm:text-base font-bold text-[#003a2f] mt-0.5">
                  {lot.currentBidAFN.toLocaleString('en-US')} AFN
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#003a2f]/10 flex flex-col shadow-2xs">
                <span className="text-[11px] text-[#707975] font-medium">نرخ رشد قیمت (Total Growth)</span>
                <span className="font-mono text-sm sm:text-base font-bold text-[#0b5345] flex items-center gap-1 mt-0.5">
                  <TrendingUp className="w-3.5 h-3.5" />
                  +{priceGrowthPercent}% (+{netGrowthAFN.toLocaleString('en-US')} AFN)
                </span>
              </div>

              <div className="bg-white p-3 rounded-xl border border-[#003a2f]/10 flex flex-col shadow-2xs">
                <span className="text-[11px] text-[#707975] font-medium">قیمت احتیاطی (Reserve Price)</span>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-sm sm:text-base font-bold text-[#735c00]">
                    {lot.reservePriceAFN ? `${lot.reservePriceAFN.toLocaleString('en-US')} AFN` : 'None'}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-semibold ${
                    lot.isReserveMet ? 'bg-[#afefdc] text-[#003a2f]' : 'bg-[#fff0c2] text-[#735c00]'
                  }`}>
                    {lot.isReserveMet ? 'Met' : 'Unmet'}
                  </span>
                </div>
              </div>
            </div>

            {/* Interactive Responsive Line Chart Container */}
            <div className="bg-white p-4 rounded-xl border border-[#003a2f]/10 shadow-xs flex flex-col gap-2">
              <div className="flex items-center justify-between text-xs text-[#707975] px-1 pb-1 border-b border-[#003a2f]/5">
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-0.5 bg-[#003a2f]" />
                  <span className="font-medium text-[#111d27]">روند پیشنهادات (Bid Price Curve)</span>
                </div>

                {lot.reservePriceAFN && (
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-3 h-0.5 border-t-2 border-dashed border-[#cea701]" />
                    <span className="text-[#735c00] font-mono text-[11px]">
                      Reserve: {lot.reservePriceAFN.toLocaleString('en-US')} AFN
                    </span>
                  </div>
                )}
              </div>

              {/* Recharts LineChart - English Numbering throughout */}
              <div className="w-full h-64 sm:h-72" dir="ltr">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={chartData}
                    margin={{ top: 15, right: 20, left: 15, bottom: 20 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#e6edeb" vertical={false} />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 11, fill: '#55605b', fontFamily: 'monospace' }}
                      stroke="#bfc9c4"
                      dy={8}
                    />
                    <YAxis
                      stroke="#bfc9c4"
                      tick={{ fontSize: 11, fill: '#55605b', fontFamily: 'monospace' }}
                      tickFormatter={(val: number) => {
                        if (val >= 1000000) {
                          return `${(val / 1000000).toFixed(2)}M`;
                        }
                        if (val >= 1000) {
                          return `${(val / 1000).toLocaleString('en-US')}k`;
                        }
                        return val.toLocaleString('en-US');
                      }}
                      domain={['dataMin - 15000', 'dataMax + 20000']}
                      dx={-4}
                    />
                    <Tooltip content={<CustomChartTooltip />} />
                    {lot.reservePriceAFN && (
                      <ReferenceLine
                        y={lot.reservePriceAFN}
                        stroke="#cea701"
                        strokeDasharray="4 4"
                        strokeWidth={1.5}
                        label={{
                          value: `Reserve: ${lot.reservePriceAFN.toLocaleString('en-US')} AFN`,
                          fill: '#735c00',
                          fontSize: 10,
                          position: 'insideTopRight',
                          offset: 10,
                        }}
                      />
                    )}
                    <Line
                      type="monotone"
                      dataKey="price"
                      name="Price (AFN)"
                      stroke="#003a2f"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#003a2f', stroke: '#fff', strokeWidth: 2 }}
                      activeDot={{
                        r: 7,
                        fill: '#0b5345',
                        stroke: '#afefdc',
                        strokeWidth: 2.5,
                      }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Chart footer insights */}
              <div className="flex flex-wrap items-center justify-between text-[11px] text-[#707975] pt-2 border-t border-[#003a2f]/5 px-1">
                <span>
                  مجموع نقاط داده: <strong className="font-mono text-[#111d27]">{chartData.length}</strong> رویداد پیشنهاد
                </span>
                <span className="font-mono text-[#003a2f]">
                  آخرین به‌روزرسانی: لحظه‌ای (Live HesabPay Ledger Feed)
                </span>
              </div>
            </div>

            {/* DETAILED SCROLLABLE TABLE BELOW THE PRICE CHART (LAST 5 BIDDERS) */}
            <div className="bg-white rounded-xl border border-[#003a2f]/15 shadow-xs p-4 flex flex-col gap-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#003a2f]/10 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-[#ecf4ff] text-[#003a2f] rounded-lg">
                    <Users className="w-4 h-4 text-[#003a2f]" />
                  </div>
                  <div>
                    <h4 className="font-serif font-bold text-xs sm:text-sm text-[#111d27] flex items-center gap-1.5">
                      <span>جدول تفصیلی 5 پیشنهاد اخیر (Last 5 Bidders & History)</span>
                      <span className="text-[10px] text-[#326286] bg-[#ecf4ff] px-2 py-0.5 rounded-full font-mono font-bold">
                        Top 5 Bids
                      </span>
                    </h4>
                    <p className="text-[11px] text-[#707975]">
                      شفافیت 100%: بررسی 5 پیشنهاددهنده اخیر به همراه زمان ثبت، مبلغ دقیق و وضعیت رقابت
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <span className="text-[11px] text-[#065043] bg-[#afefdc] px-2.5 py-0.5 rounded-md font-bold font-mono">
                    Verified Bidders ✓
                  </span>
                </div>
              </div>

              {/* Clean Scrollable Tabular Format */}
              <div className="overflow-x-auto overflow-y-auto max-h-72 border border-[#003a2f]/10 rounded-xl shadow-2xs bg-white">
                <table className="w-full text-right rtl:text-right ltr:text-left text-xs border-collapse">
                  <thead className="sticky top-0 bg-[#f1f7f5] text-[#003a2f] font-bold text-[11px] border-b border-[#003a2f]/10 z-10 shadow-2xs">
                    <tr>
                      <th className="py-2.5 px-3 whitespace-nowrap">رتبه</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">پیشنهاددهنده (Bidder)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">زمان ثبت (Timestamp)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">مبلغ پیشنهاد (Amount)</th>
                      <th className="py-2.5 px-3 whitespace-nowrap">گام افزایش</th>
                      <th className="py-2.5 px-3 whitespace-nowrap text-center">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#003a2f]/8">
                    {last5Bidders.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-6 text-center text-xs text-[#707975]">
                          هنوز پیشنهادی برای این لوط ثبت نشده است. اولین پیشنهاددهنده باشید!
                        </td>
                      </tr>
                    ) : (
                      last5Bidders.map((bid, index) => {
                        const isWinning = index === 0;
                        const previousBid = last5Bidders[index + 1];
                        const stepIncrease = previousBid 
                          ? bid.amountAFN - previousBid.amountAFN 
                          : bid.amountAFN - lot.startingPriceAFN;

                        return (
                          <tr
                            key={`${lot.id}-${bid.id || index}`}
                            className={`transition-colors ${
                              isWinning 
                                ? 'bg-[#afefdc]/25 font-semibold text-[#003a2f]' 
                                : index % 2 === 0 ? 'bg-white hover:bg-[#f7f9ff]' : 'bg-[#fbfcfe] hover:bg-[#f7f9ff]'
                            }`}
                          >
                            {/* Rank */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              {isWinning ? (
                                <span className="inline-flex items-center gap-1 bg-[#003a2f] text-[#afefdc] text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs">
                                  <Crown className="w-3 h-3 text-[#cea701]" />
                                  #1 برتر
                                </span>
                              ) : (
                                <span className="font-mono text-xs text-[#707975] font-bold px-1">
                                  #{index + 1}
                                </span>
                              )}
                            </td>

                            {/* Bidder Info */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="font-bold text-[#111d27] text-xs">
                                  {bid.bidderName || `کاربر خریدار شماره ${index + 1}`}
                                </span>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                  <span className="font-mono text-[10px] text-[#326286] font-semibold bg-[#ecf4ff] px-1.5 py-0.2 rounded">
                                    {bid.bidderMaskedId}
                                  </span>
                                  <span className="text-[10px] text-[#0b5345] flex items-center gap-0.5 font-medium">
                                    <CheckCircle2 className="w-2.5 h-2.5 text-[#003a2f]" />
                                    تایید تذکره
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Timestamp */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="flex items-center gap-1 text-[11px] text-[#3f4945] font-mono">
                                <Clock className="w-3 h-3 text-[#707975]" />
                                <span>{bid.timestamp}</span>
                              </div>
                            </td>

                            {/* Bid Amount (English Numerals) */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="font-mono text-sm font-extrabold text-[#003a2f] tabular-nums">
                                  {bid.amountAFN.toLocaleString('en-US')} AFN
                                </span>
                              </div>
                            </td>

                            {/* Step Increase */}
                            <td className="py-3 px-3 whitespace-nowrap">
                              <span className="font-mono text-xs text-[#0b5345] bg-[#afefdc]/40 px-2 py-0.5 rounded font-bold">
                                +{Math.max(0, stepIncrease).toLocaleString('en-US')} AFN
                              </span>
                            </td>

                            {/* Status */}
                            <td className="py-3 px-3 whitespace-nowrap text-center">
                              {isWinning ? (
                                <span className="inline-flex items-center gap-1 bg-[#003a2f] text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-2xs">
                                  <Check className="w-3 h-3 text-[#afefdc]" />
                                  پیشنهاد برنده فعلی
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 bg-[#eceff1] text-[#546e7a] text-[10px] font-semibold px-2 py-0.5 rounded-full">
                                  پیشنهاد ردشده (Outbid)
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Friendly Beginner Explanation Box (For people without auction knowledge) */}
              <div className="bg-[#ecf4ff]/80 rounded-xl p-3 border border-[#326286]/15 flex items-start gap-2.5">
                <HelpCircle className="w-4 h-4 text-[#326286] shrink-0 mt-0.5" />
                <div className="flex flex-col gap-1 text-[11px] text-[#3f4945] leading-relaxed">
                  <strong className="text-[#111d27] font-serif">
                    💡 راهنمای ساده مزایده برای عموم (Easy Bidding Rules):
                  </strong>
                  <ul className="list-disc list-inside space-y-0.5">
                    <li>
                      <strong>پیشنهاد برنده:</strong> ردیف اول (#1) بالاترین قیمت فعلی است. اگر تا پایان زمان کسی پیشنهاد بالاتری ندهد، این شخص برنده حراج خواهد بود.
                    </li>
                    <li>
                      <strong>چگونه پیشنهاد دهیم؟</strong> کافیست روی دکمه ثبت پیشنهاد کلیک کنید یا یکی از مبالغ آماده را انتخاب نمایید (حداقل گام: +{lot.minIncrementAFN.toLocaleString('en-US')} AFN).
                    </li>
                    <li>
                      <strong>امنیت کامل وجه:</strong> پول شما تا زمان رویت فیزیکی کالا و رضایت در حساب امانی HesabPay محافظت می‌شود.
                    </li>
                  </ul>
                </div>
              </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
