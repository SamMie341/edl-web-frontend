import { ITariffRepository } from "@/domain/repositories/tariff.repository.interface";
import { ElectricityTariff } from "@/domain/entities/tariff.entity";
import { ApiClient } from "../http/api-client";

export class HttpTariffRepository implements ITariffRepository {
  async findMany(): Promise<ElectricityTariff[]> {
    const raw = await ApiClient.get<ElectricityTariff[]>("/electricity-tariffs");
    return Array.isArray(raw) ? raw : [];
  }
}
