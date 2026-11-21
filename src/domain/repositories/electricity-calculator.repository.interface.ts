import {
  CalculatorConfig,
  TariffScheduleInfo,
  CalculateElectricityDto,
  ElectricityCalculationResponse,
} from "../entities/electricity-calculator.entity";

export interface IElectricityCalculatorRepository {
  getConfig(): Promise<CalculatorConfig>;
  getSchedule(year: number, month: number, categoryId?: number): Promise<TariffScheduleInfo | null>;
  calculate(dto: CalculateElectricityDto): Promise<ElectricityCalculationResponse>;
}
