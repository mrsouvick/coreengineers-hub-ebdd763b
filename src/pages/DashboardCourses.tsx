import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const courses = [
  { title: "Signals & Systems", branch: "ECE", progress: "62%" },
  { title: "Electrical Machines", branch: "EE", progress: "44%" },
  { title: "Thermodynamics", branch: "ME", progress: "58%" },
  { title: "Surveying", branch: "Civil", progress: "35%" },
];

const DashboardCourses = () => {
  return (
    <DashboardLayout>
      <div className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-xl backdrop-blur">
        <h1 className="font-display text-3xl font-bold text-foreground">Courses</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your semester-wise learning modules and progress.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {courses.map((course) => (
          <Card key={course.title} className="border-border/50 bg-background/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-display text-xl">{course.title}</CardTitle>
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {course.branch}
              </p>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <div className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/40 px-4 py-3">
                <span>Progress</span>
                <span className="text-foreground">{course.progress}</span>
              </div>
              <Button className="w-full">Continue Course</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default DashboardCourses;
