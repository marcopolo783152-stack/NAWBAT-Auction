# NAWBAT Product Upgrade Roadmap — 2026 Benchmark

Updated: 2026-09-27

Purpose: keep NAWBAT development focused on the highest-impact auction marketplace capabilities instead of adding disconnected UI features.

## P0 — Auction correctness and trust

1. **Move every public auction/listing to PostgreSQL**
   - The visible catalog and the bidding engine must use the same authoritative auction records.
   - No frontend-only auction should look live.

2. **Complete proxy/automatic bidding**
   - User enters a confidential maximum.
   - System bids only enough to remain highest bidder.
   - Resolve competing proxy maxima transactionally.

3. **Real-time bid and timer updates**
   - SSE or WebSocket fan-out for current bid, bid count, outbid state and extended closing time.
   - Reconnect/resync logic so clients recover cleanly after network drops.

4. **Auction close worker**
   - Close auctions server-side.
   - Select the valid winner once.
   - Respect reserve status.
   - Make finalization idempotent and safe to retry.

5. **Bid/event auditability**
   - Keep immutable bid events.
   - Store auction extensions, pauses, reserve changes and closes.
   - Provide staff-readable audit history.

## P1 — Buyer confidence and conversion

6. **Transparent fee preview everywhere**
   - Show next minimum bid.
   - Show buyer premium.
   - Show estimated total before the user confirms a bid.
   - Keep delivery/payment-provider charges clearly separated.

7. **Seller trust profile**
   - Seller profile page.
   - Verification status with precise wording about what was actually verified.
   - Completed sales, response time, dispute rate and verified transaction reviews when enough data exists.
   - Never use vague or fake verification claims.

8. **Auction Q&A / comments**
   - Buyers ask public listing questions.
   - Seller/admin replies.
   - Moderation and audit trail.
   - Notifications for replies and new seller information.

9. **Activity center**
   - Outbid.
   - Auction ending soon.
   - Seller added photos/details.
   - Reserve changed where allowed.
   - Won/lost auction.
   - Invoice/payment/pickup status.

10. **Ending Soon command center**
    - Let users watch several auctions finishing soon on one screen.
    - Live timer and latest-bid changes.
    - Quick path back into bidding.

## P1 — Seller experience

11. **Persistent seller listing wizard**
    - Draft autosave.
    - Photo/video upload.
    - Condition checklist by category.
    - Ownership/document requirements.
    - Preview before submission.
    - Admin revision requests.

12. **Listing media quality system**
    - Object storage.
    - Original + optimized derivatives.
    - Thumbnail generation.
    - Minimum resolution checks.
    - File-type/size validation.
    - Malware scanning.
    - Image ordering and captions.

13. **Seller live-auction dashboard**
    - Watchers.
    - Bids.
    - Questions.
    - Views.
    - Reserve state.
    - Approved reserve adjustment flow where permitted.

## P1 — Post-sale operations

14. **Invoice and settlement state machine**
    - Won → invoice → payment pending → paid → pickup/delivery → completed → payout eligible → paid out.

15. **Pickup/release security**
    - Unpredictable one-time release token/QR.
    - Staff identity check.
    - Proof of release.
    - Timestamp/location metadata where appropriate.

16. **Disputes as a product workflow**
    - Evidence attachments.
    - Buyer/seller messages.
    - Staff assignment.
    - Decision and refund/payout linkage.
    - Full audit history.

## P2 — Search, discovery and retention

17. **Saved searches**
    - Category, province, price, seller and keywords.
    - Alert frequency preferences.

18. **Search relevance**
    - Typo tolerance and transliteration where practical across Dari/Pashto/English.
    - Category-specific facets.
    - Recent searches.
    - Search analytics.

19. **Results/history**
    - Searchable completed auction results.
    - Price-history charts.
    - Comparable sold items.

20. **Personalized home**
    - Watched categories.
    - Saved searches.
    - Recently viewed.
    - Ending soon.
    - New listings matching interests.

## P2 — Platform resilience

21. **Secure staff sessions**
    - HttpOnly secure cookies.
    - MFA for Super Admin and Finance.
    - Privileged-session re-authentication for sensitive actions.

22. **Database operations**
    - Versioned migrations.
    - Automated backups.
    - Point-in-time recovery.
    - Restore drills.

23. **Observability**
    - Error tracking.
    - Structured server logs.
    - Bid latency metrics.
    - Payment webhook failures.
    - Auction close failures.
    - Alerting.

24. **Performance**
    - CDN-backed media.
    - Responsive image sizes.
    - Lazy loading below the fold.
    - Skeleton loading.
    - Cache public catalog queries without caching stale bid state.

## Design rules

- Mobile-first does **not** mean exposing a “mobile preview” button to customers. Responsive behavior should be automatic.
- Prefer fewer obvious actions over crowded controls.
- Every price-affecting action must show the consequence before confirmation.
- Never label identity, payment, escrow, KYC, inspections or bidders as verified unless the corresponding production process actually verified them.
- Use scalable SVG/HTML/CSS branding for large hero artwork where possible; do not stretch small raster images across desktop widths.
- Fast pages and stable layout are part of visual quality.
- Dari remains the default experience, with proper RTL; Pashto and English must receive equivalent functional coverage.
