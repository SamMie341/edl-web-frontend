import { IBranchRepository } from "@/domain/repositories/branch.repository.interface";
import { ServiceCenter } from "@/domain/entities/branch.entity";
import { branchRepository } from "@/infrastructure/repositories";

export async function getServiceCentersUseCase(
  branchId?: number,
  repo: IBranchRepository = branchRepository
): Promise<ServiceCenter[]> {
  return repo.findServiceCenters(branchId);
}
