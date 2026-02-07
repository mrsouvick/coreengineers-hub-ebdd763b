import { Link } from "react-router-dom";
import { Cpu, Zap, Cog, Building2 } from "lucide-react";
import { motion } from "framer-motion";

const branches = [
  {
    name: "ECE",
    full: "Electronics & Communication",
    icon: Cpu,
    description: "Circuit theory, signals, communications, VLSI & embedded systems",
    semesters: 8,
  },
  {
    name: "EE",
    full: "Electrical Engineering",
    icon: Zap,
    description: "Power systems, machines, control theory & electrical circuits",
    semesters: 8,
  },
  {
    name: "ME",
    full: "Mechanical Engineering",
    icon: Cog,
    description: "Thermodynamics, fluid mechanics, manufacturing & machine design",
    semesters: 8,
  },
  {
    name: "Civil",
    full: "Civil Engineering",
    icon: Building2,
    description: "Structural analysis, surveying, geotechnical & construction",
    semesters: 8,
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const BranchSelector = () => {
  return (
    <section className="relative py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Choose Your <span className="text-gradient-orange">Branch</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Select your engineering branch to access semester-wise content tailored to your syllabus.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {branches.map((branch) => (
            <motion.div key={branch.name} variants={item}>
              <Link
                to={`/explore/${branch.name.toLowerCase()}`}
                className="group relative flex flex-col items-center rounded-xl border border-border bg-gradient-card p-8 text-center transition-all duration-300 hover:border-primary/40 hover:glow-orange-sm"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                  <branch.icon className="h-8 w-8" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">{branch.name}</h3>
                <p className="mt-1 text-xs font-medium text-primary">{branch.full}</p>
                <p className="mt-3 text-sm text-muted-foreground">{branch.description}</p>
                <span className="mt-4 inline-flex items-center rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
                  {branch.semesters} Semesters
                </span>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BranchSelector;
