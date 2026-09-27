import React, { useState } from 'react';
import { Language } from '../types/auction';
import { authApi, NawbatUser } from '../services/authApi';
import { LockKeyhole, Mail, UserRound, Store, ShoppingBag, Building2, ShieldCheck, ArrowRight, ArrowLeft, CheckCircle2, FileSignature, Eye, EyeOff } from 'lucide-react';
import { RegistrationAgreementModal } from './RegistrationAgreementModal';

type Mode = 'login' | 'register';

interface LoginPageProps {
  currentLang: Language;
  onAuthenticated: (user: NawbatUser) => void;
  onViewPolicies: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ currentLang, onAuthenticated, onViewPolicies }) => {
  const isRtl = currentLang !== 'en';
  const [mode, setMode] = useState<Mode>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [accountType, setAccountType] = useState<'buyer' | 'customer' | 'seller' | 'business'>('buyer');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptFeesRules, setAcceptFeesRules] = useState(false);
  const [agreementReviewed, setAgreementReviewed] = useState(false);
  const [signatureName, setSignatureName] = useState('');
  const [agreementOpen, setAgreementOpen] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const copy = currentLang === 'en'
    ? {
        title: 'Sign in to NAWBAT',
        subtitle: 'One account. The platform recognizes whether you are a buyer, seller, business, staff member, or administrator.',
        login: 'Sign in',
        register: 'Create account',
        name: 'Full name',
        email: 'Email address',
        password: 'Password',
        account: 'Account type',
        buyer: 'Buyer',
        customer: 'Customer',
        seller: 'Seller',
        business: 'Business seller',
        acceptTerms: 'I agree to the Terms of Use',
        acceptPrivacy: 'I agree to the Privacy Policy',
        acceptFeesRules: 'I agree to the Fees & Rules / Auction Policies',
        reviewAgreement: 'Review, download & electronically sign agreement',
        reviewedAgreement: 'Agreement reviewed and electronically signed',
        policies: 'Read fees, contracts, policies and auction rules',
        submitLogin: 'Sign in securely',
        submitRegister: 'Create my account',
        staffNote: 'Staff and administrator access is assigned internally. Public registration cannot create a staff or admin account.',
      }
    : currentLang === 'ps'
    ? {
        title: 'نوبت ته ننوتل',
        subtitle: 'یو حساب. سیستم پېژني چې تاسو پېرودونکی، پلورونکی، تجارتي حساب، کارکوونکی یا مدیر یاست.',
        login: 'ننوتل',
        register: 'حساب جوړول',
        name: 'بشپړ نوم',
        email: 'برېښنالیک',
        password: 'پټنوم',
        account: 'د حساب ډول',
        buyer: 'پېرودونکی',
        customer: 'مشتری',
        seller: 'پلورونکی',
        business: 'تجارتي پلورونکی',
        acceptTerms: 'زه د کارولو شرایط منم',
        acceptPrivacy: 'زه د محرمیت تګلاره منم',
        acceptFeesRules: 'زه فیسونه، قوانین او د لیلام تګلارې منم',
        reviewAgreement: 'تړون وګورئ، کاپي واخلئ او برېښنایي لاسلیک وکړئ',
        reviewedAgreement: 'تړون ولوستل شو او برېښنایي لاسلیک شو',
        policies: 'فیسونه، قراردادونه، تګلارې او د لیلام اصول وګورئ',
        submitLogin: 'خوندي ننوتل',
        submitRegister: 'زما حساب جوړ کړئ',
        staffNote: 'د کارکوونکو او مدیرانو لاسرسی یوازې د ادارې له خوا ورکول کېږي. عام ثبت د مدیر حساب نه شي جوړولای.',
      }
    : {
        title: 'ورود به نوبت',
        subtitle: 'یک حساب. سیستم تشخیص می‌دهد که شما خریدار، فروشنده، حساب تجارتی، کارمند یا مدیر هستید.',
        login: 'ورود',
        register: 'ایجاد حساب',
        name: 'نام کامل',
        email: 'ایمیل',
        password: 'رمز عبور',
        account: 'نوع حساب',
        buyer: 'خریدار',
        customer: 'مشتری',
        seller: 'فروشنده',
        business: 'فروشنده تجارتی',
        acceptTerms: 'شرایط استفاده را می‌پذیرم',
        acceptPrivacy: 'سیاست حریم خصوصی را می‌پذیرم',
        acceptFeesRules: 'هزینه‌ها، قوانین و پالیسی‌های مزایده را می‌پذیرم',
        reviewAgreement: 'قرارداد را بخوانید، نسخه بگیرید و امضای الکترونیکی کنید',
        reviewedAgreement: 'قرارداد مطالعه و امضای الکترونیکی شد',
        policies: 'مشاهده هزینه‌ها، قراردادها، پالیسی‌ها و قوانین مزایده',
        submitLogin: 'ورود امن',
        submitRegister: 'ایجاد حساب من',
        staffNote: 'دسترسی کارمند و مدیر فقط از داخل مدیریت تعیین می‌شود. ثبت‌نام عمومی نمی‌تواند حساب مدیر یا کارمند ایجاد کند.',
      };

  const accountOptions = [
    { id: 'buyer' as const, label: copy.buyer, icon: ShoppingBag },
    { id: 'customer' as const, label: copy.customer, icon: UserRound },
    { id: 'seller' as const, label: copy.seller, icon: Store },
    { id: 'business' as const, label: copy.business, icon: Building2 },
  ];

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      const user = mode === 'login'
        ? await authApi.login(email.trim(), password)
        : await authApi.register({
            fullName: fullName.trim(),
            email: email.trim(),
            password,
            accountType,
            preferredLanguage: currentLang,
            acceptTerms,
            acceptPrivacy,
            acceptFeesRules,
            agreementReviewed,
            signatureName,
          });
      onAuthenticated(user);
    } catch (err: any) {
      setError(err?.message || 'Could not continue.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section dir={isRtl ? 'rtl' : 'ltr'} className="min-h-[72vh] bg-[linear-gradient(180deg,#f4faf7_0%,#ffffff_50%,#f7f9ff_100%)] px-4 py-10 lg:py-16">
      <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.02fr_.98fr] bg-white border border-[#003a2f]/10 rounded-[2rem] overflow-hidden shadow-[0_24px_70px_rgba(0,58,47,0.12)]">
        <div className="bg-[#003a2f] text-white p-7 lg:p-10 relative overflow-hidden">
          <div className="absolute w-64 h-64 rounded-full bg-[#afefdc]/10 -top-24 -left-16 blur-2xl" />
          <div className="relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-white/10 border border-white/15 flex items-center justify-center mb-6">
              <ShieldCheck className="w-6 h-6 text-[#afefdc]" />
            </div>
            <h1 className="font-serif text-3xl lg:text-4xl font-bold leading-tight">{copy.title}</h1>
            <p className="text-sm text-white/75 leading-7 mt-4">{copy.subtitle}</p>

            <div className="mt-8 space-y-3 text-sm">
              {[
                currentLang === 'en' ? 'Buyer and customer accounts see bidding and order tools.' : currentLang === 'ps' ? 'پېرودونکي د وړاندیز او امر وسایل ویني.' : 'خریدار و مشتری ابزارهای پیشنهاد و سفارش را می‌بینند.',
                currentLang === 'en' ? 'Sellers see listing, sales and settlement tools.' : currentLang === 'ps' ? 'پلورونکي د لیست او پلور وسایل ویني.' : 'فروشنده ابزارهای ثبت کالا، فروش و تسویه را می‌بیند.',
                currentLang === 'en' ? 'Staff see only the management areas allowed by their role.' : currentLang === 'ps' ? 'کارکوونکي یوازې خپل مجاز مدیریتي برخې ویني.' : 'کارمند فقط بخش‌های مدیریتی مجاز نقش خود را می‌بیند.',
              ].map((item) => (
                <div key={item} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#afefdc] mt-0.5 shrink-0" />
                  <span className="text-white/85 leading-6">{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-9 rounded-2xl bg-white/8 border border-white/12 p-4 text-xs leading-6 text-white/75">
              {copy.staffNote}
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-8 lg:p-10">
          <div className="grid grid-cols-2 bg-[#f1f6f4] rounded-xl p-1 mb-7">
            <button
              type="button"
              onClick={() => { setMode('login'); setError(''); }}
              className={`py-2.5 rounded-lg text-sm font-bold ${mode === 'login' ? 'bg-white text-[#003a2f] shadow-sm' : 'text-[#60706a]'}`}
            >
              {copy.login}
            </button>
            <button
              type="button"
              onClick={() => { setMode('register'); setError(''); }}
              className={`py-2.5 rounded-lg text-sm font-bold ${mode === 'register' ? 'bg-white text-[#003a2f] shadow-sm' : 'text-[#60706a]'}`}
            >
              {copy.register}
            </button>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === 'register' && (
              <label className="block">
                <span className="text-xs font-bold text-[#263a34]">{copy.name}</span>
                <div className="mt-1.5 flex items-center gap-2 bg-[#fbfdfc] border border-[#cbd8d2] rounded-xl px-3">
                  <UserRound className="w-4 h-4 text-[#60706a]" />
                  <input required minLength={2} value={fullName} onChange={(e) => { setFullName(e.target.value); if (agreementReviewed) { setAgreementReviewed(false); setAcceptTerms(false); setAcceptPrivacy(false); setAcceptFeesRules(false); setSignatureName(''); } }} className="w-full py-3 bg-transparent outline-none text-sm" />
                </div>
              </label>
            )}

            <label className="block">
              <span className="text-xs font-bold text-[#263a34]">{copy.email}</span>
              <div className="mt-1.5 flex items-center gap-2 bg-[#fbfdfc] border border-[#cbd8d2] rounded-xl px-3">
                <Mail className="w-4 h-4 text-[#60706a]" />
                <input type="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full py-3 bg-transparent outline-none text-sm direction-ltr" />
              </div>
            </label>

            <label className="block">
              <span className="text-xs font-bold text-[#263a34]">{copy.password}</span>
              <div className="mt-1.5 flex items-center gap-2 bg-[#fbfdfc] border border-[#cbd8d2] rounded-xl px-3">
                <LockKeyhole className="w-4 h-4 text-[#60706a]" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={mode === 'register' ? 10 : undefined}
                  autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full py-3 bg-transparent outline-none text-sm direction-ltr"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="p-1.5 rounded-lg text-[#60706a] hover:text-[#003a2f] hover:bg-[#edf5f1] transition-colors"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </label>

            {mode === 'register' && (
              <>
                <div>
                  <span className="text-xs font-bold text-[#263a34]">{copy.account}</span>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {accountOptions.map(({ id, label, icon: Icon }) => (
                      <button
                        key={id}
                        type="button"
                        onClick={() => setAccountType(id)}
                        className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all ${accountType === id ? 'border-[#003a2f] bg-[#eef8f4] text-[#003a2f]' : 'border-[#dce5e1] text-[#5b6964] hover:border-[#99b3a9]'}`}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className={`rounded-xl border p-3 ${agreementReviewed ? 'border-[#9bc9b8] bg-[#f1faf6]' : 'border-[#d8e3de] bg-[#fbfdfc]'}`}>
                  <button
                    type="button"
                    onClick={() => setAgreementOpen(true)}
                    className="w-full flex items-center justify-between gap-3 text-start"
                  >
                    <div className="flex items-center gap-2">
                      <FileSignature className="w-4 h-4 text-[#0b5345] shrink-0" />
                      <div>
                        <div className="text-xs font-bold text-[#17362d]">
                          {agreementReviewed ? copy.reviewedAgreement : copy.reviewAgreement}
                        </div>
                        {agreementReviewed && (
                          <div className="text-[10px] text-[#587068] mt-1">
                            {signatureName}
                          </div>
                        )}
                      </div>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${agreementReviewed ? 'bg-[#0b8f66]' : 'bg-[#c4cec9]'}`} />
                  </button>
                </div>

                <label className={`flex items-start gap-2 text-xs leading-5 ${agreementReviewed ? 'text-[#4e5d58] cursor-pointer' : 'text-[#9ba5a1] cursor-not-allowed'}`}>
                  <input type="checkbox" disabled={!agreementReviewed} checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} className="mt-1" />
                  <span>{copy.acceptTerms}</span>
                </label>
                <label className={`flex items-start gap-2 text-xs leading-5 ${agreementReviewed ? 'text-[#4e5d58] cursor-pointer' : 'text-[#9ba5a1] cursor-not-allowed'}`}>
                  <input type="checkbox" disabled={!agreementReviewed} checked={acceptPrivacy} onChange={(e) => setAcceptPrivacy(e.target.checked)} className="mt-1" />
                  <span>{copy.acceptPrivacy}</span>
                </label>
                <label className={`flex items-start gap-2 text-xs leading-5 ${agreementReviewed ? 'text-[#4e5d58] cursor-pointer' : 'text-[#9ba5a1] cursor-not-allowed'}`}>
                  <input type="checkbox" disabled={!agreementReviewed} checked={acceptFeesRules} onChange={(e) => setAcceptFeesRules(e.target.checked)} className="mt-1" />
                  <span>{copy.acceptFeesRules}</span>
                </label>
              </>
            )}

            {error && (
              <div className="rounded-xl border border-[#ba1a1a]/20 bg-[#fff2f1] px-3.5 py-3 text-xs text-[#9b1c1c]">{error}</div>
            )}

            <button
              type="submit"
              disabled={busy || (mode === 'register' && (!agreementReviewed || !acceptTerms || !acceptPrivacy || !acceptFeesRules || signatureName.trim().toLocaleLowerCase() !== fullName.trim().toLocaleLowerCase()))}
              className="w-full bg-[#003a2f] hover:bg-[#0b5345] disabled:opacity-60 text-white rounded-xl py-3.5 font-bold text-sm flex items-center justify-center gap-2 shadow-md"
            >
              {busy ? <span className="w-5 h-5 rounded-full border-2 border-white/40 border-t-white animate-spin" /> : (
                <>
                  <span>{mode === 'login' ? copy.submitLogin : copy.submitRegister}</span>
                  {isRtl ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </>
              )}
            </button>

            <button type="button" onClick={onViewPolicies} className="w-full text-xs font-semibold text-[#326286] hover:underline pt-1">
              {copy.policies}
            </button>
          </form>
        </div>
      </div>
      <RegistrationAgreementModal
        open={agreementOpen}
        currentLang={currentLang}
        fullName={fullName}
        signatureName={signatureName}
        onSignatureChange={setSignatureName}
        onClose={() => setAgreementOpen(false)}
        onReviewed={() => {
          setAgreementReviewed(true);
          setAgreementOpen(false);
        }}
      />
    </section>
  );
};
