import { motion } from "framer-motion";
import { Map, ClipboardCheck, GraduationCap } from "lucide-react";

const steps = [
  {
    icon: Map,
    title: "Choose your semester",
    description: "Select ECE, EE, ME, or Civil and your current semester." ,
  },
  {
    icon: ClipboardCheck,
    title: "Follow the roadmap",
    description: "Lessons, notes, and revision sheets organized in order.",
  },
  {
    icon: GraduationCap,
    title: "Crack exams with confidence",
    description: "Stay aligned with MAKAUT syllabus and important questions.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Workflow</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">How it works</h2>
          </div>
          <p className="max-w-lg text-sm text-muted-foreground">
            A single dashboard keeps your learning structured. Follow the steps, stay consistent,
            and upgrade your preparation.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-10 grid gap-6 lg:grid-cols-3"
        >
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 p-6 shadow-xl backdrop-blur"
            >
              <div className="absolute right-0 top-0 h-16 w-16 rounded-full bg-primary/15 blur-2xl" />
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                  <step.icon className="h-5 w-5" />
                </div>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Step {index + 1}
                </p>
              </div>
              <h3 className="mt-5 text-lg font-semibold text-foreground">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;
