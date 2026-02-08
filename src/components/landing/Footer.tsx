import { Link } from "react-router-dom";
import { Youtube, Instagram, Mail, Heart } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/50 bg-background/80 py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div className="sm:col-span-2 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <img
                src="/hero.png"
                alt="CoreEngineers Hub logo"
                className="h-10 w-10 rounded-xl object-cover"
              />
              <span className="font-display text-lg font-bold tracking-tight text-foreground">
                Core<span className="text-primary">Engineers</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm text-muted-foreground">
              Your trusted academic companion for MAKAUT core engineering students.
            </p>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Quick Links</h4>
            <ul className="mt-4 space-y-3">
              {[
                { label: "Home", path: "/" },
                { label: "Explore", path: "/explore" },
                { label: "Syllabus", path: "/syllabus" },
                { label: "Announcements", path: "/announcements" },
                { label: "About", path: "/about" },
                { label: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.path}>
                  <Link
                    to={link.path}
                    className="text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Resources</h4>
            <ul className="mt-4 space-y-3">
              {["Video Lectures", "Study Notes", "Exam Prep", "Revision Sheets"].map((item) => (
                <li key={item}>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Connect</h4>
            <div className="mt-4 flex gap-3">
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="YouTube"
              >
                <Youtube className="h-5 w-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="mailto:contact@coreengineershub.com"
                className="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-secondary text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                aria-label="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/50 pt-8 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} CoreEngineers Hub. All rights reserved.
          </p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            Made with <Heart className="h-3 w-3 text-primary" /> for MAKAUT students
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
