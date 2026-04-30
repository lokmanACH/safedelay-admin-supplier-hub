import Header from "@/components/sections/Header";
import Hero from "@/components/sections/Hero";
import Why from "@/components/sections/Why";
import About from "@/components/sections/About";
import How from "@/components/sections/How";
import CTA from "@/components/sections/CTA";
import Footer from "@/components/sections/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      <Header />
      <main>
        <Hero />
        <Why />
        <About />
        <How />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
