import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/components/auth/AuthProvider";
import { auth, db } from "@/lib/firebase";
import {
  browserLocalPersistence,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile,
} from "firebase/auth";
import { doc, getDoc, serverTimestamp, setDoc } from "firebase/firestore";

const Auth = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [college, setCollege] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  useEffect(() => {
    if (user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, navigate]);

  const applyPersistence = async () => {
    await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
  };

  const ensureProfile = async (uid: string, payload: { name?: string; email?: string | null }) => {
    const profileRef = doc(db, "profiles", uid);
    const snapshot = await getDoc(profileRef);
    if (snapshot.exists()) return;
    await setDoc(
      profileRef,
      {
        name: payload.name ?? "",
        email: payload.email ?? "",
        phone,
        city,
        college,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  const handleEmailAuth = async (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitting(true);
    setMessage(null);

    try {
      await applyPersistence();
      if (mode === "signin") {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        await ensureProfile(cred.user.uid, { name: cred.user.displayName ?? "", email });
        setMessage("Signed in. Redirecting...");
        navigate("/dashboard", { replace: true });
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(cred.user, { displayName: name || undefined });
        await setDoc(
          doc(db, "profiles", cred.user.uid),
          {
            name,
            email,
            phone,
            city,
            college,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
        setMessage("Account created. Redirecting...");
        navigate("/dashboard", { replace: true });
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
      setMessage(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("Enter your email, then click reset.");
      return;
    }
    setResetting(true);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("Password reset email sent. Check your inbox.");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
      setMessage(errorMessage);
    } finally {
      setResetting(false);
    }
  };

  const handleGoogle = async () => {
    setSubmitting(true);
    setMessage(null);
    try {
      await applyPersistence();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await ensureProfile(result.user.uid, {
        name: result.user.displayName ?? "",
        email: result.user.email,
      });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Something went wrong.";
      setMessage(errorMessage);
      setSubmitting(false);
    }
  };

  const heroItems = useMemo(
    () => [
      { title: "Realtime updates", desc: "Courses and notes refresh instantly." },
      { title: "Verified content", desc: "Curated by educators and toppers." },
      { title: "Personal dashboard", desc: "Track progress and saved resources." },
      { title: "YouTube-first", desc: "Jump straight to your video lessons." },
    ],
    []
  );

  return (
    <div className="min-h-screen bg-gradient-navy">
      <Navbar />
      <main className="container mx-auto flex min-h-[calc(100vh-8rem)] items-center px-4 pb-16 pt-24 lg:px-8">
        <div className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="rounded-3xl border border-border/60 bg-background/70 p-8 shadow-2xl backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              CoreEngineers Hub
            </p>
            <h1 className="mt-4 font-display text-3xl font-bold text-foreground sm:text-4xl">
              Learn faster. Stay exam ready.
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground">
              Access structured courses, revision notes, and curated videos built for MAKAUT
              engineering students. Everything in one dashboard.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {heroItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/60 bg-secondary/30 p-4"
                >
                  <p className="text-sm font-semibold text-foreground">{item.title}</p>
                  <p className="mt-2 text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <Card className="w-full border-border/50 bg-background/80 shadow-xl backdrop-blur">
            <CardHeader>
              <CardTitle className="font-display text-2xl">
                {mode === "signin" ? "Welcome back" : "Create your account"}
              </CardTitle>
              <CardDescription>
                {mode === "signin"
                  ? "Sign in to access your dashboard."
                  : "Sign up with email or Google to get started."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 pb-4">
                <Button
                  type="button"
                  variant={mode === "signin" ? "default" : "secondary"}
                  className="flex-1"
                  onClick={() => setMode("signin")}
                >
                  Sign In
                </Button>
                <Button
                  type="button"
                  variant={mode === "signup" ? "default" : "secondary"}
                  className="flex-1"
                  onClick={() => setMode("signup")}
                >
                  Sign Up
                </Button>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={handleGoogle}
                disabled={submitting}
              >
                Continue with Google
              </Button>

              <div className="my-6 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border/60" />
                OR
                <span className="h-px flex-1 bg-border/60" />
              </div>

              <form onSubmit={handleEmailAuth} className="space-y-4">
                {mode === "signup" && (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        placeholder="+91XXXXXXXXXX"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        value={city}
                        onChange={(event) => setCity(event.target.value)}
                        placeholder="Kolkata"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="college">College</Label>
                      <Input
                        id="college"
                        value={college}
                        onChange={(event) => setCollege(event.target.value)}
                        placeholder="Your college name"
                        required
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@example.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="flex gap-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      placeholder="********"
                      required
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowPassword((prev) => !prev)}
                    >
                      {showPassword ? "Hide" : "Show"}
                    </Button>
                  </div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(event) => setRememberMe(event.target.checked)}
                    />
                    Remember me
                  </label>
                  {mode === "signin" && (
                    <button
                      type="button"
                      className="text-primary hover:underline"
                      onClick={handleResetPassword}
                      disabled={resetting}
                    >
                      {resetting ? "Sending..." : "Forgot password?"}
                    </button>
                  )}
                </div>
                <Button type="submit" className="w-full" disabled={submitting}>
                  {submitting
                    ? "Please wait..."
                    : mode === "signin"
                      ? "Sign In"
                      : "Create Account"}
                </Button>
              </form>

              {message && (
                <p className="mt-4 text-sm text-muted-foreground" role="status">
                  {message}
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Auth;
