import { IOrgStructureRepository } from "@/domain/repositories/organization.repository.interface";
import { OrgStructure } from "@/domain/entities/organization.entity";
import { ApiClient } from "../http/api-client";

export class HttpOrgStructureRepository implements IOrgStructureRepository {
  async findMany(): Promise<OrgStructure[]> {
    const raw = await ApiClient.get<OrgStructure[]>("/org-structures");
    return Array.isArray(raw) ? raw : [];
  }
}
