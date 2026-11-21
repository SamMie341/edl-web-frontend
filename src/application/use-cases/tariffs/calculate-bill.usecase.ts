import {
  TariffCategory,
  TariffCalculationResult,
  TariffTier,
} from "@/domain/entities/tariff.entity";
import {
  calculateElectricityBill,
  calculateElectricityBillFromTiers,
} from "@/domain/services/tariff-calculator.service";

export function calculateBillUseCase(
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
  return calculateElectricityBill(category, units, options);
}
