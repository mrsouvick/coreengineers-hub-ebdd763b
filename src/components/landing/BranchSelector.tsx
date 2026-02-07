import { motion } from "framer-motion";
import { Bolt, Cpu, Wrench, Ruler } from "lucide-react";

const branches = [
  { name: "CSE", title: "Computer Science & Engineering", icon: Cpu },
  { name: "ECE", title: "Electronics & Communication", icon: Cpu },
  { name: "EE", title: "Electrical Engineering", icon: Bolt },
  { name: "ME", title: "Mechanical Engineering", icon: Wrench },
  { name: "Civil", title: "Civil Engineering", icon: Ruler },
];

const BranchSelector = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Branches</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">Choose your track</h2>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">
              Pick your branch to see curated courses, notes, and revision packs tailored for each
              semester.
            </p>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-5"
        >
          {branches.map((branch) => (
            <div
              key={branch.name}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-background/70 p-6 shadow-xl backdrop-blur transition-all hover:-translate-y-1"
            >
              <div className="absolute right-0 top-0 h-20 w-20 rounded-full bg-primary/10 blur-2xl" />
              <branch.icon className="h-8 w-8 text-primary" />
              <p className="mt-6 text-xs uppercase tracking-[0.3em] text-muted-foreground">
                {branch.name}
              </p>
              <h3 className="mt-2 text-lg font-semibold text-foreground">{branch.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Semester-wise notes, playlists, and exam guides.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                Explore
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default BranchSelector;
