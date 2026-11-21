import { ITariffRepository } from "@/domain/repositories/tariff.repository.interface";
import { ElectricityTariff } from "@/domain/entities/tariff.entity";
import { tariffRepository } from "@/infrastructure/repositories";

export async function getTariffsUseCase(
  repo: ITariffRepository = tariffRepository
): Promise<ElectricityTariff[]> {
  return repo.findMany();
}
