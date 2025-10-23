import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { createRequestLogger } from "@/lib/utils";

export async function GET() {
  try {
    const logger = createRequestLogger("GET /api/engagements");
    const db = await connectToDatabase();

    const engagements = await db
      .collection("engagements")
      .aggregate([
        {
          $addFields: {
            userObjId: {
              $convert: { input: "$userId", to: "objectId", onError: null },
            },
            courseObjId: {
              $convert: { input: "$courseId", to: "objectId", onError: null },
            },
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "userObjId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "courses",
            localField: "courseObjId",
            foreignField: "_id",
            as: "course",
          },
        },
        {
          $addFields: {
            userName: {
              $ifNull: [{ $arrayElemAt: ["$user.name", 0] }, "N/A"],
            },
            courseTitle: {
              $ifNull: [{ $arrayElemAt: ["$course.title", 0] }, "N/A"],
            },
          },
        },
        { $project: { user: 0, course: 0, userObjId: 0, courseObjId: 0 } },
        { $sort: { timestamp: -1 } },
      ])
      .toArray();

    const res = NextResponse.json(
      {
        success: true,
        engagements,
      },
      { status: 200 }
    );
    logger.info("request.complete", { status: 200, count: engagements.length });
    return res;
  } catch (error) {
    const logger = createRequestLogger("GET /api/engagements");
    logger.error("Failed to get engagements", { error: String(error) });
    return NextResponse.json(
      { success: false, error: "Failed to get engagements" },
      { status: 500 }
    );
  }
}
export const dynamic = "force-dynamic";
