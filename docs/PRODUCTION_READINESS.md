# NAWBAT Production Readiness

Last reviewed: 2026-09-27

This file is the source-of-truth checklist for moving NAWBAT from a polished prototype to a real production auction marketplace.

## Status summary

### Build and deployment
- [x] Vite/React production build configured
- [x] GitHub Actions CI added
- [x] TypeScript typecheck included in CI
- [x] Vercel API entry point added
- [x] Vite/esbuild dependency conflict fixed
- [x] Vercel production deployment is green
- [ ] Add a lockfile for deterministic installs after final dependency set is stable

### Branding and public UI
- [x] NAWBAT brand banner/header
- [x] Dari-first experience
- [x] Pashto and English
- [x] RTL/LTR support
- [x] Mobile-responsive layout
- [x] Demo claims changed so unfinished integrations are not presented as live
- [x] Fake default user, wallet and KYC identities removed
- [ ] Replace temporary remote/demo listing images with owned or properly licensed production media
- [ ] Add final favicon, social preview image and app icons

### Admin and staff security
- [x] Hard-coded demo admin password removed
- [x] Password hashing support
- [x] Signed admin JWT sessions
- [x] Admin API authentication middleware
- [x] API and admin-login rate limits
- [x] Security headers
- [x] 1 MB JSON payload limit
- [x] X-Powered-By disabled
- [ ] Move admin sessions to secure HttpOnly cookies before broad staff rollout
- [ ] Add MFA for Super Admin and Finance roles
- [x] Enforce role permissions on protected admin endpoints in the backend
- [ ] Add account lock/recovery procedure for privileged staff

### Database
- [x] PostgreSQL schema created
- [x] Users table
- [x] Roles and permissions
- [x] User-role mapping
- [x] Admin notes
- [x] KYC cases
- [x] Auctions
- [x] Bids
- [x] Watchlists
- [x] Invoices
- [x] Payments
- [x] Payouts
- [x] Disputes
- [x] Fraud flags
- [x] Audit logs
- [x] Platform settings
- [x] Persistent admin user-management repository
- [ ] Move auction management from in-memory data to PostgreSQL
- [ ] Move KYC management from in-memory data to PostgreSQL
- [ ] Move finance/ledger/disputes/fraud/logistics/settings from in-memory data to PostgreSQL
- [ ] Add migration versioning and rollback strategy
- [ ] Add automated backups and point-in-time recovery

### Public user accounts
- [x] Unsafe unauthenticated mock-profile API disabled
- [x] Buyer registration
- [x] Seller/business registration
- [ ] Email/phone verification
- [ ] Password reset
- [x] Signed user sessions
- [ ] User account deletion/deactivation workflow
- [x] Notification preferences tied to authenticated users

### Auction engine
- [x] UI model supports timed auctions
- [x] Reserve-price presentation
- [x] Minimum increment presentation
- [x] Anti-sniping presentation
- [x] Proxy-bid fields exist in the data model
- [x] PostgreSQL-backed auctions accept bids only through a server-authoritative transactional endpoint
- [x] Database row locking/serialization for PostgreSQL-backed auction bids
- [x] Server-side increment validation
- [x] Seller self-bid prevention
- [x] Bidder account/status eligibility checks
- [x] Server-side 3-minute anti-sniping extension
- [ ] Full proxy-bidding calculation
- [ ] Move the public/sample auction catalog itself to PostgreSQL so every visible lot can use the live bidding engine
- [x] Accepted bids are appended as immutable bid rows with audit events
- [ ] Real-time WebSocket/SSE updates
- [ ] Auction close worker/job with winner selection
- [ ] Idempotent close/retry behavior

### Seller listings and media
- [x] Seller listing UI exists
- [x] New UI submissions default to pending review rather than auto-verified
- [ ] Connect listing submission to authenticated seller account
- [ ] Persist drafts and submitted listings
- [ ] Object storage for images/videos
- [ ] File-type, size and malware validation
- [ ] Image resizing/thumbnails
- [ ] Admin approval/rejection notes
- [ ] Listing version history

### KYC
- [x] KYC data model and admin workflow foundation
- [x] UI no longer claims a live government biometric integration
- [ ] Decide approved identity providers/process
- [ ] Obtain required authorization before any direct government identity-system integration
- [ ] Secure document storage with strict access controls
- [ ] Retention/deletion policy
- [ ] Reviewer audit trail in PostgreSQL

### HesabPay and finance
- [x] HesabPay environment-variable structure
- [x] Sandbox is the safe default
- [x] UI no longer claims live escrow/payment success
- [x] Production simulated payout/refund actions are disabled
- [ ] Obtain production merchant credentials
- [ ] Confirm supported checkout/payment methods
- [ ] Confirm whether hold/escrow-style flows are contractually and technically supported
- [ ] Implement signed checkout/session creation
- [ ] Implement webhook signature verification
- [ ] Persist raw webhook event IDs for idempotency
- [ ] Reconcile provider transactions to internal ledger
- [ ] Implement actual refund API only after provider confirmation
- [ ] Implement seller payout API only after provider confirmation
- [ ] Finance approval controls and dual authorization for sensitive payouts
- [ ] Daily reconciliation report

### Fraud and abuse
- [x] Fraud flag schema
- [x] Admin fraud UI foundation
- [ ] Device/session risk signals
- [ ] Rate limits for bid placement and account actions
- [ ] Duplicate-account review
- [ ] Shill-bidding detection
- [ ] Payment anomaly review
- [ ] Manual appeal/review workflow

### Logistics and disputes
- [x] QR/pickup UI foundation
- [x] Dispute UI foundation
- [ ] Persistent delivery/pickup records
- [ ] Signed or unpredictable release tokens
- [ ] Proof-of-release upload
- [ ] Support ticket persistence
- [ ] Dispute evidence attachments
- [ ] Resolution and refund linkage

### Legal and operations
- [ ] Terms of Use reviewed for Afghanistan operations
- [x] Privacy policy principles and versioned acceptance flow implemented (legal review still required)
- [x] Seller agreement drafted and shown during registration (legal review still required)
- [x] Buyer rules drafted and shown during registration (legal review still required)
- [ ] Prohibited/restricted items policy
- [x] Fee schedule implemented and versioned
- [ ] Refund/cancellation policy
- [ ] Data retention policy
- [ ] Customer-support contact details
- [ ] Company/business registration details shown only once confirmed
- [ ] Do not claim regulator, bank, ministry, ATRA, museum, guild or government endorsement without documentary authorization

## Required Vercel environment variables

```
DATABASE_URL
ADMIN_EMAIL
ADMIN_PASSWORD_HASH
JWT_SECRET
```

HesabPay variables remain disabled until the real merchant integration is available:

```
HESABPAY_SANDBOX=true
HESABPAY_BASE_URL
HESABPAY_API_KEY
HESABPAY_WEBHOOK_SECRET
HESABPAY_MERCHANT_ID
```

Generate the admin password hash locally:

```bash
npm install
npm run hash:password -- "your-strong-password"
```

Then store the resulting hash in `ADMIN_PASSWORD_HASH`. Never store the plaintext admin password in GitHub.

## Required release gate

Do not merge to production until all of these are true:

1. GitHub CI is green.
2. Vercel preview is green.
3. No hard-coded credentials are present.
4. DATABASE_URL is configured and migrations have been applied.
5. Admin login works with environment-backed credentials.
6. Public pages do not claim an integration or verification that is not actually live.
7. Payment-changing actions remain disabled until the real payment provider connection is verified.
8. A backup and rollback plan exists.
