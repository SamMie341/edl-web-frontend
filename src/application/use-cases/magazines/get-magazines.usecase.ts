import { IMagazineRepository } from "@/domain/repositories/magazine.repository.interface";
import { Magazine } from "@/domain/entities/magazine.entity";
import { magazineRepository } from "@/infrastructure/repositories";

export async function getMagazinesUseCase(
  repo: IMagazineRepository = magazineRepository
): Promise<Magazine[]> {
  return repo.findMany();
}
