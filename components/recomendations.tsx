// Extracted the recommendations insights to separate components
// Task 4: Organization of the code and structure of the code
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
  } from "@/components/ui/card";
import { Recommendation } from "@/models";

  export function Recommendations({
    recommendations,
    metrics
  }: {
    recommendations: Recommendation[];
    metrics: { total: number; used: number; rate: number };
  }) {
    return (
        <Card>
          <CardHeader>
            <CardTitle>Recommendations</CardTitle>
            <CardDescription>
              The number of recommendations given to users and the ratio of used
              recommendations.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <div>Recommendations Given</div>
                <div className="text-2xl font-bold">
                  {metrics?.total ?? recommendations?.length}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div>Recommendations Used</div>
                <div className="text-2xl font-bold">{metrics?.used ?? 0}</div>
              </div>
              <div className="flex items-center justify-between">
                <div>Follow-through Rate</div>
                <div className="text-2xl font-bold">
                  {metrics ? Math.round(metrics.rate * 100) : 0}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
    );
  }
