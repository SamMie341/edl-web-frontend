import { IElectricityCalculatorRepository } from "@/domain/repositories/electricity-calculator.repository.interface";
import {
  CalculatorConfig,
  TariffScheduleInfo,
  CalculateElectricityDto,
  ElectricityCalculationResponse,
} from "@/domain/entities/electricity-calculator.entity";
import { ENV } from "../config/env.config";

export class HttpElectricityCalculatorRepository
  implements IElectricityCalculatorRepository
{
  private getCandidateBaseUrls(): string[] {
    const urls: string[] = [];
    // Only test local backend port 3005 during local development
    if (process.env.NODE_ENV === "development") {
      urls.push("http://localhost:3005/api/v1");
    }
    if (ENV.API_BASE_URL && !urls.includes(ENV.API_BASE_URL)) {
      urls.push(ENV.API_BASE_URL);
    }
    return urls;
  }

  private async executeApiRequest<T>(
    endpoint: string,
    method: "GET" | "POST" = "GET",
    body?: unknown
  ): Promise<T> {
    const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
    let lastError: Error | null = null;
    let attemptedAtLeastOne = false;

    for (const baseUrl of this.getCandidateBaseUrls()) {
      try {
        const url = `${baseUrl}${cleanEndpoint}`;
        const res = await fetch(url, {
          method,
          signal: AbortSignal.timeout(10_000),
          headers: {
            Accept: "application/json",
            ...(method === "POST" ? { "Content-Type": "application/json" } : {}),
          },
          ...(method === "POST" && body ? { body: JSON.stringify(body) } : {}),
        });

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          // If UAT returned HTML 404/502, continue to next URL candidate
          continue;
        }

        attemptedAtLeastOne = true;
        const json = await res.json();

        if (!res.ok) {
          // The backend returned a real error from NestJS/Postgres (e.g. 404: ບໍ່ພົບຕາຕະລາງອັດຕາຄ່າໄຟ...)
          const msg = json?.message || `HTTP ${res.status} on ${endpoint}`;
          throw new Error(msg);
        }

        return (json.data ?? json) as T;
      } catch (err: unknown) {
        const digest =
          typeof err === "object" && err !== null && "digest" in err
            ? (err as { digest?: string }).digest
            : undefined;
        if (
          digest === "NEXT_PRERENDER_INTERRUPTED" ||
          digest === "HANGING_PROMISE_REJECTION"
        ) {
          throw err;
        }
        lastError = err instanceof Error ? err : new Error(String(err));
        // If this is an actual business error returned from the backend (like NotFoundException 404),
        // we MUST rethrow it immediately so that the user and UI see the actual error from DB!
        if (attemptedAtLeastOne) {
          throw err;
        }
      }
    }

    throw lastError || new Error(`Cannot connect to backend API: ${endpoint}`);
  }

  async getConfig(): Promise<CalculatorConfig> {
    return this.executeApiRequest<CalculatorConfig>(
      "/electricity-calculator/config",
      "GET"
    );
  }

  async getSchedule(
    year: number,
    month: number,
    categoryId?: number
  ): Promise<TariffScheduleInfo | null> {
    const catQuery = categoryId ? `&categoryId=${categoryId}` : "";
    return this.executeApiRequest<TariffScheduleInfo>(
      `/electricity-calculator/schedules?year=${year}&month=${month}${catQuery}`,
      "GET"
    );
  }

  async calculate(
    dto: CalculateElectricityDto
  ): Promise<ElectricityCalculationResponse> {
    return this.executeApiRequest<ElectricityCalculationResponse>(
      "/electricity-calculator/calculate",
      "POST",
      dto
    );
  }
}
