import { NextRequest, NextResponse } from "next/server";
import { getMagazineByIdUseCase } from "@/application";
import { ENV, getStorageUrl } from "@/infrastructure";
import { checkRateLimit } from "@/infrastructure/security/rate-limit";
import { sanitizePathId } from "@/shared";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function isAllowedStorageUrl(targetUrl: string): boolean {
  try {
    const parsedTarget = new URL(targetUrl);
    if (parsedTarget.protocol !== "http:" && parsedTarget.protocol !== "https:") {
      return false;
    }

    const allowedOrigins = new Set<string>();
    try {
      allowedOrigins.add(new URL(ENV.STORAGE_BASE_URL).origin);
    } catch {
      // ignore invalid config
    }
    try {
      allowedOrigins.add(new URL(ENV.API_BASE_URL).origin);
    } catch {
      // ignore invalid config
    }

    return allowedOrigins.has(parsedTarget.origin);
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest, context: RouteContext) {
  const rate = checkRateLimit(request, "magazines:pdf", 60, 60_000);
  if (!rate.allowed) {
    return NextResponse.json(
      {
        statusCode: 429,
        message: "Too many PDF requests. Please try again later.",
      },
      {
        status: 429,
        headers: { "Retry-After": String(rate.retryAfterSeconds) },
      }
    );
  }

  try {
    const { id } = await context.params;
    const safeId = sanitizePathId(id);
    if (!safeId) {
      return NextResponse.json(
        { statusCode: 400, message: "Invalid magazine ID" },
        { status: 400 }
      );
    }

    const magazine = await getMagazineByIdUseCase(safeId);
    if (!magazine || !magazine.fileUrl) {
      return NextResponse.json(
        { statusCode: 404, message: "Magazine PDF not found" },
        { status: 404 }
      );
    }

    const resolvedUrl = getStorageUrl(magazine.fileUrl);
    if (!resolvedUrl || resolvedUrl.startsWith("/") || !isAllowedStorageUrl(resolvedUrl)) {
      return NextResponse.json(
        { statusCode: 403, message: "Disallowed PDF storage origin" },
        { status: 403 }
      );
    }

    const upstream = await fetch(resolvedUrl, {
      signal: AbortSignal.timeout(20_000),
      cache: "no-store",
    });

    if (!upstream.ok) {
      return NextResponse.json(
        { statusCode: 502, message: "Failed to fetch magazine PDF" },
        { status: 502 }
      );
    }

    const contentType = upstream.headers.get("content-type") || "";
    if (
      !contentType.toLowerCase().includes("application/pdf") &&
      !resolvedUrl.toLowerCase().endsWith(".pdf")
    ) {
      return NextResponse.json(
        { statusCode: 415, message: "Unsupported magazine file type" },
        { status: 415 }
      );
    }

    const isDownload = request.nextUrl.searchParams.get("download") === "1";
    const disposition = isDownload ? "attachment" : "inline";
    const safeFilename = `edl-magazine-${safeId}.pdf`;
    const pdfBytes = await upstream.arrayBuffer();

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `${disposition}; filename="${safeFilename}"`,
        "X-Content-Type-Options": "nosniff",
        "Cache-Control": "public, max-age=300",
      },
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
    console.error("[API Error] magazines/pdf:", error);
    return NextResponse.json(
      { statusCode: 500, message: "Failed to stream magazine PDF" },
      { status: 500 }
    );
  }
}
