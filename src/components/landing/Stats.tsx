import { PlayCircle, Users, BookOpen, Clock } from "lucide-react";
import { motion } from "framer-motion";

const stats = [
  { icon: PlayCircle, value: "500+", label: "Video Lectures" },
  { icon: Users, value: "10,000+", label: "Students Helped" },
  { icon: BookOpen, value: "50+", label: "Subjects Covered" },
  { icon: Clock, value: "1,000+", label: "Hours of Content" },
];

const Stats = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="grid gap-6 rounded-3xl border border-border/60 bg-background/70 p-6 shadow-2xl backdrop-blur md:grid-cols-2 xl:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/15 text-primary">
                <stat.icon className="h-6 w-6" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-foreground">{stat.value}</p>
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
