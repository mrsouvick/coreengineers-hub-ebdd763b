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
    <section className="border-y border-border/50 bg-secondary/30 py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 gap-8 lg:grid-cols-4"
        >
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <stat.icon className="h-6 w-6" />
              </div>
              <span className="mt-4 font-display text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {stat.value}
              </span>
              <span className="mt-1 text-sm text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
