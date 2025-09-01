import { Header } from '@/components/header';
import { HeroSection } from '@/components/hero-section';
import { ImageGenerator } from '@/components/image-generator';
import { PricingSection } from '@/components/pricing-section';
import { Footer } from '@/components/footer';
import { LandingGallery } from '@/components/landing-gallery';
import { ScrollIndicator } from '@/components/scroll-indicator';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <div className="h-screen w-full overflow-y-auto snap-y snap-mandatory scroll-smooth">
        <Header />
        <ScrollIndicator />
        <section id="hero" className="h-screen w-full snap-start">
          <HeroSection />
        </section>
        <section id="gallery" className="h-screen w-full snap-start my-18">
          <LandingGallery />
        </section>
        <section id="generator" className="h-screen w-full snap-start">
          <ImageGenerator />
        </section>
        <section id="pricing" className="h-screen w-full snap-start">
          <PricingSection />
        </section>
        <footer className="snap-start">
          <Footer />
        </footer>
      </div>
    </main>
  );
}
