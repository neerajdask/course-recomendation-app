import { ObjectId } from "mongodb";
import { z } from "zod";

export const UserSchema = z.object({
  _id: z.instanceof(ObjectId),
  name: z.string().min(1).max(100),
  // Add any other user-related fields here
});

export const CourseSchema = z.object({
  _id: z.instanceof(ObjectId),
  title: z.string().min(1).max(200),
  difficulty: z.enum(["easy", "medium", "hard"]),
  // Add any other course-related fields here
});

export const EngagementSchema = z.object({
  _id: z.instanceof(ObjectId),
  userId: z.string(),
  courseId: z.string(),
  timestamp: z.string(),
  timeSpent: z.number(),
  // Add any other engagement-related fields here
});

export const RecommendationSchema = z.object({
  _id: z.instanceof(ObjectId),
  userId: z.string(),
  courseId: z.string(),
  createdAt: z.string(),
  // Add any other recommendation-related fields here
});

// Infer TypeScript types from Zod schemas
export type User = z.infer<typeof UserSchema>;
export type Course = z.infer<typeof CourseSchema>;
export type Engagement = z.infer<typeof EngagementSchema>;
export type Recommendation = z.infer<typeof RecommendationSchema>;
