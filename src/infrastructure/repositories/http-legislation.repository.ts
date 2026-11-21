import { ILegislationRepository } from "@/domain/repositories/legislation.repository.interface";
import { Legislation } from "@/domain/entities/legislation.entity";
import { sanitizePathId } from "@/shared";
import { ApiClient } from "../http/api-client";

export class HttpLegislationRepository implements ILegislationRepository {
  async findMany(params?: {
    search?: string;
    page?: number;
    limit?: number;
  }): Promise<Legislation[]> {
    const query = new URLSearchParams();
    if (params?.search) query.set("search", params.search);
    if (params?.page) query.set("page", params.page.toString());
    if (params?.limit) query.set("limit", params.limit.toString());
    const qs = query.toString();
    const endpoint = qs ? `/legislations?${qs}` : "/legislations";

    const raw = await ApiClient.get<Legislation[]>(endpoint);
    return Array.isArray(raw) ? raw : [];
  }

  async findById(id: string | number): Promise<Legislation | null> {
    const safeId = sanitizePathId(id);
    if (!safeId) return null;

    const raw = await ApiClient.get<Legislation>(`/legislations/${safeId}`);
    return raw ?? null;
  }
}
