import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/components/auth/AuthProvider";
import { db } from "@/lib/firebase";
import { doc, onSnapshot } from "firebase/firestore";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Explore", path: "/explore" },
  { label: "Syllabus", path: "/syllabus" },
  { label: "Announcements", path: "/announcements" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();
  const [profileName, setProfileName] = useState<string | null>(null);
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setProfileName(null);
      return;
    }
    const profileRef = doc(db, "profiles", user.uid);
    const unsub = onSnapshot(profileRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as { name?: string; photoUrl?: string };
        setProfileName(data.name ?? null);
        setProfilePhoto(data.photoUrl ?? null);
      }
    });
    return () => unsub();
  }, [user?.uid]);

  const displayNameRaw = profileName || user?.displayName || user?.email || "Dashboard";
  const displayName = displayNameRaw.split(" ")[0];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <nav className="container mx-auto flex h-16 items-center justify-between px-4 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src="/hero.png"
            alt="CoreEngineers Hub logo"
            className="h-9 w-9 rounded-lg object-cover"
          />
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            Core<span className="text-primary">Engineers</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                location.pathname === link.path
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Desktop CTA */}
        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <Link to="/dashboard" className="flex items-center gap-3">
              {profilePhoto ? (
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Signed in</p>
                <p className="text-sm font-semibold text-foreground">{displayName}</p>
              </div>
              <Button size="sm" className="glow-orange-sm">
                Dashboard
              </Button>
            </Link>
          ) : (
            <>
              <Link to="/auth">
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  Log In
                </Button>
              </Link>
              <Link to="/auth">
                <Button size="sm" className="glow-orange-sm">
                  Get Started
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          className="inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-b border-border bg-background md:hidden"
          >
            <div className="container mx-auto flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-md px-4 py-3 text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? "bg-secondary text-primary"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="mt-3 flex flex-col gap-2">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-secondary/40 px-4 py-3 text-sm text-foreground">
                      {profilePhoto ? (
                        <img
                          src={profilePhoto}
                          alt="Profile"
                          className="h-7 w-7 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/20 text-xs font-semibold text-primary">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                      {displayName}
                    </div>
                    <Link to="/dashboard" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full">Dashboard</Button>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/auth" onClick={() => setMobileOpen(false)}>
                      <Button variant="outline" className="w-full">
                        Log In
                      </Button>
                    </Link>
                    <Link to="/auth" onClick={() => setMobileOpen(false)}>
                      <Button className="w-full">Get Started</Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
