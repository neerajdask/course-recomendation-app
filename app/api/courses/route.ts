import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { createRequestLogger } from "@/lib/utils";

export async function GET() {
  try {
    const logger = createRequestLogger("GET /api/courses");
    const db = await connectToDatabase();

    const data = await db.collection("courses").find().toArray();
    const res = NextResponse.json({ success: true, data }, { status: 200 });
    logger.info("request.complete", { status: 200, count: data.length });
    return res;
  } catch (error) {
    const logger = createRequestLogger("GET /api/courses");
    logger.error("Failed to get courses", { error: String(error) });
    return NextResponse.json(
      { success: false, error: "Failed to get courses" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
