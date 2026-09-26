# NAWBAT Marketplace Legal & Operating Rules — Draft v1

**Status:** Product/operations draft for legal review before public launch.  
**Version:** 2026-09-26-v1

This document defines the platform rules implemented by NAWBAT. It is not a substitute for review by qualified counsel in the jurisdictions where NAWBAT operates.

## 1. Platform roles

NAWBAT supports these account classes:

- **Customer:** may browse, save items and use customer services.
- **Buyer:** may bid and purchase, subject to account status and auction eligibility.
- **Seller:** may submit items and manage approved seller listings.
- **Business Seller:** seller account for a company/dealer/business.
- **Staff:** internal operational account. Staff permissions are assigned by management.
- **Admin / Super Admin:** privileged internal roles. These cannot be created through public registration.

The platform may request additional verification before allowing higher-risk actions.

## 2. Buyer premium

The buyer premium is **5% of the winning bid**, before delivery and any separately disclosed payment-processing charge.

Example:

- Winning bid: 100,000 AFN
- Buyer premium: 5,000 AFN
- Buyer subtotal before delivery/payment-provider charges: 105,000 AFN

## 3. Seller commission

Seller commission is calculated from the final sale price:

| Final sale price | Seller commission |
|---|---:|
| Under 10,000 AFN | 20% |
| 10,000–99,999 AFN | 15% |
| 100,000–499,999 AFN | 10% |
| 500,000–1,999,999 AFN | 10% |
| 2,000,000+ AFN | Negotiated 5–10% |

For sales of 2,000,000 AFN or more, the negotiated rate must be recorded before the auction becomes live.

## 4. Other fees

- Seller listing fee: **0 AFN initially**
- Unsold-item commission: **0%**
- Reserve-price option: **20% of the reserve price**
- Featured listing: **250–500 AFN**
- Storage after the stated grace period: **50–500 AFN**, charged on the daily/weekly basis shown for that location/item
- Delivery: separate charge
- Authentication/appraisal: specialist quote when required
- Payment-processing: actual provider fee may be passed through or included in the buyer premium when configured and disclosed

Every fee that applies to a transaction should be shown before the user commits.

## 5. Bidding rules

1. A bid accepted by the server is binding, subject to applicable law and platform cancellation rights.
2. The server, not the browser display, is the source of truth for accepted bids.
3. Bids must satisfy the minimum next-bid amount and any bidder eligibility requirements.
4. A seller may not bid on their own item directly or indirectly.
5. Shill bidding, collusion, artificial price inflation and use of related accounts to manipulate bidding are prohibited.
6. Proxy bidding may automatically bid up to the bidder's confidential maximum.
7. A valid late bid may extend the closing time according to the anti-sniping rule.
8. If a reserve applies, the lot is not sold unless the reserve is met or the seller/NAWBAT takes an expressly permitted action.
9. NAWBAT may pause, extend, cancel or investigate an auction for technical, fraud, ownership, safety, legal or payment concerns.
10. Bid history and audit events should be retained according to the platform retention policy.

## 6. Buyer obligations

A buyer agrees to:

- provide accurate account information;
- maintain control of their login credentials;
- use only accounts they are authorized to use;
- pay a winning invoice by the stated deadline;
- inspect listing details, condition information and available documents;
- follow pickup/delivery instructions;
- not reverse or dispute a legitimate payment fraudulently;
- cooperate with reasonable verification for high-value or higher-risk transactions.

Repeated non-payment may result in bidding limits or account suspension.

## 7. Seller agreement

A seller represents that:

1. they own the item or have documented legal authority to sell it;
2. the item is not stolen, counterfeit or unlawfully possessed;
3. required ownership/regulatory documents will be supplied when applicable;
4. descriptions and known defects will be disclosed accurately;
5. photographs and information submitted may be used to market the approved listing;
6. the seller will not bid on their own listing or arrange for another person to do so;
7. NAWBAT may request inspection, documentation or additional verification;
8. fees and seller commission may be deducted from settlement;
9. payout occurs only after the payment and transaction conditions required by the final settlement workflow are satisfied;
10. NAWBAT may reject, pause or remove a listing that presents legal, fraud, ownership, safety or authenticity concerns.

## 8. Reserve-price option

A seller selecting a reserve price is charged **20% of the reserve price** according to the current NAWBAT fee schedule.

The exact reserve fee must be displayed before the seller confirms the reserve option.

A reserve fee and the seller commission are separate unless a specific promotion or contract states otherwise.

## 9. Listing approval

Submitting a listing does not mean it is live.

A listing may pass through:

- draft;
- submitted/pending approval;
- documentation review;
- inspection or specialist review where required;
- scheduled;
- live;
- ended/sold/unsold/cancelled.

NAWBAT may request corrections before approval.

