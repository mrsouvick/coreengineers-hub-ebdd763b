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
  category?: string;
  updated?: string;
  description?: string;
  downloadUrl?: string;
};

const DashboardNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");
  const [category, setCategory] = useState("");

  const filteredNotes = notes.filter((note) => {
    const matchSearch =
      note.title.toLowerCase().includes(search.toLowerCase()) ||
      (note.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchBranch = branch ? note.tag.toLowerCase() === branch.toLowerCase() : true;
    const matchCategory = category
      ? (note.category ?? "").toLowerCase() === category.toLowerCase()
      : true;
    return matchSearch && matchBranch && matchCategory;
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
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 p-8 shadow-2xl backdrop-blur">
        <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Notes Library</p>
          <h1 className="mt-3 text-3xl font-semibold text-foreground">Revision notes & PDFs</h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Search by topic, branch, or category. Everything updates in real time.
          </p>
        </div>
      </div>

      <div className="grid gap-4 rounded-3xl border border-border/60 bg-background/70 p-4 shadow-xl backdrop-blur sm:grid-cols-3">
        <Input
          placeholder="Search notes..."
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
        <Input
          placeholder="Category (Signals/Machines)"
          value={category}
          onChange={(event) => setCategory(event.target.value)}
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
                    {note.category ? ` - ${note.category}` : ""}
                    {note.updated ? ` - ${note.updated}` : ""}
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
