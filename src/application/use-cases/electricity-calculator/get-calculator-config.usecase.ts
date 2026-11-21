import { IElectricityCalculatorRepository } from "@/domain/repositories/electricity-calculator.repository.interface";
import { CalculatorConfig } from "@/domain/entities/electricity-calculator.entity";
import { electricityCalculatorRepository } from "@/infrastructure/repositories";

export async function getCalculatorConfigUseCase(
  repo: IElectricityCalculatorRepository = electricityCalculatorRepository
): Promise<CalculatorConfig> {
  return repo.getConfig();
}
