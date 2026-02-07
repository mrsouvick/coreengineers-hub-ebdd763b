import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

type Course = {
  title: string;
  branch: string;
  description?: string;
  youtubeUrl?: string;
  status?: "draft" | "published";
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

  const embedUrl = toEmbedUrl(course?.youtubeUrl);

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
                    title={course.title}
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
        </div>
      )}
    </DashboardLayout>
  );
};

export default CourseDetail;
