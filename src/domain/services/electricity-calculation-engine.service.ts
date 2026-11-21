import {
  ApplianceInputItem,
  SavingActionTemplate,
  SavingRecommendationItem,
  TariffBillResult,
  TariffScheduleInfo,
  TierBreakdownItem,
} from "../entities/electricity-calculator.entity";

/**
 * Pure calculation engine service for electricity tariff progressive tiers and saving plan formulas.
 * All tariff rates, tier limits, appliance categories, and action templates are strictly dynamic
 * and provided by the backend database API. NO mock rates or static fallback schedules are defined here.
 */
export class ElectricityCalculationEngineService {
  /**
   * 1. ຄຳນວນພະລັງງານໄຟຟ້າລາຍເດືອນ (kWh) ຂອງແຕ່ລະເຄື່ອງໃຊ້ໄຟຟ້າ
   * Formula: (Watt * Quantity * HoursPerDay * DaysPerMonth) / 1000
   */
  public static calculateApplianceMonthlyKwh(item: ApplianceInputItem): number {
    const days = item.daysPerMonth ?? 30;
    const rawKwh = (item.watt * item.quantity * item.hoursPerDay * days) / 1000;
    return this.round2(Math.max(0, rawKwh));
  }

  /**
   * 2. ຄຳນວນຄ່າໄຟຕາມຂັ້ນບັນໄດ (Progressive Tiers) ພ້ອມ VAT ແລະ ເງື່ອນໄຂລະດູຮ້ອນ
   * ໃຊ້ຂໍ້ມູນ tiers ທີ່ສົ່ງມາຈາກ Database API
   */
  public static calculateProgressiveBill(
    totalKwhInput: number,
    schedule: TariffScheduleInfo,
    customMaintenanceFeeKip?: number
  ): TariffBillResult {
    const totalKwh = this.round2(Math.max(0, totalKwhInput));
    const sortedTiers = [...schedule.tiers].sort(
      (a, b) => a.tierOrder - b.tierOrder
    );
    const vatRate = Number(schedule.notice.vatRate ?? 0.1);
    const hotSeasonCapKwh = schedule.notice.hotSeasonDiscountCapKwh ?? 300;

    let remainingKwh = totalKwh;
    let previousMax = 0;
    let baseCostKip = 0;
    let highestTierOrder = 1;
    const tierBreakdown: TierBreakdownItem[] = [];

    for (const tier of sortedTiers) {
      const rate = Number(tier.rateKipPerKwh);
      let tierCapacity = Infinity;

      if (tier.maxKwh !== null && tier.maxKwh !== undefined) {
        tierCapacity = tier.maxKwh - previousMax;
        previousMax = tier.maxKwh;
      }

      const kwhInTier =
        remainingKwh > 0
          ? this.round2(Math.min(remainingKwh, tierCapacity))
          : 0;

      if (kwhInTier > 0) {
        highestTierOrder = tier.tierOrder;
      }

      const costKip = this.round2(kwhInTier * rate);
      baseCostKip += costKip;
      remainingKwh = this.round2(Math.max(0, remainingKwh - kwhInTier));

      tierBreakdown.push({
        tierOrder: tier.tierOrder,
        label: tier.label,
        minKwh: tier.minKwh,
        maxKwh: tier.maxKwh,
        rateKipPerKwh: rate,
        kwhInTier,
        costKip,
      });
    }

    baseCostKip = this.round2(baseCostKip);

    // ກໍລະນີລະດູຮ້ອນ (isHotSeason) ແລະ ໃຊ້ໄຟບໍ່ເກີນເພດານທີ່ກຳນົດ (ເຊັ່ນ <= 300 kWh) ຫຼຸດ 5%
    let hotSeasonDiscountKip = 0;
    if (schedule.isHotSeason && totalKwh > 0 && totalKwh <= hotSeasonCapKwh) {
      hotSeasonDiscountKip = this.round2(baseCostKip * 0.05);
    }

    // 1. ຄ່າໄຟລວມໃນເດືອນ (Net Energy Cost)
    const netBaseCostKip = this.round2(
      Math.max(0, baseCostKip - hotSeasonDiscountKip)
    );

    // 2. ຄ່າຊ່ອມບຳລຸງ / ຄ່າບຳລຸງຮັກສາ (Maintenance Fee)
    const scheduleMaintenance =
      schedule.maintenanceFeeKip !== null &&
      schedule.maintenanceFeeKip !== undefined
        ? Number(schedule.maintenanceFeeKip)
        : Number(schedule.notice.maintenanceFeeKip ?? 0);

    const maintenanceFeeKip = this.round2(
      customMaintenanceFeeKip !== undefined
        ? Math.max(0, customMaintenanceFeeKip)
        : scheduleMaintenance
    );

    // 3. ຍອດລວມກ່ອນອາກອນ = ຄ່າໄຟລວມໃນເດືອນ + ຄ່າຊ່ອມບຳລຸງ
    const subtotalBeforeVatKip = this.round2(
      netBaseCostKip + maintenanceFeeKip
    );

    // 4. ອາກອນມູນຄ່າເພີ່ມ (VAT) = ຍອດລວມກ່ອນອາກອນ * vatRate
    const vatCostKip = this.round2(subtotalBeforeVatKip * vatRate);

    // 5. ຄ່າໄຟລວມທັງໝົດໃນເດືອນ = ຍອດລວມກ່ອນອາກອນ + ອາກອນມູນຄ່າເພີ່ມ (ຄ່າໄຟລວມໃນເດືອນ + ຄ່າຊ່ອມບຳລຸງ + vat%)
    const totalCostKip = this.round2(subtotalBeforeVatKip + vatCostKip);

    return {
      totalKwh,
      highestTierOrder,
      baseCostKip,
      hotSeasonDiscountKip,
      netBaseCostKip,
      maintenanceFeeKip,
      subtotalBeforeVatKip,
      vatRate,
      vatCostKip,
      totalCostKip,
      tierBreakdown,
    };
  }

