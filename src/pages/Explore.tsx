import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
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

type Note = {
  id: string;
  title: string;
  tag: string;
  category?: string;
  description?: string;
  downloadUrl?: string;
};

const Explore = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");

  useEffect(() => {
    const courseRef = collection(db, "courses");
    const noteRef = collection(db, "notes");

    const unsubCourses = onSnapshot(query(courseRef, orderBy("createdAt", "desc")), (snap) => {
      setCourses(
        snap.docs.map((docItem) => ({ id: docItem.id, ...(docItem.data() as Omit<Course, "id">) }))
      );
    });

    const unsubNotes = onSnapshot(query(noteRef, orderBy("createdAt", "desc")), (snap) => {
      setNotes(
        snap.docs.map((docItem) => ({ id: docItem.id, ...(docItem.data() as Omit<Note, "id">) }))
      );
    });

    return () => {
      unsubCourses();
      unsubNotes();
    };
  }, []);

  const filteredCourses = courses.filter((course) => {
    const matchSearch =
      course.title.toLowerCase().includes(search.toLowerCase()) ||
      (course.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchBranch = branch ? course.branch.toLowerCase() === branch.toLowerCase() : true;
    return course.status !== "draft" && matchSearch && matchBranch;
  });

  const filteredNotes = notes.filter(
    (note) =>
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      (note.description ?? "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-navy">
      <Navbar />
      <main className="container mx-auto px-4 pb-16 pt-24 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 p-8 shadow-2xl backdrop-blur">
          <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-orange-muted/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Explore Hub
            </p>
            <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Discover courses and notes
            </h1>
            <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
              Browse the latest courses and revision notes curated for MAKAUT engineering
              students.
            </p>
            <div className="mt-6 max-w-xl">
              <Input
                placeholder="Search courses, notes, or topics..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
              />
            </div>
            <div className="mt-3 max-w-sm">
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
          </div>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          <Card className="border-border/50 bg-background/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-display text-xl">Featured Courses</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              {filteredCourses.length === 0 ? (
                <p>No courses found.</p>
              ) : (
                filteredCourses.slice(0, 6).map((course) => (
                  <div
                    key={course.id}
                    className="rounded-lg border border-border/60 bg-secondary/40 p-4"
                  >
                    <p className="text-foreground">{course.title}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {course.branch}
                    </p>
                    {course.description && (
                      <p className="mt-2 text-xs text-muted-foreground">{course.description}</p>
                    )}
                    {course.youtubeUrl && (
                      <Button size="sm" className="mt-3" asChild>
                        <a href={course.youtubeUrl} target="_blank" rel="noreferrer">
                          Watch
                        </a>
                      </Button>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-background/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-display text-xl">Latest Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              {filteredNotes.length === 0 ? (
                <p>No notes found.</p>
              ) : (
                filteredNotes.slice(0, 6).map((note) => (
                  <div
                    key={note.id}
                    className="rounded-lg border border-border/60 bg-secondary/40 p-4"
                  >
                    <p className="text-foreground">{note.title}</p>
                    <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                      {note.tag}
                      {note.category ? ` - ${note.category}` : ""}
                    </p>
                    {note.description && (
                      <p className="mt-2 text-xs text-muted-foreground">{note.description}</p>
                    )}
                    {note.downloadUrl && (
                      <Button size="sm" variant="outline" className="mt-3" asChild>
                        <a href={note.downloadUrl} target="_blank" rel="noreferrer">
                          Download
                        </a>
                      </Button>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Explore;
