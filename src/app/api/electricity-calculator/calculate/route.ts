import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { calculateElectricityBillUseCase } from "@/application";
import { CalculateElectricityDto } from "@/domain/entities/electricity-calculator.entity";
import { checkRateLimit } from "@/infrastructure/security/rate-limit";

const MAX_BODY_BYTES = 64 * 1024; // 64 KB

const applianceItemSchema = z.object({
  id: z
    .union([z.string().max(64), z.number().finite()])
    .nullable()
    .optional()
    .transform((v) => v ?? undefined),
  categoryId: z
    .number()
    .int()
    .positive()
    .max(100_000)
    .nullable()
    .optional()
    .transform((v) => v ?? undefined),
  categoryCode: z
    .string()
    .max(64)
    .nullable()
    .optional()
    .transform((v) => v ?? undefined),
  presetId: z.number().int().positive().max(100_000).nullable().optional(),
  presetCode: z.string().max(64).nullable().optional(),
  customName: z
    .string()
    .max(120)
    .nullable()
    .optional()
    .transform((v) => v ?? undefined),
  watt: z.number().finite().min(0).max(1_000_000),
  quantity: z.number().finite().min(0).max(10_000),
  hoursPerDay: z.number().finite().min(0).max(24),
  daysPerMonth: z
    .number()
    .finite()
    .min(1)
    .max(31)
    .nullable()
    .optional()
    .transform((v) => v ?? undefined),
});

const calculateElectricitySchema = z.object({
  year: z.number().int().min(2020).max(2100).optional(),
  month: z.number().int().min(1).max(12).optional(),
  categoryId: z.number().int().positive().max(100_000).optional(),
  directMonthlyKwh: z.number().finite().min(0).max(10_000_000).nullable().optional(),
  maintenanceFeeKip: z.number().finite().min(0).max(100_000_000).nullable().optional(),
  appliances: z.array(applianceItemSchema).max(100).optional(),
  selectedActionCodes: z.array(z.string().max(64)).max(100).optional(),
});

export async function POST(request: NextRequest) {
  const rate = checkRateLimit(request, "calc:post", 60, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        statusCode: 429,
        message: "Too many calculation requests. Please try again later.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      }
    );
  }

  try {
    const contentLength = Number(request.headers.get("content-length") || 0);
    if (Number.isFinite(contentLength) && contentLength > MAX_BODY_BYTES) {
      return NextResponse.json(
        { statusCode: 413, message: "Request payload too large" },
        { status: 413 }
      );
    }

    const rawText = await request.text();
    if (Buffer.byteLength(rawText, "utf8") > MAX_BODY_BYTES) {
      return NextResponse.json(
        { statusCode: 413, message: "Request payload too large" },
        { status: 413 }
      );
    }

    let rawJson: unknown;
    try {
      rawJson = JSON.parse(rawText);
    } catch {
      return NextResponse.json(
        { statusCode: 400, message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const parsed = calculateElectricitySchema.safeParse(rawJson);
    if (!parsed.success) {
      return NextResponse.json(
        {
          statusCode: 400,
          message: "Invalid electricity calculation parameters",
        },
        { status: 400 }
      );
    }

    const body: CalculateElectricityDto = parsed.data;
    const result = await calculateElectricityBillUseCase(body);
    return NextResponse.json({
      statusCode: 200,
      message: "Electricity calculation completed successfully",
      data: result,
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
    console.error("[API Error] electricity-calculator/calculate:", error);
    return NextResponse.json(
      {
        statusCode: 400,
        message: "Calculation failed",
      },
      { status: 400 }
    );
  }
}
