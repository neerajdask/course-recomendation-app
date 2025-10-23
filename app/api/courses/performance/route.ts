import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { createRequestLogger } from "@/lib/utils";

export async function GET() {
  try {
    const logger = createRequestLogger("GET /api/courses/performance");
    const db = await connectToDatabase();

    const results = await db
      .collection("engagements")
      .aggregate([
        {
          $group: {
            _id: "$courseId",
            avgTimeSpent: { $avg: "$timeSpent" },
            engagements: { $sum: 1 },
          },
        },
        {
          $addFields: {
            courseObjId: {
              $convert: { input: "$_id", to: "objectId", onError: null },
            },
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
            courseTitle: {
              $ifNull: [{ $arrayElemAt: ["$course.title", 0] }, "N/A"],
            },
          },
        },
        {
          $project: {
            _id: 0,
            courseId: "$_id",
            courseTitle: 1,
            avgTimeSpent: 1,
            engagements: 1,
          },
        },
        {
          $facet: {
            top: [
              { $sort: { avgTimeSpent: -1 } },
              { $limit: 3 },
            ],
            bottom: [
              { $sort: { avgTimeSpent: 1 } },
              { $limit: 3 },
            ],
          },
        },
      ])
      .toArray();

    const { top = [], bottom = [] } = results[0] ?? {};

    const res = NextResponse.json(
      { success: true, top, bottom },
      { status: 200 }
    );
    logger.info("request.complete", { status: 200, topCount: top.length, bottomCount: bottom.length });
    return res;
  } catch (error) {
    const logger = createRequestLogger("GET /api/courses/performance");
    logger.error("Failed to compute course performance", { error: String(error) });
    return NextResponse.json(
      { success: false, error: "Failed to compute course performance" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
