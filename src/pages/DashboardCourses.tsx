import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

type Course = {
  id: string;
  title: string;
  branch: string;
  description?: string;
  youtubeUrl?: string;
  status?: "draft" | "published";
};

const DashboardCourses = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");

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

  const visibleCourses = courses.filter((course) => course.status !== "draft");
  const filteredCourses = visibleCourses.filter((course) => {
    const matchSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      (course.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchBranch = branch ? course.branch.toLowerCase() === branch.toLowerCase() : true;
    return matchSearch && matchBranch;
  });

  return (
    <DashboardLayout>
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 p-8 shadow-2xl backdrop-blur">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Courses</p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground">Live courses & playlists</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Jump into curated playlists or explore by branch.
          </p>
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-border/60 bg-background/70 p-4 shadow-xl backdrop-blur sm:grid-cols-2">
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
        <select
          value={branch}
          onChange={(event) => setBranch(event.target.value)}
          className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground"
        >
          <option value="">All branches</option>
          <option value="CSE">CSE</option>
          <option value="ECE">ECE</option>
          <option value="EE">EE</option>
          <option value="ME">ME</option>
          <option value="Civil">Civil</option>
        </select>
      </div>

      {loading ? (
        <div className="grid gap-6 lg:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <Card key={item} className="animate-pulse border-border/50 bg-background/80 backdrop-blur">
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
