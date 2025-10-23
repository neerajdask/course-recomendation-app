import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { createRequestLogger } from "@/lib/utils";

export async function GET(_: NextRequest) {
  try {
    const logger = createRequestLogger("GET /api/recommendations");
    const db = await connectToDatabase();

    const recommendations =
      (await db
        .collection("recommendations")
        .find()
        .sort({ createdAt: -1 })
        .toArray()) ?? [];

    const res = NextResponse.json(
      { success: true, recommendations },
      { status: 200 }
    );
    logger.info("request.complete", { status: 200, count: recommendations.length });
    return res;
  } catch (error) {
    const logger = createRequestLogger("GET /api/recommendations");
    logger.error("Failed to get recommendations", { error: String(error) });
    return NextResponse.json(
      { success: false, error: "Failed to get recommendations" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
