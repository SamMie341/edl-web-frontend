import { NextRequest } from "next/server";
import { incrementElectricalKnowledgeViewUseCase } from "@/application";
import { handleCounterIncrement } from "@/infrastructure/http/counter-route";

interface RouteContext {
  params: Promise<{ id: string }>;
}

function handleKnowledgeView(request: NextRequest, context: RouteContext) {
  return handleCounterIncrement(request, context.params, {
    rateLimitKey: "electrical-knowledge:view",
    rateLimitMax: 60,
    resourceLabel: "Electrical knowledge",
    actionLabel: "View count",
    incrementFn: incrementElectricalKnowledgeViewUseCase,
  });
}

export async function POST(request: NextRequest, context: RouteContext) {
  return handleKnowledgeView(request, context);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  return handleKnowledgeView(request, context);
}
