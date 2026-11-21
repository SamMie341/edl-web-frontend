import { NextRequest } from "next/server";
import { incrementMagazineDownloadUseCase } from "@/application";
import { handleCounterIncrement } from "@/infrastructure/http/counter-route";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function handleDownload(request: NextRequest, context: RouteContext) {
  return handleCounterIncrement(request, context.params, {
    rateLimitKey: "magazines:download",
    rateLimitMax: 30,
    resourceLabel: "Magazine",
    actionLabel: "Download count",
    incrementFn: incrementMagazineDownloadUseCase,
  });
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handleDownload(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handleDownload(request, context);
}
