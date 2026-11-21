import { IOrgStructureRepository } from "@/domain/repositories/organization.repository.interface";
import { OrgStructure } from "@/domain/entities/organization.entity";
import { orgStructureRepository } from "@/infrastructure/repositories";

export async function getOrgStructuresUseCase(
  repo: IOrgStructureRepository = orgStructureRepository
): Promise<OrgStructure[]> {
  return repo.findMany();
}
