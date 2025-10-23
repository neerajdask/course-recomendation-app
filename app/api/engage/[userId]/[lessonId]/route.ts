import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { EngagementSchema } from "@/models";
import { ObjectId } from "mongodb";
import { z } from "zod";
import { createRequestLogger } from "@/lib/utils";
import { GetEngageParamsValidator, PostEngageBodyValidator, PostEngageParamsValidator } from "@/validators/engage";

// GET /engage/[userId]/[courseId] - This endpoint records one engagement.
// Should it be a POST request?
// @deprecated: kept for manual testing; prefer POST below
export async function GET(
  _: NextRequest,
  { params }: { params: { userId: string; lessonId?: string; courseId?: string } }
) {
  const logger = createRequestLogger("GET /api/engage/[userId]/[courseId] (deprecated)");
  const db = await connectToDatabase();
  const parsed = GetEngageParamsValidator.parse(params);
  const { userId } = parsed;
  const courseId = parsed.courseId ?? parsed.lessonId;

  if (!userId || !courseId) {
    return NextResponse.json(
      { success: false, error: "Missing userId or courseId", deprecated: true },
      { status: 400 }
    );
  }

  const engagement = EngagementSchema.partial({ timeSpent: true }).parse({
    _id: new ObjectId(),
    userId,
    courseId,
    timestamp: new Date().toISOString(),
    timeSpent: 0,
  });

  await db.collection("engagements").insertOne(engagement);
  logger.info("request.complete", { status: 200, userId, courseId, deprecated: true });
  return NextResponse.json(
    { success: true, engagement, deprecated: true, message: "Use POST with timeSpent" },
    { status: 200 }
  );
}

// POST: create an engagement with validation

// Task 4: Clean up
export async function POST(req: NextRequest, { params }: { params: { userId: string; lessonId?: string; courseId?: string } }) {
  const logger = createRequestLogger("POST /api/engage/[userId]/[courseId]");
  const db = await connectToDatabase();

  try {
    const { userId, courseId, lessonId } = PostEngageParamsValidator.parse(params as any);
    const pCourse = courseId ?? lessonId!;
    const body = await req.json();
    const { timeSpent, timestamp } = PostEngageBodyValidator.parse(body);

    const engagement = EngagementSchema.parse({
      _id: new ObjectId(),
      userId,
      courseId: pCourse,
      timestamp: timestamp ?? new Date().toISOString(),
      timeSpent,
    });

    await db.collection("engagements").insertOne(engagement);
    logger.info("request.complete", { status: 201, userId, courseId: pCourse });
    return NextResponse.json({ success: true, engagement }, { status: 201 });
  } catch (error) {
    const status = error instanceof z.ZodError ? 400 : 500;;
    const payload =
      error instanceof z.ZodError
        ? { success: false, errors: error.errors }
        : { success: false, error: "Failed to record engagement" };


    logger.error("request.error", { status, error: String(error), payload });
    return NextResponse.json(payload, { status });
  }
}
export const dynamic = "force-dynamic";
