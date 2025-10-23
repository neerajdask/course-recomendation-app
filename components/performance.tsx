// Extracted the performance insights to separate components
// Task 4: Organization of the code and structure of the code
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from "@/components/ui/card";
   import { CoursePerformance } from "@/types";
   import { minutesToHoursLabel } from "@/lib/utils";

  export function Performance({
    courses,
    title,
    description
  }: {
    courses: CoursePerformance[];
    title: string
    description: string
  }) {
    return (
          <Card>
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3">
                 {courses?.map(({courseId, courseTitle, avgTimeSpent, engagements}, idx) => (
                  <div key={courseId} className="flex items-center justify-between">
                   <div>{idx + 1}. {courseTitle}</div>
                   <div className="text-sm text-muted-foreground">avg {minutesToHoursLabel(avgTimeSpent)} · {engagements} engagements</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
    );
  }
