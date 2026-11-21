import { IElectricityCalculatorRepository } from "@/domain/repositories/electricity-calculator.repository.interface";
import {
  CalculateElectricityDto,
  ElectricityCalculationResponse,
} from "@/domain/entities/electricity-calculator.entity";
import { electricityCalculatorRepository } from "@/infrastructure/repositories";

export async function calculateElectricityBillUseCase(
  dto: CalculateElectricityDto,
  repo: IElectricityCalculatorRepository = electricityCalculatorRepository
): Promise<ElectricityCalculationResponse> {
  return repo.calculate(dto);
}
