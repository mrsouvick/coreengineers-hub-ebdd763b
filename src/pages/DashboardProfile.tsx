import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth/AuthProvider";
import { auth } from "@/lib/firebase";
import { updateProfile } from "firebase/auth";

type ProfileForm = {
  name: string;
  phone: string;
  branch: string;
  semester: string;
  bio: string;
};

const getProfileKey = (uid: string) => `cehub-profile-${uid}`;

const DashboardProfile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    phone: "",
    branch: "",
    semester: "",
    bio: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user?.uid) return;
    const stored = localStorage.getItem(getProfileKey(user.uid));
    if (stored) {
      setForm(JSON.parse(stored) as ProfileForm);
      return;
    }
    setForm((prev) => ({
      ...prev,
      name: user.displayName ?? "",
    }));
  }, [user]);

  const updateField = (field: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);

    try {
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: form.name });
      }
      localStorage.setItem(getProfileKey(user.uid), JSON.stringify(form));
      setMessage("Profile updated successfully.");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile.";
      setMessage(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-xl backdrop-blur">
        <h1 className="font-display text-3xl font-bold text-foreground">Profile</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Update your personal details and student profile.
        </p>
      </div>

      <Card className="border-border/50 bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-xl">Student Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSave} className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(event) => updateField("name", event.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={form.phone}
                onChange={(event) => updateField("phone", event.target.value)}
                placeholder="+91 90000 00000"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="branch">Branch</Label>
              <Input
                id="branch"
                value={form.branch}
                onChange={(event) => updateField("branch", event.target.value)}
                placeholder="ECE / EE / ME / Civil"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="semester">Semester</Label>
              <Input
                id="semester"
                value={form.semester}
                onChange={(event) => updateField("semester", event.target.value)}
                placeholder="4th Semester"
              />
            </div>
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={form.bio}
                onChange={(event) => updateField("bio", event.target.value)}
                placeholder="Tell us about your goals, strengths, or focus areas."
              />
            </div>
            <div className="lg:col-span-2">
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </Button>
              {message && (
                <p className="mt-3 text-sm text-muted-foreground" role="status">
                  {message}
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default DashboardProfile;
