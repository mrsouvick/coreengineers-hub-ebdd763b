import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { LayoutGrid, NotebookPen, BookOpen, User, Shield, LogOut } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";

const navItems = [
  { label: "Overview", path: "/dashboard", icon: LayoutGrid },
  { label: "Courses", path: "/dashboard/courses", icon: BookOpen },
  { label: "Notes", path: "/dashboard/notes", icon: NotebookPen },
  { label: "Profile", path: "/dashboard/profile", icon: User },
];

const adminItems = [{ label: "Admin Panel", path: "/admin", icon: Shield }];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { user } = useAuth();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-gradient-navy">
      <Navbar />
      <main className="container mx-auto min-h-[calc(100vh-8rem)] px-4 pb-16 pt-24 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
          <aside className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-lg backdrop-blur">
            <div className="mb-4">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Dashboard</p>
              <p className="mt-2 text-sm text-foreground">{user?.email}</p>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="my-4 border-t border-border/60 pt-4">
              <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Admin
              </p>
              {adminItems.map((item) => {
                const Icon = item.icon;
                const active = location.pathname === item.path;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                      active
                        ? "bg-secondary text-foreground"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            <Button variant="outline" className="w-full" onClick={handleSignOut}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </aside>

          <section className="space-y-6">{children}</section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout;