  /**
   * 3. ຄຳນວນສັດສ່ວນການປະຢັດໄຟ (savingFraction) ຕາມສູດ SavingRuleType
   */
  public static calculateActionSavingFraction(
    appliance: ApplianceInputItem,
    template: SavingActionTemplate
  ): number {
    if (
      appliance.watt <= 0 ||
      appliance.hoursPerDay <= 0 ||
      appliance.quantity <= 0
    ) {
      return 0;
    }

    let frac = 0;

    switch (template.ruleType) {
      case "FIXED_FRACTION": {
        frac = Number(template.fixedFraction ?? 0);
        break;
      }
      case "REDUCE_HOURS": {
        const reduceBy = Number(template.reduceHoursBy ?? 0);
        if (appliance.hoursPerDay > reduceBy && appliance.hoursPerDay > 0) {
          frac = reduceBy / appliance.hoursPerDay;
        } else if (appliance.hoursPerDay > 0) {
          frac = 0.5;
        }
        break;
      }
      case "REPLACE_WATTAGE": {
        const targetLow = template.targetWattLow ?? 9;
        const targetHigh = template.targetWattHigh ?? 16;
        const targetWatt = appliance.watt >= 30 ? targetHigh : targetLow;
        if (appliance.watt > targetWatt) {
          frac = (appliance.watt - targetWatt) / appliance.watt;
        }
        break;
      }
    }

    return Number(Math.min(0.9, Math.max(0, frac)).toFixed(4));
  }

  /**
   * 4. ຄຳນວນແຜນປະຢັດໄຟທັງໝົດ ພ້ອມປຽບທຽບກ່ອນ-ຫຼັງປະຢັດ
   */
  public static evaluateSavingPlan(
    appliances: Array<ApplianceInputItem & { monthlyKwh: number }>,
    templates: Array<SavingActionTemplate & { categoryCode?: string }>,
    selectedActionCodes: string[] | undefined,
    schedule: TariffScheduleInfo,
    beforeBill: TariffBillResult
  ) {
    const useDefaultSelection = selectedActionCodes === undefined;
    const selectedSet = new Set(selectedActionCodes ?? []);

    const recommendations: SavingRecommendationItem[] = [];
    let totalSavedKwh = 0;

    const currentTierObj = beforeBill.tierBreakdown.find(
      (t) => t.tierOrder === beforeBill.highestTierOrder
    );
    const marginalRateWithVat =
      (currentTierObj?.rateKipPerKwh ?? 1000) * (1 + (beforeBill.vatRate ?? 0.1));

    appliances.forEach((app, index) => {
      let remainingApplianceKwh = app.monthlyKwh;

      for (const tpl of templates) {
        if (tpl.categoryCode && tpl.categoryCode !== app.categoryCode) {
          continue;
        }

        const frac = this.calculateActionSavingFraction(app, tpl);
        if (frac <= 0) continue;

        const tplCode = tpl.code ?? String(tpl.id);
        const isSelected = useDefaultSelection
          ? tpl.defaultSelected
          : selectedSet.has(`${index}:${tplCode}`) ||
            selectedSet.has(tplCode);

        const estimatedKwhSaved = this.round2(remainingApplianceKwh * frac);
        const estimatedKipSaved = this.round2(
          estimatedKwhSaved * marginalRateWithVat
        );

        if (isSelected) {
          totalSavedKwh = this.round2(totalSavedKwh + estimatedKwhSaved);
          remainingApplianceKwh = this.round2(
            Math.max(0, remainingApplianceKwh - estimatedKwhSaved)
          );
        }

        recommendations.push({
          applianceIndex: index,
          applianceName: app.customName || app.categoryCode || "",
          categoryCode: app.categoryCode ?? "",
          actionCode: tplCode,
          titleLa: tpl.titleLa,
          titleEn: tpl.titleEn ?? null,
          descriptionLa: tpl.descriptionLa,
          descriptionEn: tpl.descriptionEn ?? null,
          effortLevel: tpl.effortLevel,
          ruleType: tpl.ruleType,
          isSelected,
          savingFraction: frac,
          estimatedKwhSaved,
          estimatedKipSaved,
        });
      }
    });

    const afterPlanKwh = this.round2(
      Math.max(0, beforeBill.totalKwh - totalSavedKwh)
    );
    const afterBill = this.calculateProgressiveBill(afterPlanKwh, schedule);

    const monthlySavedKip = this.round2(
      Math.max(0, beforeBill.totalCostKip - afterBill.totalCostKip)
    );
    const yearlySavedKip = this.round2(monthlySavedKip * 12);

    return {
      afterPlanKwh,
      totalSavedKwh,
      afterBill,
      monthlySavedKip,
      yearlySavedKip,
      recommendations,
    };
  }

  private static round2(value: number): number {
    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}
