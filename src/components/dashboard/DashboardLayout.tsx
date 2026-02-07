import { Link, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { LayoutGrid, NotebookPen, BookOpen, User, Shield, LogOut } from "lucide-react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth/AuthProvider";
import { auth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import useAdmin from "@/hooks/useAdmin";

const navItems = [
  { label: "Overview", path: "/dashboard", icon: LayoutGrid },
  { label: "Courses", path: "/dashboard/courses", icon: BookOpen },
  { label: "Notes", path: "/dashboard/notes", icon: NotebookPen },
  { label: "Profile", path: "/dashboard/profile", icon: User },
];

const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const { user } = useAuth();
  const { isAdmin } = useAdmin();

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="min-h-screen bg-gradient-navy">
      <Navbar />
      <main className="container mx-auto min-h-[calc(100vh-8rem)] px-4 pb-16 pt-24 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 p-5 shadow-2xl backdrop-blur">
            <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-primary/20 via-transparent to-orange-muted/20" />
            <div className="relative mb-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Dashboard</p>
              <p className="mt-2 text-sm text-foreground">{user?.email}</p>
              <p className="mt-1 text-xs text-muted-foreground">CoreEngineers Hub</p>
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
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            {isAdmin && (
              <div className="my-5 border-t border-border/60 pt-4">
                <p className="mb-2 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Admin
                </p>
                <Link
                  to="/admin"
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                    location.pathname === "/admin"
                      ? "bg-secondary text-foreground shadow-sm"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  <Shield className="h-4 w-4" />
                  Admin Panel
                </Link>
              </div>
            )}
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
