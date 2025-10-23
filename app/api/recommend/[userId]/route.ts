import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { z } from "zod";
import { GetRecommendParamsValidator } from "@/validators/recommend";
import { createRecommendation } from "@/lib/create-recommendation";
import { createRequestLogger } from "@/lib/utils";

export async function GET(
  _: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const logger = createRequestLogger("GET /api/recommend/[userId]");
    const db = await connectToDatabase();
    const { userId } = GetRecommendParamsValidator.parse(params);

    const recommendation = await createRecommendation(userId, db);
    if (!recommendation) {
      return NextResponse.json(
        { success: false, error: "No recommendations available" },
        { status: 404 }
      );
    }
    const res = NextResponse.json(
      { success: true, recommendation },
      { status: 200 }
    );
    logger.info("request.complete", { status: 200, userId });
    return res;
  } catch (error) {
    const logger = createRequestLogger("GET /api/recommend/[userId]");
    logger.error("Failed to get recommendation", { error: String(error) });
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, errors: error.errors },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: "Failed to get recommendation" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
