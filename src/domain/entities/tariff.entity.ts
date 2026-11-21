export type TariffCategory = "residential" | "business" | "industrial" | "agriculture";

export interface ElectricityTariff {
  id: number;
  title: string;
  tariffType: "RESIDENTIAL" | "COMMERCIAL" | "INDUSTRIAL" | "AGRICULTURE" | "ENTERTAINMENT" | string;
  imageUrl?: string | null;
  pdfUrl?: string | null;
  effectiveDate?: string | null;
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface TariffTier {
  min: number;
  max: number;
  rate: number;
  label: string;
}

export interface TariffTierDetail {
  label: string;
  unitsInTier: number;
  rate: number;
  total: number;
}

export interface TariffCalculationResult {
  category: TariffCategory;
  units: number;
  subtotal: number;
  vat: number;
  grandTotal: number;
  tierDetails: TariffTierDetail[];
  estimatedSavingMoney: number;
}

export interface TariffRow {
  tier: string;
  range: string;
  rate: number;
  note: string;
}
