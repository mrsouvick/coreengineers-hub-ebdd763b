import { useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { db } from "@/lib/firebase";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";

const stats = [
  { label: "Total Students", value: "1,284" },
  { label: "Active Today", value: "312" },
  { label: "Notes Uploaded", value: "3,870" },
  { label: "Courses Live", value: "24" },
];

const Admin = () => {
  const [uid, setUid] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const grantAdmin = async () => {
    if (!uid.trim()) return;
    setSaving(true);
    setMessage(null);
    try {
      await setDoc(
        doc(db, "roles", uid.trim()),
        { role: "admin", updatedAt: serverTimestamp() },
        { merge: true }
      );
      setMessage("Admin role granted.");
      setUid("");
    } catch (err) {
      setMessage(err instanceof Error ? err.message : "Failed to update role.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-xl backdrop-blur">
        <h1 className="font-display text-3xl font-bold text-foreground">Admin Panel</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Manage students, content, and platform settings.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
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

      <Card className="border-border/50 bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-xl">Content Actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3 text-sm text-muted-foreground sm:flex-row">
          <Button>Create Course</Button>
          <Button variant="outline">Upload Notes</Button>
          <Button variant="secondary">Review Submissions</Button>
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
          <Button onClick={grantAdmin} disabled={saving}>
            {saving ? "Saving..." : "Grant Admin"}
          </Button>
          {message && <p className="text-sm text-muted-foreground">{message}</p>}
        </CardContent>
      </Card>

      <Card className="border-border/50 bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-xl">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          {[
            "New student signup: priya@makaut.edu",
            "Notes approved: Signals & Systems — Unit 3",
            "Course updated: Electrical Machines — Module 2",
          ].map((item) => (
            <div
              key={item}
              className="rounded-lg border border-border/60 bg-secondary/40 px-4 py-3"
            >
              {item}
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default Admin;
