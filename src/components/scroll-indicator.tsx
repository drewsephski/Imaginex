'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sections = ['hero', 'gallery', 'generator', 'pricing'];

export function ScrollIndicator() {
  const [activeSection, setActiveSection] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (isScrolling) return;
      
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;
      
      // Calculate which section is currently in view
      const currentSection = Math.floor(scrollPosition / windowHeight);
      
      if (currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };

    // Add debounce to prevent rapid state updates
    const debouncedScroll = () => {
      setIsScrolling(true);
      handleScroll();
      setTimeout(() => setIsScrolling(false), 100);
    };

    window.addEventListener('scroll', debouncedScroll);
    return () => window.removeEventListener('scroll', debouncedScroll);
  }, [activeSection, isScrolling]);

  const scrollToSection = (index: number) => {
    const section = document.getElementById(sections[index]);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col gap-4">
      {sections.map((_, index) => (
        <button
          key={index}
          onClick={() => scrollToSection(index)}
          className="relative w-3 h-3 rounded-full focus:outline-none"
          aria-label={`Go to ${sections[index]} section`}
        >
          <AnimatePresence>
            {activeSection === index ? (
              <motion.span
                className="absolute inset-0 bg-primary rounded-full"
                initial={{ scale: 0.5 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.5 }}
                transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              />
            ) : (
              <span className="absolute inset-0 bg-gray-300 dark:bg-gray-600 rounded-full hover:bg-primary/50 transition-colors" />
            )}
          </AnimatePresence>
        </button>
      ))}
    </div>
  );
}
