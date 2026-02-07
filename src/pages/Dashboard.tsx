import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/components/auth/AuthProvider";

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="rounded-2xl border border-border/60 bg-background/70 p-6 shadow-xl backdrop-blur">
        <h1 className="font-display text-3xl font-bold text-foreground">Student Dashboard</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Welcome back, <span className="text-foreground">{user?.email}</span>.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {[
          { title: "Active Courses", value: "4", note: "ECE, EE, ME, Civil" },
          { title: "Notes Saved", value: "28", note: "Last updated today" },
          { title: "Upcoming Tests", value: "2", note: "Next: Signals & Systems" },
        ].map((item) => (
          <Card key={item.title} className="border-border/50 bg-background/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                {item.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-display text-3xl font-semibold text-foreground">{item.value}</p>
              <p className="mt-2 text-xs text-muted-foreground">{item.note}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="border-border/50 bg-background/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-xl">Recently Added Notes</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {[
              "Network Theory — Unit 2 summary",
              "Electrical Machines — Important numericals",
              "Thermodynamics — Quick revision sheet",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/40 px-4 py-3"
              >
                <span>{item}</span>
                <span className="text-xs text-muted-foreground">View</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-background/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-xl">LLM Portal</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              This will become your private local AI workspace. We'll connect it to a
              free local model (Ollama) next.
            </p>
            <div className="rounded-lg border border-border/60 bg-secondary/40 p-4 text-xs">
              Coming soon: model selector, prompt history, file uploads.
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
