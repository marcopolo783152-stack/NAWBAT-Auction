import React, { useState, useEffect } from 'react';
import { AuctionLot, CategoryId, Language, Province } from '../types/auction';
import { adminApi } from '../services/adminApi';
import { 
  ShieldCheck, 
  Plus, 
  Trash2, 
  Clock, 
  TrendingUp, 
  DollarSign, 
  Users, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  LogOut, 
  Search, 
  Filter, 
  Edit3, 
  Lock,
  ArrowUpRight,
  Gavel,
  RefreshCw,
  ExternalLink,
  Tag,
  Car,
  Sparkles,
  Building,
  UserCheck,
  UserX,
  CreditCard,
  QrCode,
  AlertOctagon,
  Scale,
  Package,
  Layers,
  Settings,
  History,
  FileCheck,
  Eye,
  Check,
  X,
  Send,
  HelpCircle,
  Truck,
  FileSpreadsheet,
  BadgeAlert,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';

interface AdminDashboardProps {
  lots: AuctionLot[];
  onAddLot: (lot: AuctionLot) => void;
  onDeleteLot: (lotId: string) => void;
  onExtendTime: (lotId: string) => void;
  onLogout: () => void;
  currentLang: Language;
}

type AdminSection = 
  | 'overview' 
  | 'users' 
  | 'staff' 
  | 'auctions' 
  | 'sellers' 
  | 'buyers' 
  | 'kyc' 
  | 'finance' 
  | 'fraud' 
  | 'disputes' 
  | 'logistics' 
  | 'cms' 
  | 'settings' 
  | 'audit';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lots,
  onAddLot,
  onDeleteLot,
  onExtendTime,
  onLogout,
  currentLang,
}) => {
  const isRtl = currentLang !== 'en';
  const [activeSection, setActiveSection] = useState<AdminSection>('overview');

  // Selected staff role simulation
  const [currentStaffRole, setCurrentStaffRole] = useState<'SuperAdmin' | 'Admin' | 'KycOfficer' | 'FinanceOfficer' | 'Auctioneer' | 'Logistics'>('SuperAdmin');

  // Backend state
  const [overviewMetrics, setOverviewMetrics] = useState<any>(null);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [rolesList, setRolesList] = useState<any[]>([]);
  const [kycList, setKycList] = useState<any[]>([]);
  const [invoicesList, setInvoicesList] = useState<any[]>([]);
  const [ledgerList, setLedgerList] = useState<any[]>([]);
  const [fraudFlagsList, setFraudFlagsList] = useState<any[]>([]);
  const [disputesList, setDisputesList] = useState<any[]>([]);
  const [deliveriesList, setDeliveriesList] = useState<any[]>([]);
  const [auditLogsList, setAuditLogsList] = useState<any[]>([]);
  const [platformSettings, setPlatformSettings] = useState<any>({
    buyerPremiumPct: 5.0,
    sellerCommissionPct: 7.5,
    minDepositRequirementAFN: 50000,
    antiSnipingMinutes: 3,
    defaultAuctionDays: 7,
    hesabPayMerchantId: 'HESAB-AFG-99201',
    hesabPaySandboxMode: false,
    autoFlagShillBids: true,
    maintenanceMode: false,
  });

  // UI Modals & Filters
  const [selectedUserDetail, setSelectedUserDetail] = useState<any>(null);
  const [selectedKycInspect, setSelectedKycInspect] = useState<any>(null);
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [disputeReplyText, setDisputeReplyText] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [userTypeFilter, setUserTypeFilter] = useState('all');
  const [auctionStatusFilter, setAuctionStatusFilter] = useState('all');
  const [qrCodeInput, setQrCodeInput] = useState('');
  const [qrScanResult, setQrScanResult] = useState<string | null>(null);
  const [notificationToast, setNotificationToast] = useState<string | null>(null);
  const [newAdminNote, setNewAdminNote] = useState('');

  // Create Lot Form State
  const [newTitle, setNewTitle] = useState('');
  const [newTitleEn, setNewTitleEn] = useState('');
  const [newCategory, setNewCategory] = useState<CategoryId>('cars');
  const [newProvince, setNewProvince] = useState<Province>('کابل');
  const [newStartingPrice, setNewStartingPrice] = useState(500000);
  const [newReservePrice, setNewReservePrice] = useState(650000);
  const [newMinIncrement, setNewMinIncrement] = useState(10000);
  const [newDurationHours, setNewDurationHours] = useState(24);
  const [newImageUrl, setNewImageUrl] = useState('https://lh3.googleusercontent.com/aida-public/AB6AXuBXrb-z2Qv6ECzBcdp4f6JTJQQh1DYVqx89lOLOOoVbkqeHM_mkCnNY7_K6IMPgf9qETqp783LVXvNSfL2-fLjLe5yNJYCMHgrLz0_Zn-xt719UYEoWWWrHGkl5yPqsFr61JgFzNEsbpIm28NbGIvjMOxeBtWBEJpMrFsOT6w70d0rW8SwS-tRrINqoMBWalxrIYWZTT6vT3-9RD6xTWawJioxwjiTnCWaCfeJr10HMcxuwj0om48vu');
  const [newInspector, setNewInspector] = useState('انجنیر فاروق رحمانی (آمریت ترافیک کابل)');
  const [newGrade, setNewGrade] = useState<'A+' | 'A' | 'B+' | 'B'>('A+');
  const [formSuccess, setFormSuccess] = useState(false);

  // Load initial backend data
  const loadData = async () => {
    try {
      const [overview, users, roles, kyc, invoices, ledger, fraud, disputes, logistics, logs, settings] = await Promise.all([
        adminApi.getOverview(),
        adminApi.getUsers(),
        adminApi.getRoles(),
        adminApi.getKycCases(),
        adminApi.getInvoices(),
        adminApi.getLedger(),
        adminApi.getFraudFlags(),
        adminApi.getDisputes(),
        adminApi.getLogistics(),
        adminApi.getAuditLogs(),
        adminApi.getSettings(),
      ]);

      if (overview?.metrics) setOverviewMetrics(overview.metrics);
      if (users?.length) setUsersList(users);
      if (roles?.length) setRolesList(roles);
      if (kyc?.length) setKycList(kyc);
      if (invoices?.length) setInvoicesList(invoices);
      if (ledger?.length) setLedgerList(ledger);
      if (fraud?.length) setFraudFlagsList(fraud);
      if (disputes?.length) setDisputesList(disputes);
      if (logistics?.length) setDeliveriesList(logistics);
      if (logs?.length) setAuditLogsList(logs);
      if (settings) setPlatformSettings(settings);
    } catch {
      // Fallback in-memory defaults
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const showToast = (msg: string) => {
    setNotificationToast(msg);
    setTimeout(() => setNotificationToast(null), 3500);
  };

  // Helper actions
  const handleToggleUserStatus = async (user: any) => {
    const nextStatus = user.status === 'active' ? 'suspended' : 'active';
    await adminApi.updateUser(user.id, { status: nextStatus });
    setUsersList(usersList.map(u => u.id === user.id ? { ...u, status: nextStatus } : u));
    if (selectedUserDetail?.id === user.id) {
      setSelectedUserDetail({ ...selectedUserDetail, status: nextStatus });
    }
    showToast(`وضعیت حساب کاربری به ${nextStatus === 'active' ? 'فعال' : 'معلق'} تغییر یافت.`);
  };

  const handleToggleBiddingBlock = async (user: any) => {
    const nextBlock = !user.isBiddingBlocked;
    await adminApi.updateUser(user.id, { isBiddingBlocked: nextBlock });
    setUsersList(usersList.map(u => u.id === user.id ? { ...u, isBiddingBlocked: nextBlock } : u));
    if (selectedUserDetail?.id === user.id) {
      setSelectedUserDetail({ ...selectedUserDetail, isBiddingBlocked: nextBlock });
    }
    showToast(`حق پیشنهاددهی کاربر ${nextBlock ? 'مسدود گردید ⛔' : 'فعال شد ✓'}`);
  };

  const handleToggleSellingBlock = async (user: any) => {
    const nextBlock = !user.isSellingBlocked;
    await adminApi.updateUser(user.id, { isSellingBlocked: nextBlock });
    setUsersList(usersList.map(u => u.id === user.id ? { ...u, isSellingBlocked: nextBlock } : u));
    if (selectedUserDetail?.id === user.id) {
      setSelectedUserDetail({ ...selectedUserDetail, isSellingBlocked: nextBlock });
    }
    showToast(`حق فروش و ثبت لوط کاربر ${nextBlock ? 'مسدود گردید ⛔' : 'فعال شد ✓'}`);
  };

  const handleAddUserNote = async () => {
    if (!newAdminNote.trim() || !selectedUserDetail) return;
    await adminApi.updateUser(selectedUserDetail.id, { newNote: newAdminNote });
    const updatedNotes = [
      { id: `n-${Date.now()}`, author: 'انجنیر احسان حق‌پال', note: newAdminNote, timestamp: 'هم‌اکنون' },
      ...(selectedUserDetail.internalNotes || [])
    ];
    setSelectedUserDetail({ ...selectedUserDetail, internalNotes: updatedNotes });
    setNewAdminNote('');
    showToast('یادداشت محرمانه اداری ثبت گردید ✓');
  };

  const handleKycDecision = async (id: string, decision: 'approved' | 'rejected' | 'resubmission_requested', reason?: string) => {
    await adminApi.decideKyc(id, decision, reason);
    setKycList(kycList.map(k => k.id === id ? { ...k, status: decision, rejectionReason: reason } : k));
    showToast(`پرونده تذکره با موفقیت ${decision === 'approved' ? 'تایید شد ✓' : 'رد گردید ✕'}`);
    setSelectedKycInspect(null);
  };

  const handleExecutePayout = async (invoiceId: string) => {
    await adminApi.executePayout(invoiceId);
    setInvoicesList(invoicesList.map(i => i.id === invoiceId ? { ...i, paymentStatus: 'settled', settledAt: 'هم‌اکنون' } : i));
    showToast('تسویه مالی و واریز وجه فروشنده از طریق حساب‌پی اجرا شد ✓');
    loadData();
  };

  const handleIssueRefund = async (invoiceId: string) => {
    await adminApi.issueRefund(invoiceId, 'برگشت وجه به دستور اداره حکمیت');
    setInvoicesList(invoicesList.map(i => i.id === invoiceId ? { ...i, paymentStatus: 'refunded' } : i));
    showToast('مبلغ سپرده امانی به کیف‌پول خریدار عودت داده شد ✓');
    loadData();
  };

  const handleAuctionAction = async (lotId: string, action: string) => {
    await adminApi.executeAuctionAction(lotId, action);
    if (action === 'extend') {
      onExtendTime(lotId);
    }
    showToast(`عملیات ${action} بر روی مزایده اعمال گردید.`);
    loadData();
  };

  const handleVerifyQr = async () => {
    if (!qrCodeInput.trim()) return;
    const res = await adminApi.verifyQrRelease(qrCodeInput, qrCodeInput);
    if (res.success) {
      setQrScanResult(`تایید شد ✓ کالا با موفقیت به ${res.item.buyerName} تحویل داده شد.`);
      setDeliveriesList(deliveriesList.map(d => d.id === res.item.id ? { ...d, status: 'verified_released' } : d));
      showToast('رسید تحویل رسمی گدام صادر شد.');
    } else {
      setQrScanResult('کد کیوآر یا پین وارد شده نامعتبر است.');
    }
  };

  const handleCreateLot = async (e: React.FormEvent) => {
    e.preventDefault();
    const createdLot: any = {
      title: newTitle,
      titleEn: newTitleEn || newTitle,
      category: newCategory,
      categoryLabel: newCategory === 'cars' ? 'موترها و وسایط' : newCategory === 'carpets' ? 'قالین و صنایع دستی' : 'ماشین‌آلات و زراعت',
      province: newProvince,
      startingPriceAFN: Number(newStartingPrice),
      reservePriceAFN: Number(newReservePrice),
      minIncrementAFN: Number(newMinIncrement),
      durationHours: Number(newDurationHours),
      imageUrl: newImageUrl,
      inspectorName: newInspector,
      inspectionGrade: newGrade,
      status: 'live',
    };

    const res = await adminApi.createAuction(createdLot);
    if (res.success && res.lot) {
      onAddLot(res.lot);
      setFormSuccess(true);
      setNewTitle('');
      setNewTitleEn('');
      showToast('لوط جدید با موفقیت ایجاد و منتشر شد ✓');
      setTimeout(() => setFormSuccess(false), 3000);
      loadData();
    }
  };

  // Nav Items definition
  const sidebarItems: { id: AdminSection; labelFa: string; labelEn: string; icon: any; badge?: number }[] = [
    { id: 'overview', labelFa: 'داشبورد کل و شاخص‌ها', labelEn: 'Dashboard Overview', icon: TrendingUp },
    { id: 'users', labelFa: 'مدیریت کاربران و مشتریان', labelEn: 'User Management', icon: Users, badge: usersList.filter(u => u.status === 'suspended').length },
    { id: 'staff', labelFa: 'کادر اداری و دسترسی‌ها', labelEn: 'Staff & Roles', icon: ShieldCheck },
    { id: 'auctions', labelFa: 'عملیات مزایده‌ها و تاییدات', labelEn: 'Auction Operations', icon: Gavel, badge: lots.filter(l => l.isClosingSoon).length },
    { id: 'sellers', labelFa: 'فروشندگان و تسویه‌ها', labelEn: 'Seller Management', icon: Building },
    { id: 'buyers', labelFa: 'خریداران و سپرده‌ها', labelEn: 'Buyer Management', icon: UserCheck },
    { id: 'kyc', labelFa: 'مرکز تایید هویت و تذکره', labelEn: 'KYC & Tazkira', icon: FileCheck, badge: kycList.filter(k => k.status === 'pending').length },
    { id: 'finance', labelFa: 'امور مالی و حساب‌پی', labelEn: 'Finance & HesabPay', icon: CreditCard },
    { id: 'fraud', labelFa: 'ضد تقلب و ریسک', labelEn: 'Fraud & Security', icon: AlertOctagon, badge: fraudFlagsList.filter(f => f.status === 'investigating').length },
    { id: 'disputes', labelFa: 'مرکز شکایات و حکمیت', labelEn: 'Disputes & Support', icon: Scale, badge: disputesList.filter(d => d.status === 'under_review').length },
    { id: 'logistics', labelFa: 'تحویل‌دهی و اسکن QR', labelEn: 'Logistics & QR Release', icon: QrCode },
    { id: 'cms', labelFa: 'مدیریت محتوا و اعلانات', labelEn: 'Content & CMS', icon: Layers },
    { id: 'settings', labelFa: 'تنظیمات قوانین و کارمزد', labelEn: 'Platform Settings', icon: Settings },
    { id: 'audit', labelFa: 'گزارش حسابرسی امنیتی', labelEn: 'Audit Trail', icon: History },
  ];

  return (
    <div className={`w-full min-h-screen bg-[#f4f7f6] text-[#111d27] font-sans flex flex-col ${isRtl ? 'rtl' : 'ltr'}`}>
      
      {/* Toast Notification */}
      {notificationToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-[#003a2f] text-white px-6 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-[#afefdc]/30 text-sm font-bold animate-in fade-in slide-in-from-top-4">
          <Sparkles className="w-4 h-4 text-[#afefdc]" />
          <span>{notificationToast}</span>
        </div>
      )}

      {/* Top Admin Header Bar */}
      <header className="w-full bg-[#003a2f] text-white px-4 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-4 shadow-md sticky top-0 z-40 border-b border-[#afefdc]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#afefdc] text-[#003a2f] flex items-center justify-center font-black text-lg shadow-sm">
            ن
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base tracking-tight text-white">
                سامانه جامع مدیریت و نظارت ملی نوبت
              </h1>
              <span className="bg-[#afefdc]/20 text-[#afefdc] text-[10px] font-bold px-2 py-0.5 rounded-full border border-[#afefdc]/30">
                Enterprise 2.5
              </span>
            </div>
            <p className="text-xs text-[#afefdc]/80 font-mono">
              NAWBAT National Auction Executive Operations & Escrow Ledger
            </p>
          </div>
        </div>

        {/* System Heartbeat & Active Role Selector */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="hidden md:flex items-center gap-2 bg-[#0b5345] px-3 py-1.5 rounded-lg border border-[#afefdc]/20 text-xs">
            <span className="w-2 h-2 rounded-full bg-[#afefdc] animate-pulse" />
            <span className="text-[#afefdc] font-mono font-semibold">HesabPay Escrow: Connected</span>
            <span className="text-white/40">|</span>
            <span className="text-[#afefdc] font-mono font-semibold">Anti-Snip: Active (3m)</span>
          </div>

          {/* Role Switcher for Testing Full RBAC */}
          <div className="flex items-center gap-1.5 bg-[#0b5345] px-2.5 py-1 rounded-lg border border-[#afefdc]/20 text-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#afefdc]" />
            <span className="text-white/70 text-[11px]">نقش اداری:</span>
            <select
              value={currentStaffRole}
              onChange={(e) => {
                setCurrentStaffRole(e.target.value as any);
                showToast(`نقش اداری به ${e.target.value} تغییر یافت.`);
              }}
              className="bg-transparent text-white font-bold text-xs focus:outline-none cursor-pointer"
            >
              <option value="SuperAdmin" className="text-[#111d27]">انجنیر احسان حق‌پال (Super Admin)</option>
              <option value="KycOfficer" className="text-[#111d27]">فریحه سادات (KYC Officer)</option>
              <option value="FinanceOfficer" className="text-[#111d27]">محمد بشیر پویا (Finance Officer)</option>
              <option value="Auctioneer" className="text-[#111d27]">احمد نوید (Auctioneer)</option>
              <option value="Logistics" className="text-[#111d27]">وحیدالله (Logistics Officer)</option>
            </select>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 bg-red-600/90 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>خروج از پنل</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace Container */}
      <div className="flex-1 w-full max-w-7xl mx-auto p-4 lg:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left / Right Sidebar (Collapsible on mobile) */}
        <aside className="lg:col-span-3 flex flex-col gap-2 bg-white rounded-2xl p-3 border border-[#003a2f]/10 shadow-xs h-fit sticky top-20">
          <div className="px-3 py-2 text-xs font-bold text-[#707975] uppercase tracking-wider border-b border-[#003a2f]/10">
            بخش‌های مدیریتی (Administration)
          </div>

          <nav className="flex flex-col gap-1 mt-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all text-right cursor-pointer ${
                    isActive
                      ? 'bg-[#003a2f] text-[#afefdc] shadow-sm'
                      : 'text-[#3f4945] hover:bg-[#f1f7f5] hover:text-[#003a2f]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#afefdc]' : 'text-[#707975]'}`} />
                    <span>{item.labelFa}</span>
                  </div>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive ? 'bg-[#afefdc] text-[#003a2f]' : 'bg-red-100 text-red-700'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick Refresh */}
          <button
            onClick={() => {
              loadData();
              showToast('داده‌های زنده از دیتابیس پشتیبان بازخوانی شدند.');
            }}
            className="mt-3 flex items-center justify-center gap-2 text-xs text-[#003a2f] hover:bg-[#f1f7f5] p-2 rounded-xl transition-colors font-medium cursor-pointer border border-[#003a2f]/10"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>همگام‌سازی دیتابیس زنده</span>
          </button>
        </aside>

        {/* Center Main Stage Content */}
        <main className="lg:col-span-9 flex flex-col gap-6">

          {/* ============================================================== */}
          {/* 1. OVERVIEW & KPI METRICS */}
          {/* ============================================================== */}
          {activeSection === 'overview' && (
            <div className="flex flex-col gap-6 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl border border-[#003a2f]/10 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-[#003a2f]">خلاصه عملکرد اجرایی و مالی پلتفرم</h2>
                  <p className="text-xs text-[#707975] mt-0.5">
                    گزارش کلی کاربران، مزایده‌های جاری، تسویه‌های حساب‌پی و هشدارهای ریسک
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveSection('auctions')}
                    className="bg-[#003a2f] hover:bg-[#0b5345] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ایجاد مزایده جدید</span>
                  </button>
                  <button
                    onClick={() => setActiveSection('kyc')}
                    className="bg-[#ecf4ff] hover:bg-[#dde9f9] text-[#003a2f] text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 border border-[#003a2f]/10 cursor-pointer"
                  >
                    <FileCheck className="w-3.5 h-3.5 text-[#326286]" />
                    <span>بررسی تذکره‌ها ({kycList.filter(k => k.status === 'pending').length})</span>
                  </button>
                </div>
              </div>

              {/* 12 Key Performance Indicator Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {[
                  { label: 'مجموع کل کاربران', value: overviewMetrics?.totalUsers || usersList.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
                  { label: 'خریداران تایید شده', value: overviewMetrics?.verifiedBuyers || usersList.filter(u => u.userType === 'buyer' && u.kycStatus === 'verified').length, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                  { label: 'فروشندگان و شرکت‌ها', value: overviewMetrics?.verifiedSellers || usersList.filter(u => (u.userType === 'seller' || u.userType === 'business') && u.kycStatus === 'verified').length, icon: Building, color: 'text-purple-600', bg: 'bg-purple-50' },
                  { label: 'مزایده‌های فعال (Live)', value: overviewMetrics?.activeAuctions || lots.length, icon: Gavel, color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'مزایده‌های رو به اختتام', value: overviewMetrics?.auctionsEndingToday || lots.filter(l => l.isClosingSoon).length, icon: Clock, color: 'text-rose-600', bg: 'bg-rose-50' },
                  { label: 'مجموع پیشنهادات ثبت‌شده', value: overviewMetrics?.totalBids || lots.reduce((a, b) => a + (b.totalBids || 0), 0), icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
                  { label: 'تراکنش‌های تایید شده', value: overviewMetrics?.payments || invoicesList.length, icon: CreditCard, color: 'text-cyan-600', bg: 'bg-cyan-50' },
                  { label: 'تسویه‌های در انتظار (AFN)', value: `${((overviewMetrics?.pendingPayoutsAFN || 1820000) / 1000).toLocaleString('en-US')}k`, icon: DollarSign, color: 'text-orange-600', bg: 'bg-orange-50' },
                  { label: 'شکایات تحت داوری', value: overviewMetrics?.disputes || disputesList.filter(d => d.status === 'under_review').length, icon: Scale, color: 'text-red-600', bg: 'bg-red-50' },
                  { label: 'هشدارهای کشف تقلب', value: overviewMetrics?.fraudAlerts || fraudFlagsList.filter(f => f.status === 'investigating').length, icon: AlertOctagon, color: 'text-red-700', bg: 'bg-red-100' },
                  { label: 'تذکره‌های در نوبت تایید', value: overviewMetrics?.kycWaitingReview || kycList.filter(k => k.status === 'pending').length, icon: FileCheck, color: 'text-amber-700', bg: 'bg-amber-100' },
                  { label: 'درآمد خالص پلتفرم (AFN)', value: `${((overviewMetrics?.revenueAFN || 120625) / 1000).toLocaleString('en-US')}k`, icon: Sparkles, color: 'text-[#003a2f]', bg: 'bg-[#afefdc]/30' },
                ].map((kpi, idx) => {
                  const Icon = kpi.icon;
                  return (
                    <div key={idx} className="bg-white p-4 rounded-xl border border-[#003a2f]/10 shadow-xs flex flex-col justify-between">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold text-[#707975]">{kpi.label}</span>
                        <div className={`p-2 rounded-lg ${kpi.bg}`}>
                          <Icon className={`w-4 h-4 ${kpi.color}`} />
                        </div>
                      </div>
                      <div className="mt-2 text-xl font-black font-mono text-[#003a2f]">
                        {kpi.value}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Escrow Guarantee Summary Banner */}
              <div className="bg-gradient-to-r from-[#003a2f] to-[#0b5345] text-white p-5 rounded-2xl shadow-sm border border-[#afefdc]/20 flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-[#afefdc]" />
                    <span className="font-extrabold text-sm text-[#afefdc]">
                      وضعیت قفل سپرده امانی حساب‌پی (Escrow Ledger Protection)
                    </span>
                  </div>
                  <p className="text-xs text-white/80 mt-1 max-w-xl leading-relaxed">
                    تمامی وجوه واریزی خریداران بر اساس قانون تجارت الکترونیک افغانستان در حساب واسط تضمین‌شده حساب‌پی مسدود است و تنها پس از اسکن کیوآر تحویل کالا به حساب فروشنده واریز می‌شود.
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs text-white/70 block">مجموع وجوه تحت حفاظت امانی:</span>
                  <span className="font-mono text-2xl font-black text-[#afefdc]">
                    14,850,000 AFN
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 2. USER MANAGEMENT */}
          {/* ============================================================== */}
          {activeSection === 'users' && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <div className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-[260px]">
                  <div className="relative flex-1">
                    <Search className="w-4 h-4 text-[#707975] absolute right-3 top-2.5 rtl:right-3 rtl:left-auto ltr:left-3 ltr:right-auto" />
                    <input
                      type="text"
                      placeholder="جستجو بر اساس نام، ایمیل، شماره تماس، یا شماره تذکره..."
                      value={userSearch}
                      onChange={(e) => setUserSearch(e.target.value)}
                      className="w-full bg-[#f7f9ff] border border-[#003a2f]/10 rounded-xl pr-9 pl-4 rtl:pr-9 rtl:pl-4 ltr:pl-9 ltr:pr-4 py-2 text-xs focus:outline-none focus:border-[#003a2f]"
                    />
                  </div>
                  <select
                    value={userTypeFilter}
                    onChange={(e) => setUserTypeFilter(e.target.value)}
                    className="bg-[#f7f9ff] border border-[#003a2f]/10 rounded-xl px-3 py-2 text-xs focus:outline-none"
                  >
                    <option value="all">همه انواع کاربران</option>
                    <option value="buyer">خریداران (Buyers)</option>
                    <option value="seller">فروشندگان (Sellers)</option>
                    <option value="business">شرکت‌ها و تاجران (Dealers)</option>
                    <option value="staff">کادر اداری (Staff)</option>
                  </select>
                </div>

                <button
                  onClick={() => {
                    const name = prompt('نام کامل کاربر جدید:');
                    const email = prompt('ایمیل:');
                    if (name && email) {
                      adminApi.createUser({ fullName: name, email, userType: 'buyer' }).then(() => {
                        showToast('کاربر جدید ثبت گردید.');
                        loadData();
                      });
                    }
                  }}
                  className="bg-[#003a2f] hover:bg-[#0b5345] text-white text-xs font-bold px-3.5 py-2 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ثبت کاربر جدید</span>
                </button>
              </div>

              {/* Users Table */}
              <div className="bg-white rounded-2xl border border-[#003a2f]/10 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right rtl:text-right ltr:text-left text-xs border-collapse">
                    <thead className="bg-[#f1f7f5] text-[#003a2f] font-bold text-[11px] border-b border-[#003a2f]/10">
                      <tr>
                        <th className="p-3">کاربر و هویت</th>
                        <th className="p-3">نوع حساب</th>
                        <th className="p-3">وضعیت تذکره</th>
                        <th className="p-3">موجودی کیف‌پول</th>
                        <th className="p-3">محدودیت‌ها</th>
                        <th className="p-3">وضعیت</th>
                        <th className="p-3 text-center">اقدامات مدیریتی</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#003a2f]/8">
                      {usersList
                        .filter(u => {
                          if (userTypeFilter !== 'all' && u.userType !== userTypeFilter) return false;
                          if (userSearch) {
                            const q = userSearch.toLowerCase();
                            return u.fullName.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.phone.includes(q);
                          }
                          return true;
                        })
                        .map((user) => (
                          <tr key={user.id} className="hover:bg-[#fbfdfe] transition-colors">
                            <td className="p-3">
                              <div className="flex flex-col">
                                <span className="font-bold text-[#111d27]">{user.fullName}</span>
                                <span className="text-[10px] text-[#707975] font-mono">{user.email} | {user.phone}</span>
                                <span className="text-[9px] text-[#326286] font-mono mt-0.5">تذکره: {user.tazkiraNumber}</span>
                              </div>
                            </td>
                            <td className="p-3">
                              <span className="font-bold text-[10px] bg-[#ecf4ff] text-[#326286] px-2 py-0.5 rounded">
                                {user.roleTitle || user.userType}
                              </span>
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                                user.kycStatus === 'verified'
                                  ? 'bg-[#afefdc]/30 text-[#003a2f]'
                                  : user.kycStatus === 'rejected'
                                  ? 'bg-red-100 text-red-700'
                                  : 'bg-amber-100 text-amber-700'
                              }`}>
                                {user.kycStatus === 'verified' ? 'تایید شده ✓' : user.kycStatus === 'rejected' ? 'رد شده ✕' : 'در انتظار بررسی'}
                              </span>
                            </td>
                            <td className="p-3 font-mono font-bold text-[#003a2f]">
                              {(user.balanceAFN || 0).toLocaleString('en-US')} AFN
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1">
                                {user.isBiddingBlocked && (
                                  <span className="bg-red-100 text-red-700 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                    بیدینگ مسدود
                                  </span>
                                )}
                                {user.isSellingBlocked && (
                                  <span className="bg-orange-100 text-orange-700 text-[9px] font-bold px-1.5 py-0.2 rounded">
                                    فروش مسدود
                                  </span>
                                )}
                                {!user.isBiddingBlocked && !user.isSellingBlocked && (
                                  <span className="text-emerald-700 text-[10px]">مجاز</span>
                                )}
                              </div>
                            </td>
                            <td className="p-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                user.status === 'active' ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'
                              }`}>
                                {user.status === 'active' ? 'فعال' : 'معلق'}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setSelectedUserDetail(user)}
                                  className="bg-[#003a2f] hover:bg-[#0b5345] text-white px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors cursor-pointer"
                                >
                                  پروفایل کامل
                                </button>
                                <button
                                  onClick={() => handleToggleUserStatus(user)}
                                  className={`px-2 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer ${
                                    user.status === 'active'
                                      ? 'bg-red-100 text-red-700 hover:bg-red-200'
                                      : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200'
                                  }`}
                                >
                                  {user.status === 'active' ? 'تعلیق' : 'فعال‌سازی'}
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* User Full Profile Drawer / Modal */}
          {selectedUserDetail && (
            <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl border border-[#003a2f]/20 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-[#003a2f]/10 pb-3">
                  <div className="flex items-center gap-2.5">
                    <UserCheck className="w-5 h-5 text-[#003a2f]" />
                    <h3 className="font-extrabold text-base text-[#003a2f]">
                      پروفایل و پرونده نظارتی: {selectedUserDetail.fullName}
                    </h3>
                  </div>
                  <button
                    onClick={() => setSelectedUserDetail(null)}
                    className="text-[#707975] hover:text-[#111d27] p-1 rounded-lg"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-[#f7f9ff] p-3 rounded-xl">
                    <span className="text-[#707975] block text-[10px]">ایمیل و تلفن:</span>
                    <span className="font-bold">{selectedUserDetail.email}</span>
                    <span className="block font-mono text-[11px] text-[#326286] mt-0.5">{selectedUserDetail.phone}</span>
                  </div>
                  <div className="bg-[#f7f9ff] p-3 rounded-xl">
                    <span className="text-[#707975] block text-[10px]">شماره تذکره الکترونیکی / جواز:</span>
                    <span className="font-mono font-bold">{selectedUserDetail.tazkiraNumber}</span>
                  </div>
                  <div className="bg-[#f7f9ff] p-3 rounded-xl">
                    <span className="text-[#707975] block text-[10px]">آی‌پی آخرین ورود و اثر انگشت دستگاه:</span>
                    <span className="font-mono text-[10px] text-[#707975] block">{selectedUserDetail.ipAddress}</span>
                    <span className="font-mono text-[9px] text-[#003a2f] block mt-0.5">{selectedUserDetail.deviceFingerprint}</span>
                  </div>
                  <div className="bg-[#f7f9ff] p-3 rounded-xl">
                    <span className="text-[#707975] block text-[10px]">موجودی قفل شده امانی:</span>
                    <span className="font-mono font-bold text-sm text-[#003a2f]">
                      {(selectedUserDetail.escrowLockedAFN || 0).toLocaleString('en-US')} AFN
                    </span>
                  </div>
                </div>

                {/* Administrative Fast Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#003a2f]/10">
                  <button
                    onClick={() => handleToggleUserStatus(selectedUserDetail)}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {selectedUserDetail.status === 'active' ? 'تعلیق حساب کاربری' : 'رفع تعلیق حساب'}
                  </button>
                  <button
                    onClick={() => handleToggleBiddingBlock(selectedUserDetail)}
                    className="bg-orange-600 hover:bg-orange-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {selectedUserDetail.isBiddingBlocked ? 'فعال‌سازی مجدد بیدینگ' : 'مسدودسازی بیدینگ (Block Bids)'}
                  </button>
                  <button
                    onClick={() => handleToggleSellingBlock(selectedUserDetail)}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    {selectedUserDetail.isSellingBlocked ? 'فعال‌سازی مجدد فروش' : 'مسدودسازی فروش (Block Selling)'}
                  </button>
                  <button
                    onClick={() => {
                      adminApi.updateUser(selectedUserDetail.id, { kycStatus: 'resubmit_required' }).then(() => {
                        showToast('درخواست ارسال مجدد مدارک هویتی برای کاربر ارسال شد.');
                        setSelectedUserDetail({ ...selectedUserDetail, kycStatus: 'resubmit_required' });
                      });
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                  >
                    ریست تاییدیه تذکره (Reset KYC)
                  </button>
                </div>

                {/* Internal Admin Notes */}
                <div className="border-t border-[#003a2f]/10 pt-3">
                  <h4 className="font-bold text-xs text-[#003a2f] mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    <span>یادداشت‌های محرمانه اداری (Internal Admin Notes):</span>
                  </h4>
                  <div className="bg-[#f7f9ff] p-3 rounded-xl max-h-36 overflow-y-auto divide-y divide-[#003a2f]/10 text-xs">
                    {(selectedUserDetail.internalNotes || []).map((n: any, idx: number) => (
                      <div key={idx} className="py-1.5 first:pt-0 last:pb-0">
                        <div className="flex items-center justify-between text-[10px] text-[#707975]">
                          <span className="font-bold text-[#003a2f]">{n.author}</span>
                          <span className="font-mono">{n.timestamp}</span>
                        </div>
                        <p className="text-[#111d27] mt-0.5">{n.note}</p>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <input
                      type="text"
                      placeholder="افزودن یادداشت جدید نظارتی..."
                      value={newAdminNote}
                      onChange={(e) => setNewAdminNote(e.target.value)}
                      className="flex-1 bg-white border border-[#003a2f]/20 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                    />
                    <button
                      onClick={handleAddUserNote}
                      className="bg-[#003a2f] hover:bg-[#0b5345] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      ثبت یادداشت
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 3. STAFF & ROLES PERMISSION MATRIX */}
          {/* ============================================================== */}
          {activeSection === 'staff' && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <div className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs">
                <h3 className="font-extrabold text-sm text-[#003a2f]">
                  ماتریس سطوح دسترسی و پست‌های سازمانی نوبت (Staff Roles & Permissions)
                </h3>
                <p className="text-xs text-[#707975] mt-0.5">
                  کنترل دقیق دسترسی به تایید مزایده‌ها، تسویه وجوه حساب‌پی، داوری شکایات و تایید تذکره الکترونیکی
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {rolesList.map((role) => (
                  <div key={role.id} className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-[#003a2f]">{role.nameFa}</span>
                        <span className="font-mono text-[10px] text-[#707975] bg-[#f1f7f5] px-2 py-0.5 rounded font-bold">
                          {role.name}
                        </span>
                      </div>
                      <p className="text-xs text-[#707975] mt-1">{role.description}</p>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#003a2f]/10">
                      <span className="text-[10px] font-bold text-[#326286] block mb-1.5">کلیدهای دسترسی مجاز (Permissions):</span>
                      <div className="flex flex-wrap gap-1">
                        {(role.permissions || []).map((perm: string, pIdx: number) => (
                          <span key={pIdx} className="bg-[#ecf4ff] text-[#003a2f] font-mono text-[10px] px-2 py-0.5 rounded border border-[#003a2f]/10">
                            {perm}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 4. AUCTIONS MANAGEMENT & LIFECYCLE */}
          {/* ============================================================== */}
          {activeSection === 'auctions' && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              {/* Header with filter tabs */}
              <div className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {[
                    { id: 'all', label: 'همه لوط‌ها' },
                    { id: 'live', label: 'در جریان (Live)' },
                    { id: 'pending_approval', label: 'در انتظار تایید' },
                    { id: 'sold', label: 'فروخته شده' },
                    { id: 'paused', label: 'متوقف موقت' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setAuctionStatusFilter(tab.id)}
                      className={`text-xs px-3 py-1.5 rounded-lg font-bold transition-colors cursor-pointer ${
                        auctionStatusFilter === tab.id
                          ? 'bg-[#003a2f] text-white shadow-xs'
                          : 'bg-[#f7f9ff] text-[#707975] hover:bg-[#ecf4ff]'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => {
                    const elem = document.getElementById('create-lot-section');
                    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="bg-[#003a2f] hover:bg-[#0b5345] text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>ثبت لوط جدید</span>
                </button>
              </div>

              {/* Auctions Table */}
              <div className="bg-white rounded-2xl border border-[#003a2f]/10 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-right rtl:text-right ltr:text-left text-xs border-collapse">
                    <thead className="bg-[#f1f7f5] text-[#003a2f] font-bold text-[11px] border-b border-[#003a2f]/10">
                      <tr>
                        <th className="p-3">کد و عنوان مزایده</th>
                        <th className="p-3">ولایت / کتگوری</th>
                        <th className="p-3">بالاترین پیشنهاد فعلی</th>
                        <th className="p-3">قیمت احتیاطی (Reserve)</th>
                        <th className="p-3">تعداد بید</th>
                        <th className="p-3">وضعیت</th>
                        <th className="p-3 text-center">عملیات اجرایی</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#003a2f]/8">
                      {lots
                        .filter(l => {
                          if (auctionStatusFilter === 'all') return true;
                          return l.status === auctionStatusFilter || (auctionStatusFilter === 'live' && !l.status);
                        })
                        .map((lot) => (
                          <tr key={lot.id} className="hover:bg-[#fbfdfe] transition-colors">
                            <td className="p-3">
                              <div className="flex items-center gap-2.5">
                                <img src={lot.imageUrl} alt="" className="w-10 h-10 rounded-lg object-cover border border-[#003a2f]/10" />
                                <div className="flex flex-col">
                                  <span className="font-bold text-[#111d27] line-clamp-1">{lot.title}</span>
                                  <span className="font-mono text-[10px] text-[#326286]">{lot.lotNumber}</span>
                                </div>
                              </div>
                            </td>
                            <td className="p-3">
                              <div className="flex flex-col">
                                <span className="font-bold text-[#003a2f]">{lot.province}</span>
                                <span className="text-[10px] text-[#707975]">{lot.categoryLabel}</span>
                              </div>
                            </td>
                            <td className="p-3 font-mono font-bold text-[#003a2f]">
                              {lot.currentBidAFN.toLocaleString('en-US')} AFN
                            </td>
                            <td className="p-3">
                              <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded ${
                                lot.isReserveMet ? 'bg-[#afefdc]/30 text-[#003a2f]' : 'bg-amber-100 text-amber-800'
                              }`}>
                                {lot.isReserveMet ? 'رد شده (Met) ✓' : 'حفظ شده (Unmet)'}
                              </span>
                            </td>
                            <td className="p-3 font-mono font-bold text-center">
                              {lot.totalBids || (lot.bidHistory ? lot.bidHistory.length : 0)}
                            </td>
                            <td className="p-3">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                                lot.status === 'paused'
                                  ? 'bg-amber-100 text-amber-800'
                                  : lot.status === 'sold'
                                  ? 'bg-purple-100 text-purple-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {lot.status || 'Live'}
                              </span>
                            </td>
                            <td className="p-3 text-center">
                              <div className="flex items-center justify-center gap-1.5 flex-wrap">
                                <button
                                  onClick={() => handleAuctionAction(lot.id, 'extend')}
                                  className="bg-[#ecf4ff] hover:bg-[#dde9f9] text-[#003a2f] px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer"
                                  title="تمدید ۱۵ دقیقه زمان مزایده"
                                >
                                  +15 دقیقه
                                </button>
                                <button
                                  onClick={() => handleAuctionAction(lot.id, 'close_hammer')}
                                  className="bg-[#003a2f] hover:bg-[#0b5345] text-white px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer"
                                  title="زدن چکش نهایی و اعلام برنده"
                                >
                                  چکش نهایی
                                </button>
                                <button
                                  onClick={() => handleAuctionAction(lot.id, 'pause')}
                                  className="bg-amber-100 hover:bg-amber-200 text-amber-800 px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer"
                                  title="توقف موقت به علت بازرسی"
                                >
                                  توقف
                                </button>
                                <button
                                  onClick={() => onDeleteLot(lot.id)}
                                  className="text-red-500 hover:text-red-700 p-1 rounded"
                                  title="حذف لوط"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Create New Lot Form */}
              <div id="create-lot-section" className="bg-white p-5 rounded-2xl border border-[#003a2f]/10 shadow-xs mt-4">
                <h3 className="font-extrabold text-sm text-[#003a2f] mb-3 flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  <span>ثبت لوط مزایده رسمی جدید در سامانه کشوری</span>
                </h3>

                {formSuccess && (
                  <div className="bg-[#afefdc] text-[#003a2f] p-3 rounded-xl text-xs font-bold mb-3 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>لوط با موفقیت ایجاد شد و در کاتالوگ کشوری و اپلیکیشن موبایل قرار گرفت.</span>
                  </div>
                )}

                <form onSubmit={handleCreateLot} className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="block text-[#707975] font-bold mb-1">عنوان فارسی / دری:</label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: تویوتا هایلوکس 2023..."
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full bg-[#f7f9ff] border border-[#003a2f]/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#707975] font-bold mb-1">عنوان انگلیسی (English):</label>
                    <input
                      type="text"
                      placeholder="e.g. Toyota Hilux 2023 Clean..."
                      value={newTitleEn}
                      onChange={(e) => setNewTitleEn(e.target.value)}
                      className="w-full bg-[#f7f9ff] border border-[#003a2f]/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#707975] font-bold mb-1">کتگوری و دسته‌بندی:</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as CategoryId)}
                      className="w-full bg-[#f7f9ff] border border-[#003a2f]/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    >
                      <option value="cars">موترها و وسایط نقلیه</option>
                      <option value="carpets">قالین و صنایع دستی</option>
                      <option value="jewelry">جواهرات و طلا</option>
                      <option value="antiques">عتیقه‌جات و هنر</option>
                      <option value="machinery">ماشین‌آلات و زراعت</option>
                      <option value="electronics">موبایل و الکترونیک</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#707975] font-bold mb-1">ولایت محل کالا:</label>
                    <select
                      value={newProvince}
                      onChange={(e) => setNewProvince(e.target.value as Province)}
                      className="w-full bg-[#f7f9ff] border border-[#003a2f]/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    >
                      <option value="کابل">کابل</option>
                      <option value="هرات">هرات</option>
                      <option value="مزارشریف">مزارشریف</option>
                      <option value="قندهار">قندهار</option>
                      <option value="جلال‌آباد">جلال‌آباد</option>
                      <option value="کندز">کندز</option>
                      <option value="بامیان">بامیان</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[#707975] font-bold mb-1">قیمت پایه مزایده (AFN):</label>
                    <input
                      type="number"
                      value={newStartingPrice}
                      onChange={(e) => setNewStartingPrice(Number(e.target.value))}
                      className="w-full bg-[#f7f9ff] border border-[#003a2f]/15 rounded-lg px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#707975] font-bold mb-1">قیمت احتیاطی (Reserve AFN):</label>
                    <input
                      type="number"
                      value={newReservePrice}
                      onChange={(e) => setNewReservePrice(Number(e.target.value))}
                      className="w-full bg-[#f7f9ff] border border-[#003a2f]/15 rounded-lg px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#707975] font-bold mb-1">حداقل گام افزایش (Increment AFN):</label>
                    <input
                      type="number"
                      value={newMinIncrement}
                      onChange={(e) => setNewMinIncrement(Number(e.target.value))}
                      className="w-full bg-[#f7f9ff] border border-[#003a2f]/15 rounded-lg px-3 py-2 text-xs font-mono font-bold focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#707975] font-bold mb-1">مدت زمان حراج (ساعت):</label>
                    <input
                      type="number"
                      value={newDurationHours}
                      onChange={(e) => setNewDurationHours(Number(e.target.value))}
                      className="w-full bg-[#f7f9ff] border border-[#003a2f]/15 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[#707975] font-bold mb-1">درجه کارشناسی فیزیکی:</label>
                    <select
                      value={newGrade}
                      onChange={(e) => setNewGrade(e.target.value as any)}
                      className="w-full bg-[#f7f9ff] border border-[#003a2f]/15 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    >
                      <option value="A+">Grade A+ (عالی - بدون نقص)</option>
                      <option value="A">Grade A (خیلی خوب)</option>
                      <option value="B+">Grade B+ (متوسط با کارکرد)</option>
                      <option value="B">Grade B (نیاز به بازسازی)</option>
                    </select>
                  </div>

                  <div className="md:col-span-3 flex justify-end">
                    <button
                      type="submit"
                      className="bg-[#003a2f] hover:bg-[#0b5345] text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Check className="w-4 h-4" />
                      <span>تایید و انتشار رسمی در نوبت</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 5. SELLERS MANAGEMENT */}
          {/* ============================================================== */}
          {activeSection === 'sellers' && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <div className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-[#003a2f]">مدیریت فروشندگان و واریز عواید (Seller Payouts)</h3>
                  <p className="text-xs text-[#707975] mt-0.5">بررسی اصالت تاجران، کارمزد ۷.۵٪ و تسویه امن با حساب‌پی</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#003a2f]/10 shadow-xs overflow-hidden">
                <table className="w-full text-right rtl:text-right ltr:text-left text-xs border-collapse">
                  <thead className="bg-[#f1f7f5] text-[#003a2f] font-bold text-[11px] border-b border-[#003a2f]/10">
                    <tr>
                      <th className="p-3">فروشنده / شرکت</th>
                      <th className="p-3">سطح تاییدیه KYC</th>
                      <th className="p-3">کارمزد پلتفرم</th>
                      <th className="p-3">مجموع فروش‌ها</th>
                      <th className="p-3">وضعیت تسویه حساب‌پی</th>
                      <th className="p-3 text-center">اقدام</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#003a2f]/8">
                    {usersList
                      .filter(u => u.userType === 'seller' || u.userType === 'business')
                      .map((seller) => (
                        <tr key={seller.id} className="hover:bg-[#fbfdfe] transition-colors">
                          <td className="p-3">
                            <div className="flex flex-col">
                              <span className="font-bold text-[#111d27]">{seller.fullName}</span>
                              <span className="text-[10px] text-[#707975] font-mono">{seller.email}</span>
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="bg-[#afefdc]/30 text-[#003a2f] font-bold text-[10px] px-2 py-0.5 rounded">
                              Tier 3 Corporate Verified
                            </span>
                          </td>
                          <td className="p-3 font-mono font-bold text-[#326286]">7.5%</td>
                          <td className="p-3 font-mono font-bold text-[#003a2f]">
                            {(seller.balanceAFN || 8900000).toLocaleString('en-US')} AFN
                          </td>
                          <td className="p-3">
                            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                              حساب HesabPay متصل ✓
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => {
                                showToast(`تسویه عواید فروشنده ${seller.fullName} با موفقیت اجرا شد.`);
                              }}
                              className="bg-[#003a2f] hover:bg-[#0b5345] text-white px-2.5 py-1 rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                            >
                              تسویه حساب فوری
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 6. BUYERS MANAGEMENT */}
          {/* ============================================================== */}
          {activeSection === 'buyers' && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <div className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs">
                <h3 className="font-extrabold text-sm text-[#003a2f]">مدیریت خریداران و صلاحیت پیشنهاددهی (Buyer Eligibility)</h3>
                <p className="text-xs text-[#707975] mt-0.5">کنترل سقف اعتبار، واریز دیپازیت تضمینی و فاکتورهای برنده شده</p>
              </div>

              <div className="bg-white rounded-2xl border border-[#003a2f]/10 shadow-xs overflow-hidden">
                <table className="w-full text-right rtl:text-right ltr:text-left text-xs border-collapse">
                  <thead className="bg-[#f1f7f5] text-[#003a2f] font-bold text-[11px] border-b border-[#003a2f]/10">
                    <tr>
                      <th className="p-3">خریدار</th>
                      <th className="p-3">تذکره</th>
                      <th className="p-3">سپرده در قفل (Escrow)</th>
                      <th className="p-3">لوط‌های برنده شده</th>
                      <th className="p-3">صلاحیت بیدینگ</th>
                      <th className="p-3 text-center">اقدام</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#003a2f]/8">
                    {usersList
                      .filter(u => u.userType === 'buyer')
                      .map((buyer) => (
                        <tr key={buyer.id} className="hover:bg-[#fbfdfe] transition-colors">
                          <td className="p-3">
                            <span className="font-bold text-[#111d27] block">{buyer.fullName}</span>
                            <span className="text-[10px] text-[#707975] font-mono">{buyer.phone}</span>
                          </td>
                          <td className="p-3 font-mono text-[10px] text-[#326286] font-bold">
                            {buyer.tazkiraNumber}
                          </td>
                          <td className="p-3 font-mono font-bold text-[#003a2f]">
                            {(buyer.escrowLockedAFN || 1820000).toLocaleString('en-US')} AFN
                          </td>
                          <td className="p-3 font-bold text-center">
                            1 لوط برتر
                          </td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              buyer.isBiddingBlocked ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-800'
                            }`}>
                              {buyer.isBiddingBlocked ? 'مسدود ⛔' : 'تایید صلاحیت شده ✓'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            <button
                              onClick={() => handleToggleBiddingBlock(buyer)}
                              className="text-[10px] font-bold bg-[#ecf4ff] hover:bg-[#dde9f9] text-[#003a2f] px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                            >
                              {buyer.isBiddingBlocked ? 'رفع مسدودیت' : 'مسدودسازی موقت'}
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 7. KYC & TAZKIRA VERIFICATION CENTER */}
          {/* ============================================================== */}
          {activeSection === 'kyc' && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <div className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-[#003a2f]">مرکز تایید تذکره الکترونیکی و هویت بیومتریک (NSIA e-KYC)</h3>
                  <p className="text-xs text-[#707975] mt-0.5">تطبیق تصویر چهره با چیپ الکترونیکی تذکره و جوازهای اتاق تجارت</p>
                </div>
                <span className="bg-[#afefdc]/30 text-[#003a2f] font-mono font-bold text-xs px-2.5 py-1 rounded-lg">
                  {kycList.filter(k => k.status === 'pending').length} در نوبت ارزیابی
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {kycList.map((caseItem) => (
                  <div key={caseItem.id} className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-[#111d27]">{caseItem.userName}</span>
                          <span className="text-[10px] font-mono bg-[#ecf4ff] text-[#326286] px-1.5 py-0.2 rounded font-bold">
                            {caseItem.userType}
                          </span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          caseItem.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-800'
                            : caseItem.status === 'rejected'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {caseItem.status === 'approved' ? 'تایید شده ✓' : caseItem.status === 'rejected' ? 'رد شده ✕' : 'در انتظار تایید'}
                        </span>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-2">
                        <div className="rounded-xl overflow-hidden border border-[#003a2f]/10 aspect-video relative group">
                          <img src={caseItem.documentUrl} alt="Document" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                            سند تذکره / جواز
                          </div>
                        </div>
                        <div className="rounded-xl overflow-hidden border border-[#003a2f]/10 aspect-video relative group">
                          <img src={caseItem.selfieUrl} alt="Selfie" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-[10px] font-bold">
                            سلفی زنده بیومتریک
                          </div>
                        </div>
                      </div>

                      <div className="mt-2 text-[11px] text-[#707975]">
                        <span className="block font-mono font-bold text-[#003a2f]">شماره سند: {caseItem.documentNumber}</span>
                        <span className="block text-[10px] mt-0.5">یادداشت ارزیابی: {caseItem.notes}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#003a2f]/10 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleKycDecision(caseItem.id, 'approved')}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        تایید رسمی هویت ✓
                      </button>
                      <button
                        onClick={() => {
                          const r = prompt('دلیل رد مدرک تذکره:');
                          if (r) handleKycDecision(caseItem.id, 'rejected', r);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        رد مدرک ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 8. FINANCE & HESABPAY SETTLEMENT */}
          {/* ============================================================== */}
          {activeSection === 'finance' && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs">
                  <span className="text-[11px] text-[#707975] font-bold block">مجموع وجوه امانی مسدود</span>
                  <span className="text-xl font-mono font-black text-[#003a2f] block mt-1">1,820,000 AFN</span>
                  <span className="text-[10px] text-emerald-700 mt-1 block">HesabPay Locked</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs">
                  <span className="text-[11px] text-[#707975] font-bold block">کارمزد خریدار (Buyer Premium 5%)</span>
                  <span className="text-xl font-mono font-black text-[#326286] block mt-1">110,750 AFN</span>
                  <span className="text-[10px] text-blue-700 mt-1 block">Platform Revenue Recognized</span>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs">
                  <span className="text-[11px] text-[#707975] font-bold block">کمیسیون فروشنده (Seller 7.5%)</span>
                  <span className="text-xl font-mono font-black text-[#0b5345] block mt-1">29,625 AFN</span>
                  <span className="text-[10px] text-[#003a2f] mt-1 block">Earned on Settled Lots</span>
                </div>
              </div>

              {/* Invoices List */}
              <div className="bg-white rounded-2xl border border-[#003a2f]/10 shadow-xs overflow-hidden">
                <div className="p-4 border-b border-[#003a2f]/10 font-bold text-xs text-[#003a2f]">
                  فاکتورهای رسمی و تسویه‌های مالی (Official Invoices & Escrows)
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-right rtl:text-right ltr:text-left text-xs border-collapse">
                    <thead className="bg-[#f1f7f5] text-[#003a2f] font-bold text-[11px] border-b border-[#003a2f]/10">
                      <tr>
                        <th className="p-3">شماره فاکتور</th>
                        <th className="p-3">لوط</th>
                        <th className="p-3">خریدار و فروشنده</th>
                        <th className="p-3">مبلغ کل (AFN)</th>
                        <th className="p-3">کارمزد پلتفرم</th>
                        <th className="p-3">وضعیت پرداخت</th>
                        <th className="p-3 text-center">اقدام تسویه</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#003a2f]/8">
                      {invoicesList.map((inv) => (
                        <tr key={inv.id} className="hover:bg-[#fbfdfe] transition-colors">
                          <td className="p-3 font-mono font-bold text-[#003a2f]">{inv.invoiceNumber}</td>
                          <td className="p-3">
                            <span className="font-bold text-[#111d27] block line-clamp-1">{inv.lotTitle}</span>
                            <span className="font-mono text-[10px] text-[#707975]">{inv.lotNumber}</span>
                          </td>
                          <td className="p-3">
                            <div className="flex flex-col text-[11px]">
                              <span>خریدار: {inv.buyerName}</span>
                              <span className="text-[#707975]">فروشنده: {inv.sellerName}</span>
                            </div>
                          </td>
                          <td className="p-3 font-mono font-bold text-[#003a2f]">
                            {inv.totalPayableAFN.toLocaleString('en-US')} AFN
                          </td>
                          <td className="p-3 font-mono font-semibold text-[#326286]">
                            {inv.buyerPremiumAFN.toLocaleString('en-US')} AFN
                          </td>
                          <td className="p-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              inv.paymentStatus === 'settled'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inv.paymentStatus === 'refunded'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-[#afefdc]/30 text-[#003a2f]'
                            }`}>
                              {inv.paymentStatus === 'settled' ? 'تسویه شده ✓' : inv.paymentStatus === 'refunded' ? 'برگشت داده شده ✕' : 'سپرده امانی قفل'}
                            </span>
                          </td>
                          <td className="p-3 text-center">
                            {inv.paymentStatus === 'escrow_locked' && (
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => handleExecutePayout(inv.id)}
                                  className="bg-[#003a2f] hover:bg-[#0b5345] text-white px-2.5 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer"
                                >
                                  آزادسازی به فروشنده
                                </button>
                                <button
                                  onClick={() => handleIssueRefund(inv.id)}
                                  className="bg-red-100 hover:bg-red-200 text-red-700 px-2 py-1 rounded text-[10px] font-bold transition-colors cursor-pointer"
                                >
                                  استرداد به خریدار
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Double Entry Ledger */}
              <div className="bg-white rounded-2xl border border-[#003a2f]/10 shadow-xs overflow-hidden mt-2">
                <div className="p-4 border-b border-[#003a2f]/10 font-bold text-xs text-[#003a2f]">
                  دفتر کل حسابداری دوبل (Double-Entry General Ledger)
                </div>
                <div className="overflow-x-auto max-h-56">
                  <table className="w-full text-right rtl:text-right ltr:text-left text-xs border-collapse">
                    <thead className="bg-[#f7f9ff] text-[#707975] font-bold text-[10px]">
                      <tr>
                        <th className="p-2.5">سند</th>
                        <th className="p-2.5">شرح حسابداری</th>
                        <th className="p-2.5">حساب بدهکار (Debit)</th>
                        <th className="p-2.5">حساب بستانکار (Credit)</th>
                        <th className="p-2.5">مبلغ (AFN)</th>
                        <th className="p-2.5">تاییدکننده</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#003a2f]/5 font-mono text-[11px]">
                      {ledgerList.map((entry) => (
                        <tr key={entry.id} className="hover:bg-[#fbfdfe]">
                          <td className="p-2.5 font-bold text-[#003a2f]">{entry.entryNumber}</td>
                          <td className="p-2.5 font-sans text-xs">{entry.description}</td>
                          <td className="p-2.5 text-blue-800">{entry.debitAccount}</td>
                          <td className="p-2.5 text-emerald-800">{entry.creditAccount}</td>
                          <td className="p-2.5 font-bold text-[#003a2f]">{entry.amountAFN.toLocaleString('en-US')}</td>
                          <td className="p-2.5 font-sans text-[10px] text-[#707975]">{entry.verifiedByStaff}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 9. FRAUD & SECURITY RISK CENTER */}
          {/* ============================================================== */}
          {activeSection === 'fraud' && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <div className="bg-red-50 border border-red-200 p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-red-800 flex items-center gap-1.5">
                    <AlertOctagon className="w-4 h-4 text-red-600" />
                    <span>موتور هوشمند کشف تقلب و دستکاری قیمت (Anti-Shill Bidding Engine)</span>
                  </h3>
                  <p className="text-xs text-red-700 mt-0.5">
                    شناسایی خودکار حساب‌های هم‌پوشان با آی‌پی یا اثر انگشت دستگاه یکسان جهت افزایش مصنوعی قیمت
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {fraudFlagsList.map((flag) => (
                  <div key={flag.id} className="bg-white p-4 rounded-2xl border border-red-200/80 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-red-800 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-red-600" />
                          <span>هشدار بحرانی: {flag.flagType === 'shill_bidding' ? 'تلاش برای افزایش مصنوعی قیمت توسط فروشنده' : 'الگوی مشکوک بیدینگ'}</span>
                        </span>
                        <span className="bg-red-100 text-red-800 text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                          {flag.severity.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs text-[#111d27] mt-2 leading-relaxed bg-[#fbfdfe] p-3 rounded-xl border border-red-100">
                        {flag.details}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-4 text-[11px] font-mono text-[#707975]">
                        <span>IP: {flag.ipAddress}</span>
                        <span>Device: {flag.deviceHash}</span>
                        <span>هدف: {flag.targetLabel}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-[#003a2f]/10 flex items-center justify-end gap-2">
                      <button
                        onClick={() => {
                          adminApi.resolveFraudFlag(flag.id, 'confirmed_action_taken', 'کاربر خاطی مسدود و بیدهای نامعتبر حذف شدند.');
                          showToast('حساب متقلب مسدود گردید و بیدهای ساختگی ابطال شدند.');
                          loadData();
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        مسدودسازی حساب و ابطال بیدها
                      </button>
                      <button
                        onClick={() => {
                          adminApi.resolveFraudFlag(flag.id, 'dismissed_false_positive');
                          showToast('هشدار به عنوان خطا نادیده گرفته شد.');
                          loadData();
                        }}
                        className="bg-[#ecf4ff] hover:bg-[#dde9f9] text-[#003a2f] px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        رد هشدار (False Positive)
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 10. DISPUTES & MEDIATION ARBITRATION */}
          {/* ============================================================== */}
          {activeSection === 'disputes' && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <div className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-[#003a2f]">مرکز حل اختلاف و داوری رسمی مزایده‌ها (Arbitration Chamber)</h3>
                  <p className="text-xs text-[#707975] mt-0.5">رسیدگی به شکایات مغایرت کالا، تأخیر تحویل یا عیب مخفی بر اساس اسناد کارشناسی</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {disputesList.map((disp) => (
                  <div key={disp.id} className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs flex flex-col gap-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-bold text-sm text-[#003a2f]">{disp.caseNumber} - {disp.lotTitle}</span>
                        <div className="flex items-center gap-3 text-xs text-[#707975] mt-0.5">
                          <span>شاکی: {disp.buyerName}</span>
                          <span>طرف شکایت: {disp.sellerName}</span>
                        </div>
                      </div>
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded">
                        {disp.status}
                      </span>
                    </div>

                    {/* Chat Messages Between Parties */}
                    <div className="bg-[#f7f9ff] p-3 rounded-xl flex flex-col gap-2 max-h-48 overflow-y-auto border border-[#003a2f]/5">
                      {disp.messages.map((m: any) => (
                        <div key={m.id} className={`p-2 rounded-lg text-xs max-w-[85%] ${
                          m.role === 'buyer' ? 'bg-white text-[#111d27] self-start border border-[#003a2f]/10' :
                          m.role === 'seller' ? 'bg-[#dde9f9] text-[#003a2f] self-end' :
                          'bg-[#afefdc]/40 text-[#003a2f] self-center text-center font-bold'
                        }`}>
                          <div className="flex items-center justify-between text-[10px] text-[#707975] mb-0.5">
                            <span className="font-bold">{m.sender}</span>
                            <span className="font-mono">{m.time}</span>
                          </div>
                          <p>{m.text}</p>
                        </div>
                      ))}
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#003a2f]/10">
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="text"
                          placeholder="ارسال پیام و دستور داوری رسمی..."
                          value={disputeReplyText}
                          onChange={(e) => setDisputeReplyText(e.target.value)}
                          className="flex-1 bg-[#f7f9ff] border border-[#003a2f]/15 rounded-lg px-3 py-1.5 text-xs focus:outline-none"
                        />
                        <button
                          onClick={() => {
                            if (!disputeReplyText.trim()) return;
                            adminApi.postDisputeMessage(disp.id, disputeReplyText);
                            showToast('پیام داوری ثبت گردید.');
                            setDisputeReplyText('');
                            loadData();
                          }}
                          className="bg-[#003a2f] hover:bg-[#0b5345] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          ارسال
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            adminApi.resolveDispute(disp.id, 'resolved_refund', 'حکم داوری به نفع خریدار صادر شد و وجه استرداد گردید.');
                            showToast('پرونده با صدور حکم استرداد وجه به خریدار مختومه شد.');
                            loadData();
                          }}
                          className="bg-red-600 hover:bg-red-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          حکم استرداد وجه (Refund)
                        </button>
                        <button
                          onClick={() => {
                            adminApi.resolveDispute(disp.id, 'resolved_payout', 'شکایت مردود اعلام شد و وجه به فروشنده آزاد گردید.');
                            showToast('شکایت رد و وجه به فروشنده آزاد شد.');
                            loadData();
                          }}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                        >
                          آزادسازی وجه به فروشنده
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 11. LOGISTICS & QR ITEM RELEASE */}
          {/* ============================================================== */}
          {activeSection === 'logistics' && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl border border-[#003a2f]/10 shadow-xs flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-sm text-[#003a2f]">تحویل فیزیکی کالا با اسکن QR و کد امنیتی (Logistics & QR Release)</h3>
                  <p className="text-xs text-[#707975] mt-0.5">تحویل‌دهی در گدام‌های رسمی ولایات و احراز هویت متقاضی تحویل</p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="کد QR یا PIN تحویل (مثال: 7821)..."
                    value={qrCodeInput}
                    onChange={(e) => setQrCodeInput(e.target.value)}
                    className="bg-[#f7f9ff] border border-[#003a2f]/20 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none"
                  />
                  <button
                    onClick={handleVerifyQr}
                    className="bg-[#003a2f] hover:bg-[#0b5345] text-white px-4 py-2 rounded-xl text-xs font-bold transition-colors cursor-pointer"
                  >
                    اعتبارسنجی و ترخیص کالا
                  </button>
                </div>
              </div>

              {qrScanResult && (
                <div className="bg-[#afefdc] text-[#003a2f] p-3 rounded-xl text-xs font-bold animate-in fade-in">
                  {qrScanResult}
                </div>
              )}

              {/* Deliveries Table */}
              <div className="bg-white rounded-2xl border border-[#003a2f]/10 shadow-xs overflow-hidden">
                <table className="w-full text-right rtl:text-right ltr:text-left text-xs border-collapse">
                  <thead className="bg-[#f1f7f5] text-[#003a2f] font-bold text-[11px] border-b border-[#003a2f]/10">
                    <tr>
                      <th className="p-3">شماره سفارش</th>
                      <th className="p-3">عنوان کالا</th>
                      <th className="p-3">متقاضی تحویل</th>
                      <th className="p-3">محل گدام</th>
                      <th className="p-3">کد امنیتی PIN</th>
                      <th className="p-3">وضعیت ترخیص</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#003a2f]/8">
                    {deliveriesList.map((dlv) => (
                      <tr key={dlv.id} className="hover:bg-[#fbfdfe] transition-colors">
                        <td className="p-3 font-mono font-bold text-[#003a2f]">{dlv.orderNumber}</td>
                        <td className="p-3 font-bold text-[#111d27]">{dlv.lotTitle}</td>
                        <td className="p-3">
                          <span className="font-bold block">{dlv.buyerName}</span>
                          <span className="font-mono text-[10px] text-[#707975]">{dlv.buyerPhone}</span>
                        </td>
                        <td className="p-3 text-[11px] text-[#707975]">{dlv.pickupLocation}</td>
                        <td className="p-3 font-mono font-bold text-amber-700 bg-amber-50 px-2 rounded">
                          {dlv.pinCode}
                        </td>
                        <td className="p-3">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            dlv.status === 'verified_released'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-800'
                          }`}>
                            {dlv.status === 'verified_released' ? 'ترخیص و تحویل داده شد ✓' : 'در انتظار مراجعه'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 12. CMS & CONTENT MANAGEMENT */}
          {/* ============================================================== */}
          {activeSection === 'cms' && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl border border-[#003a2f]/10 shadow-xs">
                <h3 className="font-extrabold text-sm text-[#003a2f]">مدیریت محتوا، بنرها و اعلانات چندزبانه (CMS & Announcements)</h3>
                <p className="text-xs text-[#707975] mt-0.5">انتشار بنرهای حراجی، قوانین مزایده ملی و پرسش‌های متداول به زبان‌های دری، پشتو و انگلیسی</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs">
                  <h4 className="font-bold text-xs text-[#003a2f] mb-2">اعلان فوری در صفحه اول (Homepage Announcement Banner)</h4>
                  <textarea
                    rows={3}
                    defaultValue="مزایده سراسری تویوتا هایلوکس و قالین‌های شاهکار هرات با تضمین رسمی امانی حساب‌پی آغاز گردید."
                    className="w-full bg-[#f7f9ff] border border-[#003a2f]/15 rounded-xl p-3 text-xs focus:outline-none"
                  />
                  <div className="mt-3 flex justify-end">
                    <button
                      onClick={() => showToast('اعلان صفحه اول به روز شد ✓')}
                      className="bg-[#003a2f] hover:bg-[#0b5345] text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer"
                    >
                      ذخیره اعلان
                    </button>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs">
                  <h4 className="font-bold text-xs text-[#003a2f] mb-2">پشتیبانی زبان‌های رسمی افغانستان</h4>
                  <div className="flex flex-col gap-2 text-xs">
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked disabled className="rounded text-[#003a2f]" />
                      <span>دری / فارسی (زبان پیش‌فرض ملی)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-[#003a2f]" />
                      <span>پښتو (ملي او رسمي ژبه)</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input type="checkbox" defaultChecked className="rounded text-[#003a2f]" />
                      <span>English (International Foreign Buyers)</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 13. PLATFORM SETTINGS */}
          {/* ============================================================== */}
          {activeSection === 'settings' && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <div className="bg-white p-5 rounded-2xl border border-[#003a2f]/10 shadow-xs">
                <h3 className="font-extrabold text-sm text-[#003a2f]">تنظیمات نرخ کارمزدها، زمان‌بندی و درگاه حساب‌پی</h3>
                <p className="text-xs text-[#707975] mt-0.5">پیکربندی قوانین بنیادین پلتفرم مزایده کشوری افغانستان</p>
              </div>

              <div className="bg-white p-5 rounded-2xl border border-[#003a2f]/10 shadow-xs grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="block text-[#707975] font-bold mb-1">کارمزد برنده (Buyer Premium %):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={platformSettings.buyerPremiumPct}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, buyerPremiumPct: Number(e.target.value) })}
                    className="w-full bg-[#f7f9ff] border border-[#003a2f]/15 rounded-lg p-2 font-mono font-bold focus:outline-none"
                  />
                  <span className="text-[10px] text-[#707975] mt-1 block">درصد اضافه بر قیمت نهایی برنده مزایده (معمولاً ۵٪)</span>
                </div>

                <div>
                  <label className="block text-[#707975] font-bold mb-1">کمیسیون فروشنده (Seller Commission %):</label>
                  <input
                    type="number"
                    step="0.1"
                    value={platformSettings.sellerCommissionPct}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, sellerCommissionPct: Number(e.target.value) })}
                    className="w-full bg-[#f7f9ff] border border-[#003a2f]/15 rounded-lg p-2 font-mono font-bold focus:outline-none"
                  />
                  <span className="text-[10px] text-[#707975] mt-1 block">درصد کسر از عواید فروشنده قبل از تسویه (معمولاً ۷.۵٪)</span>
                </div>

                <div>
                  <label className="block text-[#707975] font-bold mb-1">زمان قانون ضدقیچی (Anti-Sniping Minutes):</label>
                  <input
                    type="number"
                    value={platformSettings.antiSnipingMinutes}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, antiSnipingMinutes: Number(e.target.value) })}
                    className="w-full bg-[#f7f9ff] border border-[#003a2f]/15 rounded-lg p-2 font-mono font-bold focus:outline-none"
                  />
                  <span className="text-[10px] text-[#707975] mt-1 block">تمدید خودکار زمان در صورت ثبت بید در دقایق پایانی (معمولاً ۳ دقیقه)</span>
                </div>

                <div>
                  <label className="block text-[#707975] font-bold mb-1">شناسه پذیرنده حساب‌پی (Merchant ID):</label>
                  <input
                    type="text"
                    value={platformSettings.hesabPayMerchantId}
                    onChange={(e) => setPlatformSettings({ ...platformSettings, hesabPayMerchantId: e.target.value })}
                    className="w-full bg-[#f7f9ff] border border-[#003a2f]/15 rounded-lg p-2 font-mono focus:outline-none"
                  />
                  <span className="text-[10px] text-[#707975] mt-1 block">HesabPay Instant QR Settlement API Key</span>
                </div>

                <div className="md:col-span-2 flex items-center justify-between pt-3 border-t border-[#003a2f]/10">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={platformSettings.maintenanceMode}
                      onChange={(e) => setPlatformSettings({ ...platformSettings, maintenanceMode: e.target.checked })}
                      className="rounded text-[#003a2f]"
                    />
                    <span className="font-bold text-[#111d27]">حالت تعمیرات و توقف موقت ورود کاربران (Maintenance Mode)</span>
                  </label>

                  <button
                    onClick={() => {
                      adminApi.updateSettings(platformSettings).then(() => {
                        showToast('تنظیمات پلتفرم با موفقیت در دیتابیس سرور ذخیره شد ✓');
                      });
                    }}
                    className="bg-[#003a2f] hover:bg-[#0b5345] text-white px-5 py-2 rounded-xl font-bold text-xs transition-colors cursor-pointer"
                  >
                    ذخیره تنظیمات
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* 14. TAMPER-EVIDENT AUDIT TRAIL */}
          {/* ============================================================== */}
          {activeSection === 'audit' && (
            <div className="flex flex-col gap-4 animate-in fade-in">
              <div className="bg-white p-4 rounded-2xl border border-[#003a2f]/10 shadow-xs flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-[#003a2f]">ردیابی و لاگ غیرقابل تغییر امنیتی (Immutable Audit Trail)</h3>
                  <p className="text-xs text-[#707975] mt-0.5">ثبت تمامی تغییرات قیمت، تسویه‌های مالی، و تصمیمات کارشناسان همراه با آی‌پی و شناسه اپراتور</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-[#003a2f]/10 shadow-xs overflow-hidden">
                <table className="w-full text-right rtl:text-right ltr:text-left text-xs border-collapse">
                  <thead className="bg-[#f1f7f5] text-[#003a2f] font-bold text-[11px] border-b border-[#003a2f]/10">
                    <tr>
                      <th className="p-3">زمان</th>
                      <th className="p-3">اپراتور اداری</th>
                      <th className="p-3">اقدام ثبتی</th>
                      <th className="p-3">حوزه</th>
                      <th className="p-3">شرح کامل عملیات</th>
                      <th className="p-3">آی‌پی</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#003a2f]/8 font-mono text-[11px]">
                    {auditLogsList.map((log) => (
                      <tr key={log.id} className="hover:bg-[#fbfdfe]">
                        <td className="p-3 text-[10px] text-[#707975] whitespace-nowrap">
                          {log.timestamp.slice(0, 19).replace('T', ' ')}
                        </td>
                        <td className="p-3 font-sans font-bold text-[#003a2f]">{log.staffName}</td>
                        <td className="p-3 font-bold text-[#326286]">{log.action}</td>
                        <td className="p-3 font-sans">
                          <span className="bg-[#ecf4ff] text-[#003a2f] text-[10px] px-2 py-0.5 rounded font-bold">
                            {log.category}
                          </span>
                        </td>
                        <td className="p-3 font-sans text-xs">{log.details}</td>
                        <td className="p-3 text-[10px] text-[#707975]">{log.ip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};
