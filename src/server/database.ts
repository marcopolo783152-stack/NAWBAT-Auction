// In-memory Enterprise Relational Mock Database Engine
// Simulating PostgreSQL schema with full relational entities for NAWBAT National Auction Platform

export interface UserRecord {
  id: string;
  username: string;
  fullName: string;
  fullNameEn: string;
  email: string;
  phone: string;
  roleId: string;
  roleTitle: string;
  userType: 'buyer' | 'seller' | 'business' | 'staff';
  status: 'active' | 'suspended' | 'pending_verification' | 'blocked';
  isBiddingBlocked: boolean;
  isSellingBlocked: boolean;
  kycStatus: 'unverified' | 'pending' | 'verified' | 'rejected' | 'resubmit_required';
  tazkiraNumber: string;
  businessRegNumber?: string;
  balanceAFN: number;
  escrowLockedAFN: number;
  createdAt: string;
  lastLoginAt: string;
  ipAddress: string;
  deviceFingerprint: string;
  internalNotes: { id: string; author: string; note: string; timestamp: string }[];
  permissions: string[];
  notificationPreferences?: {
    emailOutbid: boolean;
    emailClosingSoon: boolean;
    emailHesabPayReceipts?: boolean;
  };
}

export interface RoleRecord {
  id: string;
  name: string;
  nameFa: string;
  description: string;
  permissions: string[];
  isSystem: boolean;
}

export interface KycCaseRecord {
  id: string;
  userId: string;
  userName: string;
  userType: 'buyer' | 'seller' | 'business';
  documentType: 'tazkira' | 'passport' | 'business_license' | 'selfie_with_id';
  documentNumber: string;
  documentUrl: string;
  selfieUrl: string;
  businessRegUrl?: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected' | 'resubmission_requested';
  rejectionReason?: string;
  reviewerStaffId?: string;
  reviewerName?: string;
  reviewDate?: string;
  riskScore: 'low' | 'medium' | 'high';
  notes: string;
}

export interface AuctionRecord {
  id: string;
  lotNumber: string;
  title: string;
  titleEn: string;
  titlePs: string;
  category: string;
  categoryLabel: string;
  province: string;
  startingPriceAFN: number;
  currentBidAFN: number;
  reservePriceAFN: number;
  isReserveMet: boolean;
  minIncrementAFN: number;
  totalBids: number;
  imageUrl: string;
  status: 'draft' | 'pending_approval' | 'scheduled' | 'live' | 'paused' | 'ended' | 'sold' | 'unsold' | 'cancelled';
  sellerId: string;
  sellerName: string;
  inspectorName: string;
  inspectionGrade: 'A+' | 'A' | 'B+' | 'B';
  escrowStatus: string;
  endTime: number;
  winnerId?: string;
  winnerName?: string;
  bidHistory: {
    id: string;
    bidderName: string;
    bidderMaskedId: string;
    amountAFN: number;
    timestamp: string;
    isWinning?: boolean;
    ipAddress?: string;
    isSuspicious?: boolean;
  }[];
  suspiciousFlags: string[];
}

export interface InvoiceRecord {
  id: string;
  invoiceNumber: string;
  lotId: string;
  lotNumber: string;
  lotTitle: string;
  buyerId: string;
  buyerName: string;
  sellerId: string;
  sellerName: string;
  winningBidAFN: number;
  buyerPremiumAFN: number;
  taxAFN: number;
  totalPayableAFN: number;
  paymentStatus: 'pending' | 'escrow_locked' | 'settled' | 'refunded' | 'partially_refunded';
  paymentMethod: 'HesabPay' | 'DAB_Transfer' | 'Cash_Office';
  hesabPayRef: string;
  issuedAt: string;
  settledAt?: string;
}

export interface LedgerEntryRecord {
  id: string;
  entryNumber: string;
  timestamp: string;
  type: 'escrow_deposit' | 'buyer_premium' | 'seller_commission' | 'seller_payout' | 'buyer_refund' | 'penalty';
  debitAccount: string;
  creditAccount: string;
  amountAFN: number;
  referenceId: string;
  description: string;
  verifiedByStaff: string;
}

export interface DisputeRecord {
  id: string;
  caseNumber: string;
  orderId: string;
  lotNumber: string;
  lotTitle: string;
  buyerName: string;
  sellerName: string;
  openedAt: string;
  reason: 'item_mismatch' | 'damage_in_transit' | 'undisclosed_flaw' | 'delivery_delay' | 'fraud_suspected';
  status: 'under_review' | 'awaiting_seller' | 'resolved_refund' | 'resolved_payout' | 'closed';
  claimedAmountAFN: number;
  messages: { id: string; sender: string; role: 'buyer' | 'seller' | 'admin'; text: string; time: string }[];
  resolutionNotes?: string;
  assignedStaff: string;
}

