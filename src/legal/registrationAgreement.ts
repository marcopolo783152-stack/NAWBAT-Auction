import { Language } from '../types/auction';

export const REGISTRATION_AGREEMENT_VERSION = '2026-09-26-v1';
export const TERMS_VERSION = '2026-09-26-v1';
export const PRIVACY_VERSION = '2026-09-26-v1';
export const FEES_RULES_VERSION = '2026-09-26-v1';

export function registrationAgreementText(lang: Language) {
  if (lang === 'en') {
    return `NAWBAT REGISTRATION AGREEMENT
Version: ${REGISTRATION_AGREEMENT_VERSION}

By creating a NAWBAT account, I confirm that the information I provide is accurate and that I am authorized to create and use this account.

FEES
• Buyer premium: 5% of the winning bid.
• Seller commission:
  - Under 10,000 AFN: 20%
  - 10,000–99,999 AFN: 15%
  - 100,000–499,999 AFN: 10%
  - 500,000–1,999,999 AFN: 10%
  - 2,000,000+ AFN: negotiated 5–10%
• Seller listing fee: free initially.
• Unsold item commission: 0%.
• Reserve-price option: 20% of the reserve price.
• Featured listing: 250–500 AFN.
• Storage after the stated grace period: 50–500 AFN according to the disclosed daily or weekly basis.
• Delivery is charged separately.
• Specialist authentication/appraisal is charged separately when required.
• Payment processing may be passed through at actual provider cost or included in the buyer premium when configured and disclosed.

AUCTION RULES
• A bid accepted by the server is binding, subject to applicable law and NAWBAT cancellation rights.
• Sellers may not bid on their own items directly or indirectly.
• Shill bidding, collusion, artificial price inflation and account manipulation are prohibited.
• Late bids may extend an auction under the anti-sniping rule.
• Reserve auctions are sold only when the reserve is met or another expressly permitted action applies.
• Winning buyers must pay within the deadline shown on the invoice.
• NAWBAT may pause, extend, investigate or cancel an auction for technical, legal, fraud, ownership, safety or payment concerns.

SELLER TERMS
• Sellers confirm legal ownership or documented authority to sell.
• Sellers must accurately disclose known condition issues, defects and required ownership documents.
• NAWBAT may request identity, ownership, inspection or specialist records.
• Applicable fees may be deducted from seller settlement.
• Listings may be rejected, paused or removed for legal, safety, fraud, ownership or authenticity concerns.

PAYMENTS, REFUNDS AND DELIVERY
• HesabPay or another provider is considered live only after production credentials and server-side verification are configured.
• A browser redirect alone does not prove successful payment.
• Refunds and seller payouts require verified transaction records.
• Pickup may require identity confirmation and a secure QR/release code.
• Delivery and storage charges are separate when disclosed.

ACCOUNT AND IDENTITY
• Public registration may create buyer, customer, seller or business accounts.
• Staff and administrator roles are assigned only by authorized NAWBAT management.
• Higher-risk or higher-value activity may require additional identity review.
• Accounts may be limited, suspended or blocked for fraud, abuse, repeated non-payment, false information or rule violations.

PRIVACY
NAWBAT may collect account information, identity/KYC records, listing information, transaction records, payment references, support/dispute information and security/device signals as needed to operate and protect the marketplace. Data handling is subject to the current Privacy Policy.

ELECTRONIC SIGNATURE
By typing my full legal name and submitting registration, I intend that typed name to serve as my electronic signature for this agreement, the Terms of Use, Privacy Policy, Fees & Rules, and applicable account rules.

I understand that the final legal documents should be reviewed under applicable law and that NAWBAT may publish updated versions. Material changes may require renewed acceptance.`;
  }

  if (lang === 'ps') {
    return `د نوبت د حساب جوړولو تړون
نسخه: ${REGISTRATION_AGREEMENT_VERSION}

د نوبت حساب په جوړولو سره زه تاییدوم چې ورکړل شوي معلومات سم دي او زه د دې حساب د جوړولو او کارولو صلاحیت لرم.

فیسونه
• د پېرودونکي فیس: د ګټونکي قیمت ۵٪.
• د پلورونکي کمیسیون:
  - تر ۱۰٬۰۰۰ افغانیو کم: ۲۰٪
  - ۱۰٬۰۰۰–۹۹٬۹۹۹: ۱۵٪
  - ۱۰۰٬۰۰۰–۴۹۹٬۹۹۹: ۱۰٪
  - ۵۰۰٬۰۰۰–۱٬۹۹۹٬۹۹۹: ۱۰٪
  - ۲٬۰۰۰٬۰۰۰ او پورته: د خبرو له مخې ۵–۱۰٪
• د لیست فیس: په پیل کې وړیا.
• د نه پلورل شوي توکي کمیسیون: ۰٪.
• د ریزرف قیمت اختیار: د ریزرف قیمت ۲۰٪.
• ځانګړی لیست: ۲۵۰–۵۰۰ افغانۍ.
• ذخیره د وړیا مودې وروسته: ۵۰–۵۰۰ افغانۍ د اعلان شوي ورځني یا اونیز نرخ له مخې.
• تحویلي جلا حسابېږي.
• مسلکي ارزونه/تصدیق د اړتیا په وخت کې جلا فیس لري.

د لیلام اصول
• د سرور لخوا منل شوی وړاندیز پابند دی.
• پلورونکی نشي کولی په خپل توکي مستقیم یا غیرمستقیم داو وکړي.
• جعلي داو، همغږي، مصنوعي قیمت لوړول او د حسابونو ناوړه کارول منع دي.
• ناوخته داوونه د anti-sniping قانون له مخې وخت غځولی شي.
• د ریزرف لیلام هغه وخت پلورل کېږي چې ریزرف بشپړ شي.
• ګټونکی باید د انوایس په موده کې پیسې ورکړي.
• نوبت کولی شي د تخنیکي، قانوني، درغلۍ، مالکیت، خوندیتوب یا تادیې ستونزو لپاره لیلام ودروي یا وڅېړي.

برېښنایي لاسلیک
د خپل بشپړ قانوني نوم په لیکلو او د حساب په ثبتولو سره، زه منم چې همدا لیکل شوی نوم زما برېښنایي لاسلیک دی او د کارولو شرایط، د محرمیت تګلاره، فیسونه او قوانین منم.`;
  }

  return `قرارداد ایجاد حساب نوبت
نسخه: ${REGISTRATION_AGREEMENT_VERSION}

با ایجاد حساب نوبت، تایید می‌کنم معلوماتی که ارائه می‌کنم دقیق است و صلاحیت ایجاد و استفاده از این حساب را دارم.

هزینه‌ها
• حق‌العمل خریدار: ۵٪ قیمت برنده.
• کمیسیون فروشنده:
  - کمتر از ۱۰٬۰۰۰ افغانی: ۲۰٪
  - ۱۰٬۰۰۰ تا ۹۹٬۹۹۹ افغانی: ۱۵٪
  - ۱۰۰٬۰۰۰ تا ۴۹۹٬۹۹۹ افغانی: ۱۰٪
  - ۵۰۰٬۰۰۰ تا ۱٬۹۹۹٬۹۹۹ افغانی: ۱۰٪
  - ۲٬۰۰۰٬۰۰۰ افغانی و بیشتر: توافقی، معمولاً ۵ تا ۱۰٪
• هزینه ثبت فروشنده: فعلاً رایگان.
• کمیسیون جنس فروخته‌نشده: ۰٪.
• گزینه قیمت احتیاطی: ۲۰٪ قیمت احتیاطی.
• لیست ویژه: ۲۵۰ تا ۵۰۰ افغانی.
• ذخیره پس از مهلت رایگان: ۵۰ تا ۵۰۰ افغانی طبق نرخ روزانه یا هفتگی اعلام‌شده.
• ارسال جداگانه محاسبه می‌شود.
• ارزیابی/تصدیق متخصص در صورت نیاز هزینه جداگانه دارد.
• هزینه پردازش پرداخت می‌تواند مطابق هزینه واقعی ارائه‌دهنده جداگانه دریافت شود یا در حق‌العمل خریدار لحاظ گردد، مشروط به افشای واضح.

قوانین مزایده
• پیشنهادی که سرور نوبت بپذیرد، با رعایت قانون و حق لغو نوبت، تعهدآور است.
• فروشنده اجازه ندارد مستقیم یا غیرمستقیم روی جنس خود پیشنهاد بدهد.
• پیشنهاد صوری، تبانی، بالا بردن مصنوعی قیمت و سوءاستفاده از حساب‌ها ممنوع است.
• پیشنهاد لحظات آخر ممکن است طبق قانون anti-sniping زمان مزایده را تمدید کند.
• مزایده دارای قیمت احتیاطی فقط پس از رسیدن به آن قیمت فروخته‌شده محسوب می‌شود، مگر اقدام دیگری صراحتاً مجاز باشد.
• برنده باید در مهلت درج‌شده در فاکتور پرداخت کند.
• نوبت می‌تواند به دلیل مشکل تخنیکی، قانونی، تقلب، مالکیت، ایمنی یا پرداخت مزایده را متوقف، تمدید، بررسی یا لغو کند.

شرایط فروشنده
• فروشنده مالکیت قانونی یا صلاحیت مستند برای فروش را تایید می‌کند.
• فروشنده باید وضعیت، عیب‌های شناخته‌شده و اسناد لازم مالکیت را دقیق اعلام کند.
• نوبت می‌تواند اسناد هویت، مالکیت، بازرسی یا ارزیابی متخصص درخواست کند.
• هزینه‌های قابل اجرا می‌تواند از تسویه فروشنده کسر شود.
• لیست ممکن است به دلیل مشکل قانونی، ایمنی، تقلب، مالکیت یا اصالت رد یا متوقف شود.

پرداخت، بازپرداخت و تحویل
• HesabPay یا هر ارائه‌دهنده دیگر فقط پس از فعال شدن کلیدهای تولید و تایید سروری، فعال محسوب می‌شود.
• برگشت مرورگر به صفحه موفق به تنهایی اثبات پرداخت نیست.
• بازپرداخت و پرداخت به فروشنده نیاز به رکورد تراکنش تاییدشده دارد.
• تحویل ممکن است نیاز به تایید هویت و کد امن QR/تحویل داشته باشد.
• هزینه ارسال و ذخیره، در صورت اعلام، جداگانه است.

حساب و احراز هویت
• ثبت‌نام عمومی می‌تواند حساب خریدار، مشتری، فروشنده یا تجارتی ایجاد کند.
• نقش کارمند و مدیر فقط توسط مدیریت مجاز نوبت تعیین می‌شود.
• فعالیت‌های پرریسک یا معاملات بزرگ ممکن است نیاز به بررسی هویت بیشتر داشته باشد.
• حساب می‌تواند به دلیل تقلب، سوءاستفاده، عدم پرداخت تکراری، معلومات نادرست یا نقض قوانین محدود، تعلیق یا مسدود شود.

حریم خصوصی
نوبت می‌تواند معلومات حساب، اسناد هویت/KYC، معلومات لیست، سوابق تراکنش، مراجع پرداخت، سوابق پشتیبانی/اختلاف و علایم امنیتی دستگاه را در حد لازم برای اداره و محافظت از بازار جمع‌آوری کند. نحوه استفاده از داده‌ها تابع سیاست حریم خصوصی جاری است.

امضای الکترونیکی
با تایپ نام کامل قانونی خود و ارسال ثبت‌نام، قصد دارم همان نام تایپ‌شده به‌عنوان امضای الکترونیکی من برای این قرارداد، شرایط استفاده، سیاست حریم خصوصی، هزینه‌ها و قوانین مزایده محسوب شود.

می‌دانم که اسناد حقوقی نهایی باید مطابق قانون قابل اجرا بررسی شوند و نوبت ممکن است نسخه‌های جدید منتشر کند. تغییرات مهم می‌تواند نیاز به پذیرش دوباره داشته باشد.`;
}
