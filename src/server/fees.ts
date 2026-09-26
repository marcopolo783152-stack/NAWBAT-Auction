export const NAWBAT_FEES = {
  buyerPremiumPct: 5,
  sellerListingAFN: 0,
  unsoldCommissionPct: 0,
  reserveOptionPctOfReserve: 20,
  featuredListingAFN: { min: 250, max: 500 },
  storageAFN: { min: 50, max: 500, basis: 'daily_or_weekly_by_location' },
  sellerCommissionSchedule: [
    { min: 0, max: 9_999, pct: 20 },
    { min: 10_000, max: 99_999, pct: 15 },
    { min: 100_000, max: 499_999, pct: 10 },
    { min: 500_000, max: 1_999_999, pct: 10 },
    { min: 2_000_000, max: null, pct: null, negotiatedMinPct: 5, negotiatedMaxPct: 10 },
  ],
} as const;

export function sellerCommissionForSale(finalSalePriceAFN: number, negotiatedPct?: number) {
  if (!Number.isFinite(finalSalePriceAFN) || finalSalePriceAFN < 0) {
    throw new Error('Invalid final sale price.');
  }

  const tier = NAWBAT_FEES.sellerCommissionSchedule.find(
    (item) => finalSalePriceAFN >= item.min && (item.max === null || finalSalePriceAFN <= item.max),
  );
  if (!tier) throw new Error('No seller commission tier configured.');

  if (tier.pct !== null) {
    const amountAFN = Math.round((finalSalePriceAFN * tier.pct) / 100);
    return { pct: tier.pct, amountAFN, negotiated: false as const };
  }

  const min = tier.negotiatedMinPct ?? 5;
  const max = tier.negotiatedMaxPct ?? 10;
  if (negotiatedPct === undefined) {
    return { pct: null, amountAFN: null, negotiated: true as const, negotiatedMinPct: min, negotiatedMaxPct: max };
  }
  if (negotiatedPct < min || negotiatedPct > max) {
    throw new Error(`Negotiated seller commission must be between ${min}% and ${max}%.`);
  }
  return {
    pct: negotiatedPct,
    amountAFN: Math.round((finalSalePriceAFN * negotiatedPct) / 100),
    negotiated: true as const,
    negotiatedMinPct: min,
    negotiatedMaxPct: max,
  };
}

export function buyerPremiumForSale(finalSalePriceAFN: number) {
  return Math.round((finalSalePriceAFN * NAWBAT_FEES.buyerPremiumPct) / 100);
}

export function reserveOptionFee(reserveAFN: number) {
  return Math.round((reserveAFN * NAWBAT_FEES.reserveOptionPctOfReserve) / 100);
}

export function quoteFees(finalSalePriceAFN: number, options?: { reserveAFN?: number; negotiatedSellerPct?: number }) {
  const buyerPremiumAFN = buyerPremiumForSale(finalSalePriceAFN);
  const sellerCommission = sellerCommissionForSale(finalSalePriceAFN, options?.negotiatedSellerPct);
  const reserveFeeAFN = options?.reserveAFN ? reserveOptionFee(options.reserveAFN) : 0;

  return {
    finalSalePriceAFN,
    buyerPremiumPct: NAWBAT_FEES.buyerPremiumPct,
    buyerPremiumAFN,
    buyerTotalBeforeDeliveryAndProcessingAFN: finalSalePriceAFN + buyerPremiumAFN,
    sellerCommission,
    reserveOptionPctOfReserve: NAWBAT_FEES.reserveOptionPctOfReserve,
    reserveFeeAFN,
    sellerNetBeforeOtherServicesAFN:
      sellerCommission.amountAFN === null
        ? null
        : finalSalePriceAFN - sellerCommission.amountAFN - reserveFeeAFN,
  };
}
