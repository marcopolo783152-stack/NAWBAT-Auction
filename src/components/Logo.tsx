import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showTagline?: boolean;
  light?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
  light = false,
}) => {
  const iconSizes = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20 sm:w-24 sm:h-24',
  };

  const titleSizes = {
    sm: 'text-base',
    md: 'text-lg',
    lg: 'text-xl sm:text-2xl',
    xl: 'text-3xl sm:text-4xl lg:text-5xl',
  };

  const primary = light ? 'text-white' : 'text-[#003a2f]';
  const secondary = light ? 'text-[#d8fff2]' : 'text-[#326286]';
  const muted = light ? 'text-white/70' : 'text-[#5c6964]';

  return (
    <div className={`inline-flex items-center gap-3 sm:gap-4 ${className}`}>
      <div className={`${iconSizes[size]} shrink-0`}>
        <svg viewBox="0 0 96 96" role="img" aria-label="NAWBAT" className="w-full h-full drop-shadow-sm">
          <defs>
            <linearGradient id="nawbatGold" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#f0c84a" />
              <stop offset="100%" stopColor="#b98d00" />
            </linearGradient>
            <linearGradient id="nawbatGreen" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#0b5f50" />
              <stop offset="100%" stopColor="#003a2f" />
            </linearGradient>
          </defs>
          <path d="M18 84V42c0-18 14-31 30-31s30 13 30 31v42" fill="none" stroke="url(#nawbatGreen)" strokeWidth="8" strokeLinecap="round" />
          <path d="M31 67V39l17 17 17-17v28" fill="none" stroke="url(#nawbatGold)" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="48" cy="24" r="5" fill="#afefdc" stroke="#003a2f" strokeWidth="3" />
          <path d="M25 83h46" stroke="#003a2f" strokeWidth="6" strokeLinecap="round" />
        </svg>
      </div>

      <div className="flex flex-col min-w-0">
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className={`font-serif font-black tracking-tight ${titleSizes[size]} ${primary}`}>نوبت</span>
          <span className={`font-sans font-black tracking-[0.14em] ${size === 'xl' ? 'text-xl sm:text-2xl lg:text-3xl' : size === 'lg' ? 'text-base sm:text-lg' : 'text-sm'} ${secondary}`}>NAWBAT</span>
        </div>
        {showTagline && (
          <span className={`${size === 'xl' ? 'text-sm sm:text-base mt-1' : 'text-[10px] sm:text-xs'} font-medium ${muted}`}>
            بازار آنلاین مزایده افغانستان
          </span>
        )}
      </div>
    </div>
  );
};
