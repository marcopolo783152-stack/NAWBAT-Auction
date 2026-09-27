import { getPool } from './postgres';

export class BidError extends Error {
  status: number;
  code: string;
  constructor(status: number, code: string, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

export async function placePersistentBid(input: {
  lotNumber: string;
  bidderId: string;
  amountAFN: number;
  maxProxyAFN?: number;
  ipAddress?: string | null;
}) {
  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('begin');

    const auctionResult = await client.query(
      `select
         id, lot_number, seller_id, status, current_bid_afn, starting_price_afn,
         reserve_price_afn, min_increment_afn, ends_at
       from auctions
       where lot_number = $1
       for update`,
      [input.lotNumber],
    );
    const auction = auctionResult.rows[0];
    if (!auction) throw new BidError(404, 'AUCTION_NOT_FOUND', 'This auction is not available in the live bidding database.');

    const bidderResult = await client.query(
      `select id, user_type, status, is_bidding_blocked
       from users
       where id = $1
       limit 1`,
      [input.bidderId],
    );
    const bidder = bidderResult.rows[0];
    if (!bidder) throw new BidError(401, 'BIDDER_NOT_FOUND', 'Your bidder account could not be found.');
    if (bidder.status !== 'active') throw new BidError(403, 'ACCOUNT_NOT_ACTIVE', 'Your account is not active for bidding.');
    if (bidder.is_bidding_blocked) throw new BidError(403, 'BIDDING_BLOCKED', 'Bidding is currently blocked on your account.');
    if (bidder.user_type === 'staff') throw new BidError(403, 'STAFF_BIDDING_BLOCKED', 'Staff accounts cannot place marketplace bids.');
    if (auction.seller_id === input.bidderId) throw new BidError(403, 'SELLER_SELF_BID', 'Sellers cannot bid on their own auction.');

    if (auction.status !== 'live') throw new BidError(409, 'AUCTION_NOT_LIVE', 'This auction is not currently accepting bids.');

    const now = new Date();
    const currentEndsAt = new Date(auction.ends_at);
    if (currentEndsAt.getTime() <= now.getTime()) {
      throw new BidError(409, 'AUCTION_ENDED', 'This auction has already ended.');
    }

    const currentBid = Number(auction.current_bid_afn);
    const startingPrice = Number(auction.starting_price_afn);
    const increment = Math.max(1, Number(auction.min_increment_afn));
    const minimumBid = currentBid > 0 ? currentBid + increment : startingPrice;

    if (!Number.isSafeInteger(input.amountAFN) || input.amountAFN < minimumBid) {
      throw new BidError(400, 'BID_TOO_LOW', `Minimum acceptable bid is ${minimumBid} AFN.`);
    }

    if (input.maxProxyAFN !== undefined) {
      if (!Number.isSafeInteger(input.maxProxyAFN) || input.maxProxyAFN < input.amountAFN) {
        throw new BidError(400, 'INVALID_PROXY_MAX', 'Proxy maximum must be at least the submitted bid amount.');
      }
    }

    const antiSnipingMs = 3 * 60 * 1000;
    const remainingMs = currentEndsAt.getTime() - now.getTime();
    const extended = remainingMs <= antiSnipingMs;
    const nextEndsAt = extended
      ? new Date(Math.max(currentEndsAt.getTime(), now.getTime()) + antiSnipingMs)
      : currentEndsAt;

    const bidResult = await client.query(
      `insert into bids
        (auction_id, bidder_id, amount_afn, max_proxy_afn, source, ip_address, accepted)
       values ($1,$2,$3,$4,'web',$5,true)
       returning id, amount_afn, max_proxy_afn, created_at`,
      [
        auction.id,
        input.bidderId,
        input.amountAFN,
        input.maxProxyAFN ?? null,
        input.ipAddress || null,
      ],
    );

    await client.query(
      `update auctions
       set current_bid_afn = $1,
           ends_at = $2,
           updated_at = now()
       where id = $3`,
      [input.amountAFN, nextEndsAt.toISOString(), auction.id],
    );

    await client.query(
      `insert into audit_logs
        (actor_user_id, action, category, target_type, target_id, details, ip_address)
       values ($1,'BID_ACCEPTED','auction_ops','auction',$2,$3::jsonb,$4)`,
      [
        input.bidderId,
        auction.id,
        JSON.stringify({
          lotNumber: auction.lot_number,
          amountAFN: input.amountAFN,
          maxProxyAFN: input.maxProxyAFN ?? null,
          antiSnipingExtended: extended,
          previousEndsAt: currentEndsAt.toISOString(),
          newEndsAt: nextEndsAt.toISOString(),
        }),
        input.ipAddress || null,
      ],
    );

    await client.query('commit');

    const bid = bidResult.rows[0];
    return {
      success: true,
      bid: {
        id: bid.id,
        amountAFN: Number(bid.amount_afn),
        maxProxyAFN: bid.max_proxy_afn === null ? null : Number(bid.max_proxy_afn),
        createdAt: bid.created_at,
      },
      auction: {
        id: auction.id,
        lotNumber: auction.lot_number,
        currentBidAFN: input.amountAFN,
        minimumNextBidAFN: input.amountAFN + increment,
        reserveMet: auction.reserve_price_afn === null
          ? true
          : input.amountAFN >= Number(auction.reserve_price_afn),
        endTime: nextEndsAt.getTime(),
        antiSnipingExtended: extended,
      },
    };
  } catch (error) {
    await client.query('rollback');
    throw error;
  } finally {
    client.release();
  }
}
