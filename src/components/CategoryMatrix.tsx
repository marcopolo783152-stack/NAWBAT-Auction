import React from 'react';
import { CategoryId, Language } from '../types/auction';
import { translations } from '../translations';
import { Car, Sparkles, Gem, Tractor, Landmark, Smartphone, ArrowLeft, ArrowRight } from 'lucide-react';

interface CategoryMatrixProps {
  currentLang: Language;
  onSelectCategory: (category: CategoryId) => void;
}

export const CategoryMatrix: React.FC<CategoryMatrixProps> = ({ currentLang, onSelectCategory }) => {
  const t = translations[currentLang];
  const isRtl = currentLang !== 'en';

  const categories = [
    {
      id: 'cars' as CategoryId,
      title: 'موترها و وسایط نقلیه',
      titleEn: 'Motor Vehicles & Heavy Transport',
      titlePs: 'موټر او درانه وسایط',
      desc: 'انواع موترهای سواری کرولا، فوررانر، لندکروز، باربری و موترسایکل با اسناد ترافیکی پاک',
      descEn: 'Toyota Corolla, Land Cruiser, 4Runner, Hilux and transport vehicles with clean papers.',
      count: '148 مزایده فعال',
      icon: Car,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXrb-z2Qv6ECzBcdp4f6JTJQQh1DYVqx89lOLOOoVbkqeHM_mkCnNY7_K6IMPgf9qETqp783LVXvNSfL2-fLjLe5yNJYCMHgrLz0_Zn-xt719UYEoWWWrHGkl5yPqsFr61JgFzNEsbpIm28NbGIvjMOxeBtWBEJpMrFsOT6w70d0rW8SwS-tRrINqoMBWalxrIYWZTT6vT3-9RD6xTWawJioxwjiTnCWaCfeJr10HMcxuwj0om48vu',
      span: 'md:col-span-2',
    },
    {
      id: 'carpets' as CategoryId,
      title: 'قالین و گلیم‌های اصیل',
      titleEn: 'Authentic Carpets & Mauri Rugs',
      titlePs: 'اصیلې قالینې او لاسي اوبدل شوي ګلیمونه',
      desc: 'قالین‌های چوب‌رنگ، قزاق، موری، چوب‌باش و ابریشم هرات با شناسنامه بافنده',
      descEn: 'Hand-knotted Herat silk, Mauri Kazakh, and botanical vegetable dyed Afghan master rugs.',
      count: '92 مزایده فعال',
      icon: Sparkles,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHfNh-y8KSnfpXBiPiTyfYWBXgTjraa-ZY-MALG5PVjNwvbG-zrzGzbX-qvLVnz5yAsESSfyXpNlsxMWqSKv4MZThs1EvcvrBLkZCW66IU8V8z5kNSDOcdlRMOHIYINwSFwVc9DK-c6ytJv7mKLldiAsGLLlScG6lCO3hQkKaUN0y0IMULnp9zZOdau-YREJQyzu7XBDUrg9JTl78f8xDQfrrYlSmSo1XmkVvsLmwQ_Nj_ZtBDXDMm',
      span: 'md:col-span-2',
    },
    {
      id: 'jewelry' as CategoryId,
      title: 'طلا، لاجورد و زمرد پنجشیر',
      titleEn: 'Panjshir Emeralds, Lapis & Gold',
      titlePs: 'د پنجشیر زمرد، بدخشان لاجورد او طلا',
      desc: 'سنگ‌های قیمتی دارای سرتیفیکیت عیارسنجی رسمی، طلاجات و کلکسیون‌های ساعت',
      descEn: 'Certified Panjshir emerald crystals, Badakhshan royal lapis, gold bullion & luxury timepieces.',
      count: '63 مزایده فعال',
      icon: Gem,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuASqVD51D1pWxPs_zCCEFja5JCDXLJmDxEUhQY4ran-zET3CdDW_qYwO3JzTSm9V2T7JeZfIqoEDZtvlNoGda4hdUs0S0gWtpGNBmN3xDnJ9QBwPuGlHvO2Qrr0UAOgFLNJtcB0WZMwc0YOSW6wWtrwANoKpTGLiWal3WX1TpvjBiPUcaoM1vJ4IY2aKLAaH5yiXF5_GpU5Yt0_el9X7M_QcENm4RNpX7E82B7Z94b4f0JBfBzNjuom',
      span: 'md:col-span-2',
    },
    {
      id: 'machinery' as CategoryId,
      title: 'ماشین‌آلات زراعتی و صنعتی',
      titleEn: 'Agricultural & Heavy Machinery',
      titlePs: 'کرنیز او صنعتي درانه ماشینونه',
      desc: 'تراکتور، جنراتورهای دیزلی، تجهیزات آبرسانی و تجهیزات سولری صنعتی',
      descEn: 'Tractors, heavy diesel generators, solar hybrid stations, and industrial processing units.',
      count: '38 مزایده فعال',
      icon: Tractor,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDATs-X3PPAHb5cCDeLuTDKdmN49LfaIJEUFj8HgwOJCLl0ieW4UVik1XPqSJCQ1JMh2cKHGzmQ_BmAJKh-yCwsoQUElLulmMbDZKrEShwbvUZoDYuVPrHWSL75ARJ07mT5BPdye1nyCZXGoaD7n87hJB7c3yxg5PgH33740m0gdIBW2BFTV8_erhu5AKU-OgrXWctbnc-tM-FQj7fkmMkI4RXKyWjzJWMD7uQFpKK_Fcd7D6UoKCo7',
      span: 'md:col-span-2',
    },
    {
      id: 'antiques' as CategoryId,
      title: 'عتیقه‌جات و آثار تاریخی مجاز',
      titleEn: 'Permitted Antiques & Cultural Heirlooms',
      titlePs: 'تاریخي اثار او قانوني عتیقې',
      desc: 'ظروف مسین قدیمی، خطاطی‌های نفیس، صندوق‌های نورستانی با مجوز قانونی',
      descEn: 'Antique copper samovars, calligraphic manuscripts, and 18th century Nuristani cedar chests.',
      count: '27 مزایده فعال',
      icon: Landmark,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCgfm8DBsvmarbCXu6idPSInET1cICRgF4NHg1jUt76wNRXWc69Oxtq3GEazX1C7PI07lb50GOpprjqn7piaKFnjnuO5Y0pyVIcBOlckvVpdx2b2f6I7kovtXYLDincpHLIpddC0Drg0jlRwIiOVV5ruur0VYwVttqWlxDGVCSXQgIymG1k9XdwZBYgraYqcEDNLk6Wg4re5V9GhCCK_70YJfJvx4XPrZHKVrNGbo6RleVDtUwa9Rd5',
      span: 'md:col-span-2',
    },
    {
      id: 'electronics' as CategoryId,
      title: 'موبایل و وسایل الکترونیکی',
      titleEn: 'Consumer Electronics & Mobile Devices',
      titlePs: 'ګرځنده موبایلونه او الکټرونیکي توکي',
      desc: 'گوشی‌های آیفون و سامسونگ، لپ‌تاپ‌های کاری و تجهیزات شبکه با تست سلامت',
      descEn: 'Factory sealed smartphones, enterprise laptops, network hardware with warranty check.',
      count: '114 مزایده فعال',
      icon: Smartphone,
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA368Qf-0yEwm1UVaavVxNPMrLGxNoi1zS3xcO7G01R-dPr_2KkxHtmwt5hbn5g2--h_qfv3Sn_V_QALtLkPTC6BfMuKc9hMFSUM8iuRB9BYpx3xIMm64ZHtr7-aHeEG0Qdfn5bPISv6RDdhZhD8fPh2YBC2snVaz4xr6nejY8k0nVfdt-syGvy0GLJc0xq2or_jJ9lPqkhSBkieum9Ubu0REBf60NPT0_ZsWqaY4UaBVSIXzIU6oxB',
      span: 'md:col-span-2',
    },
  ];

  return (
    <section className="w-full px-4 lg:px-8 py-10 lg:py-16 bg-[#f7f9ff] border-b border-[#003a2f]/10">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-[#326286] tracking-wide block mb-1">
              {t.categoriesHeaderSub}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#111d27]">
              {t.categoriesHeaderTitle}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#3f4945] max-w-md leading-relaxed">
            {t.categoriesHeaderDesc}
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
          {categories.map((cat) => {
            const IconComponent = cat.icon;
            return (
              <div
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`${cat.span} group relative rounded-xl overflow-hidden h-72 shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-end p-5 text-white cursor-pointer border border-[#003a2f]/10`}
              >
                {/* Background Image with Zoom */}
                <div
                  className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700"
                  style={{ backgroundImage: `url('${cat.imageUrl}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003a2f] via-[#003a2f]/60 to-transparent" />

                {/* Content Overlay */}
                <div className="relative z-10 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[11px] font-medium text-[#afefdc]">
                      <IconComponent className="w-3.5 h-3.5" />
                      {cat.count}
                    </span>
                    <span className="w-7 h-7 rounded-full bg-white/20 group-hover:bg-[#afefdc] text-white group-hover:text-[#003a2f] flex items-center justify-center transition-colors">
                      {isRtl ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold mb-1 text-white group-hover:text-[#afefdc] transition-colors">
                    {currentLang === 'en' ? cat.titleEn : currentLang === 'ps' ? cat.titlePs : cat.title}
                  </h3>

                  <p className="text-xs text-[#dde9f9] line-clamp-2 leading-relaxed font-light">
                    {currentLang === 'en' ? cat.descEn : cat.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
