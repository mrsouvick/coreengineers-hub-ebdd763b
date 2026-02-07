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

type Note = {
  id: string;
  title: string;
  tag: string;
  updated: string;
};

const DashboardNotes = () => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadNotes = async () => {
      if (!user?.uid) return;
      const notesRef = collection(db, "users", user.uid, "notes");
      const snapshot = await getDocs(query(notesRef, orderBy("createdAt", "desc")));
      const results = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Note, "id">),
      }));
      setNotes(results);
      setLoading(false);
    };

    loadNotes();
  }, [user?.uid]);

  const seedNotes = async () => {
    if (!user?.uid) return;
    setSaving(true);
    const notesRef = collection(db, "users", user.uid, "notes");
    const data = [
      { title: "Network Theory — Unit 2", tag: "ECE", updated: "Today" },
      { title: "Digital Electronics — Short Notes", tag: "ECE", updated: "Yesterday" },
      { title: "Electrical Machines — PYQ", tag: "EE", updated: "2 days ago" },
      { title: "Thermodynamics — Formula Sheet", tag: "ME", updated: "4 days ago" },
      { title: "Surveying — Lab Manual", tag: "Civil", updated: "1 week ago" },
    ];
    for (const item of data) {
      await addDoc(notesRef, { ...item, createdAt: serverTimestamp() });
    }
    setSaving(false);
    setLoading(true);
    const snapshot = await getDocs(query(notesRef, orderBy("createdAt", "desc")));
    const results = snapshot.docs.map((docItem) => ({
      id: docItem.id,
      ...(docItem.data() as Omit<Note, "id">),
    }));
    setNotes(results);
    setLoading(false);
  };
  return (
    <DashboardLayout>
      <div className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-xl backdrop-blur">
        <h1 className="font-display text-3xl font-bold text-foreground">Notes</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Quick access to your saved notes, PDFs, and revision sheets.
        </p>
      </div>

      {loading ? (
        <Card className="border-border/50 bg-background/80 p-6 text-sm text-muted-foreground backdrop-blur">
          Loading notes...
        </Card>
      ) : notes.length === 0 ? (
        <Card className="border-border/50 bg-background/80 p-6 text-sm text-muted-foreground backdrop-blur">
          <p>No notes yet.</p>
          <Button className="mt-4" onClick={seedNotes} disabled={saving}>
            {saving ? "Adding..." : "Add sample notes"}
          </Button>
        </Card>
      ) : (
        <Card className="border-border/50 bg-background/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-xl">Saved Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.id}
                className="flex flex-col gap-2 rounded-lg border border-border/60 bg-secondary/40 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-foreground">{note.title}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {note.tag} · {note.updated}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    View
                  </Button>
                  <Button size="sm">Download</Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
};

export default DashboardNotes;
