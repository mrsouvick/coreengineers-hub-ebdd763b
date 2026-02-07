import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";

const quickStats = [
  { title: "Active Courses", value: "4", note: "ECE, EE, ME, Civil" },
  { title: "Notes Saved", value: "28", note: "Last updated today" },
  { title: "Learning Streak", value: "12", note: "days in a row" },
  { title: "Upcoming Tests", value: "2", note: "Next: Signals & Systems" },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <DashboardLayout>
      <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 p-8 shadow-2xl backdrop-blur">
        <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-orange-muted/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative">
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Student Hub</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-foreground sm:text-4xl">
            Welcome back{user?.email ? "," : ""}
            <span className="block text-primary">{user?.email ?? "Engineer"}</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Your personalized workspace for MAKAUT engineering prep. Track progress, open courses,
            and keep your notes organized in one place.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button className="glow-orange-sm">Open My Courses</Button>
            <Button variant="outline">Explore Notes</Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {quickStats.map((item) => (
          <Card key={item.title} className="border-border/50 bg-background/80 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
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

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-border/50 bg-background/80 backdrop-blur lg:col-span-2">
          <CardHeader>
            <CardTitle className="font-display text-xl">Continue Learning</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            {[
              { title: "Signals & Systems", detail: "Module 3 · 45 min" },
              { title: "Electrical Machines", detail: "Module 2 · 35 min" },
              { title: "Thermodynamics", detail: "Module 1 · 50 min" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between rounded-lg border border-border/60 bg-secondary/40 px-4 py-3"
              >
                <div>
                  <p className="text-foreground">{item.title}</p>
                  <p className="text-xs text-muted-foreground">{item.detail}</p>
                </div>
                <Button size="sm">Resume</Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border/50 bg-background/80 backdrop-blur">
          <CardHeader>
            <CardTitle className="font-display text-xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            {["Open latest notes", "View syllabus", "Contact mentor"].map((item) => (
              <Button key={item} variant="outline" className="w-full justify-start">
                {item}
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
