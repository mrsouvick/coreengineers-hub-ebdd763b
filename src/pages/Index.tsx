import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import BranchSelector from "@/components/landing/BranchSelector";
import Stats from "@/components/landing/Stats";
import HowItWorks from "@/components/landing/HowItWorks";
import Testimonials from "@/components/landing/Testimonials";
import CTASection from "@/components/landing/CTASection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-navy">
      <Navbar />
      <main>
        <Hero />
        <Stats />
        <BranchSelector />
        <HowItWorks />
        <Testimonials />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
