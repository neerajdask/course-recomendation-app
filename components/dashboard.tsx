import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

import { Engagement, Recommendation } from "@/models";
import { formatIsoToLocal, minutesToHoursLabel } from "@/lib/utils";
import { Recommendations } from "@/components/recomendations";
import { Performance } from "@/components/performance";
import { CoursePerformance } from "@/types";
export function Dashboard({
  engagements,
  recommendations,
  metrics,
  topCourses,
  bottomCourses,
}: {
  engagements: Engagement[];
  recommendations: Recommendation[];
  metrics: { total: number; used: number; rate: number };
  topCourses: CoursePerformance[];
  bottomCourses: CoursePerformance[];
}) {
  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-rows-3 gap-6 p-6">
        <Card className="col-span-1 lg:col-span-2 lg:row-span-2">
          <CardHeader>
            <CardTitle>User Engagement</CardTitle>
            <CardDescription>
              Detailed engagement data for each user and course type.
            </CardDescription>
          </CardHeader>
          <CardContent className="max-h-[20lh] overflow-y-scroll">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Time Spent (hrs)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {engagements?.map((engagement: Engagement & { userName?: string; courseTitle?: string }) => (
                  <TableRow key={engagement._id.toString()}>
                    <TableCell>{engagement.userName ?? engagement.userId}</TableCell>
                    <TableCell>
                      {engagement.courseTitle ?? engagement.courseId}
                    </TableCell>
                    <TableCell>{formatIsoToLocal(engagement.timestamp)}</TableCell>
                    <TableCell>{minutesToHoursLabel(engagement.timeSpent)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Engagements</CardTitle>
            <CardDescription>
              The total number of engagements across all users and course types.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-5xl font-bold">{engagements?.length}</div>
          </CardContent>
        </Card>
        {/* Task 2: Recommendations */}
        <Recommendations recommendations={recommendations} metrics={metrics} />
        {/* Task 3: Performance */}
        <Performance courses={topCourses} title="Top performing courses" description="By average time spent" />
        <Performance courses={bottomCourses} title="Least liked courses" description="By average time spent" />
      </main>
    </div>
  );
}
