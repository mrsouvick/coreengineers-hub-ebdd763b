import { useState } from "react";
import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Mail, Youtube, Instagram, Send, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const faqs = [
  {
    q: "Is CoreEngineers Hub completely free?",
    a: "Yes! All our video lectures, notes, and study materials are completely free. Our mission is to make quality education accessible to every MAKAUT student.",
  },
  {
    q: "Which branches are covered?",
    a: "We currently cover four core engineering branches: Electronics & Communication (ECE), Electrical Engineering (EE), Mechanical Engineering (ME), and Civil Engineering.",
  },
  {
    q: "Are the notes syllabus-aligned?",
    a: "Absolutely. All content is carefully structured to align with the official MAKAUT syllabus, covering topics semester-wise from first year to final year.",
  },
  {
    q: "How often is new content added?",
    a: "We upload new content regularly, with priority given to subjects with upcoming exams. Subscribe to our YouTube channel to get notified!",
  },
  {
    q: "Can I download the study materials?",
    a: "Yes, all PDFs including handwritten notes, digital reference sheets, and important questions are available for free download.",
  },
];

const Contact = () => {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate submission
    setTimeout(() => {
      toast({
        title: "Message sent!",
        description: "We'll get back to you as soon as possible.",
      });
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    }, 1000);
  };

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
                Get in Touch
              </span>
              <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-5xl">
                We'd Love to <span className="text-gradient-orange">Hear From You</span>
              </h1>
              <p className="mt-6 text-lg text-muted-foreground">
                Have a question, feedback, or suggestion? Reach out and we'll get back to you.
              </p>
            </motion.div>
          </div>
        </section>

        <section className="pb-24">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
              {/* Contact Form */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
              >
                <div className="rounded-xl border border-border bg-gradient-card p-8">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                      <MessageSquare className="h-5 w-5" />
                    </div>
                    <h2 className="font-display text-xl font-bold">Send us a Message</h2>
                  </div>

                  <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                      <label htmlFor="name" className="mb-2 block text-sm font-medium text-foreground">
                        Your Name
                      </label>
                      <Input
                        id="name"
                        placeholder="Enter your name"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">
                        Email Address
                      </label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="message" className="mb-2 block text-sm font-medium text-foreground">
                        Message
                      </label>
                      <Textarea
                        id="message"
                        placeholder="How can we help you?"
                        rows={5}
                        value={form.message}
                        onChange={(e) => setForm({ ...form, message: e.target.value })}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full glow-orange-sm" disabled={loading}>
                      {loading ? "Sending..." : "Send Message"}
                      <Send className="ml-1 h-4 w-4" />
                    </Button>
                  </form>
                </div>
              </motion.div>

              {/* Social + FAQ */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="space-y-8"
              >
                {/* Social Links */}
                <div className="rounded-xl border border-border bg-gradient-card p-8">
                  <h3 className="font-display text-lg font-bold">Connect With Us</h3>
                  <div className="mt-4 space-y-3">
                    <a
                      href="https://www.youtube.com/@vickify-b6l"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      <Youtube className="h-5 w-5 text-primary" />
                      YouTube — VickiFY
                    </a>
                    <a
                      href="https://www.instagram.com/souvick.exe/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      <Instagram className="h-5 w-5 text-primary" />
                      Instagram — @souvick.exe
                    </a>
                    <a
                      href="mailto:coreengineershub@gmail.com"
                      className="flex items-center gap-3 rounded-lg border border-border bg-secondary/50 p-3 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground"
                    >
                      <Mail className="h-5 w-5 text-primary" />
                      coreengineershub@gmail.com
                    </a>
                  </div>
                </div>

                {/* FAQ */}
                <div className="rounded-xl border border-border bg-gradient-card p-8">
                  <h3 className="font-display text-lg font-bold">Frequently Asked Questions</h3>
                  <Accordion type="single" collapsible className="mt-4">
                    {faqs.map((faq, index) => (
                      <AccordionItem key={index} value={`faq-${index}`} className="border-border/50">
                        <AccordionTrigger className="text-left text-sm font-medium hover:text-primary">
                          {faq.q}
                        </AccordionTrigger>
                        <AccordionContent className="text-sm text-muted-foreground">
                          {faq.a}
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
