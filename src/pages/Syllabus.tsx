import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

type Syllabus = {
  id: string;
  title: string;
  branch: string;
  semester: string;
  downloadUrl?: string;
  description?: string;
};

type Resource = {
  id: string;
  title: string;
  category: string;
  branch?: string;
  downloadUrl?: string;
  description?: string;
};

const Syllabus = () => {
  const [syllabi, setSyllabi] = useState<Syllabus[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [search, setSearch] = useState("");
  const [branch, setBranch] = useState("");

  useEffect(() => {
    const syllabusRef = collection(db, "syllabus");
    const resourceRef = collection(db, "resources");

    const unsubSyllabus = onSnapshot(query(syllabusRef, orderBy("createdAt", "desc")), (snap) => {
      setSyllabi(
        snap.docs.map((docItem) => ({
          id: docItem.id,
          ...(docItem.data() as Omit<Syllabus, "id">),
        }))
      );
    });

    const unsubResources = onSnapshot(query(resourceRef, orderBy("createdAt", "desc")), (snap) => {
      setResources(
        snap.docs.map((docItem) => ({
          id: docItem.id,
          ...(docItem.data() as Omit<Resource, "id">),
        }))
      );
    });

    return () => {
      unsubSyllabus();
      unsubResources();
    };
  }, []);

  const filteredSyllabi = syllabi.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchBranch = branch ? item.branch.toLowerCase() === branch.toLowerCase() : true;
    return matchSearch && matchBranch;
  });

  const filteredResources = resources.filter((item) => {
    const matchSearch =
      item.title.toLowerCase().includes(search.toLowerCase()) ||
      (item.description ?? "").toLowerCase().includes(search.toLowerCase());
    const matchBranch = branch ? (item.branch ?? "").toLowerCase() === branch.toLowerCase() : true;
    return matchSearch && matchBranch;
  });

  return (
    <div className="min-h-screen bg-gradient-navy">
      <Navbar />
      <main className="container mx-auto px-4 pb-16 pt-24 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 p-8 shadow-2xl backdrop-blur">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Syllabus</p>
            <h1 className="mt-3 text-3xl font-semibold text-foreground">
              MAKAUT syllabus & academic resources
            </h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Download semester-wise syllabus PDFs and essential resource packs.
            </p>
          </div>
        </div>

        <div className="mt-6 grid gap-4 rounded-3xl border border-border/60 bg-background/70 p-4 shadow-xl backdrop-blur sm:grid-cols-2">
          <Input
            placeholder="Search syllabus/resources..."
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

        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
          <Card className="border-border/50 bg-background/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-display text-xl">Semester-wise Syllabus</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              {filteredSyllabi.length === 0 ? (
                <p>No syllabus entries yet.</p>
              ) : (
                filteredSyllabi.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col gap-3 rounded-lg border border-border/60 bg-secondary/40 px-4 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div>
                      <p className="text-foreground">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.branch} - Semester {item.semester}
                      </p>
                      {item.description && (
                        <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>
                      )}
                    </div>
                    {item.downloadUrl ? (
                      <Button size="sm" asChild>
                        <a href={item.downloadUrl} target="_blank" rel="noreferrer">
                          Download
                        </a>
                      </Button>
                    ) : (
                      <Button size="sm" variant="secondary" disabled>
                        Coming soon
                      </Button>
                    )}
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-background/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-display text-xl">Resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              {filteredResources.length === 0 ? (
                <p>No resources yet.</p>
              ) : (
                filteredResources.map((item) => (
                  <div
                    key={item.id}
                    className="rounded-lg border border-border/60 bg-secondary/40 px-4 py-3"
                  >
                    <p className="text-foreground">{item.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.category}
                      {item.branch ? ` - ${item.branch}` : ""}
                    </p>
                    {item.description && (
                      <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>
                    )}
                    {item.downloadUrl && (
                      <Button size="sm" variant="outline" className="mt-3" asChild>
                        <a href={item.downloadUrl} target="_blank" rel="noreferrer">
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

export default Syllabus;
