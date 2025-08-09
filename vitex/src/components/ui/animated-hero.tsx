import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { gsap } from "gsap";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import type { MouseEvent } from "react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/navigation-menu";

export default function NavbarDemo() {
  const navItems = [
    {
      name: "Services",
      link: "#services",
    },
    {
      name: "Projects",
      link: "#projects",
    },
    {
      name: "Contact",
      link: "#contact",
    },
  ];

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["Intelligent", "Automated", "Scalable", "Efficient", "Secure"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  gsap.registerPlugin(ScrollToPlugin);

  function handleSmoothScroll(
    e: MouseEvent<HTMLAnchorElement>,
    href: string,
  ): void {
    if (!href) return;
    const isHash = href.startsWith("#");
    if (!isHash) return;
    e.preventDefault();
    const target = document.querySelector<HTMLElement>(href);
    gsap.to(window, {
      duration: 0.8,
      ease: "power2.out",
      scrollTo: { y: target ?? 0, offsetY: 80 },
    });
  }

  function handleScrollTo(targetHash: string): void {
    const target = document.querySelector<HTMLElement>(targetHash);
    gsap.to(window, {
      duration: 0.8,
      ease: "power2.out",
      scrollTo: { y: target ?? 0, offsetY: 80 },
    });
  }

  return (
      <div className="relative w-full mt-6">
        <Navbar>
          {/* Desktop Navigation */}
          <NavBody>
            <NavbarLogo />
            <NavItems items={navItems} onItemClick={handleSmoothScroll} />
            <div className="flex items-center gap-4">
              <NavbarButton
                as="button"
                onClick={() => handleScrollTo("#contact")}
                variant="primary"
              >
                Get in Touch
              </NavbarButton>
            </div>
          </NavBody>
  
          {/* Mobile Navigation */}
          <MobileNav>
            <MobileNavHeader>
              <NavbarLogo />
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              />
            </MobileNavHeader>
  
            <MobileNavMenu
              isOpen={isMobileMenuOpen}
              onClose={() => setIsMobileMenuOpen(false)}
            >
              {navItems.map((item, idx) => (
                <a
                  key={`mobile-link-${idx}`}
                  href={item.link}
                  onClick={(e) => {
                    handleSmoothScroll(e, item.link);
                    setIsMobileMenuOpen(false);
                  }}
                  className="relative text-neutral-600 dark:text-neutral-300"
                >
                  <span className="block">{item.name}</span>
                </a>
              ))}
              <div className="flex w-full flex-col gap-4">
                <NavbarButton
                  onClick={() => {
                    handleScrollTo("#contact");
                    setIsMobileMenuOpen(false);
                  }}
                  variant="primary"
                  className="w-full"
                >
                  Get in Touch
                </NavbarButton>
              </div>
            </MobileNavMenu>
          </MobileNav>
        </Navbar>
        <div className="container mx-auto">
        <div className="flex gap-8 py-32 lg:py-48 items-center justify-center flex-col">
          <div>
            <Button
              variant="secondary"
              size="sm"
              className="gap-4"
              onClick={() => handleScrollTo("#services")}
            >
              Explore my work <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-2xl tracking-tighter text-center font-regular">
              <span className="text-spektr-cyan-50">Building AI-Powered Web Experiences</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-muted-foreground max-w-2xl text-center">
              I specialize in developing intelligent AI agents and modern, responsive web applications. Let's build something incredible together.
            </p>
          </div>
          <div className="flex flex-row gap-3">
            <Button size="lg" className="gap-4" variant="outline">
              Schedule a Consultation <PhoneCall className="w-4 h-4" />
            </Button>
            <Button
              size="lg"
              className="gap-4"
              onClick={() => handleScrollTo("#projects")}
            >
              View My Projects <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}