import { IBranchRepository } from "@/domain/repositories/branch.repository.interface";
import { Branch, ServiceCenter } from "@/domain/entities/branch.entity";
import { sanitizePathId } from "@/shared";
import { ApiClient } from "../http/api-client";

export class HttpBranchRepository implements IBranchRepository {
  async findMany(): Promise<Branch[]> {
    const raw = await ApiClient.get<Branch[]>("/branches");
    return Array.isArray(raw) ? raw : [];
  }

  async findById(id: string | number): Promise<Branch | null> {
    const safeId = sanitizePathId(id);
    if (!safeId) return null;

    const raw = await ApiClient.get<Branch>(`/branches/${safeId}`);
    return raw ?? null;
  }

  async findServiceCenters(branchId?: number): Promise<ServiceCenter[]> {
    const validBranchId =
      typeof branchId === "number" && Number.isInteger(branchId) && branchId > 0
        ? branchId
        : undefined;
    const endpoint = validBranchId
      ? `/service-centers?branchId=${validBranchId}`
      : "/service-centers";
    const raw = await ApiClient.get<ServiceCenter[]>(endpoint);
    const list = Array.isArray(raw) ? raw : [];
    if (validBranchId) {
      return list.filter((c) => c.branchId === validBranchId);
    }
    return list;
  }
}
