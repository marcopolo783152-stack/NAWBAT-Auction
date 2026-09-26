import React, { useState } from 'react';
import { AuctionLot, CategoryId, Language, Province } from '../types/auction';
import { translations } from '../translations';
import { 
  X, 
  PlusCircle, 
  Upload, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  DollarSign, 
  FileText, 
  BadgeCheck 
} from 'lucide-react';

interface SubmitLotModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLotCreated: (lot: AuctionLot) => void;
  currentLang: Language;
}

export const SubmitLotModal: React.FC<SubmitLotModalProps> = ({
  isOpen,
  onClose,
  onLotCreated,
  currentLang,
}) => {
  if (!isOpen) return null;

  const t = translations[currentLang];

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CategoryId>('cars');
  const [province, setProvince] = useState<Province>('کابل');
  const [locationDetails, setLocationDetails] = useState('گدام مرکزی مزایده نوبت، کابل');
  const [startingPriceAFN, setStartingPriceAFN] = useState<number>(500000);
  const [reservePriceAFN, setReservePriceAFN] = useState<number>(650000);
  const [minIncrementAFN, setMinIncrementAFN] = useState<number>(10000);
  const [description, setDescription] = useState('');
  const [sellerName, setSellerName] = useState('احمدشاه رضایی');
  const [tazkiraId, setTazkiraId] = useState('1402-9982-10492');
  const [hesabPayWallet, setHesabPayWallet] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Default images for category preview
  const categoryImages: Record<CategoryId, string> = {
    cars: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXrb-z2Qv6ECzBcdp4f6JTJQQh1DYVqx89lOLOOoVbkqeHM_mkCnNY7_K6IMPgf9qETqp783LVXvNSfL2-fLjLe5yNJYCMHgrLz0_Zn-xt719UYEoWWWrHGkl5yPqsFr61JgFzNEsbpIm28NbGIvjMOxeBtWBEJpMrFsOT6w70d0rW8SwS-tRrINqoMBWalxrIYWZTT6vT3-9RD6xTWawJioxwjiTnCWaCfeJr10HMcxuwj0om48vu',
    carpets: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHfNh-y8KSnfpXBiPiTyfYWBXgTjraa-ZY-MALG5PVjNwvbG-zrzGzbX-qvLVnz5yAsESSfyXpNlsxMWqSKv4MZThs1EvcvrBLkZCW66IU8V8z5kNSDOcdlRMOHIYINwSFwVc9DK-c6ytJv7mKLldiAsGLLlScG6lCO3hQkKaUN0y0IMULnp9zZOdau-YREJQyzu7XBDUrg9JTl78f8xDQfrrYlSmSo1XmkVvsLmwQ_Nj_ZtBDXDMm',
    jewelry: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASqVD51D1pWxPs_zCCEFja5JCDXLJmDxEUhQY4ran-zET3CdDW_qYwO3JzTSm9V2T7JeZfIqoEDZtvlNoGda4hdUs0S0gWtpGNBmN3xDnJ9QBwPuGlHvO2Qrr0UAOgFLNJtcB0WZMwc0YOSW6wWtrwANoKpTGLiWal3WX1TpvjBiPUcaoM1vJ4IY2aKLAaH5yiXF5_GpU5Yt0_el9X7M_QcENm4RNpX7E82B7Z94b4f0JBfBzNjuom',
    antiques: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgfm8DBsvmarbCXu6idPSInET1cICRgF4NHg1jUt76wNRXWc69Oxtq3GEazX1C7PI07lb50GOpprjqn7piaKFnjnuO5Y0pyVIcBOlckvVpdx2b2f6I7kovtXYLDincpHLIpddC0Drg0jlRwIiOVV5ruur0VYwVttqWlxDGVCSXQgIymG1k9XdwZBYgraYqcEDNLk6Wg4re5V9GhCCK_70YJfJvx4XPrZHKVrNGbo6RleVDtUwa9Rd5',
    electronics: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA368Qf-0yEwm1UVaavVxNPMrLGxNoi1zS3xcO7G01R-dPr_2KkxHtmwt5hbn5g2--h_qfv3Sn_V_QALtLkPTC6BfMuKc9hMFSUM8iuRB9BYpx3xIMm64ZHtr7-aHeEG0Qdfn5bPISv6RDdhZhD8fPh2YBC2snVaz4xr6nejY8k0nVfdt-syGvy0GLJc0xq2or_jJ9lPqkhSBkieum9Ubu0REBf60NPT0_ZsWqaY4UaBVSIXzIU6oxB',
    machinery: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDATs-X3PPAHb5cCDeLuTDKdmN49LfaIJEUFj8HgwOJCLl0ieW4UVik1XPqSJCQ1JMh2cKHGzmQ_BmAJKh-yCwsoQUElLulmMbDZKrEShwbvUZoDYuVPrHWSL75ARJ07mT5BPdye1nyCZXGoaD7n87hJB7c3yxg5PgH33740m0gdIBW2BFTV8_erhu5AKU-OgrXWctbnc-tM-FQj7fkmMkI4RXKyWjzJWMD7uQFpKK_Fcd7D6UoKCo7',
    all: '',
    real_estate: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXrb-z2Qv6ECzBcdp4f6JTJQQh1DYVqx89lOLOOoVbkqeHM_mkCnNY7_K6IMPgf9qETqp783LVXvNSfL2-fLjLe5yNJYCMHgrLz0_Zn-xt719UYEoWWWrHGkl5yPqsFr61JgFzNEsbpIm28NbGIvjMOxeBtWBEJpMrFsOT6w70d0rW8SwS-tRrINqoMBWalxrIYWZTT6vT3-9RD6xTWawJioxwjiTnCWaCfeJr10HMcxuwj0om48vu',
    corporate: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDATs-X3PPAHb5cCDeLuTDKdmN49LfaIJEUFj8HgwOJCLl0ieW4UVik1XPqSJCQ1JMh2cKHGzmQ_BmAJKh-yCwsoQUElLulmMbDZKrEShwbvUZoDYuVPrHWSL75ARJ07mT5BPdye1nyCZXGoaD7n87hJB7c3yxg5PgH33740m0gdIBW2BFTV8_erhu5AKU-OgrXWctbnc-tM-FQj7fkmMkI4RXKyWjzJWMD7uQFpKK_Fcd7D6UoKCo7',
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newLot: AuctionLot = {
        id: `lot-${Date.now()}`,
        lotNumber: `LOT-${province.substring(0, 3).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
        title,
        titleEn: title,
        titlePs: title,
        category,
        categoryLabel:
          category === 'cars' ? 'موترها و وسایط' :
          category === 'carpets' ? 'قالین و صنایع دستی' :
          category === 'jewelry' ? 'جواهرات و طلا' :
          category === 'antiques' ? 'عتیقه‌جات و هنر' :
          category === 'electronics' ? 'موبایل و کمپیوتر' : 'ماشین‌آلات و زراعت',
        province,
        locationDetails,
        startingPriceAFN,
        currentBidAFN: startingPriceAFN,
        reservePriceAFN,
        isReserveMet: false,
        minIncrementAFN,
        totalBids: 0,
        imageUrl: categoryImages[category] || categoryImages.cars,
        endTime: Date.now() + 48 * 60 * 60 * 1000, // 48 hours auction
        isClosingSoon: false,
        inspectorName: 'در انتظار بررسی',
        inspectionGrade: 'A',
        escrowStatus: 'Payment integration pending',
        description: description || 'کالای بازرسی شده با اسناد قانونی و امانت‌داری کامل در پلتفرم نوبت افغانستان.',
        descriptionEn: description || 'Certified inspected asset on NAWBAT Afghanistan.',
        specs: {
          'ولایت': province,
          'قیمت پایه': `${startingPriceAFN.toLocaleString('fa-AF')} افغانی`,
          'وضعیت': 'تایید شده برای مزایده',
        },
        bidHistory: [],
        sellerName,
        sellerKycTier: 2,
        sellerVerified: false,
      };

      onLotCreated(newLot);
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="bg-white rounded-2xl max-w-2xl w-full border border-[#003a2f]/20 shadow-2xl overflow-hidden flex flex-col text-[#111d27] my-auto max-h-[92vh]"
        dir={currentLang === 'en' ? 'ltr' : 'rtl'}
      >
        {/* Header */}
        <div className="bg-[#003a2f] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PlusCircle className="w-5 h-5 text-[#afefdc]" />
            <h3 className="font-serif font-bold text-base">ثبت و عرضه کالا در مزایده نوبت (NAWBAT)</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {submitted ? (
          <div className="p-8 text-center flex flex-col items-center gap-3">
            <div className="w-16 h-16 rounded-full bg-[#afefdc] text-[#003a2f] flex items-center justify-center shadow-lg animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h4 className="font-serif text-lg font-bold text-[#003a2f]">مزایده شما با موفقیت ثبت شد!</h4>
            <p className="text-xs text-[#3f4945]">
              لوط شما برای بررسی ثبت شد. پس از تایید مدیریت می‌تواند وارد کاتالوگ عمومی گردد.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4 overflow-y-auto">
            {/* Trust Notice */}
            <div className="p-3 bg-[#ecf4ff] rounded-xl border border-[#326286]/20 flex items-center gap-2 text-xs text-[#001e31]">
              <ShieldCheck className="w-4 h-4 text-[#003a2f] shrink-0" />
              <span>
                انتشار عمومی هر لوط منوط به بررسی حساب، اطلاعات کالا و قوانین نهایی پلتفرم است. اتصال HesabPay پس از تایید تجارتی فعال می‌شود.
              </span>
            </div>

            {/* Field: Title */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#111d27]">عنوان کامل لوط یا کالا:</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="مثال: تویوتا لندکروزر GXR 2021 سفید فابریکه"
                className="bg-[#f7f9ff] border border-[#bfc9c4] focus:border-[#003a2f] rounded-lg p-2.5 text-xs text-[#111d27] focus:outline-none"
              />
            </div>

            {/* Field: Category & Province */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#111d27]">دسته‌بندی دارایی:</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CategoryId)}
                  className="bg-[#f7f9ff] border border-[#bfc9c4] rounded-lg p-2.5 text-xs text-[#111d27] focus:outline-none"
                >
                  <option value="cars">موترها و وسایط نقلیه</option>
                  <option value="carpets">قالین و صنایع دستی</option>
                  <option value="jewelry">جواهرات، طلا و سنگ‌های قیمتی</option>
                  <option value="antiques">عتیقه‌جات و هنر</option>
                  <option value="electronics">موبایل و کمپیوتر</option>
                  <option value="machinery">ماشین‌آلات و زراعت</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#111d27]">ولایت محل استقرار:</label>
                <select
                  value={province}
                  onChange={(e) => setProvince(e.target.value as Province)}
                  className="bg-[#f7f9ff] border border-[#bfc9c4] rounded-lg p-2.5 text-xs text-[#111d27] focus:outline-none"
                >
                  <option value="کابل">کابل</option>
                  <option value="هرات">هرات</option>
                  <option value="مزارشریف">مزارشریف</option>
                  <option value="قندهار">قندهار</option>
                  <option value="جلال‌آباد">جلال‌آباد</option>
                  <option value="بامیان">بامیان</option>
                </select>
              </div>
            </div>

            {/* Pricing Details */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#111d27]">قیمت پایه (Floor Price):</label>
                <input
                  type="number"
                  min={1000}
                  step={5000}
                  value={startingPriceAFN}
                  onChange={(e) => setStartingPriceAFN(Number(e.target.value))}
                  className="bg-[#f7f9ff] border border-[#bfc9c4] rounded-lg p-2.5 text-xs font-mono font-bold text-[#003a2f] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#111d27]">قیمت احتیاطی (Reserve):</label>
                <input
                  type="number"
                  min={startingPriceAFN}
                  step={5000}
                  value={reservePriceAFN}
                  onChange={(e) => setReservePriceAFN(Number(e.target.value))}
                  className="bg-[#f7f9ff] border border-[#bfc9c4] rounded-lg p-2.5 text-xs font-mono font-bold text-[#003a2f] focus:outline-none"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-[#111d27]">حداقل پله افزایش:</label>
                <input
                  type="number"
                  min={1000}
                  step={1000}
                  value={minIncrementAFN}
                  onChange={(e) => setMinIncrementAFN(Number(e.target.value))}
                  className="bg-[#f7f9ff] border border-[#bfc9c4] rounded-lg p-2.5 text-xs font-mono font-bold text-[#003a2f] focus:outline-none"
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-[#111d27]">توضیحات وضعیت و اسناد:</label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="مشخصات موتور، بدنه، اسناد گمرکی، سابقه مالکیت یا اصالت اثر..."
                className="bg-[#f7f9ff] border border-[#bfc9c4] rounded-lg p-2.5 text-xs text-[#111d27] focus:outline-none resize-none"
              />
            </div>

            {/* Verification & KYC Credentials */}
            <div className="p-3 bg-[#f7f9ff] rounded-xl border border-[#003a2f]/10 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#111d27]">شماره تذکره الکترونیکی فروشنده:</label>
                <input
                  type="text"
                  value={tazkiraId}
                  onChange={(e) => setTazkiraId(e.target.value)}
                  className="bg-white border border-[#bfc9c4] rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="font-semibold text-[#111d27]">شماره حساب HesabPay (اختیاری تا زمان اتصال رسمی):</label>
                <input
                  type="text"
                  value={hesabPayWallet}
                  onChange={(e) => setHesabPayWallet(e.target.value)}
                  className="bg-white border border-[#bfc9c4] rounded-lg p-2 text-xs font-mono"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#003a2f] hover:bg-[#0b5345] disabled:bg-[#bfc9c4] text-white py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mt-2"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  در حال ثبت در شبکه حراج نوبت...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-[#afefdc]" />
                  انتشار فوری در مزایده‌های سراسری نوبت
                </span>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
