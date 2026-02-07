import { GitBranch, Layers, Play, Trophy } from "lucide-react";
import { motion } from "framer-motion";

const steps = [
  {
    icon: GitBranch,
    title: "Choose Your Branch",
    description: "Select from ECE, EE, ME, or Civil Engineering to get started.",
  },
  {
    icon: Layers,
    title: "Select Your Semester",
    description: "Navigate to your current semester and pick your subject.",
  },
  {
    icon: Play,
    title: "Start Learning",
    description: "Watch video lectures, download notes, and track your progress.",
  },
  {
    icon: Trophy,
    title: "Ace Your Exams",
    description: "Use revision materials and exam prep resources to score high.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How It <span className="text-gradient-orange">Works</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Four simple steps to supercharge your engineering journey.
          </p>
        </div>

        <div className="relative mt-16">
          {/* Connecting line */}
          <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-gradient-to-b from-primary/40 via-primary/20 to-transparent lg:block" />

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative flex flex-col items-center text-center"
              >
                {/* Step number */}
                <div className="relative">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary">
                    <step.icon className="h-7 w-7" />
                  </div>
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold text-primary-foreground">
                    {index + 1}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-lg font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
