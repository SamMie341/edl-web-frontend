import { NextRequest } from "next/server";
import { incrementNewsViewUseCase } from "@/application";
import { handleCounterIncrement } from "@/infrastructure/http/counter-route";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function handleNewsView(request: NextRequest, context: RouteContext) {
  return handleCounterIncrement(request, context.params, {
    rateLimitKey: "news:view",
    rateLimitMax: 60,
    resourceLabel: "News",
    actionLabel: "View count",
    incrementFn: incrementNewsViewUseCase,
  });
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handleNewsView(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handleNewsView(request, context);
}
