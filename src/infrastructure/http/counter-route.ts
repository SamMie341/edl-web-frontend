import { NextRequest, NextResponse } from "next/server";
import { checkRateLimit } from "@/infrastructure/security/rate-limit";
import { sanitizePathId } from "@/shared";

interface CounterRouteOptions<T> {
  rateLimitKey: string;
  rateLimitMax?: number;
  resourceLabel: string;
  actionLabel: string;
  incrementFn: (id: string) => Promise<T | null>;
}

/**
 * Shared handler for public view/download counter increment Route Handlers.
 */
export async function handleCounterIncrement<T>(
  request: NextRequest,
  paramsPromise: Promise<{ id: string }>,
  options: CounterRouteOptions<T>
): Promise<NextResponse> {
  const rate = checkRateLimit(
    request,
    options.rateLimitKey,
    options.rateLimitMax ?? 30,
    60_000
  );
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
    const { id } = await paramsPromise;
    const safeId = sanitizePathId(id);
    if (!safeId) {
      return NextResponse.json(
        { statusCode: 400, message: `Invalid ${options.resourceLabel} ID` },
        { status: 400 }
      );
    }

    const updated = await options.incrementFn(safeId);
    if (!updated) {
      return NextResponse.json(
        { statusCode: 404, message: `${options.resourceLabel} not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      statusCode: 200,
      message: `${options.actionLabel} incremented successfully`,
      data: updated,
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
    console.error(`[API Error] ${options.rateLimitKey}:`, error);
    return NextResponse.json(
      {
        statusCode: 500,
        message: `Failed to track ${options.resourceLabel.toLowerCase()} ${options.actionLabel.toLowerCase()}`,
      },
      { status: 500 }
    );
  }
}
