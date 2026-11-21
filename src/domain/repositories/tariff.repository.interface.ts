import { ElectricityTariff } from "../entities/tariff.entity";

export interface ITariffRepository {
  findMany(): Promise<ElectricityTariff[]>;
}
