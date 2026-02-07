import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const CTASection = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 p-10 text-center shadow-2xl backdrop-blur">
          <div className="absolute left-0 top-0 h-24 w-24 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 right-0 h-28 w-28 rounded-full bg-accent/20 blur-3xl" />
          <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Ready to start?</p>
          <h2 className="mt-4 text-3xl font-semibold text-foreground">
            Build your exam routine with CoreEngineers Hub
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-sm text-muted-foreground">
            Join thousands of students using structured courses, curated notes, and a personal
            dashboard to stay ahead.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="glow-orange px-8">
                Create free account
              </Button>
            </Link>
            <Link to="/explore">
              <Button variant="outline" size="lg" className="px-8">
                Explore content
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
