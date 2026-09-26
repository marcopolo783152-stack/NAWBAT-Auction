import express, { Request, Response } from 'express';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import { db, UserRecord, AuctionRecord } from './src/server/database';
import { issueAdminToken, requireAdmin, verifyAdminCredentials } from './src/server/auth';
import { createPersistentUser, getPersistentUser, hasPersistentDatabase, listPersistentUsers, updatePersistentUser } from './src/server/userRepository';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createApp(serveFrontend = true) {
  const app = express();
  app.disable('x-powered-by');
  app.set('trust proxy', 1);

  app.use(helmet({
    contentSecurityPolicy: false,
    crossOriginResourcePolicy: false,
  }));
  app.use(express.json({ limit: '1mb' }));

  const apiLimiter = rateLimit({
    windowMs: 60_000,
    limit: 180,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
  });
  const adminLoginLimiter = rateLimit({
    windowMs: 15 * 60_000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { success: false, error: 'Too many login attempts. Please try again later.' },
  });

  app.use('/api', apiLimiter);

  // -------------------------------------------------------------
  // Public & Health APIs
  // -------------------------------------------------------------
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      platform: 'NAWBAT Afghanistan Auction Marketplace',
      payments: process.env.HESABPAY_API_KEY ? 'HesabPay configured' : 'HesabPay not configured',
      kyc: 'Manual review workflow',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    });
  });

  // -------------------------------------------------------------
  // Authentication API
  // -------------------------------------------------------------
  app.post('/api/admin/login', adminLoginLimiter, async (req: Request, res: Response) => {
    const { email, password } = req.body || {};
    if (typeof email !== 'string' || typeof password !== 'string') {
      return res.status(400).json({ success: false, error: 'Email and password are required.' });
    }

    const verified = await verifyAdminCredentials(email, password);
    if (!verified.ok) {
      const status = verified.reason === 'ADMIN_NOT_CONFIGURED' ? 503 : 401;
      return res.status(status).json({
        success: false,
        error: verified.reason === 'ADMIN_NOT_CONFIGURED'
          ? 'Admin access is not configured on the server.'
          : 'Invalid email or password.',
      });
    }

    const superAdmin = db.users.find(u => u.id === 'usr-admin-1') || {
      id: 'usr-admin-1',
      fullName: 'NAWBAT Administrator',
      email: verified.email,
      roleTitle: 'Super Admin',
    };

    db.addAuditLog(
      superAdmin.fullName,
      'ADMIN_LOGIN',
      'user_management',
      superAdmin.id,
      'Authenticated admin session created',
    );

    return res.json({
      success: true,
      token: issueAdminToken(verified.email),
      user: superAdmin,
    });
  });

  // Every admin route below this line requires a valid signed bearer token.
  app.use('/api/admin', requireAdmin);

  // -------------------------------------------------------------
  // User account APIs
  // -------------------------------------------------------------
  // Public buyer/seller authentication is intentionally disabled until
  // a signed user-session flow is connected to persistent users.
  app.get('/api/user/profile', (_req: Request, res: Response) => {
    return res.status(501).json({
      error: 'User authentication is not enabled yet.',
      code: 'USER_AUTH_PENDING',
    });
  });

  app.put('/api/user/notification-preferences', (_req: Request, res: Response) => {
    return res.status(501).json({
      error: 'User authentication is not enabled yet.',
      code: 'USER_AUTH_PENDING',
    });
  });

  // -------------------------------------------------------------
  // 1. Dashboard Overview & KPI Metrics
  // -------------------------------------------------------------
  app.get('/api/admin/overview', (req: Request, res: Response) => {
    const totalUsers = db.users.length;
    const verifiedBuyers = db.users.filter(u => u.userType === 'buyer' && u.kycStatus === 'verified').length;
    const verifiedSellers = db.users.filter(u => (u.userType === 'seller' || u.userType === 'business') && u.kycStatus === 'verified').length;
    const activeAuctions = db.auctions.filter(a => a.status === 'live').length;
    
    // Ending today (within next 24 hours)
    const now = Date.now();
    const endingToday = db.auctions.filter(a => a.status === 'live' && a.endTime > now && a.endTime < now + 86400000).length;
    
    const totalBids = db.auctions.reduce((acc, a) => acc + (a.totalBids || 0), 0);
    const paymentsCount = db.invoices.filter(i => i.paymentStatus === 'settled' || i.paymentStatus === 'escrow_locked').length;
    const pendingPayoutsAFN = db.invoices
      .filter(i => i.paymentStatus === 'escrow_locked')
      .reduce((acc, i) => acc + (i.winningBidAFN * (1 - db.settings.sellerCommissionPct / 100)), 0);
    
    const disputesCount = db.disputes.filter(d => d.status === 'under_review' || d.status === 'awaiting_seller').length;
    const fraudAlertsCount = db.fraudFlags.filter(f => f.status === 'investigating').length;
    const kycReviewWaiting = db.kycCases.filter(k => k.status === 'pending').length;

    // Platform revenue = sum of buyer premiums + seller commissions
    const totalBuyerPremiumsAFN = db.invoices.reduce((acc, i) => acc + (i.buyerPremiumAFN || 0), 0);
    const totalSellerCommissionsAFN = db.invoices.reduce((acc, i) => acc + Math.round(i.winningBidAFN * (db.settings.sellerCommissionPct / 100)), 0);
    const totalRevenueAFN = totalBuyerPremiumsAFN + totalSellerCommissionsAFN;

    const escrowHeldTotalAFN = db.invoices
      .filter(i => i.paymentStatus === 'escrow_locked')
      .reduce((acc, i) => acc + i.totalPayableAFN, 0);

    res.json({
      metrics: {
        totalUsers,
        verifiedBuyers,
        verifiedSellers,
        activeAuctions,
        auctionsEndingToday: endingToday,
        totalBids,
        payments: paymentsCount,
        pendingPayoutsAFN,
        disputes: disputesCount,
        fraudAlerts: fraudAlertsCount,
        kycWaitingReview: kycReviewWaiting,
        revenueAFN: totalRevenueAFN,
        escrowHeldTotalAFN,
      },
      systemStatus: {
        hesabPayGateway: process.env.HESABPAY_API_KEY ? 'Configured' : 'Not configured',
        antiSnipingEngine: `Active (${db.settings.antiSnipingMinutes}m extension rule)`,
        kycVerifierService: 'Manual review workflow',
        maintenanceMode: db.settings.maintenanceMode,
      }
    });
  });

  // -------------------------------------------------------------
  // 2. User Management APIs
  // -------------------------------------------------------------
  app.get('/api/admin/users', async (req: Request, res: Response) => {
    const { search, userType, status, kycStatus } = req.query;

    if (hasPersistentDatabase()) {
      try {
        const users = await listPersistentUsers({
          search: typeof search === 'string' ? search : undefined,
          userType: typeof userType === 'string' ? userType : undefined,
          status: typeof status === 'string' ? status : undefined,
          kycStatus: typeof kycStatus === 'string' ? kycStatus : undefined,
        });
        return res.json(users);
      } catch (error) {
        console.error('Persistent user list failed:', error);
        return res.status(500).json({ error: 'Could not load users from the database.' });
      }
    }

    let list = [...db.users];
    if (search && typeof search === 'string') {
      const q = search.toLowerCase();
      list = list.filter(u =>
        u.fullName.toLowerCase().includes(q) ||
        u.fullNameEn.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.phone.includes(q) ||
        u.tazkiraNumber.toLowerCase().includes(q)
      );
    }
    if (userType && typeof userType === 'string' && userType !== 'all') list = list.filter(u => u.userType === userType);
    if (status && typeof status === 'string' && status !== 'all') list = list.filter(u => u.status === status);
    if (kycStatus && typeof kycStatus === 'string' && kycStatus !== 'all') list = list.filter(u => u.kycStatus === kycStatus);
    return res.json(list);
  });

  app.get('/api/admin/users/:id', async (req: Request, res: Response) => {
    if (hasPersistentDatabase()) {
      try {
        const user = await getPersistentUser(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        return res.json({ user, kyc: null, invoices: [], disputes: [], lots: [] });
      } catch (error) {
        console.error('Persistent user lookup failed:', error);
        return res.status(500).json({ error: 'Could not load user from the database.' });
      }
    }

    const user = db.users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    const kyc = db.kycCases.find(k => k.userId === user.id);
    const invoices = db.invoices.filter(i => i.buyerId === user.id || i.sellerId === user.id);
    const disputes = db.disputes.filter(d => d.buyerName === user.fullName || d.sellerName === user.fullName);
    const lots = db.auctions.filter(a => a.sellerId === user.id);
    return res.json({ user, kyc, invoices, disputes, lots });
  });

  app.post('/api/admin/users', async (req: Request, res: Response) => {
    const { fullName, fullNameEn, email, phone, userType, roleId, tazkiraNumber } = req.body || {};
    if (!fullName || !userType || (!email && !phone)) {
      return res.status(400).json({ error: 'fullName, userType, and an email or phone number are required.' });
    }

    if (hasPersistentDatabase()) {
      try {
        const user = await createPersistentUser({
          fullName,
          fullNameEn,
          email,
          phone,
          userType,
          tazkiraNumber,
          roleKey: typeof roleId === 'string' ? roleId.replace(/^role-/, '') : undefined,
        });
        db.addAuditLog('NAWBAT Administrator', 'CREATE_USER', 'user_management', user?.id || 'database-user', `Created ${userType} account for ${fullName}`);
        return res.status(201).json({ success: true, user });
      } catch (error: any) {
        console.error('Persistent user creation failed:', error);
        const duplicate = error?.code === '23505';
        return res.status(duplicate ? 409 : 500).json({ error: duplicate ? 'Email or phone is already registered.' : 'Could not create user.' });
      }
    }

    const newUser: UserRecord = {
      id: `usr-${Date.now()}`,
      username: email ? email.split('@')[0] : phone,
      fullName,
      fullNameEn: fullNameEn || fullName,
      email: email || '',
      phone: phone || '',
      roleId: roleId || (userType === 'staff' ? 'role-support' : `role-${userType}`),
      roleTitle: userType === 'staff' ? 'Staff' : userType === 'buyer' ? 'Buyer' : 'Seller',
      userType,
      status: 'active',
      isBiddingBlocked: false,
      isSellingBlocked: false,
      kycStatus: 'pending',
      tazkiraNumber: tazkiraNumber || '',
      balanceAFN: 0,
      escrowLockedAFN: 0,
      createdAt: new Date().toISOString(),
      lastLoginAt: new Date().toISOString(),
      ipAddress: '',
      deviceFingerprint: '',
      internalNotes: [{ id: `n-${Date.now()}`, author: 'Super Admin', note: 'Created via Admin Portal', timestamp: new Date().toISOString() }],
      permissions: userType === 'staff' ? ['support.reply', 'tickets.manage'] : ['bidding.place'],
    };
    db.users.unshift(newUser);
    db.addAuditLog('NAWBAT Administrator', 'CREATE_USER', 'user_management', newUser.id, `Created ${userType} account for ${fullName}`);
    return res.status(201).json({ success: true, user: newUser });
  });

  app.put('/api/admin/users/:id', async (req: Request, res: Response) => {
    const { status, isBiddingBlocked, isSellingBlocked, kycStatus, newNote, roleId, roleTitle } = req.body || {};

    if (hasPersistentDatabase()) {
      try {
        const user = await updatePersistentUser(req.params.id, { status, isBiddingBlocked, isSellingBlocked, kycStatus, newNote });
        if (!user) return res.status(404).json({ error: 'User not found' });
        db.addAuditLog('NAWBAT Administrator', 'UPDATE_USER', 'user_management', user.id, 'Updated persistent user account');
        return res.json({ success: true, user });
      } catch (error) {
        console.error('Persistent user update failed:', error);
        return res.status(500).json({ error: 'Could not update user.' });
      }
    }

    const user = db.users.find(u => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    if (status !== undefined) user.status = status;
    if (isBiddingBlocked !== undefined) user.isBiddingBlocked = isBiddingBlocked;
    if (isSellingBlocked !== undefined) user.isSellingBlocked = isSellingBlocked;
    if (kycStatus !== undefined) user.kycStatus = kycStatus;
    if (roleId) user.roleId = roleId;
    if (roleTitle) user.roleTitle = roleTitle;
    if (newNote && typeof newNote === 'string') {
      user.internalNotes.unshift({ id: `note-${Date.now()}`, author: 'NAWBAT Administrator', note: newNote, timestamp: new Date().toISOString() });
    }
    db.addAuditLog('NAWBAT Administrator', 'UPDATE_USER', 'user_management', user.id, `Updated status to ${user.status}`);
    return res.json({ success: true, user });
  });

  // -------------------------------------------------------------
  // 3. Staff & Permissions Matrix
  // -------------------------------------------------------------
  app.get('/api/admin/roles', (req: Request, res: Response) => {
    res.json(db.roles);
  });

  app.put('/api/admin/roles/:id', (req: Request, res: Response) => {
    const role = db.roles.find(r => r.id === req.params.id);
    if (!role) return res.status(404).json({ error: 'Role not found' });
    const { permissions, description } = req.body;
    if (permissions) role.permissions = permissions;
    if (description) role.description = description;

    db.addAuditLog('انجنیر احسان حق‌پال', 'UPDATE_ROLE_PERMISSIONS', 'settings', role.id, `Modified permission keys for role ${role.name}`);
    res.json({ success: true, role });
  });

  // -------------------------------------------------------------
  // 4. Auction Operations & Lifecycle Management
  // -------------------------------------------------------------
  app.get('/api/admin/auctions', (req: Request, res: Response) => {
    const { status, province, category } = req.query;
    let list = [...db.auctions];

    if (status && typeof status === 'string' && status !== 'all') {
      list = list.filter(a => a.status === status);
    }
    if (province && typeof province === 'string' && province !== 'all') {
      list = list.filter(a => a.province === province);
    }
    if (category && typeof category === 'string' && category !== 'all') {
      list = list.filter(a => a.category === category);
    }

    res.json(list);
  });

  app.post('/api/admin/auctions', (req: Request, res: Response) => {
    const body = req.body;
    const newLot: AuctionRecord = {
      id: `lot-${Date.now()}`,
      lotNumber: `LOT-${body.province ? body.province.slice(0, 3).toUpperCase() : 'KBL'}-${Math.floor(1000 + Math.random() * 9000)}`,
      title: body.title,
      titleEn: body.titleEn || body.title,
      titlePs: body.titlePs || body.title,
      category: body.category || 'machinery',
      categoryLabel: body.categoryLabel || 'اموال و تجهیزات',
      province: body.province || 'کابل',
      startingPriceAFN: Number(body.startingPriceAFN) || 100000,
      currentBidAFN: Number(body.startingPriceAFN) || 100000,
      reservePriceAFN: Number(body.reservePriceAFN) || Number(body.startingPriceAFN) * 1.2,
      isReserveMet: false,
      minIncrementAFN: Number(body.minIncrementAFN) || 10000,
      totalBids: 0,
      imageUrl: body.imageUrl || 'https://images.unsplash.com/photo-1541888946425-d0fbb186156f?w=600&auto=format&fit=crop&q=80',
      status: body.status || 'live',
      sellerId: body.sellerId || 'usr-seller-toloo',
      sellerName: body.sellerName || 'اداره تدارکات ملی افغانستان',
      inspectorName: body.inspectorName || 'آمریت ارزیابی و استندرد کابل',
      inspectionGrade: body.inspectionGrade || 'A+',
      escrowStatus: 'HesabPay Guaranteed',
      endTime: Date.now() + (body.durationHours ? body.durationHours * 3600 * 1000 : 7 * 86400 * 1000),
      bidHistory: [],
      suspiciousFlags: [],
    };

    db.auctions.unshift(newLot);
    db.addAuditLog('انجنیر احسان حق‌پال', 'CREATE_AUCTION_LOT', 'auction_ops', newLot.id, `Created auction lot ${newLot.lotNumber} (${newLot.title})`);
    res.json({ success: true, lot: newLot });
  });

  app.put('/api/admin/auctions/:id/action', (req: Request, res: Response) => {
    const lot = db.auctions.find(a => a.id === req.params.id);
    if (!lot) return res.status(404).json({ error: 'Auction lot not found' });

    const { action, extensionMinutes } = req.body;
    switch (action) {
      case 'approve':
        lot.status = 'live';
        break;
      case 'reject':
        lot.status = 'cancelled';
        break;
      case 'pause':
        lot.status = 'paused';
        break;
      case 'resume':
        lot.status = 'live';
        break;
      case 'extend':
        lot.endTime += (extensionMinutes || 15) * 60 * 1000;
        break;
      case 'close_hammer':
        lot.status = lot.isReserveMet ? 'sold' : 'unsold';
        lot.endTime = Date.now();
        break;
      case 'cancel':
        lot.status = 'cancelled';
        break;
      default:
        return res.status(400).json({ error: `Unknown auction action: ${action}` });
    }

    db.addAuditLog('انجنیر احسان حق‌پال', `AUCTION_${action.toUpperCase()}`, 'auction_ops', lot.id, `Executed ${action} on ${lot.lotNumber}`);
    res.json({ success: true, lot });
  });

  // -------------------------------------------------------------
  // 5. KYC & Tazkira Identity Verification Center
  // -------------------------------------------------------------
  app.get('/api/admin/kyc', (req: Request, res: Response) => {
    res.json(db.kycCases);
  });

  app.put('/api/admin/kyc/:id/decision', (req: Request, res: Response) => {
    const kyc = db.kycCases.find(k => k.id === req.params.id);
    if (!kyc) return res.status(404).json({ error: 'KYC case not found' });

    const { decision, reason, staffName } = req.body; // 'approved' | 'rejected' | 'resubmission_requested'
    kyc.status = decision;
    kyc.rejectionReason = reason;
    kyc.reviewerName = staffName || 'فریحه سادات (KYC Officer)';
    kyc.reviewDate = new Date().toISOString();

    // Sync to user record
    const user = db.users.find(u => u.id === kyc.userId);
    if (user) {
      user.kycStatus = decision === 'approved' ? 'verified' : decision === 'rejected' ? 'rejected' : 'resubmit_required';
    }

    db.addAuditLog(kyc.reviewerName || 'فریحه سادات (KYC Officer)', `KYC_${decision.toUpperCase()}`, 'kyc', kyc.id, `Decision on ${kyc.userName} - ${decision}${reason ? ': ' + reason : ''}`);
    res.json({ success: true, kyc, user });
  });

  // -------------------------------------------------------------
  // 6. Finance & HesabPay Settlement Center
  // -------------------------------------------------------------
  app.get('/api/admin/finance/summary', (req: Request, res: Response) => {
    const totalHeldEscrow = db.invoices
      .filter(i => i.paymentStatus === 'escrow_locked')
      .reduce((acc, i) => acc + i.totalPayableAFN, 0);

    const totalSettled = db.invoices
      .filter(i => i.paymentStatus === 'settled')
      .reduce((acc, i) => acc + i.totalPayableAFN, 0);

    const totalBuyerPremiums = db.invoices.reduce((acc, i) => acc + i.buyerPremiumAFN, 0);
    const totalSellerCommissions = db.invoices.reduce((acc, i) => acc + Math.round(i.winningBidAFN * (db.settings.sellerCommissionPct / 100)), 0);

    res.json({
      totalHeldEscrowAFN: totalHeldEscrow,
      totalSettledAFN: totalSettled,
      totalBuyerPremiumsAFN: totalBuyerPremiums,
      totalSellerCommissionsAFN: totalSellerCommissions,
      netPlatformRevenueAFN: totalBuyerPremiums + totalSellerCommissions,
      gateway: {
        provider: 'HesabPay',
        merchantId: process.env.HESABPAY_MERCHANT_ID || '',
        status: process.env.HESABPAY_API_KEY ? (process.env.HESABPAY_SANDBOX === 'false' ? 'Configured - production' : 'Configured - sandbox') : 'Not configured',
        currency: 'AFN',
      }
    });
  });

  app.get('/api/admin/finance/invoices', (req: Request, res: Response) => {
    res.json(db.invoices);
  });

  app.get('/api/admin/finance/ledger', (req: Request, res: Response) => {
    res.json(db.ledger);
  });

  app.post('/api/admin/finance/payout', (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(501).json({ error: 'Production HesabPay payout execution is disabled until the signed merchant payout API is integrated.' });
    }
    const { invoiceId, staffName } = req.body;
    const inv = db.invoices.find(i => i.id === invoiceId);
    if (!inv) return res.status(404).json({ error: 'Invoice not found' });

    inv.paymentStatus = 'settled';
    inv.settledAt = new Date().toISOString();

    const payoutAmount = Math.round(inv.winningBidAFN * (1 - db.settings.sellerCommissionPct / 100));

    // Append ledger entry
    const entry: any = {
      id: `led-${Date.now()}`,
      entryNumber: `LED-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      type: 'seller_payout',
      debitAccount: 'Customer_Escrow_Liability',
      creditAccount: 'Seller_HesabPay_Disbursement',
      amountAFN: payoutAmount,
      referenceId: inv.invoiceNumber,
      description: `Disbursed ${payoutAmount.toLocaleString('en-US')} AFN to ${inv.sellerName} via HesabPay`,
      verifiedByStaff: staffName || 'محمد بشیر پویا (Finance)',
    };
    db.ledger.unshift(entry);

    db.addAuditLog(entry.verifiedByStaff, 'EXECUTE_PAYOUT', 'finance', inv.id, `Released payout of ${payoutAmount} AFN for ${inv.lotNumber}`);
    res.json({ success: true, invoice: inv, ledgerEntry: entry });
  });

  app.post('/api/admin/finance/refund', (req: Request, res: Response) => {
    if (process.env.NODE_ENV === 'production') {
      return res.status(501).json({ error: 'Production HesabPay refund execution is disabled until the signed merchant refund API is integrated.' });
    }
    const { invoiceId, reason, staffName } = req.body;
    const inv = db.invoices.find(i => i.id === invoiceId);
    if (!inv) return res.status(404).json({ error: 'Invoice not found' });

    inv.paymentStatus = 'refunded';

    const entry: any = {
      id: `led-${Date.now()}`,
      entryNumber: `LED-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      type: 'buyer_refund',
      debitAccount: 'Customer_Escrow_Liability',
      creditAccount: 'Customer_HesabPay_Refund_Wallet',
      amountAFN: inv.totalPayableAFN,
      referenceId: inv.invoiceNumber,
      description: `Refunded full escrow ${inv.totalPayableAFN.toLocaleString('en-US')} AFN to ${inv.buyerName}: ${reason}`,
      verifiedByStaff: staffName || 'محمد بشیر پویا (Finance)',
    };
    db.ledger.unshift(entry);

    db.addAuditLog(entry.verifiedByStaff, 'ISSUE_REFUND', 'finance', inv.id, `Issued full refund of ${inv.totalPayableAFN} AFN to ${inv.buyerName}`);
    res.json({ success: true, invoice: inv, ledgerEntry: entry });
  });

  // -------------------------------------------------------------
  // 7. Fraud & Security Risk Engine
  // -------------------------------------------------------------
  app.get('/api/admin/fraud/flags', (req: Request, res: Response) => {
    res.json(db.fraudFlags);
  });

  app.put('/api/admin/fraud/flags/:id', (req: Request, res: Response) => {
    const flag = db.fraudFlags.find(f => f.id === req.params.id);
    if (!flag) return res.status(404).json({ error: 'Fraud flag not found' });

    const { status, actionNote } = req.body;
    flag.status = status;

    db.addAuditLog('انجنیر احسان حق‌پال', 'FRAUD_FLAG_DECISION', 'fraud', flag.id, `Fraud flag ${flag.id} updated to ${status}. Note: ${actionNote || 'N/A'}`);
    res.json({ success: true, flag });
  });

  // -------------------------------------------------------------
  // 8. Disputes & Mediation Center
  // -------------------------------------------------------------
  app.get('/api/admin/disputes', (req: Request, res: Response) => {
    res.json(db.disputes);
  });

  app.post('/api/admin/disputes/:id/message', (req: Request, res: Response) => {
    const disp = db.disputes.find(d => d.id === req.params.id);
    if (!disp) return res.status(404).json({ error: 'Dispute not found' });

    const { text, sender } = req.body;
    disp.messages.push({
      id: `m-${Date.now()}`,
      sender: sender || 'مدیریت و حکمیت نوبت',
      role: 'admin',
      text,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    });

    res.json({ success: true, dispute: disp });
  });

  app.put('/api/admin/disputes/:id/resolve', (req: Request, res: Response) => {
    const disp = db.disputes.find(d => d.id === req.params.id);
    if (!disp) return res.status(404).json({ error: 'Dispute not found' });

    const { resolution, notes, staffName } = req.body; // 'resolved_refund' | 'resolved_payout' | 'closed'
    disp.status = resolution;
    disp.resolutionNotes = notes;

    db.addAuditLog(staffName || 'انجنیر احسان حق‌پال', 'RESOLVE_DISPUTE', 'dispute', disp.id, `Dispute ${disp.caseNumber} resolved as ${resolution}. ${notes}`);
    res.json({ success: true, dispute: disp });
  });

  // -------------------------------------------------------------
  // 9. Logistics, Pickup & QR Item Release
  // -------------------------------------------------------------
  app.get('/api/admin/logistics', (req: Request, res: Response) => {
    res.json(db.deliveries);
  });

  app.post('/api/admin/logistics/verify-qr', (req: Request, res: Response) => {
    const { qrCode, pinCode, staffName } = req.body;
    const item = db.deliveries.find(d => d.qrReleaseCode === qrCode || d.pinCode === pinCode);
    if (!item) {
      return res.status(404).json({ success: false, error: 'کد کیوآر یا پین معتبر پیدا نشد. لطفا با فاکتور رسمی خریدار مطابقت دهید.' });
    }

    item.status = 'verified_released';
    item.releasedByStaff = staffName || 'احمد نوید (Logistics Officer)';
    item.releasedAt = new Date().toISOString();

    db.addAuditLog(item.releasedByStaff || 'احمد نوید (Logistics Officer)', 'QR_ITEM_RELEASE', 'logistics', item.id, `Verified QR release for ${item.lotNumber} to ${item.buyerName}`);
    res.json({ success: true, item });
  });

  // -------------------------------------------------------------
  // 10. Platform Settings & Global Rules
  // -------------------------------------------------------------
  app.get('/api/admin/settings', (req: Request, res: Response) => {
    res.json(db.settings);
  });

  app.put('/api/admin/settings', (req: Request, res: Response) => {
    const updates = req.body;
    Object.assign(db.settings, updates);

    db.addAuditLog('انجنیر احسان حق‌پال', 'UPDATE_SETTINGS', 'settings', 'global', `Updated platform settings: BuyerPremium=${db.settings.buyerPremiumPct}%, SellerCommission=${db.settings.sellerCommissionPct}%, AntiSnip=${db.settings.antiSnipingMinutes}m`);
    res.json({ success: true, settings: db.settings });
  });

  // -------------------------------------------------------------
  // 11. Tamper-Evident Immutable Audit Trail
  // -------------------------------------------------------------
  app.get('/api/admin/audit-logs', (req: Request, res: Response) => {
    res.json(db.auditLogs);
  });

  // -------------------------------------------------------------
  // Local frontend serving. Vercel serves the built Vite frontend separately.
  // -------------------------------------------------------------
  if (serveFrontend) {
    if (process.env.NODE_ENV === 'production') {
      app.use(express.static(path.resolve(__dirname, 'dist')));
      app.get('*', (req: Request, res: Response) => {
        res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
      });
    } else {
      const vite = await createViteServer({
        server: { middlewareMode: true, hmr: false },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    }
  }

  return app;
}

if (!process.env.VERCEL) {
  const PORT = Number(process.env.PORT || 3000);
  createApp(true).then((app) => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`NAWBAT full-stack server running on http://0.0.0.0:${PORT}`);
    });
  });
}
