import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
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
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const visibleCourses = courses.filter((course) => course.status !== "draft");
  const filteredCourses = visibleCourses.filter((course) => {
    const matchSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      (course.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchBranch = branch ? course.branch.toLowerCase() === branch.toLowerCase() : true;
    return matchSearch && matchBranch;
  });

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

      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/70 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center">
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <Input
          placeholder="Filter by branch (ECE/EE/ME/Civil)"
          value={branch}
          onChange={(event) => setBranch(event.target.value)}
        />
      </div>

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <Card
              key={item}
              className="animate-pulse border-border/50 bg-background/80 backdrop-blur"
            >
              <CardHeader>
                <div className="h-5 w-2/3 rounded bg-secondary/60" />
                <div className="mt-3 h-3 w-1/3 rounded bg-secondary/60" />
              </CardHeader>
              <CardContent>
                <div className="h-16 rounded bg-secondary/60" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredCourses.length === 0 ? (
        <Card className="border-border/50 bg-background/80 p-6 text-sm text-muted-foreground backdrop-blur">
          <p>No courses match your filters.</p>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredCourses.map((course) => (
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
                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button className="w-full" asChild>
                    <Link to={`/courses/${course.id}`}>View Course</Link>
                  </Button>
                  {course.youtubeUrl ? (
                    <Button className="w-full" variant="outline" asChild>
                      <a href={course.youtubeUrl} target="_blank" rel="noreferrer">
                        YouTube
                      </a>
                    </Button>
                  ) : (
                    <Button className="w-full" variant="secondary" disabled>
                      Video coming soon
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
};

export default DashboardCourses;
