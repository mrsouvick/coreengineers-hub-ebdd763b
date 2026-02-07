import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Target, Eye, Rocket, Users } from "lucide-react";
import { motion } from "framer-motion";

const team = [
  {
    name: "Founder & Admin",
    role: "Product Direction & Academic Quality",
    description: "Oversees the overall direction, ensures academic accuracy, and drives the vision forward.",
  },
  {
    name: "Tutors",
    role: "Content Creation & Teaching",
    description: "Responsible for lecture creation, concept explanations, and problem-solving content.",
  },
  {
    name: "Graphics Designer",
    role: "Visual Identity & Branding",
    description: "Handles thumbnails, visuals, and maintains branding consistency across all content.",
  },
];

const roadmap = [
  "Live doubt-clearing sessions",
  "Free PDF libraries",
  "Branch-specific project guides",
  "Internship & placement guidance",
  "Skill-based training modules",
];

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-navy">
      <Navbar />
      <main className="pt-16">
        {/* Hero */}
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mx-auto max-w-3xl text-center"
            >
              <span className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-medium text-primary">
                About Us
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                Building the <span className="text-gradient-orange">Future of Learning</span> for MAKAUT
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                CoreEngineers Hub is positioned as a long-term academic support ecosystem. With structured 
                delivery, a focused audience, and a clear vision, we aim to become the most trusted learning 
                companion for MAKAUT core engineering students.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="border-y border-border/50 bg-secondary/20 py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-xl border border-border bg-gradient-card p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Target className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">Our Mission</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To support every engineering student with clear explanations, quality notes, and a 
                  structured learning path so they can study confidently and perform well in exams. We 
                  believe that access to quality education shouldn't depend on your coaching or college.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="rounded-xl border border-border bg-gradient-card p-8"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Eye className="h-6 w-6" />
                </div>
                <h3 className="mt-5 font-display text-xl font-bold">Our Vision</h3>
                <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  To become the single most trusted academic platform for MAKAUT engineering students — 
                  a place where they can find everything they need to learn, revise, and excel. We're 
                  building more than a channel; we're building an ecosystem.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Meet the <span className="text-gradient-orange">Team</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                A small but dedicated team committed to making engineering education better.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex flex-col items-center rounded-xl border border-border bg-gradient-card p-8 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Users className="h-7 w-7" />
                  </div>
                  <h3 className="mt-5 font-display text-lg font-bold">{member.name}</h3>
                  <p className="mt-1 text-xs font-medium text-primary">{member.role}</p>
                  <p className="mt-3 text-sm text-muted-foreground">{member.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Roadmap */}
        <section className="border-t border-border/50 bg-secondary/20 py-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                What's <span className="text-gradient-orange">Coming Next</span>
              </h2>
              <p className="mt-4 text-muted-foreground">
                We're always working on new features to help you learn better.
              </p>
            </div>

            <div className="mx-auto mt-12 max-w-md space-y-4">
              {roadmap.map((item, index) => (
                <motion.div
                  key={item}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-4 rounded-lg border border-border bg-gradient-card p-4"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <Rocket className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-foreground">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
