import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";

type Course = {
  id: string;
  title: string;
  branch: string;
  progress: string;
};

const DashboardCourses = () => {
  const { user } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadCourses = async () => {
      if (!user?.uid) return;
      const coursesRef = collection(db, "users", user.uid, "courses");
      const snapshot = await getDocs(query(coursesRef, orderBy("createdAt", "desc")));
      const results = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Course, "id">),
      }));
      setCourses(results);
      setLoading(false);
    };

    loadCourses();
  }, [user?.uid]);

  const seedCourses = async () => {
    if (!user?.uid) return;
    setSaving(true);
    const coursesRef = collection(db, "users", user.uid, "courses");
    const data = [
      { title: "Signals & Systems", branch: "ECE", progress: "62%" },
      { title: "Electrical Machines", branch: "EE", progress: "44%" },
      { title: "Thermodynamics", branch: "ME", progress: "58%" },
      { title: "Surveying", branch: "Civil", progress: "35%" },
    ];
    for (const item of data) {
      await addDoc(coursesRef, { ...item, createdAt: serverTimestamp() });
    }
    setSaving(false);
    setLoading(true);
    const snapshot = await getDocs(query(coursesRef, orderBy("createdAt", "desc")));
    const results = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<Course, "id">),
    }));
    setCourses(results);
    setLoading(false);
  };
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
      ) : courses.length === 0 ? (
        <Card className="border-border/50 bg-background/80 p-6 text-sm text-muted-foreground backdrop-blur">
          <p>No courses yet.</p>
          <Button className="mt-4" onClick={seedCourses} disabled={saving}>
            {saving ? "Adding..." : "Add sample courses"}
          </Button>
        </Card>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {courses.map((course) => (
            <Card key={course.id} className="border-border/50 bg-background/80 backdrop-blur">
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
      )}
    </DashboardLayout>
  );
};

export default DashboardCourses;
