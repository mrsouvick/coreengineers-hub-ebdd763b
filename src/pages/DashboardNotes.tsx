import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const notes = [
  { title: "Network Theory — Unit 2", tag: "ECE", updated: "Today" },
  { title: "Digital Electronics — Short Notes", tag: "ECE", updated: "Yesterday" },
  { title: "Electrical Machines — PYQ", tag: "EE", updated: "2 days ago" },
  { title: "Thermodynamics — Formula Sheet", tag: "ME", updated: "4 days ago" },
  { title: "Surveying — Lab Manual", tag: "Civil", updated: "1 week ago" },
];

const DashboardNotes = () => {
  return (
    <DashboardLayout>
      <div className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-xl backdrop-blur">
        <h1 className="font-display text-3xl font-bold text-foreground">Notes</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Quick access to your saved notes, PDFs, and revision sheets.
        </p>
      </div>

      <Card className="border-border/50 bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-xl">Saved Notes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {notes.map((note) => (
            <div
              key={note.title}
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
    </DashboardLayout>
  );
};

export default DashboardNotes;
