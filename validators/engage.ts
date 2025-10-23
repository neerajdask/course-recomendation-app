import { z } from "zod";

// POST /api/engage/[userId]/[courseId]
export const PostEngageParamsValidator = z.object({
  userId: z.string().min(1),
  courseId: z.string().min(1),
  lessonId: z.string().min(1).optional(),
});

export const PostEngageBodyValidator = z.object({
  timeSpent: z.number().int().nonnegative(),
  timestamp: z.string().datetime().optional(),
});

// GET (deprecated) /api/engage/[userId]/[courseId]
export const GetEngageParamsValidator = z.object({
  userId: z.string().min(1),
  courseId: z.string().min(1).optional(),
  lessonId: z.string().min(1).optional(),
});
