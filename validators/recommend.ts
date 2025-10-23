import { z } from "zod";

// GET /api/recommend/[userId]
export const GetRecommendParamsValidator = z.object({
  userId: z.string().min(1),
});
