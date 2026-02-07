import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

type Course = {
  id: string;
  title: string;
  branch: string;
  description?: string;
  youtubeUrl?: string;
};

const DashboardCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const visibleCourses = courses.filter((course) => course.status !== "draft");

  useEffect(() => {
    const coursesRef = collection(db, "courses");
    const q = query(coursesRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Course, "id">),
      }));
      setCourses(results);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  return (
    <DashboardLayout>
      <div className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-xl backdrop-blur">
        <h1 className="font-display text-3xl font-bold text-foreground">Courses</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Your semester-wise learning modules and progress.
        </p>
      </div>

      {loading ? (
        <Card className="border-border/50 bg-background/80 p-6 text-sm text-muted-foreground backdrop-blur">
          Loading courses...
        </Card>
      ) : visibleCourses.length === 0 ? (
        <Card className="border-border/50 bg-background/80 p-6 text-sm text-muted-foreground backdrop-blur">
          <p>No courses published yet.</p>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {visibleCourses.map((course) => (
            <Card key={course.id} className="border-border/50 bg-background/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-display text-xl">{course.title}</CardTitle>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {course.branch}
                </p>
              </CardHeader>
              <CardContent className="space-y-4 text-sm text-muted-foreground">
                {course.description && (
                  <p className="rounded-lg border border-border/60 bg-secondary/40 px-4 py-3">
                    {course.description}
                  </p>
                )}
                {course.youtubeUrl ? (
                  <Button className="w-full" asChild>
                    <a href={course.youtubeUrl} target="_blank" rel="noreferrer">
                      Watch on YouTube
                    </a>
                  </Button>
                ) : (
                  <Button className="w-full" variant="secondary" disabled>
                    Video coming soon
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardCourses;
