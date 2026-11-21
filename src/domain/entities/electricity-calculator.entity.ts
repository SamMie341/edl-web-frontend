export interface ApplianceInputItem {
  id?: string | number;
  categoryId?: number;
  categoryCode?: string;
  presetId?: number | null;
  presetCode?: string | null;
  customName?: string;
  watt: number;
  quantity: number;
  hoursPerDay: number;
  daysPerMonth?: number;
}

export interface TierBreakdownItem {
  tierOrder: number;
  label: string;
  minKwh: number;
  maxKwh: number | null;
  rateKipPerKwh: number;
  tierKwh?: number;
  kwhInTier?: number;
  costKip: number;
}

export interface TariffBillResult {
  totalKwh: number;
  highestTierOrder: number;
  baseCostKip: number;
  hotSeasonDiscountKip: number;
  netBaseCostKip: number;
  maintenanceFeeKip: number;
  subtotalBeforeVatKip: number;
  vatRate?: number;
  vatCostKip: number;
  totalCostKip: number;
  tierBreakdown: TierBreakdownItem[];
}

export interface SavingRecommendationItem {
  applianceIndex?: number;
  applianceName?: string;
  categoryCode?: string;
  actionCode?: string;
  templateId?: number;
  templateCode?: string;
  titleLa: string;
  titleEn: string | null;
  descriptionLa: string;
  descriptionEn: string | null;
  effortLevel: string;
  ruleType?: string;
  appliedApplianceCount?: number;
  isSelected?: boolean;
  isDefaultSelected?: boolean;
  savingFraction?: number;
  estimatedKwhSaved?: number;
  savedKwhPerMonth?: number;
  estimatedKipSaved?: number;
  savedKipPerMonth?: number;
}

export interface AppliancePreset {
  id: number;
  code?: string;
  nameLa: string;
  nameEn?: string | null;
  defaultWatt: number;
  defaultQuantity: number;
  defaultHoursPerDay: number;
  defaultDaysPerMonth: number;
  isSampleDefault: boolean;
}

export interface SavingActionTemplate {
  id: number;
  code?: string;
  titleLa: string;
  titleEn?: string | null;
  descriptionLa: string;
  descriptionEn?: string | null;
  effortLevel: "EASY" | "LOW_COST" | "INVESTMENT" | string;
  ruleType: "FIXED_FRACTION" | "REDUCE_HOURS" | "REPLACE_WATTAGE" | string;
  fixedFraction?: number | null;
  reduceHoursBy?: number | null;
  targetWattLow?: number | null;
  targetWattHigh?: number | null;
  defaultSelected: boolean;
}

export interface ApplianceCategory {
  id: number;
  code?: string;
  nameLa: string;
  nameEn?: string | null;
  iconName?: string | null;
  orderIndex: number;
  presets: AppliancePreset[];
  actionTemplates: SavingActionTemplate[];
}

export interface TariffCategoryInfo {
  id: number;
  nameLa: string;
  nameEn?: string | null;
  categoryGroup?: string | null;
  voltageLevel?: string | null;
  description?: string | null;
  orderIndex: number;
}

export interface TariffNoticeInfo {
  noticeNumber: string;
  title: string;
  vatRate: number;
  hotSeasonDiscountCapKwh: number;
  maintenanceFeeKip?: number;
}

export interface TariffTierInfo {
  tierOrder: number;
  label: string;
  minKwh: number;
  maxKwh: number | null;
  rateKipPerKwh: number;
}

export interface TariffScheduleInfo {
  id: number;
  categoryId?: number;
  category?: {
    id: number;
    nameLa: string;
    nameEn?: string | null;
  };
  year: number;
  month: number;
  isHotSeason: boolean;
  maintenanceFeeKip?: number | null;
  notice: TariffNoticeInfo;
  tiers: TariffTierInfo[];
}

export interface AvailableScheduleSummary {
  id?: number;
  categoryId?: number;
  year: number;
  month: number;
  isHotSeason: boolean;
  noticeNumber?: string;
}

export interface CalculatorConfig {
  categories: ApplianceCategory[];
  tariffCategories?: TariffCategoryInfo[];
  sampleAppliances: ApplianceInputItem[];
  availableSchedules: AvailableScheduleSummary[];
  defaultSchedule: TariffScheduleInfo | null;
}

export interface CalculateElectricityDto {
  year?: number;
  month?: number;
  categoryId?: number;
  directMonthlyKwh?: number | null;
  maintenanceFeeKip?: number | null;
  appliances?: ApplianceInputItem[];
  selectedActionCodes?: string[];
}

export interface EvaluatedApplianceItem {
  index: number;
  categoryCode: string;
  presetCode: string | null;
  customName: string;
  watt: number;
  quantity: number;
  hoursPerDay: number;
  daysPerMonth: number;
  monthlyKwh: number;
  sharePercent: number;
}

export interface YearlyOutlookItem {
  year: number;
  month: number;
  beforeTotalCostKip: number;
  afterTotalCostKip: number;
  monthlySavedKip: number;
  yearlySavedKip: number;
}

export interface ElectricityCalculationResponse {
  selectedPeriod: {
    scheduleId: number;
    categoryId?: number;
    categoryName?: string;
    year: number;
    month: number;
    isHotSeason: boolean;
    noticeNumber: string;
    vatRate: number;
    maintenanceFeeKip?: number;
  };
  summary: {
    totalMonthlyKwh: number;
    afterPlanKwh: number;
    totalSavedKwh: number;
    currentTierOrder: number;
    afterTierOrder: number;
    baseCostKip: number;
    hotSeasonDiscountKip: number;
    netBaseCostKip: number;
    maintenanceFeeKip: number;
    subtotalBeforeVatKip: number;
    vatCostKip: number;
    totalCostKip: number;
    afterPlanCostKip: number;
    monthlySavedKip: number;
    yearlySavedKip: number;
  };
  currentBill: TariffBillResult;
  afterPlanBill: TariffBillResult;
  appliances: EvaluatedApplianceItem[];
  savingRecommendations: SavingRecommendationItem[];
  yearlyOutlook: YearlyOutlookItem[];
}
