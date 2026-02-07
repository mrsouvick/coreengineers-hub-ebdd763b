import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { collection, doc, onSnapshot, orderBy, query } from "firebase/firestore";

type Course = {
  title: string;
  branch: string;
  description?: string;
  youtubeUrl?: string;
  status?: "draft" | "published";
};

type Lesson = {
  id: string;
  title: string;
  youtubeUrl?: string;
  order?: number;
};

const toEmbedUrl = (url?: string) => {
  if (!url) return "";
  if (url.includes("embed")) return url;
  const match = url.match(/v=([^&]+)/);
  const id = match?.[1] ?? url.split("/").pop();
  return id ? `https://www.youtube.com/embed/${id}` : "";
};

const CourseDetail = () => {
  const { id } = useParams();
  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLessonId, setSelectedLessonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    const courseRef = doc(db, "courses", id);
    const unsubscribe = onSnapshot(courseRef, (snapshot) => {
      if (snapshot.exists()) {
        setCourse(snapshot.data() as Course);
      } else {
        setCourse(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  useEffect(() => {
    if (!id) return;
    const lessonsRef = collection(db, "courses", id, "lessons");
    const q = query(lessonsRef, orderBy("order", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Lesson, "id">),
      }));
      setLessons(results);
      if (!selectedLessonId && results.length > 0) {
        setSelectedLessonId(results[0].id);
      }
    });

    return () => unsubscribe();
  }, [id, selectedLessonId]);

  const selectedLesson = useMemo(
    () => lessons.find((lesson) => lesson.id === selectedLessonId),
    [lessons, selectedLessonId]
  );

  const videoUrl = selectedLesson?.youtubeUrl ?? course?.youtubeUrl;
  const embedUrl = toEmbedUrl(videoUrl);

  return (
    <DashboardLayout>
      {loading ? (
        <Card className="animate-pulse border-border/50 bg-background/80 backdrop-blur">
          <CardContent className="space-y-4 py-10">
            <div className="h-6 w-1/2 rounded bg-secondary/60" />
            <div className="h-4 w-1/3 rounded bg-secondary/60" />
            <div className="h-24 rounded bg-secondary/60" />
          </CardContent>
        </Card>
      ) : !course ? (
        <Card className="border-border/50 bg-background/80 p-6 text-sm text-muted-foreground backdrop-blur">
          Course not found.
        </Card>
      ) : (
        <div className="space-y-6">
          <Card className="border-border/50 bg-background/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-display text-2xl">{course.title}</CardTitle>
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
              {course.youtubeUrl && (
                <Button variant="outline" asChild>
                  <a href={course.youtubeUrl} target="_blank" rel="noreferrer">
                    Open on YouTube
                  </a>
                </Button>
              )}
            </CardContent>
          </Card>

          <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
            <Card className="border-border/50 bg-background/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-display text-xl">Video Lesson</CardTitle>
              </CardHeader>
              <CardContent>
                {embedUrl ? (
                  <div className="aspect-video overflow-hidden rounded-lg border border-border/60">
                    <iframe
                      src={embedUrl}
                      className="h-full w-full"
                      title={selectedLesson?.title ?? course.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <div className="rounded-lg border border-border/60 bg-secondary/40 p-6 text-sm text-muted-foreground">
                    Video link not added yet.
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="border-border/50 bg-background/80 backdrop-blur">
              <CardHeader>
                <CardTitle className="font-display text-xl">Lessons</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                {lessons.length === 0 ? (
                  <p>No lessons added yet.</p>
                ) : (
                  lessons.map((lesson) => (
                    <button
                      key={lesson.id}
                      onClick={() => setSelectedLessonId(lesson.id)}
                      className={`w-full rounded-lg border border-border/60 px-4 py-3 text-left transition-colors ${
                        selectedLessonId === lesson.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary/40 text-foreground hover:bg-secondary"
                      }`}
                    >
                      <p className="text-sm font-semibold">{lesson.title}</p>
                      <p className="text-xs opacity-70">Lesson {lesson.order ?? 1}</p>
                    </button>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CourseDetail;
