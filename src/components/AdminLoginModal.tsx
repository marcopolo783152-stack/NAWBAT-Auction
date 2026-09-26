import React, { useState } from 'react';
import { Language } from '../types/auction';
import { ShieldCheck, X, Lock, Mail, KeyRound, AlertCircle } from 'lucide-react';
import { adminAuth } from '../services/adminApi';

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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const data = await res.json();

      if (!res.ok || !data?.token) {
        throw new Error(data?.error || 'Invalid credentials');
      }

      adminAuth.saveToken(data.token);
      onLoginSuccess();
      onClose();
    } catch {
      setError(
        currentLang === 'en'
          ? 'The email or password is incorrect, or admin access is not configured.'
          : 'ایمیل یا رمز عبور درست نیست، یا حساب مدیریت هنوز تنظیم نشده است.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className="bg-white rounded-2xl max-w-md w-full border border-[#003a2f]/20 shadow-2xl overflow-hidden flex flex-col text-[#111d27]"
        dir={isRtl ? 'rtl' : 'ltr'}
      >
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
                {currentLang === 'en' ? 'Authorized staff only' : 'فقط برای کارمندان مجاز'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
          <div className="rounded-xl border border-[#d8e2dc] bg-[#f7f9ff] p-3 text-[11px] leading-5 text-[#4d5752]">
            {currentLang === 'en'
              ? 'Admin credentials are managed securely in the server environment. No demo password is stored in the website.'
              : 'اطلاعات ورود مدیر به‌صورت امن در سرور نگهداری می‌شود. هیچ رمز آزمایشی در وب‌سایت ذخیره نشده است.'}
          </div>

          {error && (
            <div className="p-3 bg-[#ba1a1a]/10 border border-[#ba1a1a]/20 rounded-xl text-xs text-[#ba1a1a] flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#111d27] flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-[#707975]" />
              <span>{currentLang === 'en' ? 'Admin email' : 'ایمیل مدیر'}</span>
            </label>
            <input
              type="email"
              required
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@nawbat.af"
              className="bg-[#f7f9ff] border border-[#bfc9c4] focus:border-[#003a2f] rounded-xl p-2.5 text-xs text-[#111d27] focus:outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold text-[#111d27] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-[#707975]" />
              <span>{currentLang === 'en' ? 'Password' : 'رمز عبور'}</span>
            </label>
            <input
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••••••"
              className="bg-[#f7f9ff] border border-[#bfc9c4] focus:border-[#003a2f] rounded-xl p-2.5 text-xs text-[#111d27] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#003a2f] hover:bg-[#0b5345] disabled:opacity-60 text-white py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all mt-2"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <KeyRound className="w-4 h-4 text-[#afefdc]" />
                <span>{currentLang === 'en' ? 'Sign in securely' : 'ورود امن به مدیریت'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
