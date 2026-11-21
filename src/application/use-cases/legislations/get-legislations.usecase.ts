import { ILegislationRepository } from "@/domain/repositories/legislation.repository.interface";
import { Legislation } from "@/domain/entities/legislation.entity";
import { legislationRepository } from "@/infrastructure/repositories";

export async function getLegislationsUseCase(
  params?: { search?: string; page?: number; limit?: number },
  repo: ILegislationRepository = legislationRepository
): Promise<Legislation[]> {
  return repo.findMany(params);
}

export async function getLegislationByIdUseCase(
  id: string | number,
  repo: ILegislationRepository = legislationRepository
): Promise<Legislation | null> {
  return repo.findById(id);
}
