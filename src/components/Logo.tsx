import React from 'react';

interface LogoProps {
  variant?: 'nawbat' | 'mazayeda' | 'combined';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ variant = 'combined', className = '', size = 'md' }) => {
  // Hotlinked official Nawbat logo from prompt
  const nawbatImgUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYW7pYX71wjXvPlTgFbT-opX9UwEpjohbKiOd-AH_Sygbexb-eBRgNCAcAjGoZDCH4CI7L1DUp4d4oDlWL9KIqPdJDwnvEee5eVZuforOrSnadLkvqP1LzHUsMbzt6OFxulNpGFRDEVLRUxJdjR4Ru1Gxfot1Tr7uzTEXPQzp_vlg8eYDnfyYhU_gvkc5e6g6ss6Up8EWxGX5_uQ62PVKhgpm6W_5wc0phTU4HUXe-TIIXv41m1qKQ49CzKcfSYY5UzA';

  const heights = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
  };

  if (variant === 'mazayeda') {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        {/* Mazayeda Gavel in Arch Icon */}
        <div className="w-9 h-9 rounded-lg bg-[#003a2f] flex items-center justify-center p-1 shadow-sm">
          <svg viewBox="0 0 100 100" className="w-full h-full" fill="none">
            {/* Islamic Arch Outline */}
            <path
              d="M 20 90 L 20 45 C 20 25 50 10 50 10 C 50 10 80 25 80 45 L 80 90 Z"
              stroke="#afefdc"
              strokeWidth="5"
              fill="none"
            />
            {/* Geometric Gold Gavel */}
            <rect x="40" y="32" width="28" height="16" rx="2" transform="rotate(-30 40 32)" fill="#ecc22c" stroke="#ffe085" strokeWidth="2" />
            <rect x="34" y="44" width="8" height="38" rx="2" transform="rotate(-30 34 44)" fill="#ecc22c" stroke="#ffe085" strokeWidth="2" />
            <circle cx="50" cy="40" r="3" fill="#ffffff" />
          </svg>
        </div>
        <div className="flex flex-col">
          <span className="font-serif font-bold text-sm tracking-wide text-[#003a2f]">مزایده | MAZAYEDA</span>
          <span className="text-[10px] text-[#326286] font-medium">پلتفرم حراج الکترونیک افغانستان</span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <img
        src={nawbatImgUrl}
        alt="NAWBAT Logo"
        className={`${heights[size]} w-auto object-contain drop-shadow-sm`}
        referrerPolicy="no-referrer"
        onError={(e) => {
          // Graceful fallback to styled brand mark if image fails
          (e.currentTarget as HTMLElement).style.display = 'none';
        }}
      />
      <div className="flex flex-col">
        <div className="flex items-center gap-1.5">
          <span className="font-serif text-lg font-bold text-[#003a2f] tracking-tight">نوبت افغانستان</span>
          <span className="text-xs text-[#707975] font-light">|</span>
          <span className="font-mono text-sm font-bold text-[#326286] tracking-wider">NAWBAT</span>
        </div>
        <span className="hidden xl:inline text-[#3f4945] text-xs font-normal">
          بزرگترین پلتفرم مزایده‌های معتبر و تضمین شده افغانستان
        </span>
      </div>
    </div>
  );
};
