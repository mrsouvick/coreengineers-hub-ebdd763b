import { motion } from "framer-motion";

const testimonials = [
  {
    quote:
      "The dashboard finally keeps my notes, lectures, and revision sheets in one place. I stopped jumping between apps.",
    name: "Riya S.",
    role: "ECE, 5th Semester",
  },
  {
    quote:
      "The courses are aligned with MAKAUT syllabus and the revision sheets are gold. Helped me score 8+ CGPA.",
    name: "Arjun D.",
    role: "EE, 6th Semester",
  },
  {
    quote:
      "Simple, fast, and exam-focused. I like the lesson roadmap and weekly targets.",
    name: "Neha P.",
    role: "Mechanical, 4th Semester",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">Stories</p>
            <h2 className="mt-3 text-3xl font-semibold text-foreground">Students love it</h2>
          </div>
          <p className="max-w-lg text-sm text-muted-foreground">
            Built with feedback from MAKAUT students who need focused, reliable learning systems.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mt-10 grid gap-6 lg:grid-cols-3"
        >
          {testimonials.map((item) => (
            <div
              key={item.name}
              className="rounded-3xl border border-border/60 bg-background/70 p-6 shadow-xl backdrop-blur"
            >
              <p className="text-sm text-muted-foreground">"{item.quote}"</p>
              <div className="mt-6">
                <p className="text-sm font-semibold text-foreground">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.role}</p>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default Testimonials;
