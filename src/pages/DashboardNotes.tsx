import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

type Note = {
  id: string;
  title: string;
  tag: string;
  updated?: string;
  description?: string;
  downloadUrl?: string;
};

const DashboardNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const filteredNotes = notes.filter((note) => {
    const matchSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      (note.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchBranch = branch ? note.tag.toLowerCase() === branch.toLowerCase() : true;
    return matchSearch && matchBranch;
  });

  useEffect(() => {
    const notesRef = collection(db, "notes");
    const q = query(notesRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((docItem) => ({
        id: docItem.id,
        ...(docItem.data() as Omit<Note, "id">),
      }));
      setNotes(results);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  return (
    <DashboardLayout>
      <div className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-xl backdrop-blur">
        <h1 className="font-display text-3xl font-bold text-foreground">Notes</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Quick access to your saved notes, PDFs, and revision sheets.
        </p>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-background/70 p-4 shadow-lg backdrop-blur sm:flex-row sm:items-center">
        <Input
          placeholder="Search notes..."
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
        <div className="space-y-3">
          {[0, 1, 2, 3].map((item) => (
            <Card
              key={item}
              className="animate-pulse border-border/50 bg-background/80 backdrop-blur"
            >
              <CardContent className="space-y-3 py-6">
                <div className="h-4 w-2/3 rounded bg-secondary/60" />
                <div className="h-3 w-1/3 rounded bg-secondary/60" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredNotes.length === 0 ? (
        <Card className="border-border/50 bg-background/80 p-6 text-sm text-muted-foreground backdrop-blur">
          <p>No notes match your filters.</p>
        </Card>
      ) : (
        <Card className="border-border/50 bg-background/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-xl">Saved Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {filteredNotes.map((note) => (
              <div
                key={note.id}
                className="flex flex-col gap-2 rounded-lg border border-border/60 bg-secondary/40 px-4 py-3 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-foreground">{note.title}</p>
                  <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {note.tag}
                    {note.updated ? ` · ${note.updated}` : ""}
                  </p>
                  {note.description && <p className="mt-2 text-xs">{note.description}</p>}
                </div>
                <div className="flex gap-2">
                  {note.downloadUrl ? (
                    <Button size="sm" asChild>
                      <a href={note.downloadUrl} target="_blank" rel="noreferrer">
                        Download
                      </a>
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" disabled>
                      No file
                    </Button>
                  )}
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