## 10. Prohibited and restricted items

NAWBAT must not knowingly allow unlawful commerce.

Listings may be prohibited, restricted or require specialist/legal review when they involve:

- stolen property;
- counterfeit goods;
- goods the seller lacks authority to sell;
- illegal drugs or controlled contraband;
- prohibited weapons or regulated dangerous items;
- hazardous substances;
- protected cultural property or antiquities without required authority;
- wildlife/environmental contraband;
- items subject to sanctions/export/import restrictions;
- personal data, identity documents or other items whose sale violates law;
- any category NAWBAT determines cannot safely or lawfully be offered.

A listing may be frozen while legality or ownership is investigated.

## 11. Payments

1. NAWBAT may integrate HesabPay and other approved providers.
2. A payment is not considered successful merely because a browser redirects to a success page.
3. The backend must rely on a verified provider response/webhook or other approved server-side confirmation.
4. Provider transaction references must be recorded.
5. Duplicate provider events must not create duplicate payments.
6. Production payment functionality remains disabled until valid production credentials and provider requirements are configured.

## 12. Refunds

Refund eligibility depends on the final Refund Policy, transaction status and applicable law.

Potential refund scenarios may include:

- duplicate payment;
- payment for a cancelled transaction;
- verified platform/payment error;
- approved dispute resolution;
- other cases required by law or the final policy.

A refund is not complete until the provider confirms it.

## 13. Seller payouts

Seller payout equals the amount due under the transaction after applicable:

- seller commission;
- reserve fee;
- agreed service fees;
- refunds/adjustments;
- other properly disclosed charges.

High-value or sensitive payouts may require additional approval controls.

## 14. Pickup, delivery and storage

1. Each sale states its pickup/delivery method.
2. Identity or a secure release code/QR may be required.
3. Delivery charges are separate unless expressly included.
4. A grace period may be provided before storage charges begin.
5. Storage may be charged **50–500 AFN** using the daily/weekly basis disclosed for the item/location.
6. Release should be recorded in an auditable delivery/pickup record.
7. Policies for abandoned/uncollected items must be disclosed before enforcement.

## 15. Disputes

A dispute record should include:

- invoice/lot;
- buyer and seller;
- reason;
- evidence;
- staff assignment;
- messages;
- decision;
- any refund/adjustment;
- timestamps/audit history.

NAWBAT may request additional evidence from either party.

## 16. Account enforcement

NAWBAT may warn, limit, suspend or block an account for reasons including:

- fraud;
- shill bidding;
- abusive behavior;
- repeated non-payment;
- false identity information;
- prohibited listings;
- account compromise;
- payment abuse;
- violation of platform rules.

Privileged staff actions must be auditable.

## 17. Identity verification

NAWBAT may use manual review and approved third-party verification services.

The platform must not claim direct biometric/government-database verification unless that integration is actually authorized and live.

Verification records should be access-controlled and retained only as required by the final privacy/retention policy.

## 18. Privacy principles

The final Privacy Policy should disclose:

- account data collected;
- KYC/identity documents collected;
- transaction and payment references;
- device/IP/security signals;
- seller/listing information;
- customer-support/dispute records;
- cookies/local browser storage;
- service providers receiving necessary data;
- retention periods;
- deletion/deactivation processes;
- security safeguards;
- lawful disclosure obligations.

## 19. Staff roles and access

Staff permissions follow least privilege.

Examples:

- Auction Manager: auction operations
- Auctioneer: live auction controls
- Cataloger: listing/catalog work
- Finance: invoices, reconciliation, payouts/refunds
- KYC: identity-review cases
- Support: disputes/support
- Logistics: pickup/delivery
- Moderator: fraud/risk review
- Admin/Super Admin: broader management permissions

Public users cannot self-assign staff roles.

## 20. Platform records

NAWBAT should maintain auditable records for:

- account creation;
- role changes;
- KYC decisions;
- auction publication/actions;
- bids;
- invoices;
- payment events;
- refunds;
- payouts;
- dispute actions;
- pickup/release;
- sensitive settings changes.

## 21. Technical failure

If a material technical failure affects fair bidding, NAWBAT may pause, extend, reopen or cancel an affected auction according to a documented incident procedure.

The decision and relevant timestamps should be logged.

## 22. Legal review before launch

Before public production launch, qualified counsel should review and localize:

- Terms of Use;
- Buyer Terms;
- Seller Agreement;
- Managed Auction/Consignment Agreement;
- Fee Schedule;
- Payment & Refund Policy;
- Auction Rules;
- Prohibited/Restricted Items Policy;
- KYC Policy;
- Privacy Policy;
- Pickup/Delivery/Storage Policy;
- Dispute Policy.

The version shown to a user at registration should be recorded with the acceptance timestamp.
