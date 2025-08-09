import { ThemeProvider } from "@/components/theme-provider"
import NavbarDemo from "@/components/ui/animated-hero"
import { Features } from "@/components/blocks/features-8"
import { Projects } from "@/components/blocks/projects"
import { ContactForm } from "@/components/blocks/contact-form"
import useBlobity from "blobity/lib/react/useBlobity";
import { initialBlobityOptions } from "./lib/blobity.config";
import { useEffect } from "react"
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

function App() {
  const blobity = useBlobity(initialBlobityOptions);

  useEffect(() => {
  }, [blobity]);

  // GSAP-powered smooth snap to sections with navbar offset
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const sections = Array.from(
      document.querySelectorAll<HTMLElement>("section[id]")
    );
    if (sections.length === 0) return;

    const NAV_OFFSET = 80; // approximate navbar height

    const getSnapPoints = () => {
      const pts = sections.map((s) => Math.max(0, s.offsetTop - NAV_OFFSET));
      // include the very top for hero
      pts.unshift(0);
      return Array.from(new Set(pts)).sort((a, b) => a - b);
    };

    let snapPoints = getSnapPoints();

    const st = ScrollTrigger.create({
      id: "section-snap",
      start: 0,
      end: () => ScrollTrigger.maxScroll(window),
      snap: {
        snapTo(value: number) {
          const max = ScrollTrigger.maxScroll(window);
          const currentY = value * max;
          let closest = snapPoints[0];
          for (const y of snapPoints) {
            if (Math.abs(y - currentY) < Math.abs(closest - currentY)) {
              closest = y;
            }
          }
          return closest / max;
        },
        duration: 1.6,
        ease: "power2.out",
        inertia: true,
        delay: 0.05,
      },
    });

    const handleRefresh = () => {
      snapPoints = getSnapPoints();
      st.refresh();
    };

    window.addEventListener("resize", handleRefresh);
    ScrollTrigger.addEventListener("refreshInit", handleRefresh);

    return () => {
      window.removeEventListener("resize", handleRefresh);
      ScrollTrigger.removeEventListener("refreshInit", handleRefresh);
      st.kill();
    };
  }, []);

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex min-h-dvh flex-col items-center justify-start scroll-smooth">
        <NavbarDemo />
        <section id="projects" className="scroll-mt-24 w-full mt-10">
          <Projects />
        </section>
        <section id="services" className="scroll-mt-24 w-full mt-10">
          <Features />
        </section>
        <section id="contact" className="scroll-mt-24 w-full">
          <ContactForm />
        </section>
      </div>
    </ThemeProvider>
  )
}

export default App  