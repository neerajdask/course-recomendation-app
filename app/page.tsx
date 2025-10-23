import { Dashboard } from "@/components/dashboard";
import { Engagement, Recommendation } from "@/models";
import { headers } from "next/headers";

export default async function Home() {
  const baseUrl = headers().get("Host")!;

  const { engagements } = await fetch(
    new URL("/api/engagements", `http://${baseUrl}`),
    { cache: "no-store" }
  ).then((res) => res.json() as Promise<{ engagements: Engagement[] }>);

  const { recommendations } = await fetch(
    new URL("/api/recommendations", `http://${baseUrl}`),
    { cache: "no-store" }
  ).then((res) => res.json() as Promise<{ recommendations: Recommendation[] }>);

  const { metrics } = await fetch(
    new URL("/api/recommendations/metrics", `http://${baseUrl}`),
    { cache: "no-store" }
  ).then((res) => res.json() as Promise<{ metrics: { total: number; used: number; rate: number } }>);

  const { top, bottom } = await fetch(
    new URL("/api/courses/performance", `http://${baseUrl}`),
    { cache: "no-store" }
  ).then((res) =>
    res.json() as Promise<{
      top: { courseId: string; courseTitle: string; avgTimeSpent: number; engagements: number }[];
      bottom: { courseId: string; courseTitle: string; avgTimeSpent: number; engagements: number }[];
    }>
  );

  return (
    <Dashboard
        engagements={engagements}
        recommendations={recommendations}
        metrics={metrics}
        topCourses={top}
        bottomCourses={bottom} />
  );
}

export const dynamic = "force-dynamic";
