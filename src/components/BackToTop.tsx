import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

export const BackToTop: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 20 }}
          transition={{ duration: 0.25, ease: [0.25, 0.1, 0, 1] as const }}
          onClick={scrollToTop}
          aria-label="Scroll to top"
          className="fixed bottom-5 right-5 md:bottom-8 md:right-8 z-50 w-11 h-11 md:w-12 md:h-12 flex items-center justify-center rounded-xl border bg-[var(--glass-bg)] backdrop-blur-md border-[var(--border-color)] text-[var(--accent-blue)] hover:bg-[var(--accent-blue)] hover:text-white hover:border-[var(--accent-blue)] active:scale-90 active:shadow-[0_0_16px_var(--accent-blue)] transition-all duration-300 shadow-lg"
        >
          <i className="fas fa-arrow-up text-sm md:text-base" />
        </motion.button>
      )}
    </AnimatePresence>
  );
};