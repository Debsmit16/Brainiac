import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Features from '@/components/Features';
import Courses from '@/components/Courses';
import WhyChooseUs from '@/components/WhyChooseUs';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <Features />
        <Courses />
        <WhyChooseUs />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
