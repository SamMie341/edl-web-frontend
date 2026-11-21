import { IElectricalKnowledgeRepository } from "@/domain/repositories/electrical-knowledge.repository.interface";
import { ElectricalKnowledge } from "@/domain/entities/electrical-knowledge.entity";
import { sanitizePathId } from "@/shared";
import { ApiClient } from "../http/api-client";

export class HttpElectricalKnowledgeRepository
  implements IElectricalKnowledgeRepository
{
  async findMany(): Promise<ElectricalKnowledge[]> {
    const raw = await ApiClient.get<ElectricalKnowledge[]>(
      "/electrical-knowledge"
    );
    return Array.isArray(raw) ? raw : [];
  }

  async incrementView(
    id: string | number
  ): Promise<ElectricalKnowledge | null> {
    const safeId = sanitizePathId(id);
    if (!safeId) return null;

    const raw = await ApiClient.put<ElectricalKnowledge>(
      `/electrical-knowledge/${safeId}/view`
    );
    return raw ?? null;
  }
}
