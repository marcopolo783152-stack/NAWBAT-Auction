import React, { useState } from 'react';
import { Language } from '../types/auction';
import { 
  ShieldCheck, 
  X, 
  Lock, 
  Mail, 
  KeyRound, 
  AlertCircle, 
  CheckCircle2, 
  Sparkles,
  UserCheck
} from 'lucide-react';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: () => void;
  currentLang: Language;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  currentLang,
}) => {
  if (!isOpen) return null;

  const isRtl = currentLang !== 'en';
  const [email, setEmail] = useState('admin@nawbat.af');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    setTimeout(() => {
      if (email.trim() && password.trim()) {
        setIsLoading(false);
        onLoginSuccess();
        onClose();
      } else {
        setIsLoading(false);
        setError(currentLang === 'en' ? 'Invalid credentials' : 'ایمیل یا رمز عبور اشتباه است');
      }
    }, 500);
  };

  const handleQuickDemoLogin = () => {
    setEmail('admin@nawbat.af');
    setPassword('admin123');
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLoginSuccess();
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div 
        className="bg-white rounded-2xl max-w-md w-full border border-[#003a2f]/20 shadow-2xl overflow-hidden flex flex-col text-[#111d27]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
        {/* Header */}
        <div className="bg-[#003a2f] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#afefdc]/20 rounded-xl text-[#afefdc]">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base">
                {currentLang === 'en' ? 'Administrator Login' : 'ورود به پنل مدیریت نوبت'}
              </h3>
              <p className="text-xs text-[#dde9f9]">
                {currentLang === 'en' ? 'Nawbat Official Auction Admin Portal' : 'سامانه نظارت بر حراج‌ها و امور امانی'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          
          {/* Quick Demo Credentials Banner */}
          <div className="bg-[#ecf4ff] rounded-xl p-3.5 border border-[#326286]/20 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-[#326286]">
              <span className="font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#cea701]" />
                {currentLang === 'en' ? 'Demo Admin Credentials:' : 'اطلاعات ورود آزمایشی مدیر:'}
              </span>
              <span className="text-[10px] bg-white px-2 py-0.5 rounded font-mono font-bold text-[#003a2f]">
                SuperAdmin
              </span>
            </div>
            <div className="text-[11px] text-[#3f4945] font-mono flex flex-col gap-0.5">
              <span>Email: <strong>admin@nawbat.af</strong></span>
              <span>Pass: <strong>admin123</strong></span>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="mt-1 w-full bg-[#326286] hover:bg-[#204969] text-white py-1.5 px-3 rounded-lg text-xs font-bold transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#afefdc]" />
              <span>{currentLang === 'en' ? '⚡ 1-Click Instant Demo Login' : '⚡ ورود سریع 1 کلیکی با حساب مدیر'}</span>
            </button>
          </div>

          {error && (
            <div className="p-3 bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 rounded-xl text-xs text-[#ba1a1a] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Email field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#111d27] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#707975]" />
              <span>{currentLang === 'en' ? 'Admin Email Address:' : 'ایمیل سازمانی مدیر:'}</span>
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nawbat.af"
              className="bg-[#f7f9ff] border border-[#bfc9c4] focus:border-[#003a2f] rounded-xl p-2.5 text-xs text-[#111d27] focus:outline-none font-mono"
            />
          </div>

          {/* Password field */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#111d27] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#707975]" />
              <span>{currentLang === 'en' ? 'Password:' : 'رمز عبور:'}</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="bg-[#f7f9ff] border border-[#bfc9c4] focus:border-[#003a2f] rounded-xl p-2.5 text-xs text-[#111d27] focus:outline-none font-mono"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#003a2f] hover:bg-[#0b5345] text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer mt-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <KeyRound className="w-4 h-4 text-[#afefdc]" />
                <span>{currentLang === 'en' ? 'Authenticate as Admin' : 'ورود به سامانه مدیریت'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
