import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const Dashboard = () => {
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-gradient-navy">
      <Navbar />
      <main className="container mx-auto flex min-h-[calc(100vh-8rem)] flex-col gap-8 px-4 pb-16 pt-24 lg:px-8">
        <div className="flex flex-col gap-3">
          <h1 className="font-display text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-sm text-muted-foreground">
            Signed in as <span className="text-foreground">{user?.email}</span>
          </p>
          <div>
            <Button variant="outline" onClick={handleSignOut}>
              Sign Out
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="border-border/50 bg-background/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-display text-xl">LLM Portal</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-muted-foreground">
              <p>
                This will become your private local AI workspace. In the next step we’ll
                connect it to a free local model (Ollama).
              </p>
              <div className="rounded-lg border border-border/60 bg-secondary/40 p-4 text-xs">
                Coming soon: model selector, prompt history, file uploads.
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-background/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="font-display text-xl">Learning Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-muted-foreground">
              <p>Track semester modules, notes, and revision checkpoints.</p>
              <div className="rounded-lg border border-border/60 bg-secondary/40 p-4 text-xs">
                We’ll wire this to real data after auth is stable.
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
