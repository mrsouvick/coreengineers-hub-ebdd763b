import { useEffect, useMemo, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { db } from "@/lib/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";

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

type Profile = {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  branch?: string;
  semester?: string;
};

type Lesson = {
  id: string;
  title: string;
  youtubeUrl?: string;
  order?: number;
};

const Admin = () => {
  const [uid, setUid] = useState("");
  const [savingRole, setSavingRole] = useState(false);
  const [roleMessage, setRoleMessage] = useState<string | null>(null);

  const [courses, setCourses] = useState<Course[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");

  const [courseForm, setCourseForm] = useState({
    id: "",
    title: "",
    branch: "",
    description: "",
    youtubeUrl: "",
    status: "published" as "draft" | "published",
  });

  const [noteForm, setNoteForm] = useState({
    id: "",
    title: "",
    tag: "",
    category: "",
    description: "",
    downloadUrl: "",
  });

  const [lessonForm, setLessonForm] = useState({
    id: "",
    title: "",
    youtubeUrl: "",
    order: "1",
  });

  const stats = useMemo(
    () => [
      { label: "Total Students", value: profiles.length.toString() },
      { label: "Notes Published", value: notes.length.toString() },
      { label: "Courses Live", value: courses.length.toString() },
      { label: "Lessons", value: lessons.length.toString() },
    ],
    [profiles.length, notes.length, courses.length, lessons.length]
  );

  useEffect(() => {
    const coursesRef = collection(db, "courses");
    const notesRef = collection(db, "notes");
    const profilesRef = collection(db, "profiles");

    const unsubCourses = onSnapshot(query(coursesRef, orderBy("createdAt", "desc")), (snap) => {
      setCourses(
        snap.docs.map((docItem) => ({ id: docItem.id, ...(docItem.data() as Omit<Course, "id">) }))
      );
    });

    const unsubNotes = onSnapshot(query(notesRef, orderBy("createdAt", "desc")), (snap) => {
      setNotes(
        snap.docs.map((docItem) => ({ id: docItem.id, ...(docItem.data() as Omit<Note, "id">) }))
      );
    });

    const unsubProfiles = onSnapshot(query(profilesRef, orderBy("updatedAt", "desc")), (snap) => {
      setProfiles(
        snap.docs.map((docItem) => ({
          id: docItem.id,
          ...(docItem.data() as Omit<Profile, "id">),
        }))
      );
    });

    return () => {
      unsubCourses();
      unsubNotes();
      unsubProfiles();
    };
  }, []);

  useEffect(() => {
    if (!selectedCourseId) {
      setLessons([]);
      return;
    }
    const lessonsRef = collection(db, "courses", selectedCourseId, "lessons");
    const unsubscribe = onSnapshot(query(lessonsRef, orderBy("order", "asc")), (snap) => {
      setLessons(
        snap.docs.map((docItem) => ({
          id: docItem.id,
          ...(docItem.data() as Omit<Lesson, "id">),
        }))
      );
    });
    return () => unsubscribe();
  }, [selectedCourseId]);

  const grantAdmin = async () => {
    if (!uid.trim()) return;
    setSavingRole(true);
    setRoleMessage(null);
    try {
      await setDoc(
        doc(db, "roles", uid.trim()),
        { role: "admin", updatedAt: serverTimestamp() },
        { merge: true }
      );
      setRoleMessage("Admin role granted.");
      setUid("");
    } catch (err) {
      setRoleMessage(err instanceof Error ? err.message : "Failed to update role.");
    } finally {
      setSavingRole(false);
    }
  };

  const upsertCourse = async () => {
    if (!courseForm.title.trim() || !courseForm.branch.trim()) return;
    const payload = {
      title: courseForm.title.trim(),
      branch: courseForm.branch.trim(),
      description: courseForm.description.trim(),
      youtubeUrl: courseForm.youtubeUrl.trim(),
      status: courseForm.status,
      updatedAt: serverTimestamp(),
    };
    if (courseForm.id) {
      await updateDoc(doc(db, "courses", courseForm.id), payload);
    } else {
      await addDoc(collection(db, "courses"), {
        ...payload,
        createdAt: serverTimestamp(),
      });
    }
    setCourseForm({
      id: "",
      title: "",
      branch: "",
      description: "",
      youtubeUrl: "",
      status: "published",
    });
  };

  const editCourse = (course: Course) => {
    setCourseForm({
      id: course.id,
      title: course.title,
      branch: course.branch,
      description: course.description ?? "",
      youtubeUrl: course.youtubeUrl ?? "",
      status: course.status ?? "published",
    });
  };

  const deleteCourse = async (courseId: string) => {
    await deleteDoc(doc(db, "courses", courseId));
  };

  const upsertNote = async () => {
    if (!noteForm.title.trim() || !noteForm.tag.trim()) return;
    const resolvedUrl = noteForm.downloadUrl.trim();
    const payload = {
      title: noteForm.title.trim(),
      tag: noteForm.tag.trim(),
      category: noteForm.category.trim(),
      description: noteForm.description.trim(),
      downloadUrl: resolvedUrl,
      updatedAt: serverTimestamp(),
    };
    if (noteForm.id) {
      await updateDoc(doc(db, "notes", noteForm.id), payload);
    } else {
      await addDoc(collection(db, "notes"), {
        ...payload,
        createdAt: serverTimestamp(),
      });
    }
    setNoteForm({
      id: "",
      title: "",
      tag: "",
      category: "",
      description: "",
      downloadUrl: "",
    });
  };

  const editNote = (note: Note) => {
    setNoteForm({
      id: note.id,
      title: note.title,
      tag: note.tag,
      category: note.category ?? "",
      description: note.description ?? "",
      downloadUrl: note.downloadUrl ?? "",
    });
  };

  const deleteNote = async (noteId: string) => {
    await deleteDoc(doc(db, "notes", noteId));
  };

  const upsertLesson = async () => {
    if (!selectedCourseId || !lessonForm.title.trim()) return;
    const payload = {
      title: lessonForm.title.trim(),
      youtubeUrl: lessonForm.youtubeUrl.trim(),
      order: Number(lessonForm.order) || 1,
      updatedAt: serverTimestamp(),
    };
    if (lessonForm.id) {
      await updateDoc(doc(db, "courses", selectedCourseId, "lessons", lessonForm.id), payload);
    } else {
      await addDoc(collection(db, "courses", selectedCourseId, "lessons"), {
        ...payload,
        createdAt: serverTimestamp(),
      });
    }
    setLessonForm({ id: "", title: "", youtubeUrl: "", order: "1" });
  };

  const editLesson = (lesson: Lesson) => {
    setLessonForm({
      id: lesson.id,
      title: lesson.title,
      youtubeUrl: lesson.youtubeUrl ?? "",
      order: String(lesson.order ?? 1),
    });
  };

  const deleteLesson = async (lessonId: string) => {
    if (!selectedCourseId) return;
    await deleteDoc(doc(db, "courses", selectedCourseId, "lessons", lessonId));
  };

  return (
    <DashboardLayout>
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 p-8 shadow-2xl backdrop-blur">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Admin Control Room
          </p>
          <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            CoreEngineers Studio
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Publish courses, manage notes, lessons, and student profiles in real time.
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Card key={item.label} className="border-border/50 bg-background/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {item.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-2xl font-semibold text-foreground">{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="rounded-2xl border border-border/50 bg-background/60 p-4 text-xs uppercase tracking-[0.3em] text-muted-foreground">
        Content Studio
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-background/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-xl">Create / Edit Course</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="course-title">Course Title</Label>
              <Input
                id="course-title"
                value={courseForm.title}
                onChange={(event) => setCourseForm({ ...courseForm, title: event.target.value })}
                placeholder="Signals & Systems"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-branch">Branch</Label>
              <Input
                id="course-branch"
                value={courseForm.branch}
                onChange={(event) => setCourseForm({ ...courseForm, branch: event.target.value })}
                placeholder="CSE / ECE / EE / ME / Civil"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-desc">Description</Label>
              <Textarea
                id="course-desc"
                value={courseForm.description}
                onChange={(event) =>
                  setCourseForm({ ...courseForm, description: event.target.value })
                }
                placeholder="Short summary of the course module."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-youtube">YouTube Link</Label>
              <Input
                id="course-youtube"
                value={courseForm.youtubeUrl}
                onChange={(event) =>
                  setCourseForm({ ...courseForm, youtubeUrl: event.target.value })
                }
                placeholder="https://youtube.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="course-status">Status</Label>
              <Input
                id="course-status"
                value={courseForm.status}
                onChange={(event) =>
                  setCourseForm({
                    ...courseForm,
                    status: event.target.value === "draft" ? "draft" : "published",
                  })
                }
                placeholder="published or draft"
              />
            </div>
            <Button onClick={upsertCourse}>
              {courseForm.id ? "Update Course" : "Publish Course"}
            </Button>
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-background/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-xl">Create / Edit Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="note-title">Note Title</Label>
              <Input
                id="note-title"
                value={noteForm.title}
                onChange={(event) => setNoteForm({ ...noteForm, title: event.target.value })}
                placeholder="Network Theory - Unit 2"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-tag">Branch / Tag</Label>
              <Input
                id="note-tag"
                value={noteForm.tag}
                onChange={(event) => setNoteForm({ ...noteForm, tag: event.target.value })}
                placeholder="CSE / ECE / EE / ME / Civil"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-category">Category</Label>
              <Input
                id="note-category"
                value={noteForm.category}
                onChange={(event) => setNoteForm({ ...noteForm, category: event.target.value })}
                placeholder="Signals / Machines / Thermo"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-desc">Description</Label>
              <Textarea
                id="note-desc"
                value={noteForm.description}
                onChange={(event) => setNoteForm({ ...noteForm, description: event.target.value })}
                placeholder="What does this note cover?"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="note-download">Download Link</Label>
              <Input
                id="note-download"
                value={noteForm.downloadUrl}
                onChange={(event) => setNoteForm({ ...noteForm, downloadUrl: event.target.value })}
                placeholder="Paste Google Drive or GitHub link"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              Tip: Use Google Drive (Anyone with link) or GitHub raw file URLs.
            </p>
            <Button onClick={upsertNote}>{noteForm.id ? "Update Note" : "Publish Note"}</Button>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-xl">Manage Lessons (Realtime)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="lesson-course">Select Course</Label>
            <select
              id="lesson-course"
              value={selectedCourseId}
              onChange={(event) => setSelectedCourseId(event.target.value)}
              className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
            >
              <option value="">Choose a course</option>
              {courses.map((course) => (
                <option key={course.id} value={course.id}>
                  {course.title}
                </option>
              ))}
            </select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="lesson-title">Lesson Title</Label>
              <Input
                id="lesson-title"
                value={lessonForm.title}
                onChange={(event) => setLessonForm({ ...lessonForm, title: event.target.value })}
                placeholder="Signals & Systems - Intro"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lesson-order">Order</Label>
              <Input
                id="lesson-order"
                value={lessonForm.order}
                onChange={(event) => setLessonForm({ ...lessonForm, order: event.target.value })}
                placeholder="1"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="lesson-youtube">YouTube Link</Label>
            <Input
              id="lesson-youtube"
              value={lessonForm.youtubeUrl}
              onChange={(event) => setLessonForm({ ...lessonForm, youtubeUrl: event.target.value })}
              placeholder="https://youtube.com/..."
            />
          </div>
          <Button onClick={upsertLesson} disabled={!selectedCourseId}>
            {lessonForm.id ? "Update Lesson" : "Add Lesson"}
          </Button>

          {selectedCourseId ? (
            <div className="space-y-3 text-sm text-muted-foreground">
              {lessons.length === 0 ? (
                <p>No lessons yet.</p>
              ) : (
                lessons.map((lesson) => (
                  <div
                    key={lesson.id}
                    className="flex flex-col gap-3 rounded-lg border border-border/60 bg-secondary/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-foreground">{lesson.title}</p>
                      <p className="text-xs text-muted-foreground">Order {lesson.order ?? 1}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" onClick={() => editLesson(lesson)}>
                        Edit
                      </Button>
                      <Button size="sm" variant="secondary" onClick={() => deleteLesson(lesson.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Select a course to manage lessons.</p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-background/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-xl">Courses (Realtime)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {courses.length === 0 ? (
              <p>No courses published.</p>
            ) : (
              courses.map((course) => (
                <div
                  key={course.id}
                  className="flex flex-col gap-3 rounded-lg border border-border/60 bg-secondary/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-foreground">{course.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {course.branch} - {course.status ?? "published"}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => editCourse(course)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => deleteCourse(course.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-background/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-xl">Notes (Realtime)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {notes.length === 0 ? (
              <p>No notes published.</p>
            ) : (
              notes.map((note) => (
                <div
                  key={note.id}
                  className="flex flex-col gap-3 rounded-lg border border-border/60 bg-secondary/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="text-foreground">{note.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {note.tag}
                      {note.category ? ` - ${note.category}` : ""}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => editNote(note)}>
                      Edit
                    </Button>
                    <Button size="sm" variant="secondary" onClick={() => deleteNote(note.id)}>
                      Delete
                    </Button>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/50 bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-xl">Students (Realtime)</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {profiles.length === 0 ? (
            <p>No student profiles saved yet.</p>
          ) : (
            profiles.map((profile) => (
              <div
                key={profile.id}
                className="rounded-lg border border-border/60 bg-secondary/40 px-4 py-3"
              >
                <p className="text-foreground">{profile.name || "Unnamed Student"}</p>
                <p className="text-xs text-muted-foreground">
                  {profile.email ?? "No email"} - {profile.branch ?? "Branch"} -{" "}
                  {profile.semester ?? "Semester"}
                </p>
                <p className="text-xs text-muted-foreground">UID: {profile.id}</p>
              </div>
            ))
          )}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-xl">Grant Admin Access</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <div className="space-y-2">
            <Label htmlFor="uid">Student UID</Label>
            <Input
              id="uid"
              value={uid}
              onChange={(event) => setUid(event.target.value)}
              placeholder="Paste Firebase UID"
            />
          </div>
          <Button onClick={grantAdmin} disabled={savingRole}>
            {savingRole ? "Saving..." : "Grant Admin"}
          </Button>
          {roleMessage && <p className="text-sm text-muted-foreground">{roleMessage}</p>}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Admin;
