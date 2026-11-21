import { IBranchRepository } from "@/domain/repositories/branch.repository.interface";
import { Branch } from "@/domain/entities/branch.entity";
import { branchRepository } from "@/infrastructure/repositories";

export async function getBranchByIdUseCase(
  id: string | number,
  repo: IBranchRepository = branchRepository
): Promise<Branch | null> {
  return repo.findById(id);
}
