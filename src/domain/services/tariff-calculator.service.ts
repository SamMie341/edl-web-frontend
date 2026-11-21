import {
  TariffCategory,
  TariffCalculationResult,
  TariffTier,
  TariffTierDetail,
} from "../entities/tariff.entity";

/**
 * Domain Service: Calculates progressive bill dynamically given real tiers from the database.
 * No hardcoded or mock rates are stored in the codebase.
 */
export function calculateElectricityBillFromTiers(
  tiers: TariffTier[],
  units: number,
  vatRate: number = 0.1,
  options?: { isHotSeason?: boolean; hotSeasonCapKwh?: number }
): TariffCalculationResult {
  const safeUnits = Math.max(0, units || 0);
  let subtotal = 0;
  const tierDetails: TariffTierDetail[] = [];
  let remainingUnits = safeUnits;

  for (const tier of tiers) {
    if (remainingUnits <= 0) break;

    const tierCapacity =
      tier.max === Infinity || tier.max === null
        ? remainingUnits
        : tier.max - tier.min;
    const unitsApplied = Math.min(remainingUnits, tierCapacity);

    if (unitsApplied > 0) {
      const cost = unitsApplied * tier.rate;
      subtotal += cost;
      tierDetails.push({
        label: tier.label,
        unitsInTier: unitsApplied,
        rate: tier.rate,
        total: cost,
      });
      remainingUnits -= unitsApplied;
    }
  }

  // Hot Season Discount: 5% discount if hot season and units <= cap (default 300)
  const cap = options?.hotSeasonCapKwh ?? 300;
  if (options?.isHotSeason && safeUnits > 0 && safeUnits <= cap) {
    const discount = subtotal * 0.05;
    subtotal = Math.max(0, subtotal - discount);
  }

  const vat = subtotal * vatRate;
  const grandTotal = subtotal + vat;

  return {
    category: "residential",
    units: safeUnits,
    subtotal: Math.round(subtotal),
    vat: Math.round(vat),
    grandTotal: Math.round(grandTotal),
    tierDetails,
    estimatedSavingMoney: 0,
  };
}

/**
 * Backward-compatible helper that requires dynamic tiers.
 * Returns an empty result if tiers are not provided from the API.
 */
export function calculateElectricityBill(
  category: TariffCategory,
  units: number,
  options?: { tiers?: TariffTier[]; vatRate?: number; isHotSeason?: boolean }
): TariffCalculationResult {
  if (options?.tiers && options.tiers.length > 0) {
    return calculateElectricityBillFromTiers(
      options.tiers,
      units,
      options.vatRate ?? 0.1,
      { isHotSeason: options.isHotSeason }
    );
  }

  return {
    category,
    units: Math.max(0, units || 0),
    subtotal: 0,
    vat: 0,
    grandTotal: 0,
    tierDetails: [],
    estimatedSavingMoney: 0,
  };
}
