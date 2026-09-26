import React, { useState, useEffect } from 'react';
import { Language } from '../types/auction';
import { adminApi } from '../services/adminApi';
import { 
  X, 
  User, 
  Mail, 
  Bell, 
  ShieldCheck, 
  CheckCircle2, 
  CreditCard, 
  Phone, 
  Clock, 
  Sparkles,
  Lock,
  ArrowRight,
  ChevronLeft
} from 'lucide-react';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLang: Language;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  currentLang,
}) => {
  const isRtl = currentLang !== 'en';

  // Notification Preferences State with localStorage persistence + backend synchronization
  const [emailOutbid, setEmailOutbid] = useState<boolean>(() => {
    const saved = localStorage.getItem('nawbat_email_outbid');
    return saved !== null ? saved === 'true' : true;
  });

  const [emailClosingSoon, setEmailClosingSoon] = useState<boolean>(() => {
    const saved = localStorage.getItem('nawbat_email_closing_soon');
    return saved !== null ? saved === 'true' : true;
  });

  const [emailHesabPayReceipts, setEmailHesabPayReceipts] = useState<boolean>(() => {
    const saved = localStorage.getItem('nawbat_email_receipts');
    return saved !== null ? saved === 'true' : true;
  });

  const [savedFeedback, setSavedFeedback] = useState<string | null>(null);
  const [userProfile, setUserProfile] = useState<any>({
    fullName: currentLang === 'en' ? 'Ahmad Shah Rezaye' : 'احمدشاه رضایی',
    email: 'ahmad.rezaye@kabul-trade.af',
    phone: '+93 77 990 1234',
    tazkiraNumber: 'KBL-8812-4401',
    balanceAFN: 0,
    escrowLockedAFN: 0,
  });

  // Fetch from backend API on mount
  useEffect(() => {
    if (isOpen) {
      adminApi.getUserProfile().then((data) => {
        if (data) {
          setUserProfile(data);
          if (data.notificationPreferences) {
            setEmailOutbid(data.notificationPreferences.emailOutbid);
            setEmailClosingSoon(data.notificationPreferences.emailClosingSoon);
            if (data.notificationPreferences.emailHesabPayReceipts !== undefined) {
              setEmailHesabPayReceipts(data.notificationPreferences.emailHesabPayReceipts);
            }
          }
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Toggle handlers
  const handleToggleOutbid = async (newValue: boolean) => {
    setEmailOutbid(newValue);
    localStorage.setItem('nawbat_email_outbid', String(newValue));
    
    // Save to backend API
    await adminApi.updateNotificationPreferences({
      emailOutbid: newValue,
      emailClosingSoon,
      emailHesabPayReceipts,
    });

    setSavedFeedback(
      newValue
        ? (currentLang === 'en' ? 'Outbid email alerts enabled ✓' : 'هشدار ایمیلی پیشی‌گرفتن پیشنهاد فعال شد ✓')
        : (currentLang === 'en' ? 'Outbid email alerts disabled' : 'هشدار ایمیلی پیشی‌گرفتن پیشنهاد غیرفعال شد')
    );
    setTimeout(() => setSavedFeedback(null), 3000);
  };

  const handleToggleClosingSoon = async (newValue: boolean) => {
    setEmailClosingSoon(newValue);
    localStorage.setItem('nawbat_email_closing_soon', String(newValue));

    // Save to backend API
    await adminApi.updateNotificationPreferences({
      emailOutbid,
      emailClosingSoon: newValue,
      emailHesabPayReceipts,
    });

    setSavedFeedback(
      newValue
        ? (currentLang === 'en' ? 'Auction closing alerts enabled ✓' : 'هشدار ایمیلی دقایق پایانی مزایده فعال شد ✓')
        : (currentLang === 'en' ? 'Auction closing alerts disabled' : 'هشدار ایمیلی دقایق پایانی مزایده غیرفعال شد')
    );
    setTimeout(() => setSavedFeedback(null), 3000);
  };

  const handleToggleReceipts = async (newValue: boolean) => {
    setEmailHesabPayReceipts(newValue);
    localStorage.setItem('nawbat_email_receipts', String(newValue));

    await adminApi.updateNotificationPreferences({
      emailOutbid,
      emailClosingSoon,
      emailHesabPayReceipts: newValue,
    });

    setSavedFeedback(
      newValue
        ? (currentLang === 'en' ? 'Payment receipts enabled ✓' : 'رسیدهای ایمیلی حساب‌پی فعال شد ✓')
        : (currentLang === 'en' ? 'Payment receipts disabled' : 'رسیدهای ایمیلی حساب‌پی غیرفعال شد')
    );
    setTimeout(() => setSavedFeedback(null), 3000);
  };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in ${isRtl ? 'rtl' : 'ltr'}`}>
      <div 
        className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-[#003a2f]/15 flex flex-col gap-5 text-right relative overflow-hidden max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Subtle decorative background glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#afefdc]/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#003a2f]/10 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#003a2f] text-white flex items-center justify-center shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-extrabold text-base text-[#003a2f]">
                {currentLang === 'en' ? 'User Profile & Preferences' : 'پروفایل کاربری و تنظیمات حساب'}
              </h2>
              <span className="text-[11px] text-[#707975] block">
                {currentLang === 'en' ? 'Manage your identity and email notifications' : 'مدیریت هویت تایید شده و اعلانات ایمیل'}
              </span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-[#707975] hover:text-[#111d27] hover:bg-[#f1f7f5] rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Identity Card */}
        <div className="bg-[#f7f9ff] p-4 rounded-2xl border border-[#003a2f]/10 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4 relative z-10">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#003a2f] text-[#afefdc] flex items-center justify-center font-bold text-xl shadow-xs ring-4 ring-[#afefdc]/40">
              AR
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-sm text-[#111d27]">{userProfile.fullName}</h3>
                <CheckCircle2 className="w-4 h-4 text-[#003a2f] fill-[#afefdc]" />
              </div>
              <span className="text-xs text-[#326286] font-mono block mt-0.5">
                {userProfile.email}
              </span>
              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                <span className="inline-flex items-center gap-1 bg-[#afefdc]/50 text-[#003a2f] text-[10px] font-bold px-2 py-0.5 rounded-md">
                  <ShieldCheck className="w-3 h-3 text-[#003a2f]" />
                  {currentLang === 'en' ? 'Identity review status' : 'وضعیت بررسی هویت'}
                </span>
                <span className="text-[10px] font-mono text-[#707975]">
                  {userProfile.tazkiraNumber}
                </span>
              </div>
            </div>
          </div>

          {/* Wallet Mini Metric */}
          <div className="bg-white p-3 rounded-xl border border-[#003a2f]/10 shadow-2xs text-center sm:text-left rtl:sm:text-right min-w-[140px]">
            <span className="text-[10px] text-[#707975] font-semibold block">
              {currentLang === 'en' ? 'HesabPay balance (when connected)' : 'موجودی حساب‌پی (پس از اتصال)'}
            </span>
            <span className="font-mono text-sm font-extrabold text-[#003a2f] block mt-0.5">
              {(userProfile.balanceAFN ?? 0).toLocaleString('en-US')} AFN
            </span>
          </div>
        </div>

        {/* Feedback Message Toast */}
        {savedFeedback && (
          <div className="bg-[#afefdc] text-[#003a2f] px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2 border border-[#003a2f]/20">
            <Sparkles className="w-4 h-4 text-[#003a2f]" />
            <span>{savedFeedback}</span>
          </div>
        )}

        {/* Email Notifications Preferences Section */}
        <div className="bg-white rounded-2xl border border-[#003a2f]/15 p-5 shadow-xs flex flex-col gap-4 relative z-10">
          <div className="flex items-center justify-between border-b border-[#003a2f]/10 pb-3">
            <div className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#003a2f]" />
              <h3 className="font-extrabold text-sm text-[#003a2f]">
                {currentLang === 'en' ? 'Email Notification Settings' : 'تنظیمات اعلانات و هشدارهای ایمیلی'}
              </h3>
            </div>
            <span className="text-[11px] text-[#707975] font-mono">
              {userProfile.email}
            </span>
          </div>

          <p className="text-xs text-[#707975] leading-relaxed">
            {currentLang === 'en'
              ? 'Control which instant alert emails you receive about your auction activity and bidding updates. Changes are applied immediately.'
              : 'با استفاده از کلیدهای زیر مشخص کنید چه نوع ایمیل‌های اطلاع‌رسانی برای حساب شما ارسال گردد. تغییرات بلافاصله ذخیره و اعمال می‌شوند.'}
          </p>

          <div className="flex flex-col gap-3.5 pt-1">
            
            {/* TOGGLE 1: Outbid Status Alerts */}
            <div className="p-3.5 rounded-xl border border-[#003a2f]/10 hover:border-[#003a2f]/30 bg-[#fbfdfe] transition-all flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl mt-0.5 ${emailOutbid ? 'bg-[#afefdc]/40 text-[#003a2f]' : 'bg-gray-100 text-gray-500'}`}>
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#111d27]">
                      {currentLang === 'en' 
                        ? 'Outbid Status Alerts' 
                        : currentLang === 'ps' 
                        ? 'د لوړ وړاندیز خبرتیا (Outbid)' 
                        : 'هشدارهای پیشی‌گرفتن پیشنهاد دیگران (Outbid Alerts)'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full font-mono ${
                      emailOutbid ? 'bg-[#afefdc] text-[#003a2f]' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {emailOutbid 
                        ? (currentLang === 'en' ? 'ON' : 'فعال') 
                        : (currentLang === 'en' ? 'OFF' : 'غیرفعال')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#707975] mt-1 leading-normal">
                    {currentLang === 'en'
                      ? 'Receive an immediate email whenever another buyer outbids you, so you can place a counter-bid before time runs out.'
                      : 'در صورتی که پیشنهاددهنده دیگری مبلغی بالاتر از شما ثبت کند، فوراً ایمیل دریافت کنید تا قبل از پایان حراج بتوانید پیشنهاد جدید ثبت نمایید.'}
                  </p>
                </div>
              </div>

              {/* Accessible Simple Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={emailOutbid}
                onClick={() => handleToggleOutbid(!emailOutbid)}
                className={`w-12 h-6.5 shrink-0 rounded-full p-0.5 cursor-pointer transition-colors duration-200 ease-in-out flex items-center ${
                  emailOutbid ? 'bg-[#003a2f] justify-end' : 'bg-gray-300 justify-start'
                }`}
                title={emailOutbid ? 'غیرفعال کردن هشدار' : 'فعال کردن هشدار'}
              >
                <span className="w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200" />
              </button>
            </div>

            {/* TOGGLE 2: Auction Closing Alerts */}
            <div className="p-3.5 rounded-xl border border-[#003a2f]/10 hover:border-[#003a2f]/30 bg-[#fbfdfe] transition-all flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl mt-0.5 ${emailClosingSoon ? 'bg-[#afefdc]/40 text-[#003a2f]' : 'bg-gray-100 text-gray-500'}`}>
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#111d27]">
                      {currentLang === 'en' 
                        ? 'Auction Closing Alerts' 
                        : currentLang === 'ps' 
                        ? 'د پای ته رسیدو خبرتیا (Closing Alerts)' 
                        : 'هشدارهای دقایق پایانی مزایده (Auction Closing Alerts)'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full font-mono ${
                      emailClosingSoon ? 'bg-[#afefdc] text-[#003a2f]' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {emailClosingSoon 
                        ? (currentLang === 'en' ? 'ON' : 'فعال') 
                        : (currentLang === 'en' ? 'OFF' : 'غیرفعال')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#707975] mt-1 leading-normal">
                    {currentLang === 'en'
                      ? 'Receive a reminder email 15 minutes before auctions on your watchlist or lots you have bid on close.'
                      : 'ارسال ایمیل یادآوری در ۱۵ دقیقه پایانی برای مزایده‌های نشان‌شده در واچ‌لیست یا لوط‌هایی که در آن‌ها پیشنهاد فعال دارید.'}
                  </p>
                </div>
              </div>

              {/* Accessible Simple Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={emailClosingSoon}
                onClick={() => handleToggleClosingSoon(!emailClosingSoon)}
                className={`w-12 h-6.5 shrink-0 rounded-full p-0.5 cursor-pointer transition-colors duration-200 ease-in-out flex items-center ${
                  emailClosingSoon ? 'bg-[#003a2f] justify-end' : 'bg-gray-300 justify-start'
                }`}
                title={emailClosingSoon ? 'غیرفعال کردن هشدار' : 'فعال کردن هشدار'}
              >
                <span className="w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200" />
              </button>
            </div>

            {/* TOGGLE 3: HesabPay Escrow Transaction Receipts */}
            <div className="p-3.5 rounded-xl border border-[#003a2f]/10 hover:border-[#003a2f]/30 bg-[#fbfdfe] transition-all flex items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-xl mt-0.5 ${emailHesabPayReceipts ? 'bg-[#afefdc]/40 text-[#003a2f]' : 'bg-gray-100 text-gray-500'}`}>
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[#111d27]">
                      {currentLang === 'en' 
                        ? 'Payment Transaction Receipts' 
                        : 'رسیدهای تراکنش پرداخت'}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.2 rounded-full font-mono ${
                      emailHesabPayReceipts ? 'bg-[#afefdc] text-[#003a2f]' : 'bg-gray-200 text-gray-700'
                    }`}>
                      {emailHesabPayReceipts ? (currentLang === 'en' ? 'ON' : 'فعال') : (currentLang === 'en' ? 'OFF' : 'غیرفعال')}
                    </span>
                  </div>
                  <p className="text-[11px] text-[#707975] mt-1 leading-normal">
                    {currentLang === 'en'
                      ? 'Receive receipts for payment events after the payment provider integration is activated.'
                      : 'پس از فعال شدن اتصال پرداخت، رسید رویدادهای مالی برای حساب شما ارسال می‌شود.'}
                  </p>
                </div>
              </div>

              {/* Accessible Simple Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={emailHesabPayReceipts}
                onClick={() => handleToggleReceipts(!emailHesabPayReceipts)}
                className={`w-12 h-6.5 shrink-0 rounded-full p-0.5 cursor-pointer transition-colors duration-200 ease-in-out flex items-center ${
                  emailHesabPayReceipts ? 'bg-[#003a2f] justify-end' : 'bg-gray-300 justify-start'
                }`}
                title={emailHesabPayReceipts ? 'غیرفعال کردن رسید' : 'فعال کردن رسید'}
              >
                <span className="w-5.5 h-5.5 rounded-full bg-white shadow-md transform transition-transform duration-200" />
              </button>
            </div>

          </div>
        </div>

        {/* Footer info & close button */}
        <div className="flex items-center justify-between pt-2 border-t border-[#003a2f]/10 text-xs">
          <div className="flex items-center gap-1.5 text-[#707975]">
            <Lock className="w-3.5 h-3.5 text-[#003a2f]" />
            <span>
              {currentLang === 'en' 
                ? 'Protected by NAWBAT Privacy Policy' 
                : 'محافظت شده با پروتکل حریم خصوصی سامانه ملی نوبت'}
            </span>
          </div>

          <button
            onClick={onClose}
            className="bg-[#003a2f] hover:bg-[#0b5345] text-white px-5 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer shadow-xs"
          >
            {currentLang === 'en' ? 'Done' : 'تایید و بستن'}
          </button>
        </div>
      </div>
    </div>
  );
};
