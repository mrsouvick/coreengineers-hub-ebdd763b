import { useEffect, useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/lib/firebase";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";

type Announcement = {
  id: string;
  title: string;
  message: string;
  type?: "info" | "update" | "alert";
  date?: string;
};

const Announcements = () => {
  const [items, setItems] = useState<Announcement[]>([]);

  useEffect(() => {
    const ref = collection(db, "announcements");
    const q = query(ref, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setItems(
        snapshot.docs.map((docItem) => ({
          id: docItem.id,
          ...(docItem.data() as Omit<Announcement, "id">),
        }))
      );
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-navy">
      <Navbar />
      <main className="container mx-auto px-4 pb-16 pt-24 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 p-8 shadow-2xl backdrop-blur">
          <div className="absolute right-0 top-0 h-24 w-24 rounded-full bg-primary/15 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-accent/20 blur-3xl" />
          <div className="relative">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Announcements
            </p>
            <h1 className="mt-3 text-3xl font-semibold text-foreground">Latest updates</h1>
            <p className="mt-3 text-sm text-muted-foreground">
              Important notices, exam alerts, and platform updates.
            </p>
          </div>
        </div>

        <div className="mt-10 grid gap-6">
          {items.length === 0 ? (
            <Card className="border-border/50 bg-background/80 p-6 text-sm text-muted-foreground backdrop-blur">
              No announcements yet.
            </Card>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="border-border/50 bg-background/80 backdrop-blur">
                <CardHeader>
                  <CardTitle className="font-display text-xl">{item.title}</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  <p>{item.message}</p>
                  <div className="mt-3 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                    {item.type ?? "update"}
                    {item.date ? ` - ${item.date}` : ""}
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Announcements;
