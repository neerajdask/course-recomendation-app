import { connectToDatabase } from "@/lib/mongodb";
import { generateSeedData } from "@/lib/seed-data";
import { NextResponse } from "next/server";
import { createRequestLogger } from "@/lib/utils";

export async function GET() {
  try {
    const logger = createRequestLogger("GET /api/seed-data");
    const db = await connectToDatabase();
    await generateSeedData(db);
    logger.info("request.complete", { status: 200 });
    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    const logger = createRequestLogger("GET /api/seed-data");
    logger.error("Failed to seed data", { error: String(error) });
    return NextResponse.json(
      { success: false, error: "Failed to seed data" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
