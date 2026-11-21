import { IElectricityCalculatorRepository } from "@/domain/repositories/electricity-calculator.repository.interface";
import { TariffScheduleInfo } from "@/domain/entities/electricity-calculator.entity";
import { electricityCalculatorRepository } from "@/infrastructure/repositories";

export async function getTariffScheduleUseCase(
  year: number,
  month: number,
  categoryId?: number,
  repo: IElectricityCalculatorRepository = electricityCalculatorRepository
): Promise<TariffScheduleInfo | null> {
  return repo.getSchedule(year, month, categoryId);
}
