import { IMagazineRepository } from "@/domain/repositories/magazine.repository.interface";
import { Magazine } from "@/domain/entities/magazine.entity";
import { sanitizePathId } from "@/shared";
import { ApiClient } from "../http/api-client";

export class HttpMagazineRepository implements IMagazineRepository {
  async findMany(): Promise<Magazine[]> {
    const raw = await ApiClient.get<Magazine[]>("/magazines");
    return Array.isArray(raw) ? raw : [];
  }

  async findById(id: string | number): Promise<Magazine | null> {
    const safeId = sanitizePathId(id);
    if (!safeId) return null;

    const raw = await ApiClient.get<Magazine>(`/magazines/${safeId}`);
    return raw ?? null;
  }

  async incrementDownload(id: string | number): Promise<Magazine | null> {
    const safeId = sanitizePathId(id);
    if (!safeId) return null;

    const raw = await ApiClient.put<Magazine>(`/magazines/${safeId}/download`);
    return raw ?? null;
  }
}
