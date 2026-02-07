import { Star } from "lucide-react";
import { motion } from "framer-motion";

const testimonials = [
  {
    name: "Arjun Mondal",
    branch: "ECE — 4th Semester",
    quote: "CoreEngineers Hub literally saved my semester. The video explanations are clear and the notes are exactly what I needed for my exams.",
    rating: 5,
  },
  {
    name: "Sneha Roy",
    branch: "EE — 6th Semester",
    quote: "Finally, one platform that covers everything semester-wise. No more searching through random YouTube videos. The study roadmaps are a game-changer!",
    rating: 5,
  },
  {
    name: "Rahul Das",
    branch: "ME — 3rd Semester",
    quote: "The revision videos before exams are incredibly helpful. I can quickly brush up on important topics. Highly recommended for all MAKAUT students.",
    rating: 5,
  },
];

const Testimonials = () => {
  return (
    <section className="border-t border-border/50 bg-secondary/20 py-24">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            What Students <span className="text-gradient-orange">Say</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Hear from fellow MAKAUT engineering students who've leveled up their learning.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {testimonials.map((t, index) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col rounded-xl border border-border bg-gradient-card p-6"
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>

              {/* Quote */}
              <p className="mt-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="mt-6 flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 font-display text-sm font-bold text-primary">
                  {t.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.branch}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
