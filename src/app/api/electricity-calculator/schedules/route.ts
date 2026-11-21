import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getTariffScheduleUseCase } from "@/application";
import { checkRateLimit } from "@/infrastructure/security/rate-limit";

const scheduleQuerySchema = z.object({
  year: z.coerce.number().int().min(2020).max(2100).default(2026),
  month: z.coerce.number().int().min(1).max(12).default(11),
  categoryId: z.coerce.number().int().positive().max(100_000).optional(),
});

export async function GET(request: NextRequest) {
  const rate = checkRateLimit(request, "calc:schedules", 120, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        statusCode: 429,
        message: "Too many requests. Please try again later.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      }
    );
  }

  try {
    const { searchParams } = new URL(request.url);
    const parsed = scheduleQuerySchema.safeParse({
      year: searchParams.get("year") ?? undefined,
      month: searchParams.get("month") ?? undefined,
      categoryId:
        searchParams.get("categoryId") ??
        searchParams.get("category") ??
        undefined,
    });

    if (!parsed.success) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: "Invalid schedule query parameters",
        },
        { status: 400 }
      );
    }

    const { year, month, categoryId } = parsed.data;
    const schedule = await getTariffScheduleUseCase(year, month, categoryId);
    return NextResponse.json({
      statusCode: 200,
      message: "Schedule retrieved successfully",
      data: schedule,
    });
  } catch (error: unknown) {
    const digest =
      typeof error === "object" && error !== null && "digest" in error
        ? (error as { digest?: string }).digest
        : undefined;
    if (
      digest === "NEXT_PRERENDER_INTERRUPTED" ||
      digest === "HANGING_PROMISE_REJECTION"
    ) {
      throw error;
    }
    console.error("[API Error] electricity-calculator/schedules:", error);
    return NextResponse.json(
      {
        statusCode: 500,
        message: "Failed to get schedule",
      },
      { status: 500 }
    );
  }
}
