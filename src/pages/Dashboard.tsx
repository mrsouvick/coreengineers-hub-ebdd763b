import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";

type Course = {
  id: string;
  title: string;
  branch: string;
  status?: "draft" | "published";
};

type Note = {
  id: string;
  title: string;
  tag: string;
  category?: string;
};

type Lesson = {
  id: string;
  title: string;
  courseId: string;
};

type Profile = {
  name?: string;
};

const getFirstName = (name?: string | null, fallback?: string | null) => {
  if (name && name.trim()) return name.trim().split(" ")[0];
  if (fallback && fallback.trim()) return fallback.trim().split("@")[0];
  return "Engineer";
};

const Dashboard = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [profileName, setProfileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.uid) return;
    const profileRef = doc(db, "profiles", user.uid);
    const unsub = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as Profile;
        setProfileName(data.name ?? null);
      }
    });
    return () => unsub();
  }, [user?.uid]);

  useEffect(() => {
    const courseRef = collection(db, "courses");
    const notesRef = collection(db, "notes");

    const unsubCourses = onSnapshot(query(courseRef, orderBy("createdAt", "desc")), (snap) => {
      setCourses(
        snap.docs.map((docItem) => ({
          id: docItem.id,
          ...(docItem.data() as Omit<Course, "id">),
        }))
      );
      setLoading(false);
    });

    const unsubNotes = onSnapshot(query(notesRef, orderBy("createdAt", "desc")), (snap) => {
      setNotes(
        snap.docs.map((docItem) => ({
          id: docItem.id,
          ...(docItem.data() as Omit<Note, "id">),
        }))
      );
    });

    const unsubLessons: Array<() => void> = [];
    const courseSub = onSnapshot(query(courseRef, orderBy("createdAt", "desc")), (snap) => {
      unsubLessons.forEach((fn) => fn());
      unsubLessons.length = 0;
      snap.docs.forEach((courseDoc) => {
        const lessonsRef = collection(db, "courses", courseDoc.id, "lessons");
        const unsub = onSnapshot(query(lessonsRef, orderBy("order", "asc")), (lessonSnap) => {
          setLessons((prev) => {
            const filtered = prev.filter((item) => item.courseId !== courseDoc.id);
            const next = lessonSnap.docs.map((lessonDoc) => ({
              id: lessonDoc.id,
              courseId: courseDoc.id,
              ...(lessonDoc.data() as Omit<Lesson, "id" | "courseId">),
            }));
            return [...filtered, ...next];
          });
        });
        unsubLessons.push(unsub);
      });
    });

    return () => {
      unsubCourses();
      unsubNotes();
      unsubLessons.forEach((fn) => fn());
      courseSub();
    };
  }, []);

  const publishedCourses = useMemo(
    () => courses.filter((course) => course.status !== "draft"),
    [courses]
  );

  const stats = useMemo(
    () => [
      { title: "Live Courses", value: publishedCourses.length, note: "Published" },
      { title: "Notes Library", value: notes.length, note: "Available" },
      { title: "Lessons", value: lessons.length, note: "Across courses" },
      { title: "Learning Streak", value: 12, note: "days in a row" },
    ],
    [publishedCourses.length, notes.length, lessons.length]
  );

  const recentCourses = publishedCourses.slice(0, 3);
  const recentNotes = notes.slice(0, 3);
  const firstName = getFirstName(profileName ?? user?.displayName ?? null, user?.email ?? null);

  return (
    <DashboardLayout>
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 p-8 shadow-2xl backdrop-blur">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-orange-muted/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Student Hub</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Welcome back,
            <span className="block text-primary">{firstName}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Your personalized workspace for MAKAUT engineering prep. Track progress, open courses,
            and keep your notes organized in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="glow-orange-sm" asChild>
              <Link to="/dashboard/courses">Open My Courses</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link to="/dashboard/notes">Explore Notes</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.title} className="border-border/50 bg-background/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-semibold text-foreground">
                {loading ? "..." : item.value}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/50 bg-background/80 backdrop-blur lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-xl">Latest Courses</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {recentCourses.length === 0 ? (
              <p>No courses published yet.</p>
            ) : (
              recentCourses.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/40 px-4 py-3"
                >
                  <div>
                    <p className="text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">{item.branch}</p>
                  </div>
                  <Button size="sm" asChild>
                    <Link to={`/courses/${item.id}`}>Open</Link>
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-background/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-xl">Latest Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {recentNotes.length === 0 ? (
              <p>No notes published yet.</p>
            ) : (
              recentNotes.map((item) => (
                <div
                  key={item.id}
                  className="rounded-lg border border-border/60 bg-secondary/40 px-4 py-3"
                >
                  <p className="text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.tag}
                    {item.category ? ` - ${item.category}` : ""}
                  </p>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
