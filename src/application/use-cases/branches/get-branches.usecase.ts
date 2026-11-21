import { IBranchRepository } from "@/domain/repositories/branch.repository.interface";
import { Branch, BranchDisplay } from "@/domain/entities/branch.entity";
import { branchRepository } from "@/infrastructure/repositories";
import {
  HEADQUARTERS_BRANCH,
  mapBranchToDisplay,
} from "@/domain/services/branch-region.service";

export async function getBranchesUseCase(
  repo: IBranchRepository = branchRepository
): Promise<Branch[]> {
  return repo.findMany();
}

/**
 * Returns branches mapped with Headquarters at the top for presentation.
 * Automatically prefers entries with uploaded branch images if duplicates exist.
 */
export async function getBranchDisplaysUseCase(
  repo: IBranchRepository = branchRepository
): Promise<BranchDisplay[]> {
  const branches = await repo.findMany();

  // Deduplicate by branchName, preferring records with valid images
  const branchMap = new Map<string, Branch>();
  for (const b of branches) {
    const existing = branchMap.get(b.branchName);
    if (!existing) {
      branchMap.set(b.branchName, b);
    } else {
      const currentHasImg = Boolean(b.coverImage || b.branchImage);
      const existingHasImg = Boolean(existing.coverImage || existing.branchImage);
      if (currentHasImg && !existingHasImg) {
        branchMap.set(b.branchName, b);
      }
    }
  }

  const list: BranchDisplay[] = [HEADQUARTERS_BRANCH];
  branchMap.forEach((b) => {
    list.push(mapBranchToDisplay(b));
  });

  return list;
}
