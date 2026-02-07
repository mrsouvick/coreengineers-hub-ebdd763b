import { useEffect, useState } from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/components/auth/AuthProvider";
import { auth, db } from "@/lib/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential,
  updatePassword,
  updateProfile,
} from "firebase/auth";
import { doc, onSnapshot, serverTimestamp, setDoc } from "firebase/firestore";

type ProfileForm = {
  name: string;
  phone: string;
  photoUrl: string;
  branch: string;
  semester: string;
  bio: string;
};

const normalizeImageUrl = (url: string) => {
  const trimmed = url.trim();
  if (!trimmed) return "";
  if (trimmed.includes("drive.google.com")) {
    const match = trimmed.match(/\/d\/([\w-]+)/) || trimmed.match(/id=([\w-]+)/);
    const id = match?.[1];
    if (id) return `https://drive.google.com/uc?export=view&id=${id}`;
  }
  if (trimmed.includes("github.com") && trimmed.includes("/blob/")) {
    return trimmed.replace("github.com", "raw.githubusercontent.com").replace("/blob/", "/");
  }
  return trimmed;
};

const DashboardProfile = () => {
  const { user } = useAuth();
  const [form, setForm] = useState<ProfileForm>({
    name: "",
    phone: "",
    photoUrl: "",
    branch: "",
    semester: "",
    bio: "",
  });
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordMessage, setPasswordMessage] = useState<string | null>(null);
  const [passwordSaving, setPasswordSaving] = useState(false);
  const canChangePassword = user?.providerData.some((provider) => provider.providerId === "password");

  useEffect(() => {
    if (!user?.uid) return;
    const profileRef = doc(db, "profiles", user.uid);
    const unsubscribe = onSnapshot(profileRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as ProfileForm;
        setForm({
          name: data.name ?? "",
          phone: data.phone ?? "",
          photoUrl: data.photoUrl ?? "",
          branch: data.branch ?? "",
          semester: data.semester ?? "",
          bio: data.bio ?? "",
        });
        return;
      }
      setForm((prev) => ({
        ...prev,
        name: user.displayName ?? "",
      }));
    });

    return () => unsubscribe();
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
      const normalizedPhoto = normalizeImageUrl(form.photoUrl);
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { displayName: form.name, photoURL: normalizedPhoto });
      }
      const profileRef = doc(db, "profiles", user.uid);
      await setDoc(
        profileRef,
        {
          ...form,
          photoUrl: normalizedPhoto,
          email: user.email,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setForm((prev) => ({ ...prev, photoUrl: normalizedPhoto }));
      setMessage("Profile updated successfully.");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update profile.";
      setMessage(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordChange = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!auth.currentUser || !user?.email) return;
    if (!canChangePassword) {
      setPasswordMessage("Password change is available only for email/password accounts.");
      return;
    }
    if (!currentPassword || !newPassword) {
      setPasswordMessage("Enter current and new password.");
      return;
    }
    if (newPassword.length < 6) {
      setPasswordMessage("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage("New password and confirm password do not match.");
      return;
    }

    setPasswordSaving(true);
    setPasswordMessage(null);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
      setPasswordMessage("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update password.";
      setPasswordMessage(errorMessage);
    } finally {
      setPasswordSaving(false);
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
              <Label htmlFor="uid">User ID (UID)</Label>
              <Input id="uid" value={user?.uid ?? ""} readOnly />
            </div>
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
            <div className="space-y-2 lg:col-span-2">
              <Label htmlFor="photoUrl">Profile Photo URL</Label>
              <Input
                id="photoUrl"
                value={form.photoUrl}
                onChange={(event) => updateField("photoUrl", event.target.value)}
                placeholder="Paste image URL (Google Drive / GitHub / Imgur)"
              />
              {form.photoUrl && (
                <img
                  src={form.photoUrl}
                  alt="Profile preview"
                  className="mt-3 h-20 w-20 rounded-full object-cover"
                />
              )}
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

      <Card className="border-border/50 bg-background/80 backdrop-blur">
        <CardHeader>
          <CardTitle className="font-display text-xl">Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          {!canChangePassword ? (
            <p className="text-sm text-muted-foreground">
              You signed in with Google. Password change is not available for this account.
            </p>
          ) : (
            <form onSubmit={handlePasswordChange} className="grid gap-4 lg:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="current-password">Current Password</Label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(event) => setCurrentPassword(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new-password">New Password</Label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm-password">Confirm New Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                />
              </div>
              <div className="flex items-end">
                <Button type="submit" disabled={passwordSaving}>
                  {passwordSaving ? "Updating..." : "Update Password"}
                </Button>
              </div>
              {passwordMessage && (
                <p className="text-sm text-muted-foreground lg:col-span-2" role="status">
                  {passwordMessage}
                </p>
              )}
            </form>
          )}
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default DashboardProfile;
