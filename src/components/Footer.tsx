import React from 'react';
import { Logo } from './Logo';
import { Language } from '../types/auction';
import { translations } from '../translations';
import { 
  ShieldCheck, 
  Wallet, 
  Building, 
  BadgeCheck, 
  Timer, 
  Phone, 
  Mail, 
  ExternalLink 
} from 'lucide-react';

interface FooterProps {
  currentLang: Language;
  onLanguageChange: (lang: Language) => void;
}

export const Footer: React.FC<FooterProps> = ({ currentLang, onLanguageChange }) => {
  const t = translations[currentLang];

  return (
    <footer className="w-full bg-[#ecf4ff] border-t border-[#003a2f]/10 pt-12 pb-8 text-[#3f4945]">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 pb-10">
          {/* Column 1: Brand & Description */}
          <div className="flex flex-col gap-3">
            <Logo size="md" />
            <p className="text-xs leading-relaxed text-[#3f4945]">
              اولین زیرساخت رسمی، اعتبارسنجی شده و تایید هویت یافته مزایده‌های آنلاین در افغانستان با همکاری امانی و بانکی HesabPay تحت نظارت د افغانستان بانک.
            </p>
            <div className="flex items-center gap-1.5 text-[#003a2f] text-xs font-semibold pt-1">
              <ShieldCheck className="w-4 h-4 text-[#0b5345]" />
              <span>ضمانت اصالت و سلامت تمامی اموال و اسناد</span>
            </div>
          </div>

          {/* Column 2: Guarantees */}
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-sm font-bold text-[#111d27]">
              تضمین‌های سازمانی و امنیتی
            </h3>
            <ul className="flex flex-col gap-2 text-xs">
              <li className="flex items-center gap-2">
                <Wallet className="w-3.5 h-3.5 text-[#326286] shrink-0" />
                <span>تسویه و سپرده‌گذاری رسمی امانی HesabPay</span>
              </li>
              <li className="flex items-center gap-2">
                <Building className="w-3.5 h-3.5 text-[#326286] shrink-0" />
                <span>تفتیش فیزیکی گدام‌ها در کابل و هرات</span>
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck className="w-3.5 h-3.5 text-[#326286] shrink-0" />
                <span>احراز هویت بیومتریک تذکره الکترونیکی (KYC)</span>
              </li>
              <li className="flex items-center gap-2">
                <Timer className="w-3.5 h-3.5 text-[#326286] shrink-0" />
                <span>مقررات ضد دزدی ثانیه‌ای (Anti-Sniping 2-min)</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Quick Links */}
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-sm font-bold text-[#111d27]">
              پیوندهای سریع و خدمات
            </h3>
            <ul className="flex flex-col gap-2 text-xs">
              <li>
                <a href="#dispute" className="hover:text-[#003a2f] transition-colors flex items-center gap-1">
                  <span>مرکز حل منازعات و داوری (Dispute Center)</span>
                  <ExternalLink className="w-3 h-3 text-[#707975]" />
                </a>
              </li>
              <li>
                <a href="#escrow-terms" className="hover:text-[#003a2f] transition-colors">
                  قوانین حراجی و سپرده احتیاطی (Escrow Terms)
                </a>
              </li>
              <li>
                <a href="#rates" className="hover:text-[#003a2f] transition-colors">
                  تعرفه‌های کارشناسی و ارزیابی عتیقه‌جات
                </a>
              </li>
              <li>
                <a href="#faq" className="hover:text-[#003a2f] transition-colors">
                  پرسش‌های متداول خریداران و تاجران
                </a>
              </li>
              <li>
                <a href="#branch" className="hover:text-[#003a2f] transition-colors">
                  درخواست نمایندگی در سایر ولایات
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Support Kabul */}
          <div className="flex flex-col gap-3">
            <h3 className="font-serif text-sm font-bold text-[#111d27]">
              ارتباط با مرکز پشتیبانی کابل
            </h3>
            <p className="text-xs text-[#3f4945]">
              پاسخگویی 24 ساعته در هفت روز هفته برای تایید معاملات کلان
            </p>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#111d27]">
              <Phone className="w-4 h-4 text-[#003a2f]" />
              <span className="font-mono dir-ltr">+93 (0) 20 221 4400</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[#111d27]">
              <Mail className="w-4 h-4 text-[#003a2f]" />
              <span className="font-mono">support@nawbat.af</span>
            </div>

            <div className="mt-1 flex items-center gap-1.5 text-xs">
              <span className="text-[#3f4945]">تغییر زبان:</span>
              <button
                onClick={() => onLanguageChange('fa')}
                className={`px-2 py-0.5 rounded text-xs ${
                  currentLang === 'fa' ? 'bg-[#dde9f9] text-[#003a2f] font-bold' : 'hover:bg-white'
                }`}
              >
                دری
              </button>
              <button
                onClick={() => onLanguageChange('ps')}
                className={`px-2 py-0.5 rounded text-xs ${
                  currentLang === 'ps' ? 'bg-[#dde9f9] text-[#003a2f] font-bold' : 'hover:bg-white'
                }`}
              >
                پښتو
              </button>
              <button
                onClick={() => onLanguageChange('en')}
                className={`px-2 py-0.5 rounded text-xs ${
                  currentLang === 'en' ? 'bg-[#dde9f9] text-[#003a2f] font-bold' : 'hover:bg-white'
                }`}
              >
                English
              </button>
            </div>
          </div>
        </div>

        {/* Legal Disclaimer & Copyright */}
        <div className="pt-6 border-t border-[#bfc9c4]/60 flex flex-col md:flex-row items-center justify-between gap-3 text-center md:text-right text-xs">
          <span>
            © 1403 نوبت افغانستان (Nawbat.af) - تمامی حقوق تحت قانون تجارت الکترونیک و حمایت مستهلک محفوظ است.
          </span>
          <div className="flex items-center gap-4 text-xs font-medium">
            <a href="#terms" className="hover:text-[#111d27] transition-colors">
              شرایط استفاده
            </a>
            <a href="#privacy" className="hover:text-[#111d27] transition-colors">
              حریم خصوصی
            </a>
            <a href="#hesabpay-rules" className="hover:text-[#111d27] transition-colors">
              مقررات HesabPay
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
