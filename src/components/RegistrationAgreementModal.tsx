import React from 'react';
import { Download, FileText, PenLine, ShieldCheck, X } from 'lucide-react';
import { Language } from '../types/auction';
import {
  REGISTRATION_AGREEMENT_VERSION,
  registrationAgreementText,
} from '../legal/registrationAgreement';

interface RegistrationAgreementModalProps {
  open: boolean;
  currentLang: Language;
  fullName: string;
  signatureName: string;
  onSignatureChange: (value: string) => void;
  onClose: () => void;
  onReviewed: () => void;
}

export const RegistrationAgreementModal: React.FC<RegistrationAgreementModalProps> = ({
  open,
  currentLang,
  fullName,
  signatureName,
  onSignatureChange,
  onClose,
  onReviewed,
}) => {
  if (!open) return null;

  const isRtl = currentLang !== 'en';
  const agreement = registrationAgreementText(currentLang);

  const labels = currentLang === 'en'
    ? {
        title: 'NAWBAT Account Agreement',
        version: 'Document version',
        download: 'Download a copy',
        signature: 'Electronic signature',
        signatureHint: 'Type your full legal name exactly as shown above.',
        acknowledge: 'I reviewed this agreement',
        mismatch: 'Signature must match the full name entered on the account.',
      }
    : currentLang === 'ps'
    ? {
        title: 'د نوبت د حساب تړون',
        version: 'د سند نسخه',
        download: 'یوه کاپي ښکته کړئ',
        signature: 'برېښنایي لاسلیک',
        signatureHint: 'خپل بشپړ قانوني نوم هماغسې ولیکئ لکه پورته.',
        acknowledge: 'ما دا تړون ولوست',
        mismatch: 'لاسلیک باید د حساب له بشپړ نوم سره برابر وي.',
      }
    : {
        title: 'قرارداد ایجاد حساب نوبت',
        version: 'نسخه سند',
        download: 'دریافت یک نسخه',
        signature: 'امضای الکترونیکی',
        signatureHint: 'نام کامل قانونی خود را دقیقاً مطابق نام حساب تایپ کنید.',
        acknowledge: 'این قرارداد را مطالعه کردم',
        mismatch: 'امضا باید با نام کامل درج‌شده در حساب مطابقت داشته باشد.',
      };

  const signatureMatches =
    fullName.trim().length >= 2 &&
    signatureName.trim().toLocaleLowerCase() === fullName.trim().toLocaleLowerCase();

  const downloadCopy = () => {
    const signedLine = currentLang === 'en'
      ? `\n\nElectronic signature: ${signatureName || '[not signed yet]'}`
      : currentLang === 'ps'
      ? `\n\nبرېښنایي لاسلیک: ${signatureName || '[لا نه دی لاسلیک شوی]'}`
      : `\n\nامضای الکترونیکی: ${signatureName || '[هنوز امضا نشده]'}`;

    const blob = new Blob([agreement + signedLine], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `NAWBAT-Registration-Agreement-${REGISTRATION_AGREEMENT_VERSION}.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-[90] bg-black/60 backdrop-blur-sm p-3 sm:p-6 flex items-center justify-center">
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="w-full max-w-4xl max-h-[92vh] bg-white rounded-2xl overflow-hidden shadow-2xl border border-[#003a2f]/15 flex flex-col"
      >
        <div className="flex items-center justify-between gap-4 px-5 sm:px-6 py-4 bg-[#003a2f] text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#afefdc]" />
            </div>
            <div>
              <h2 className="font-serif text-lg sm:text-xl font-bold">{labels.title}</h2>
              <p className="text-[11px] text-white/70 mt-0.5">
                {labels.version}: {REGISTRATION_AGREEMENT_VERSION}
              </p>
            </div>
          </div>
          <button type="button" onClick={onClose} className="p-2 rounded-lg hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto p-5 sm:p-6">
          <div className="flex justify-end mb-4">
            <button
              type="button"
              onClick={downloadCopy}
              className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-[#0b5345]/25 text-[#0b5345] text-xs font-bold hover:bg-[#eef8f4]"
            >
              <Download className="w-4 h-4" />
              {labels.download}
            </button>
          </div>

          <pre className="whitespace-pre-wrap font-sans text-xs sm:text-sm leading-7 text-[#33413c] bg-[#f8faf9] border border-[#dfe7e3] rounded-xl p-4 sm:p-5">
            {agreement}
          </pre>

          <div className="mt-5 rounded-xl border border-[#d7e3dd] bg-white p-4">
            <div className="flex items-center gap-2 text-[#003a2f] font-bold text-sm">
              <PenLine className="w-4 h-4" />
              <span>{labels.signature}</span>
            </div>
            <p className="text-xs text-[#66736e] mt-1.5">{labels.signatureHint}</p>
            <input
              type="text"
              value={signatureName}
              onChange={(e) => onSignatureChange(e.target.value)}
              placeholder={fullName || labels.signature}
              className="mt-3 w-full border border-[#cbd8d2] rounded-xl px-3 py-3 text-sm outline-none focus:border-[#0b5345]"
            />
            {signatureName && !signatureMatches && (
              <p className="text-xs text-[#9b1c1c] mt-2">{labels.mismatch}</p>
            )}
          </div>
        </div>

        <div className="border-t border-[#e1e7e4] px-5 sm:px-6 py-4 bg-[#fbfdfc] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-[#53615b]">
            <ShieldCheck className="w-4 h-4 text-[#0b5345]" />
            <span>{labels.version}: {REGISTRATION_AGREEMENT_VERSION}</span>
          </div>
          <button
            type="button"
            disabled={!signatureMatches}
            onClick={onReviewed}
            className="bg-[#003a2f] hover:bg-[#0b5345] disabled:opacity-45 disabled:cursor-not-allowed text-white px-5 py-3 rounded-xl text-sm font-bold"
          >
            {labels.acknowledge}
          </button>
        </div>
      </div>
    </div>
  );
};
