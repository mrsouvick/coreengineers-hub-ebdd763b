import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, Play, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative overflow-hidden pt-24">
      <div className="pointer-events-none absolute inset-0 grid-dots opacity-40" />
      <div className="pointer-events-none absolute left-0 top-0 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

      <div className="container relative mx-auto px-4 lg:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-primary"
            >
              <Sparkles className="h-3.5 w-3.5" />
              MAKAUT Engineering Hub
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="mt-6 text-4xl font-semibold leading-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              The learning studio for serious
              <span className="block text-gradient-orange">Core Engineers</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="mt-5 max-w-xl text-base text-muted-foreground sm:text-lg"
            >
              One dashboard for courses, notes, and revision. Built for MAKAUT students who want
              clear guidance, verified resources, and a faster path to exam success.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-4"
            >
              <Link to="/auth">
                <Button size="lg" className="glow-orange px-8 text-base">
                  Start your dashboard
                  <ArrowUpRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <a href="https://youtube.com" target="_blank" rel="noreferrer">
                <Button variant="outline" size="lg" className="px-8 text-base">
                  <Play className="mr-2 h-4 w-4" />
                  Watch on YouTube
                </Button>
              </a>
            </motion.div>

            <div className="mt-8 flex flex-wrap gap-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
              <span>100% Free</span>
              <span>Syllabus Aligned</span>
              <span>Realtime Updates</span>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid gap-4"
          >
            <div className="glass-panel rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Live Course</p>
              <h3 className="mt-3 text-xl font-semibold text-foreground">Signals & Systems</h3>
              <p className="mt-2 text-sm text-muted-foreground">Module 3 · 45 min · ECE</p>
              <div className="mt-4 h-2 w-full rounded-full bg-secondary">
                <div className="h-2 w-2/3 rounded-full bg-primary" />
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Notes Drop</p>
              <h3 className="mt-3 text-xl font-semibold text-foreground">Network Theory</h3>
              <p className="mt-2 text-sm text-muted-foreground">Unit 2 summary · Updated today</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                PDF ready
              </div>
            </div>

            <div className="glass-panel rounded-3xl p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Next Test</p>
              <h3 className="mt-3 text-xl font-semibold text-foreground">Electrical Machines</h3>
              <p className="mt-2 text-sm text-muted-foreground">Monday · 9:00 AM</p>
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs text-muted-foreground">
                2 topics to revise
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