export interface FraudFlagRecord {
  id: string;
  flagType: 'shill_bidding' | 'same_device_syndicate' | 'velocity_anomaly' | 'unusual_payment_origin' | 'repeated_outbid_cancellation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  targetType: 'user' | 'lot' | 'bid';
  targetId: string;
  targetLabel: string;
  details: string;
  detectedAt: string;
  status: 'investigating' | 'confirmed_action_taken' | 'dismissed_false_positive';
  ipAddress: string;
  deviceHash: string;
}

export interface PickupDeliveryRecord {
  id: string;
  orderNumber: string;
  lotId: string;
  lotNumber: string;
  lotTitle: string;
  buyerName: string;
  buyerPhone: string;
  sellerName: string;
  pickupLocation: string;
  appointmentTime: string;
  deliveryMethod: 'warehouse_pickup' | 'armored_courier' | 'regional_center';
  qrReleaseCode: string;
  pinCode: string;
  status: 'scheduled' | 'ready_for_inspection' | 'verified_released' | 'cancelled';
  releasedByStaff?: string;
  releasedAt?: string;
  proofPhotoUrl?: string;
}

export interface AuditLogRecord {
  id: string;
  timestamp: string;
  staffId: string;
  staffName: string;
  action: string;
  category: 'user_management' | 'auction_ops' | 'kyc' | 'finance' | 'fraud' | 'dispute' | 'settings' | 'logistics';
  targetId: string;
  details: string;
  ip: string;
}

export interface PlatformSettings {
  buyerPremiumPct: number;
  sellerCommissionPct: number;
  minDepositRequirementAFN: number;
  antiSnipingMinutes: number;
  defaultAuctionDays: number;
  hesabPayMerchantId: string;
  hesabPaySandboxMode: boolean;
  autoFlagShillBids: boolean;
  maintenanceMode: boolean;
  supportedLanguages: string[];
}

// Global In-Memory Database Instance
class EnterpriseDataStore {
  users: UserRecord[] = [];
  roles: RoleRecord[] = [];
  kycCases: KycCaseRecord[] = [];
  auctions: AuctionRecord[] = [];
  invoices: InvoiceRecord[] = [];
  ledger: LedgerEntryRecord[] = [];
  disputes: DisputeRecord[] = [];
  fraudFlags: FraudFlagRecord[] = [];
  deliveries: PickupDeliveryRecord[] = [];
  auditLogs: AuditLogRecord[] = [];
  settings: PlatformSettings = {
    buyerPremiumPct: 5.0,
    sellerCommissionPct: 7.5,
    minDepositRequirementAFN: 50000,
    antiSnipingMinutes: 3,
    defaultAuctionDays: 7,
    hesabPayMerchantId: 'HESAB-AFG-99201',
    hesabPaySandboxMode: false,
    autoFlagShillBids: true,
    maintenanceMode: false,
    supportedLanguages: ['fa', 'ps', 'en'],
  };

  constructor() {
    this.seedDatabase();
  }

