import { authApi } from './authApi';

export type LiveBidResult = {
  success: true;
  bid: {
    id: string;
    amountAFN: number;
    maxProxyAFN: number | null;
    createdAt: string;
  };
  auction: {
    id: string;
    lotNumber: string;
    currentBidAFN: number;
    minimumNextBidAFN: number;
    reserveMet: boolean;
    endTime: number;
    antiSnipingExtended: boolean;
  };
};

export const bidApi = {
  async placeBid(input: { lotNumber: string; amountAFN: number; maxProxyAFN?: number }) {
    const token = authApi.token();
    if (!token) throw new Error('Please sign in before bidding.');

    const response = await fetch(`/api/auctions/${encodeURIComponent(input.lotNumber)}/bids`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        amountAFN: input.amountAFN,
        maxProxyAFN: input.maxProxyAFN,
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data?.error || 'Could not place the bid.');
    }
    return data as LiveBidResult;
  },
};
