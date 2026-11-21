import { Branch, ServiceCenter } from "../entities/branch.entity";

export interface IBranchRepository {
  findMany(): Promise<Branch[]>;
  findById(id: string | number): Promise<Branch | null>;
  findServiceCenters(branchId?: number): Promise<ServiceCenter[]>;
}
