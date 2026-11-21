import { IProcurementRepository } from "@/domain/repositories/procurement.repository.interface";
import { Procurement } from "@/domain/entities/procurement.entity";
import { ApiClient } from "../http/api-client";

export class HttpProcurementRepository implements IProcurementRepository {
  async findMany(): Promise<Procurement[]> {
    const raw = await ApiClient.get<Procurement[]>("/procurements");
    return Array.isArray(raw) ? raw : [];
  }
}