  private seedDatabase() {
    // 1. Roles
    this.roles = [
      {
        id: 'role-superadmin',
        name: 'Super Admin',
        nameFa: 'مدیر ارشد کل سیستم',
        description: 'Full unconstrained platform control, staff hierarchy & settings',
        permissions: ['*'],
        isSystem: true,
      },
      {
        id: 'role-admin',
        name: 'Admin',
        nameFa: 'مدیر اجرایی',
        description: 'Auction approvals, user moderation, dispute resolution',
        permissions: ['users.*', 'auctions.*', 'disputes.*', 'fraud.*', 'logistics.*'],
        isSystem: true,
      },
      {
        id: 'role-gm',
        name: 'General Manager',
        nameFa: 'مدیر عمومی بازرگانی',
        description: 'Operations oversight and corporate lots approvals',
        permissions: ['auctions.approve', 'auctions.view', 'users.view', 'reports.view', 'finance.view'],
        isSystem: true,
      },
      {
        id: 'role-auction-mgr',
        name: 'Auction Manager',
        nameFa: 'مدیر مزایده‌ها',
        description: 'Schedule, extend, close, pause, and review live auctions',
        permissions: ['auctions.create', 'auctions.edit', 'auctions.pause', 'auctions.extend', 'auctions.close'],
        isSystem: true,
      },
      {
        id: 'role-auctioneer',
        name: 'Auctioneer',
        nameFa: 'گرداننده و چکش‌زن مزایده',
        description: 'Live floor bidding coordination and floor hammer calls',
        permissions: ['auctions.live_call', 'auctions.view', 'bids.create'],
        isSystem: true,
      },
      {
        id: 'role-cataloger',
        name: 'Cataloger',
        nameFa: 'کارشناس کاتالوگ و مشخصات',
        description: 'Lot photography inspection, translation, and category placement',
        permissions: ['auctions.catalog', 'auctions.edit_specs', 'media.upload'],
        isSystem: true,
      },
      {
        id: 'role-finance',
        name: 'Finance Officer',
        nameFa: 'مدیر مالی و تصفیه حساب‌پی',
        description: 'HesabPay settlements, escrow unlock, seller payouts, refunds',
        permissions: ['finance.*', 'ledger.view', 'payouts.approve', 'refunds.issue'],
        isSystem: true,
      },
      {
        id: 'role-kyc',
        name: 'KYC & Compliance Officer',
        nameFa: 'مسئول تایید هویت و تذکره الکترونیکی',
        description: 'Tazkira verification, biometric check, AML high-value review',
        permissions: ['kyc.review', 'kyc.approve', 'kyc.reject', 'users.view'],
        isSystem: true,
      },
      {
        id: 'role-support',
        name: 'Customer Support',
        nameFa: 'پشتیبانی مشتریان',
        description: 'Tickets, user queries, dispute communication mediation',
        permissions: ['support.reply', 'tickets.manage', 'users.view'],
        isSystem: true,
      },
      {
        id: 'role-logistics',
        name: 'Logistics & Dispatch',
        nameFa: 'مسئول تحویل‌دهی و QR گدام',
        description: 'Warehouse collection verification, QR release scanning, transport',
        permissions: ['logistics.scan_qr', 'logistics.release_item', 'deliveries.update'],
        isSystem: true,
      },
      {
        id: 'role-moderator',
        name: 'Risk & Fraud Moderator',
        nameFa: 'ناظر امنیت و کشف تقلب',
        description: 'Shill bidding analysis, velocity monitor, account suspension flags',
        permissions: ['fraud.view', 'fraud.flag', 'users.restrict_bidding'],
        isSystem: true,
      },
    ];

    // 2. Staff & Users
    this.users = [
      {
        id: 'usr-admin-1',
        username: 'ehsan_superadmin',
        fullName: 'انجنیر احسان حق‌پال',
        fullNameEn: 'Eng. Ehsan Haqpal',
        email: 'admin@nawbat.af',
        phone: '+93 79 123 4567',
        roleId: 'role-superadmin',
        roleTitle: 'Super Admin',
        userType: 'staff',
        status: 'active',
        isBiddingBlocked: false,
        isSellingBlocked: false,
        kycStatus: 'verified',
        tazkiraNumber: 'KBL-9812-3341',
        balanceAFN: 0,
        escrowLockedAFN: 0,
        createdAt: '2025-01-10T08:00:00Z',
        lastLoginAt: '2026-09-26T18:15:00Z',
        ipAddress: '103.111.45.12 (Kabul)',
        deviceFingerprint: 'DEV-WIN-PRO-99',
        internalNotes: [{ id: 'n1', author: 'System', note: 'Master Super Admin Created', timestamp: '2025-01-10' }],
        permissions: ['*'],
      },
      {
        id: 'usr-kyc-1',
        username: 'fariha_kyc',
        fullName: 'فریحه سادات',
        fullNameEn: 'Fariha Sadat',
        email: 'kyc@nawbat.af',
        phone: '+93 70 882 1100',
        roleId: 'role-kyc',
        roleTitle: 'KYC Officer',
        userType: 'staff',
        status: 'active',
        isBiddingBlocked: false,
        isSellingBlocked: false,
        kycStatus: 'verified',
        tazkiraNumber: 'KBL-4412-9901',
        balanceAFN: 0,
        escrowLockedAFN: 0,
        createdAt: '2025-03-01T09:00:00Z',
        lastLoginAt: '2026-09-26T17:40:00Z',
        ipAddress: '103.111.45.18 (Kabul)',
        deviceFingerprint: 'DEV-MAC-AIR-41',
        internalNotes: [{ id: 'n2', author: 'Admin', note: 'Certified e-Tazkira Operator badge issued', timestamp: '2025-03-02' }],
        permissions: ['kyc.review', 'kyc.approve', 'kyc.reject', 'users.view'],
      },
      {
        id: 'usr-fin-1',
        username: 'bashir_finance',
        fullName: 'محمد بشیر پویا',
        fullNameEn: 'Mohammad Bashir Pouya',
        email: 'finance@nawbat.af',
        phone: '+93 78 331 4455',
        roleId: 'role-finance',
        roleTitle: 'Finance Officer',
        userType: 'staff',
        status: 'active',
        isBiddingBlocked: false,
        isSellingBlocked: false,
        kycStatus: 'verified',
        tazkiraNumber: 'HRT-2210-6677',
        balanceAFN: 0,
        escrowLockedAFN: 0,
        createdAt: '2025-02-15T10:00:00Z',
        lastLoginAt: '2026-09-26T18:05:00Z',
        ipAddress: '103.111.45.22 (Kabul)',
        deviceFingerprint: 'DEV-THINKPAD-82',
        internalNotes: [{ id: 'n3', author: 'System', note: 'HesabPay API settlement signer', timestamp: '2025-02-15' }],
        permissions: ['finance.*', 'ledger.view', 'payouts.approve', 'refunds.issue'],
      },
      // Buyers & Sellers
      {
        id: 'usr-buyer-84',
        username: 'ahmad_rezaye',
        fullName: 'احمدشاه رضایی',
        fullNameEn: 'Ahmad Shah Rezaye',
        email: 'ahmad.rezaye@kabul-trade.af',
        phone: '+93 77 990 1234',
        roleId: 'role-buyer',
        roleTitle: 'Verified Buyer',
        userType: 'buyer',
        status: 'active',
        isBiddingBlocked: false,
        isSellingBlocked: false,
        kycStatus: 'verified',
        tazkiraNumber: 'KBL-8812-4401',
        balanceAFN: 2450000,
        escrowLockedAFN: 1820000,
        createdAt: '2025-04-12T11:20:00Z',
        lastLoginAt: '2026-09-26T18:22:00Z',
        ipAddress: '180.94.77.201 (Kabul)',
        deviceFingerprint: 'DEV-IPHONE-15-PRO',
        internalNotes: [
          { id: 'n4', author: 'fariha_kyc', note: 'Tazkira smart chip authenticated, HesabPay Tier 3 linked', timestamp: '2025-04-13' }
        ],
        permissions: ['bidding.place', 'account.view'],
        notificationPreferences: {
          emailOutbid: true,
          emailClosingSoon: true,
          emailHesabPayReceipts: true,
        },
      },
      {
        id: 'usr-seller-toloo',
        username: 'toloo_logistics',
        fullName: 'شرکت لوجستیکی طلوع افغان',
        fullNameEn: 'Toloo Afghan Logistics Corp',
        email: 'fleet@toloo-afghan.af',
        phone: '+93 79 555 4321',
        roleId: 'role-seller',
        roleTitle: 'Corporate Verified Dealer',
        userType: 'business',
        status: 'active',
        isBiddingBlocked: false,
        isSellingBlocked: false,
        kycStatus: 'verified',
        tazkiraNumber: 'ACBR-REG-2021-998',
        businessRegNumber: 'ACBR-LIC-882194',
        balanceAFN: 8900000,
        escrowLockedAFN: 0,
        createdAt: '2025-01-20T14:00:00Z',
        lastLoginAt: '2026-09-26T16:10:00Z',
        ipAddress: '180.94.33.19 (Kabul)',
        deviceFingerprint: 'DEV-OFFICE-PC-01',
        internalNotes: [
          { id: 'n5', author: 'admin@nawbat.af', note: 'Customs transit clearance verified with Kabul Airport authorities', timestamp: '2025-01-22' }
        ],
        permissions: ['selling.create_lot', 'payout.request'],
      },
      {
        id: 'usr-seller-rasouli',
        username: 'rasouli_silk',
        fullName: 'کارگاه بافندگی ابریشم استاد رسولی',
        fullNameEn: 'Master Rasouli Silk Workshop',
        email: 'info@rasouli-silk.af',
        phone: '+93 70 334 8877',
        roleId: 'role-seller',
        roleTitle: 'Verified Artisan Seller',
        userType: 'seller',
        status: 'active',
        isBiddingBlocked: false,
        isSellingBlocked: false,
        kycStatus: 'verified',
        tazkiraNumber: 'HRT-3391-7721',
        balanceAFN: 1350000,
        escrowLockedAFN: 0,
        createdAt: '2025-02-18T09:30:00Z',
        lastLoginAt: '2026-09-26T15:00:00Z',
        ipAddress: '103.24.112.50 (Herat)',
        deviceFingerprint: 'DEV-SAMSUNG-S23',
        internalNotes: [
          { id: 'n6', author: 'fariha_kyc', note: 'Herat Carpet Union guild registration confirmed', timestamp: '2025-02-19' }
        ],
        permissions: ['selling.create_lot'],
      },
      {
        id: 'usr-suspicious-shill',
        username: 'speedy_bidder_99',
        fullName: 'نعیم‌الله بارکزی (حساب مشکوک)',
        fullNameEn: 'Naimullah Barakzai (Flagged)',
        email: 'naim.fake99@tempmail.af',
        phone: '+93 78 000 9988',
        roleId: 'role-buyer',
        roleTitle: 'Restricted Bidder',
        userType: 'buyer',
        status: 'suspended',
        isBiddingBlocked: true,
        isSellingBlocked: true,
        kycStatus: 'rejected',
        tazkiraNumber: 'KBL-0000-FAKE',
        balanceAFN: 0,
        escrowLockedAFN: 0,
        createdAt: '2026-09-25T20:00:00Z',
        lastLoginAt: '2026-09-26T12:00:00Z',
        ipAddress: '180.94.33.19 (Same as Toloo Logistics!)',
        deviceFingerprint: 'DEV-OFFICE-PC-01 (DUPLICATE MATCH)',
        internalNotes: [
          { id: 'n7', author: 'System Security Engine', note: 'CRITICAL FRAUD: Identical IP and device hash with seller Toloo Logistics. Attempted 4 outbids to drive price above reserve.', timestamp: '2026-09-26T12:05:00Z' }
        ],
        permissions: [],
      },
    ];

    // 3. KYC Cases
    this.kycCases = [
      {
        id: 'kyc-case-101',
        userId: 'usr-buyer-84',
        userName: 'احمدشاه رضایی',
        userType: 'buyer',
        documentType: 'tazkira',
        documentNumber: 'KBL-8812-4401',
        documentUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=600&auto=format&fit=crop&q=80',
        selfieUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
        submissionDate: '2026-09-20T10:15:00Z',
        status: 'approved',
        reviewerStaffId: 'usr-kyc-1',
        reviewerName: 'فریحه سادات',
        reviewDate: '2026-09-20T14:30:00Z',
        riskScore: 'low',
        notes: 'e-Tazkira chip barcode scanned with NSIA database match. Approved.',
      },
      {
        id: 'kyc-case-102',
        userId: 'usr-seller-toloo',
        userName: 'شرکت لوجستیکی طلوع افغان',
        userType: 'business',
        documentType: 'business_license',
        documentNumber: 'ACBR-LIC-882194',
        documentUrl: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
        selfieUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80',
        businessRegUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
        submissionDate: '2026-09-22T09:00:00Z',
        status: 'approved',
        reviewerStaffId: 'usr-admin-1',
        reviewerName: 'انجنیر احسان حق‌پال',
        reviewDate: '2026-09-22T11:00:00Z',
        riskScore: 'low',
        notes: 'Ministry of Industry & Commerce corporate registration validated.',
      },
      {
        id: 'kyc-case-103',
        userId: 'usr-pending-dealer',
        userName: 'زرگری و صرافی انصاری',
        userType: 'business',
        documentType: 'business_license',
        documentNumber: 'DAB-EXCHANGE-490',
        documentUrl: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
        selfieUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=600&auto=format&fit=crop&q=80',
        submissionDate: '2026-09-26T08:30:00Z',
        status: 'pending',
        riskScore: 'medium',
        notes: 'High-value bullion dealer license under review with Da Afghanistan Bank directory.',
      },
      {
        id: 'kyc-case-104',
        userId: 'usr-suspicious-shill',
        userName: 'نعیم‌الله بارکزی',
        userType: 'buyer',
        documentType: 'tazkira',
        documentNumber: 'KBL-0000-FAKE',
        documentUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&auto=format&fit=crop&q=80',
        selfieUrl: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&auto=format&fit=crop&q=80',
        submissionDate: '2026-09-25T20:10:00Z',
        status: 'rejected',
        rejectionReason: 'Forged document format, blurred seal, national ID number does not exist.',
        reviewerStaffId: 'usr-kyc-1',
        reviewerName: 'فریحه سادات',
        reviewDate: '2026-09-26T10:00:00Z',
        riskScore: 'high',
        notes: 'High risk alert triggered. IP matches another registered seller.',
      },
    ];

    // 4. Seeded Auctions
    const now = Date.now();
    this.auctions = [
      {
        id: 'lot-1',
        lotNumber: 'LOT-KBL-4891',
        title: 'تویوتا هایلوکس دبل کبين 2022 - اسناد پاک کابل',
        titleEn: 'Toyota Hilux Double Cab 2022 - Clean Kabul Registration',
        titlePs: 'ټویوټا هایلکس ډبل کیبن 2022 - د کابل پاک اسناد',
        category: 'cars',
        categoryLabel: 'موترها و وسایط',
        province: 'کابل',
        startingPriceAFN: 1450000,
        currentBidAFN: 1820000,
        reservePriceAFN: 1800000,
        isReserveMet: true,
        minIncrementAFN: 20000,
        totalBids: 28,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBXrb-z2Qv6ECzBcdp4f6JTJQQh1DYVqx89lOLOOoVbkqeHM_mkCnNY7_K6IMPgf9qETqp783LVXvNSfL2-fLjLe5yNJYCMHgrLz0_Zn-xt719UYEoWWWrHGkl5yPqsFr61JgFzNEsbpIm28NbGIvjMOxeBtWBEJpMrFsOT6w70d0rW8SwS-tRrINqoMBWalxrIYWZTT6vT3-9RD6xTWawJioxwjiTnCWaCfeJr10HMcxuwj0om48vu',
        status: 'live',
        sellerId: 'usr-seller-toloo',
        sellerName: 'شرکت لوجستیکی طلوع افغان',
        inspectorName: 'انجنیر فاروق رحمانی (آمریت ترافیک کابل)',
        inspectionGrade: 'A+',
        escrowStatus: 'HesabPay Guaranteed',
        endTime: now + (18 * 60 * 1000),
        winnerId: 'usr-buyer-84',
        winnerName: 'حاجی بشیر احمد',
        bidHistory: [
          { id: 'lot-1-b1', bidderName: 'حاجی بشیر احمد', bidderMaskedId: 'Bidder ***84', amountAFN: 1820000, timestamp: '2 min ago', isWinning: true, ipAddress: '180.94.77.201' },
          { id: 'lot-1-b2', bidderName: 'شمس‌الدین پوپل', bidderMaskedId: 'Bidder ***19', amountAFN: 1800000, timestamp: '7 min ago', ipAddress: '180.94.77.100' },
          { id: 'lot-1-b3', bidderName: 'میرویس عزیزی', bidderMaskedId: 'Bidder ***92', amountAFN: 1760000, timestamp: '14 min ago', ipAddress: '103.11.22.4' },
        ],
        suspiciousFlags: ['FLAG-SAME-DEVICE-DETECTION'],
      },
      {
        id: 'lot-2',
        lotNumber: 'LOT-HRT-8820',
        title: 'قالین ابریشم دستباف قزاق موری هرات (12 متری استادبافت)',
        titleEn: 'Herat Mauri Kazakh 100% Raw Silk Carpet (12m² Master Weave)',
        titlePs: 'د هرات قزاق موري 100% وریښم لاسي قالین (12 متره)',
        category: 'carpets',
        categoryLabel: 'قالین و صنایع دستی',
        province: 'هرات',
        startingPriceAFN: 240000,
        currentBidAFN: 395000,
        reservePriceAFN: 380000,
        isReserveMet: true,
        minIncrementAFN: 5000,
        totalBids: 41,
        imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHfNh-y8KSnfpXBiPiTyfYWBXgTjraa-ZY-MALG5PVjNwvbG-zrzGzbX-qvLVnz5yAsESSfyXpNlsxMWqSKv4MZThs1EvcvrBLkZCW66IU8V8z5kNSDOcdlRMOHIYINwSFwVc9DK-c6ytJv7mKLldiAsGLLlScG6lCO3hQkKaUN0y0IMULnp9zZOdau-YREJQyzu7XBDUrg9JTl78f8xDQfrrYlSmSo1XmkVvsLmwQ_Nj_ZtBDXDMm',
        status: 'live',
        sellerId: 'usr-seller-rasouli',
        sellerName: 'کارگاه بافندگی ابریشم استاد رسولی',
        inspectorName: 'استاد عبدالغفور رسولی (اتحادیه قالین‌بافان هرات)',
        inspectionGrade: 'A+',
        escrowStatus: 'HesabPay Guaranteed',
        endTime: now + (4 * 60 * 1000),
        winnerId: 'usr-buyer-84',
        winnerName: 'صدیق‌الله فقیری',
        bidHistory: [
          { id: 'lot-2-b1', bidderName: 'صدیق‌الله فقیری', bidderMaskedId: 'Bidder ***33', amountAFN: 395000, timestamp: '1 min ago', isWinning: true, ipAddress: '103.24.11.19' },
          { id: 'lot-2-b2', bidderName: 'فرشته انوری', bidderMaskedId: 'Bidder ***77', amountAFN: 390000, timestamp: '3 min ago', ipAddress: '103.24.11.88' },
        ],
        suspiciousFlags: [],
      },
      {
        id: 'lot-pending-01',
        lotNumber: 'LOT-KBL-9932',
        title: 'شمش طلای 100 گرام عیار 995 با سرتیفیکیت رسمی دا افغانستان بانک',
        titleEn: '100g Fine Gold Bullion Bar 995 Da Afghanistan Bank Certified',
        titlePs: 'د 100 ګرامه 995 خالص سرو زرو بار د مرکزي بانک سند سره',
        category: 'jewelry',
        categoryLabel: 'جواهرات و طلا',
        province: 'کابل',
        startingPriceAFN: 680000,
        currentBidAFN: 680000,
        reservePriceAFN: 710000,
        isReserveMet: false,
        minIncrementAFN: 10000,
        totalBids: 0,
        imageUrl: 'https://images.unsplash.com/photo-1610375461246-83df859d849d?w=600&auto=format&fit=crop&q=80',
        status: 'pending_approval',
        sellerId: 'usr-pending-dealer',
        sellerName: 'زرگری و صرافی انصاری',
        inspectorName: 'مرکز عیارسنجی طلا و جواهرات بازار شهزاده',
        inspectionGrade: 'A+',
        escrowStatus: 'HesabPay Guaranteed',
        endTime: now + (48 * 3600 * 1000),
        bidHistory: [],
        suspiciousFlags: [],
      },
    ];

    // 5. Invoices
    this.invoices = [
      {
        id: 'inv-2026-001',
        invoiceNumber: 'INV-AFN-8821',
        lotId: 'lot-1',
        lotNumber: 'LOT-KBL-4891',
        lotTitle: 'تویوتا هایلوکس دبل کبين 2022',
        buyerId: 'usr-buyer-84',
        buyerName: 'احمدشاه رضایی',
        sellerId: 'usr-seller-toloo',
        sellerName: 'شرکت لوجستیکی طلوع افغان',
        winningBidAFN: 1820000,
        buyerPremiumAFN: 91000, // 5%
        taxAFN: 0,
        totalPayableAFN: 1911000,
        paymentStatus: 'escrow_locked',
        paymentMethod: 'HesabPay',
        hesabPayRef: 'HP-TXN-984412-KBL',
        issuedAt: '2026-09-26T18:00:00Z',
      },
      {
        id: 'inv-2026-002',
        invoiceNumber: 'INV-AFN-8819',
        lotId: 'lot-2',
        lotNumber: 'LOT-HRT-8820',
        lotTitle: 'قالین ابریشم دستباف قزاق موری هرات',
        buyerId: 'usr-buyer-84',
        buyerName: 'صدیق‌الله فقیری',
        sellerId: 'usr-seller-rasouli',
        sellerName: 'کارگاه بافندگی ابریشم استاد رسولی',
        winningBidAFN: 395000,
        buyerPremiumAFN: 19750,
        taxAFN: 0,
        totalPayableAFN: 414750,
        paymentStatus: 'settled',
        paymentMethod: 'HesabPay',
        hesabPayRef: 'HP-TXN-881200-HRT',
        issuedAt: '2026-09-26T17:30:00Z',
        settledAt: '2026-09-26T18:10:00Z',
      },
    ];

    // 6. Double Entry Ledger
    this.ledger = [
      {
        id: 'led-1',
        entryNumber: 'LED-2026-0091',
        timestamp: '2026-09-26T18:00:00Z',
        type: 'escrow_deposit',
        debitAccount: 'HesabPay_Holding_Wallet',
        creditAccount: 'Customer_Escrow_Liability',
        amountAFN: 1820000,
        referenceId: 'INV-AFN-8821',
        description: 'Escrow lock for LOT-KBL-4891 by buyer Ahmad Shah',
        verifiedByStaff: 'محمد بشیر پویا (Finance)',
      },
      {
        id: 'led-2',
        entryNumber: 'LED-2026-0092',
        timestamp: '2026-09-26T18:00:00Z',
        type: 'buyer_premium',
        debitAccount: 'Customer_Cash_Wallet',
        creditAccount: 'Platform_Revenue_5Pct',
        amountAFN: 91000,
        referenceId: 'INV-AFN-8821',
        description: '5% Platform Buyer Premium recognized on LOT-KBL-4891',
        verifiedByStaff: 'محمد بشیر پویا (Finance)',
      },
      {
        id: 'led-3',
        entryNumber: 'LED-2026-0089',
        timestamp: '2026-09-26T17:45:00Z',
        type: 'seller_payout',
        debitAccount: 'Customer_Escrow_Liability',
        creditAccount: 'Seller_HesabPay_Disbursement',
        amountAFN: 365375, // after 7.5% commission deduction
        referenceId: 'INV-AFN-8819',
        description: 'Disbursement to Master Rasouli following QR handover validation',
        verifiedByStaff: 'محمد بشیر پویا (Finance)',
      },
      {
        id: 'led-4',
        entryNumber: 'LED-2026-0088',
        timestamp: '2026-09-26T17:45:00Z',
        type: 'seller_commission',
        debitAccount: 'Seller_Escrow_Deduction',
        creditAccount: 'Platform_Commission_Revenue_7_5Pct',
        amountAFN: 29625,
        referenceId: 'INV-AFN-8819',
        description: '7.5% Seller commission fee earned on Herat Mauri Carpet',
        verifiedByStaff: 'محمد بشیر پویا (Finance)',
      },
    ];

    // 7. Disputes
    this.disputes = [
      {
        id: 'disp-001',
        caseNumber: 'DISP-2026-771',
        orderId: 'inv-2026-001',
        lotNumber: 'LOT-KBL-4891',
        lotTitle: 'تویوتا هایلوکس دبل کبين 2022',
        buyerName: 'احمدشاه رضایی',
        sellerName: 'شرکت لوجستیکی طلوع افغان',
        openedAt: '2026-09-26T17:50:00Z',
        reason: 'item_mismatch',
        status: 'under_review',
        claimedAmountAFN: 1820000,
        messages: [
          {
            id: 'm1',
            sender: 'احمدشاه رضایی',
            role: 'buyer',
            text: 'کارکرد در کیلومترشمار ۴۵،۰۰۰ نشان می‌دهد درحالی‌که کاتالوگ ۴۲،۰۰۰ درج نموده بود. تقاضای کارشناسی مجدد دارم.',
            time: '17:50',
          },
          {
            id: 'm2',
            sender: 'شرکت لوجستیکی طلوع افغان',
            role: 'seller',
            text: '۳۰۰۰ کیلومتر اضافی مربوط به انتقال زمینی از مرز حیرتان تا گدام کابل بوده و برگه بارنامه رسمی آن ضمیمه است.',
            time: '18:02',
          },
        ],
        resolutionNotes: 'Assigning Engineer Farooq for odometer and delivery route audit.',
        assignedStaff: 'انجنیر احسان حق‌پال',
      },
    ];

    // 8. Fraud Flags
    this.fraudFlags = [
      {
        id: 'ff-001',
        flagType: 'shill_bidding',
        severity: 'critical',
        targetType: 'lot',
        targetId: 'lot-1',
        targetLabel: 'LOT-KBL-4891 (Toyota Hilux)',
        details: 'Bidder "speedy_bidder_99" registered from identical IP 180.94.33.19 and canvas fingerprint as Seller "Toloo Afghan". Triggered automated bid freeze.',
        detectedAt: '2026-09-26T12:05:00Z',
        status: 'confirmed_action_taken',
        ipAddress: '180.94.33.19',
        deviceHash: 'DEV-OFFICE-PC-01',
      },
      {
        id: 'ff-002',
        flagType: 'velocity_anomaly',
        severity: 'medium',
        targetType: 'user',
        targetId: 'usr-buyer-84',
        targetLabel: 'احمدشاه رضایی',
        details: '14 consecutive bids placed within 45 seconds across 3 separate categories. Flagged for anti-bot reCAPTCHA check.',
        detectedAt: '2026-09-26T16:20:00Z',
        status: 'dismissed_false_positive',
        ipAddress: '180.94.77.201',
        deviceHash: 'DEV-IPHONE-15-PRO',
      },
    ];

    // 9. Logistics & Pickup
    this.deliveries = [
      {
        id: 'dlv-01',
        orderNumber: 'ORD-AFN-9981',
        lotId: 'lot-2',
        lotNumber: 'LOT-HRT-8820',
        lotTitle: 'قالین ابریشم دستباف قزاق موری هرات (12 متری استادبافت)',
        buyerName: 'صدیق‌الله فقیری',
        buyerPhone: '+93 79 444 1122',
        sellerName: 'کارگاه بافندگی ابریشم استاد رسولی',
        pickupLocation: 'گدام مرکزی تحویل مزایده هرات - سرای ارباب‌زاده',
        appointmentTime: '2026-09-27T10:00:00Z',
        deliveryMethod: 'warehouse_pickup',
        qrReleaseCode: 'QR-RELEASE-HRT-8820-SAFE',
        pinCode: '7821',
        status: 'verified_released',
        releasedByStaff: 'احمد نوید (Logistics Officer)',
        releasedAt: '2026-09-26T18:10:00Z',
        proofPhotoUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=600&auto=format&fit=crop&q=80',
      },
      {
        id: 'dlv-02',
        orderNumber: 'ORD-AFN-9982',
        lotId: 'lot-1',
        lotNumber: 'LOT-KBL-4891',
        lotTitle: 'تویوتا هایلوکس دبل کبين 2022',
        buyerName: 'احمدشاه رضایی',
        buyerPhone: '+93 77 990 1234',
        sellerName: 'شرکت لوجستیکی طلوع افغان',
        pickupLocation: 'پارکینگ نظارتی میدان هوایی کابل - گدام شماره 4',
        appointmentTime: '2026-09-28T14:00:00Z',
        deliveryMethod: 'warehouse_pickup',
        qrReleaseCode: 'QR-RELEASE-KBL-4891-SAFE',
        pinCode: '4490',
        status: 'scheduled',
      },
    ];

    // 10. Audit Logs
    this.auditLogs = [
      {
        id: 'log-1',
        timestamp: '2026-09-26T18:15:20Z',
        staffId: 'usr-admin-1',
        staffName: 'انجنیر احسان حق‌پال (Super Admin)',
        action: 'UPDATE_SETTINGS',
        category: 'settings',
        targetId: 'global_config',
        details: 'Verified HesabPay production settlement webhook and anti-sniping duration set to 3 minutes',
        ip: '103.111.45.12',
      },
      {
        id: 'log-2',
        timestamp: '2026-09-26T18:10:14Z',
        staffId: 'usr-fin-1',
        staffName: 'محمد بشیر پویا (Finance)',
        action: 'APPROVE_PAYOUT',
        category: 'finance',
        targetId: 'INV-AFN-8819',
        details: 'Released 365,375 AFN to Master Rasouli via HesabPay transaction HP-TXN-881200-HRT',
        ip: '103.111.45.22',
      },
      {
        id: 'log-3',
        timestamp: '2026-09-26T17:40:05Z',
        staffId: 'usr-kyc-1',
        staffName: 'فریحه سادات (KYC Officer)',
        action: 'REJECT_KYC_DOCUMENT',
        category: 'kyc',
        targetId: 'usr-suspicious-shill',
        details: 'Rejected Tazkira for user speedy_bidder_99 due to invalid checksum and shill association',
        ip: '103.111.45.18',
      },
    ];
  }

  // Helper Methods for Mutations
  addAuditLog(staffName: string, action: string, category: AuditLogRecord['category'], targetId: string, details: string) {
    const entry: AuditLogRecord = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      staffId: 'usr-admin-1',
      staffName,
      action,
      category,
      targetId,
      details,
      ip: '103.111.45.12',
    };
    this.auditLogs.unshift(entry);
    return entry;
  }
}

export const db = new EnterpriseDataStore();
