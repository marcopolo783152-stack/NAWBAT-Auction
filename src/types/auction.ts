export type Province = 'همه ولایات' | 'کابل' | 'هرات' | 'مزارشریف' | 'قندهار' | 'جلال‌آباد' | 'بامیان' | 'کندز';

export type CategoryId = 
  | 'all'
  | 'cars'
  | 'carpets'
  | 'jewelry'
  | 'antiques'
  | 'electronics'
  | 'machinery'
  | 'real_estate'
  | 'corporate';

export interface BidRecord {
  id: string;
  bidderName: string;
  bidderMaskedId: string;
  amountAFN: number;
  timestamp: string;
  isWinning?: boolean;
}

export interface AuctionLot {
  id: string;
  lotNumber: string;
  title: string;
  titleEn: string;
  titlePs: string;
  category: CategoryId;
  categoryLabel: string;
  province: Province;
  locationDetails: string;
  startingPriceAFN: number;
  currentBidAFN: number;
  reservePriceAFN: number;
  isReserveMet: boolean;
  minIncrementAFN: number;
  totalBids: number;
  imageUrl: string;
  additionalImages?: string[];
  endTime: number; // Unix timestamp in ms
  isClosingSoon?: boolean;
  status?: 'draft' | 'pending_approval' | 'scheduled' | 'live' | 'paused' | 'ended' | 'sold' | 'unsold' | 'cancelled';
  inspectorName: string;
  inspectionGrade: 'A+' | 'A' | 'B+' | 'B';
  escrowStatus: 'payment_pending' | 'payment_ready' | 'payment_verified' | string;
  description: string;
  descriptionEn: string;
  specs: Record<string, string>;
  bidHistory: BidRecord[];
  sellerName: string;
  sellerKycTier: number;
  sellerVerified: boolean;
}

export type Language = 'fa' | 'ps' | 'en';
export type ViewMode = 'web' | 'mobile_app';
export type ActiveTab = 'home' | 'browse' | 'closing' | 'categories' | 'my-bids' | 'watchlist' | 'corporate' | 'admin';
