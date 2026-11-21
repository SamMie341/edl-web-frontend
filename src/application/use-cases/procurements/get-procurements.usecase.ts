import { IProcurementRepository } from "@/domain/repositories/procurement.repository.interface";
import { Procurement } from "@/domain/entities/procurement.entity";
import { procurementRepository } from "@/infrastructure/repositories";

export async function getProcurementsUseCase(
  repo: IProcurementRepository = procurementRepository
): Promise<Procurement[]> {
  return repo.findMany();
}
