import React, { useMemo, useState } from 'react';
import { Language } from '../types/auction';
import { Calculator, FileText, ShieldCheck, Gavel, Store, UserCheck, Truck, CreditCard, AlertTriangle } from 'lucide-react';

interface FeesPoliciesPageProps {
  currentLang: Language;
}

const sellerTiers = [
  { range: 'Under 10,000 AFN', pct: '20%' },
  { range: '10,000–99,999 AFN', pct: '15%' },
  { range: '100,000–499,999 AFN', pct: '10%' },
  { range: '500,000–1,999,999 AFN', pct: '10%' },
  { range: '2,000,000+ AFN', pct: 'Negotiated 5–10%' },
];

export const FeesPoliciesPage: React.FC<FeesPoliciesPageProps> = ({ currentLang }) => {
  const [salePrice, setSalePrice] = useState(100000);
  const [reservePrice, setReservePrice] = useState(0);

  const quote = useMemo(() => {
    const buyerPremium = Math.round(salePrice * 0.05);
    let sellerPct: number | null = 20;
    if (salePrice >= 2_000_000) sellerPct = null;
    else if (salePrice >= 100_000) sellerPct = 10;
    else if (salePrice >= 10_000) sellerPct = 15;
    const sellerCommission = sellerPct === null ? null : Math.round(salePrice * sellerPct / 100);
    const reserveFee = reservePrice > 0 ? Math.round(reservePrice * 0.20) : 0;
    return {
      buyerPremium,
      buyerTotal: salePrice + buyerPremium,
      sellerPct,
      sellerCommission,
      reserveFee,
      sellerNet: sellerCommission === null ? null : salePrice - sellerCommission - reserveFee,
    };
  }, [salePrice, reservePrice]);

  const isEn = currentLang === 'en';

  const sections = [
    {
      icon: Gavel,
      title: isEn ? 'Buyer Auction Rules' : 'قوانین خریدار و مزایده',
      items: isEn
        ? ['Accepted bids are binding.', 'Buyer premium is 5% of the winning bid.', 'Late bids may extend the auction under the anti-sniping rule.', 'Reserve auctions close as sold only when the reserve is met.', 'Winning buyers must pay within the deadline shown on the invoice.']
        : ['پیشنهاد پذیرفته‌شده تعهد خرید است.', 'حق‌العمل خریدار ۵٪ مبلغ برنده است.', 'پیشنهادهای لحظات پایانی می‌توانند زمان مزایده را تمدید کنند.', 'مزایده دارای قیمت احتیاطی فقط پس از رسیدن به ذخیره فروخته‌شده محسوب می‌شود.', 'برنده باید در مهلت درج‌شده در فاکتور پرداخت کند.'],
    },
    {
      icon: Store,
      title: isEn ? 'Seller Agreement' : 'قرارداد فروشنده',
      items: isEn
        ? ['Seller confirms legal ownership and authority to sell.', 'Seller must accurately disclose condition, defects and ownership documents.', 'Shill bidding or bidding on your own item is prohibited.', 'Seller commission follows the published tier schedule.', 'Listings may be rejected, paused or removed for legal, fraud, ownership or safety concerns.']
        : ['فروشنده مالکیت قانونی و صلاحیت فروش را تایید می‌کند.', 'وضعیت، عیب‌ها و اسناد مالکیت باید دقیق اعلام شود.', 'پیشنهاد دادن روی جنس خود یا از طریق شخص دیگر ممنوع است.', 'کمیسیون فروشنده طبق جدول منتشرشده محاسبه می‌شود.', 'نوبت می‌تواند لیست را به دلیل مشکل قانونی، تقلب، مالکیت یا ایمنی رد یا متوقف کند.'],
    },
    {
      icon: ShieldCheck,
      title: isEn ? 'Identity & Account Policy' : 'پالیسی حساب و احراز هویت',
      items: isEn
        ? ['Public registration can create buyer, customer, seller or business accounts.', 'Staff and administrator roles are assigned only by authorized management.', 'Higher-risk or higher-value activity may require additional identity review.', 'Accounts may be suspended for fraud, abuse, unpaid wins or policy violations.']
        : ['ثبت‌نام عمومی فقط حساب خریدار، مشتری، فروشنده یا تجارتی ایجاد می‌کند.', 'نقش کارمند و مدیر فقط توسط مدیریت مجاز تعیین می‌شود.', 'فعالیت‌های پرریسک یا معاملات بزرگ ممکن است نیاز به بررسی هویت بیشتر داشته باشد.', 'حساب به دلیل تقلب، سوءاستفاده، عدم پرداخت یا نقض قوانین قابل تعلیق است.'],
    },
    {
      icon: CreditCard,
      title: isEn ? 'Payment & Refund Policy' : 'پالیسی پرداخت و بازپرداخت',
      items: isEn
        ? ['HesabPay is enabled only after official production credentials are configured.', 'Payment is confirmed by the server/provider response, never only by a browser redirect.', 'Processing fees are passed through at actual provider cost or included in the buyer premium when configured.', 'Refunds and seller payouts require verified transaction records.']
        : ['HesabPay فقط پس از تنظیم کلیدهای رسمی تولید فعال می‌شود.', 'پرداخت فقط با تایید سرور/ارائه‌دهنده معتبر است، نه صرفاً برگشت مرورگر.', 'هزینه پردازش مطابق هزینه واقعی ارائه‌دهنده یا در حق‌العمل خریدار لحاظ می‌شود.', 'بازپرداخت و پرداخت به فروشنده نیاز به رکورد تراکنش تاییدشده دارد.'],
    },
    {
      icon: Truck,
      title: isEn ? 'Pickup, Delivery & Storage' : 'تحویل، ارسال و ذخیره',
      items: isEn
        ? ['Delivery is charged separately.', 'Storage after the grace period is 50–500 AFN based on item/location and the stated daily or weekly basis.', 'Pickup may require identity confirmation and a release code/QR.', 'Items not collected on time may incur storage charges under the published pickup notice.']
        : ['هزینه ارسال جداگانه محاسبه می‌شود.', 'بعد از مهلت رایگان، ذخیره‌سازی بر اساس کالا/محل بین ۵۰ تا ۵۰۰ افغانی طبق نرخ روزانه یا هفتگی اعلام‌شده است.', 'تحویل حضوری می‌تواند نیاز به تایید هویت و کد/QR داشته باشد.', 'عدم تحویل به‌موقع می‌تواند باعث هزینه ذخیره طبق اطلاعیه تحویل شود.'],
    },
    {
      icon: AlertTriangle,
      title: isEn ? 'Restricted & Prohibited Listings' : 'کالاهای ممنوع و محدود',
      items: isEn
        ? ['Illegal, stolen or counterfeit goods are prohibited.', 'Items requiring ownership or regulatory documents cannot go live without required records.', 'NAWBAT may require specialist review for high-risk categories.', 'The platform can suspend a listing while ownership, legality or authenticity is investigated.']
        : ['کالای غیرقانونی، مسروقه یا تقلبی ممنوع است.', 'کالاهایی که سند مالکیت یا مجوز لازم دارند بدون مدارک موردنیاز منتشر نمی‌شوند.', 'برای دسته‌های پرریسک ممکن است بررسی متخصص لازم باشد.', 'نوبت می‌تواند تا زمان بررسی مالکیت، قانونیت یا اصالت، لیست را متوقف کند.'],
    },
  ];

  return (
    <section className="bg-[#f7f9ff] min-h-[70vh] px-4 py-10 lg:py-14">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="rounded-[2rem] bg-[#003a2f] text-white p-7 lg:p-10 shadow-xl">
          <div className="flex items-center gap-2 text-[#afefdc] text-xs font-bold uppercase tracking-wider">
            <FileText className="w-4 h-4" />
            <span>{isEn ? 'NAWBAT Marketplace Rules' : 'قوانین و قراردادهای نوبت'}</span>
          </div>
          <h1 className="font-serif text-3xl lg:text-4xl font-bold mt-3">
            {isEn ? 'Fees, commissions, contracts and auction policies' : 'هزینه‌ها، کمیسیون‌ها، قراردادها و پالیسی مزایده'}
          </h1>
          <p className="text-sm text-white/75 mt-3 max-w-3xl leading-7">
            {isEn
              ? 'This page is the platform rulebook shown to users. Final legal wording should be reviewed by qualified counsel before public launch.'
              : 'این صفحه چارچوب قوانین پلتفرم برای کاربران است. متن حقوقی نهایی قبل از راه‌اندازی عمومی باید توسط مشاور حقوقی واجد صلاحیت بررسی شود.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-[1.25fr_.75fr] gap-6">
          <div className="bg-white rounded-2xl border border-[#003a2f]/10 overflow-hidden shadow-sm">
            <div className="p-5 border-b border-[#003a2f]/10">
              <h2 className="font-serif text-xl font-bold text-[#003a2f]">{isEn ? 'Seller commission schedule' : 'جدول کمیسیون فروشنده'}</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[#eef6f2] text-[#33453f]">
                  <tr><th className="p-3 text-start">{isEn ? 'Final sale price' : 'قیمت نهایی فروش'}</th><th className="p-3 text-start">{isEn ? 'Seller commission' : 'کمیسیون فروشنده'}</th></tr>
                </thead>
                <tbody>
                  {sellerTiers.map((tier) => (
                    <tr key={tier.range} className="border-t border-[#edf1ef]">
                      <td className="p-3 font-medium">{tier.range}</td>
                      <td className="p-3 font-bold text-[#003a2f]">{tier.pct}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-[#003a2f]/10 p-5 shadow-sm">
            <h2 className="font-serif text-xl font-bold text-[#003a2f]">{isEn ? 'Core platform charges' : 'هزینه‌های اصلی پلتفرم'}</h2>
            <dl className="mt-4 space-y-3 text-sm">
              {[
                [isEn ? 'Buyer premium' : 'حق‌العمل خریدار', '5%'],
                [isEn ? 'Listing fee' : 'هزینه ثبت', isEn ? 'Free initially' : 'فعلاً رایگان'],
                [isEn ? 'Unsold commission' : 'کمیسیون جنس فروخته‌نشده', '0%'],
                [isEn ? 'Reserve option' : 'گزینه قیمت احتیاطی', '20% of reserve'],
                [isEn ? 'Featured listing' : 'لیست ویژه', '250–500 AFN'],
                [isEn ? 'Storage after grace period' : 'ذخیره بعد از مهلت', '50–500 AFN'],
                [isEn ? 'Delivery' : 'ارسال', isEn ? 'Separate' : 'جداگانه'],
                [isEn ? 'Appraisal' : 'ارزیابی', isEn ? 'Specialist quote' : 'قیمت متخصص'],
              ].map(([label, value]) => (
                <div key={label} className="flex items-center justify-between gap-3 border-b border-[#edf1ef] pb-2">
                  <dt className="text-[#5c6964]">{label}</dt><dd className="font-bold text-[#003a2f]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#003a2f]/10 p-5 lg:p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Calculator className="w-5 h-5 text-[#003a2f]" />
            <h2 className="font-serif text-xl font-bold text-[#003a2f]">{isEn ? 'Fee calculator' : 'محاسبه‌گر هزینه‌ها'}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <label className="text-xs font-bold text-[#3d4d47]">
              {isEn ? 'Final sale price (AFN)' : 'قیمت نهایی فروش (AFN)'}
              <input type="number" min={0} value={salePrice} onChange={(e) => setSalePrice(Math.max(0, Number(e.target.value) || 0))} className="mt-1.5 w-full border border-[#cbd8d2] rounded-xl p-3 text-sm" />
            </label>
            <label className="text-xs font-bold text-[#3d4d47]">
              {isEn ? 'Reserve price if used (AFN)' : 'قیمت احتیاطی در صورت استفاده (AFN)'}
              <input type="number" min={0} value={reservePrice} onChange={(e) => setReservePrice(Math.max(0, Number(e.target.value) || 0))} className="mt-1.5 w-full border border-[#cbd8d2] rounded-xl p-3 text-sm" />
            </label>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-5">
            {[
              [isEn ? 'Buyer premium' : 'حق‌العمل خریدار', `${quote.buyerPremium.toLocaleString()} AFN`],
              [isEn ? 'Buyer total before delivery' : 'مجموع خریدار قبل از ارسال', `${quote.buyerTotal.toLocaleString()} AFN`],
              [isEn ? 'Seller commission' : 'کمیسیون فروشنده', quote.sellerCommission === null ? '5–10% negotiated' : `${quote.sellerCommission.toLocaleString()} AFN`],
              [isEn ? 'Reserve option fee' : 'هزینه قیمت احتیاطی', `${quote.reserveFee.toLocaleString()} AFN`],
            ].map(([label,value]) => (
              <div key={label} className="rounded-xl bg-[#f2f7f5] border border-[#dce7e2] p-4">
                <div className="text-[11px] text-[#66746f]">{label}</div>
                <div className="font-bold text-[#003a2f] mt-1">{value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {sections.map(({ icon: Icon, title, items }) => (
            <article key={title} className="bg-white rounded-2xl border border-[#003a2f]/10 p-5 shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-[#eef8f4] text-[#003a2f] flex items-center justify-center"><Icon className="w-4 h-4" /></div>
                <h3 className="font-serif font-bold text-[#152a23]">{title}</h3>
              </div>
              <ul className="mt-4 space-y-2.5 text-xs text-[#586660] leading-6">
                {items.map((item) => <li key={item} className="flex items-start gap-2"><UserCheck className="w-3.5 h-3.5 mt-1 text-[#0b5345] shrink-0" /><span>{item}</span></li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};
