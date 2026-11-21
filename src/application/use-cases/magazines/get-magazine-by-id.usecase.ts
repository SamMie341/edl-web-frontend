import { IMagazineRepository } from "@/domain/repositories/magazine.repository.interface";
import { Magazine } from "@/domain/entities/magazine.entity";
import { magazineRepository } from "@/infrastructure/repositories";

export async function getMagazineByIdUseCase(
  id: string | number,
  repo: IMagazineRepository = magazineRepository
): Promise<Magazine | null> {
  return repo.findById(id);
}
