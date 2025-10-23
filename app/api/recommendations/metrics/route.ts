import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { createRequestLogger } from "@/lib/utils";

export async function GET() {
  try {
    const logger = createRequestLogger("GET /api/recommendations/metrics");
    const db = await connectToDatabase();

    const agg = await db
      .collection("recommendations")
      .aggregate([
        {
          $addFields: {
            recCreatedAtDate: { $toDate: "$createdAt" },
          },
        },
        {
          $lookup: {
            from: "engagements",
            let: {
              userId: "$userId",
              courseId: "$courseId",
              recCreatedAtDate: "$recCreatedAtDate",
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$userId", "$$userId"] },
                      { $eq: ["$courseId", "$$courseId"] },
                      { $gt: [{ $toDate: "$timestamp" }, "$$recCreatedAtDate"] },
                    ],
                  },
                },
              },
              { $limit: 1 },
            ],
            as: "followed",
          },
        },
        {
          $addFields: {
            used: { $gt: [{ $size: "$followed" }, 0] },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            used: {
              $sum: { $cond: [{ $eq: ["$used", true] }, 1, 0] },
            },
          },
        },
        {
          $project: {
            _id: 0,
            total: 1,
            used: 1,
            rate: {
              $cond: [{ $gt: ["$total", 0] }, { $divide: ["$used", "$total"] }, 0],
            },
          },
        },
      ])
      .toArray();

    const metrics = agg[0] ?? { total: 0, used: 0, rate: 0 };
    const res = NextResponse.json({ success: true, metrics }, { status: 200 });
    logger.info("request.complete", { status: 200, total: metrics.total.toString(), used: metrics.used.toString() });
    return res;
  } catch (error) {
    const logger = createRequestLogger("GET /api/recommendations/metrics");
    logger.error("Failed to compute recommendation metrics", { error: String(error) });
    return NextResponse.json(
      { success: false, error: "Failed to compute recommendation metrics" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
