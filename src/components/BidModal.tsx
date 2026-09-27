import React, { useState } from 'react';
import { AuctionLot, Language } from '../types/auction';
import { translations } from '../translations';
import { 
  X, 
  Gavel, 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  AlertTriangle, 
  CreditCard,
  Bot
} from 'lucide-react';

interface BidModalProps {
  lot: AuctionLot | null;
  isOpen: boolean;
  onClose: () => void;
  onSubmitBid: (lotId: string, amountAFN: number, isProxy: boolean, maxProxyAFN?: number) => Promise<{ antiSnipingExtended?: boolean } | void>;
  currentLang: Language;
}

export const BidModal: React.FC<BidModalProps> = ({
  lot,
  isOpen,
  onClose,
  onSubmitBid,
  currentLang,
}) => {
  if (!isOpen || !lot) return null;

  const t = translations[currentLang];
  const minValidBid = lot.currentBidAFN + lot.minIncrementAFN;

  const [bidAmount, setBidAmount] = useState<number>(minValidBid);
  const [isProxy, setIsProxy] = useState<boolean>(false);
  const [maxProxyAmount, setMaxProxyAmount] = useState<number>(minValidBid + lot.minIncrementAFN * 3);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Display-only deposit estimate. No funds are locked until a verified payment integration confirms it.
  const escrowDeposit = Math.round(bidAmount * 0.05);

  const handleIncrement = (extra: number) => {
    setBidAmount((prev) => prev + extra);
  };

  const handleConfirm = async () => {
    if (bidAmount < minValidBid || isProcessing) return;
    setErrorMessage('');
    setIsProcessing(true);

    try {
      await onSubmitBid(lot.id, bidAmount, isProxy, isProxy ? maxProxyAmount : undefined);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        onClose();
      }, 1400);
    } catch (error: any) {
      setErrorMessage(error?.message || (currentLang === 'en' ? 'Could not place the bid.' : 'پیشنهاد ثبت نشد.'));
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-lg w-full border border-[#003a2f]/20 shadow-2xl overflow-hidden flex flex-col text-[#111d27] animate-in fade-in zoom-in-95 duration-200"
        dir={currentLang === 'en' ? 'ltr' : 'rtl'}
      >
        {/* Header */}
        <div className="bg-[#003a2f] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#afefdc]/20 flex items-center justify-center text-[#afefdc]">
              <Gavel className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm">{t.bidNow}</h3>
              <span className="text-[11px] text-[#afefdc] font-mono">{lot.lotNumber}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {isSuccess ? (
          <div className="p-8 flex flex-col items-center justify-center text-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#afefdc] text-[#003a2f] flex items-center justify-center shadow-lg animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#003a2f]">پیشنهاد شما با موفقیت ثبت گردید!</h4>
            <p className="text-xs text-[#3f4945] max-w-xs">
              {currentLang === 'en' ? 'Your bid was accepted by the NAWBAT server and recorded in the bidding database.' : 'پیشنهاد شما توسط سرور نوبت تایید و در پایگاه داده مزایده ثبت شد.'}
            </p>
          </div>
        ) : (
          <div className="p-5 flex flex-col gap-4 max-h-[80vh] overflow-y-auto">
            {/* Lot Summary Card */}
            <div className="flex items-center gap-3 p-3 bg-[#ecf4ff] rounded-xl border border-[#d7e4f3]">
              <img
                src={lot.imageUrl}
                alt={lot.title}
                className="w-16 h-16 rounded-lg object-cover shrink-0"
              />
              <div className="flex-1 min-w-0">
                <span className="text-[10px] text-[#326286] font-semibold">{lot.province} · {lot.categoryLabel}</span>
                <h4 className="font-serif text-xs font-bold text-[#111d27] truncate">
                  {currentLang === 'en' ? lot.titleEn : currentLang === 'ps' ? lot.titlePs : lot.title}
                </h4>
                <div className="flex items-center justify-between text-xs mt-1">
                  <span className="text-[#707975] text-[11px]">{t.currentBid}</span>
                  <span className="font-mono font-bold text-[#003a2f]">
                    {lot.currentBidAFN.toLocaleString('en-US')} AFN
                  </span>
                </div>
              </div>
            </div>

            {/* Bid Input Box */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[#111d27] flex items-center justify-between">
                <span>مبلغ پیشنهاد جدید (AFN):</span>
                <span className="text-[11px] text-[#707975]">
                  حداقل قابل قبول: <strong className="font-mono text-[#003a2f]">{minValidBid.toLocaleString('en-US')}</strong>
                </span>
              </label>

              <div className="relative flex items-center">
                <input
                  type="number"
                  min={minValidBid}
                  step={lot.minIncrementAFN}
                  value={bidAmount}
                  onChange={(e) => setBidAmount(Number(e.target.value))}
                  className="w-full bg-[#f7f9ff] border-2 border-[#003a2f]/20 focus:border-[#003a2f] rounded-xl py-2.5 px-4 font-mono text-lg font-bold text-[#003a2f] focus:outline-none tabular-nums"
                />
                <span className="absolute left-4 rtl:left-4 rtl:right-auto text-xs font-semibold text-[#707975]">
                  AFN
                </span>
              </div>

              {/* Quick Increment Buttons */}
              <div className="grid grid-cols-4 gap-1.5 mt-1">
                {[lot.minIncrementAFN, lot.minIncrementAFN * 2, 50000, 100000].map((inc, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleIncrement(inc)}
                    className="bg-[#ecf4ff] hover:bg-[#dde9f9] text-[#003a2f] py-1.5 rounded-lg text-xs font-mono font-bold transition-colors border border-[#d7e4f3] cursor-pointer"
                  >
                    +{inc.toLocaleString('en-US')}
                  </button>
                ))}
              </div>
            </div>

            {/* Smart Proxy Bidding Option */}
            <div className="p-3 bg-[#f7f9ff] rounded-xl border border-[#003a2f]/10 flex flex-col gap-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isProxy}
                  onChange={(e) => setIsProxy(e.target.checked)}
                  className="w-4 h-4 rounded text-[#003a2f] focus:ring-[#003a2f] cursor-pointer"
                />
                <div className="flex items-center gap-1.5">
                  <Bot className="w-4 h-4 text-[#326286]" />
                  <span className="text-xs font-bold text-[#111d27]">فعال‌سازی پیشنهاد خودکار هوشمند (Proxy Bidding)</span>
                </div>
              </label>

              {isProxy && (
                <div className="pt-2 border-t border-[#003a2f]/10 flex flex-col gap-1">
                  <span className="text-[11px] text-[#3f4945]">سقف حداکثر بودجه شما (کاملاً محرمانه):</span>
                  <input
                    type="number"
                    min={bidAmount}
                    value={maxProxyAmount}
                    onChange={(e) => setMaxProxyAmount(Number(e.target.value))}
                    className="w-full bg-white border border-[#bfc9c4] rounded-lg p-2 font-mono text-xs font-bold text-[#003a2f]"
                  />
                  <span className="text-[10px] text-[#707975]">
                    سیستم به صورت خودکار تنها به اندازه پله بعدی رقیب، پیشنهاد شما را افزایش می‌دهد.
                  </span>
                </div>
              )}
            </div>

            {/* HesabPay Escrow Lock Box */}
            <div className="p-3.5 bg-[#afefdc]/30 rounded-xl border border-[#0b5345]/20 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-bold text-[#065043]">
                  <CreditCard className="w-4 h-4 text-[#003a2f]" />
                  <span>برآورد سپرده 5% (در انتظار اتصال پرداخت)</span>
                </div>
                <span className="font-mono text-xs font-bold text-[#003a2f]">
                  {escrowDeposit.toLocaleString('en-US')} AFN
                </span>
              </div>

              <div className="text-[11px] text-[#065043] flex items-start gap-1 leading-relaxed">
                <Lock className="w-3.5 h-3.5 text-[#003a2f] shrink-0 mt-0.5" />
                <span>
                  این مبلغ فعلاً فقط یک برآورد نمایشی است. قفل یا آزادسازی واقعی وجه بعد از اتصال رسمی و تاییدشده پرداخت فعال می‌شود.
                </span>
              </div>

              <div className="flex items-center gap-1 text-[10px] text-[#707975] bg-white/70 px-2 py-1 rounded">
                <AlertTriangle className="w-3 h-3 text-[#d35400] shrink-0" />
                <span>در صورت ثبت پیشنهاد در 2 دقیقه پایانی، ساعت حراج 3 دقیقه تمدید خواهد شد.</span>
              </div>
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-[#ba1a1a]/20 bg-[#fff2f1] px-3.5 py-3 text-xs text-[#9b1c1c]">
                {errorMessage}
              </div>
            )}

            {/* Submit Action */}
            <button
              onClick={handleConfirm}
              disabled={isProcessing || bidAmount < minValidBid}
              className="w-full bg-[#003a2f] hover:bg-[#0b5345] disabled:bg-[#bfc9c4] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  {currentLang === 'en' ? 'Submitting secure bid...' : 'در حال ثبت امن پیشنهاد...'}
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#afefdc]" />
                  تایید و ثبت پیشنهاد ({bidAmount.toLocaleString('en-US')} AFN)
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
