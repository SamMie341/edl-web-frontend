import { NextRequest, NextResponse } from "next/server";
import { getCalculatorConfigUseCase } from "@/application";
import { checkRateLimit } from "@/infrastructure/security/rate-limit";

export async function GET(request: NextRequest) {
  const rate = checkRateLimit(request, "calc:config", 120, 60_000);
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
    const config = await getCalculatorConfigUseCase();
    return NextResponse.json({
      statusCode: 200,
      message: "Calculator config retrieved successfully",
      data: config,
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
    console.error("[API Error] electricity-calculator/config:", error);
    return NextResponse.json(
      {
        statusCode: 500,
        message: "Failed to get config",
      },
      { status: 500 }
    );
  }
}
