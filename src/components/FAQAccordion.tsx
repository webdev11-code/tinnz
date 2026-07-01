import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { useFAQ } from "../hooks/useFirestore";

export const FAQAccordion: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const { faqs } = useFAQ();
  const isEn = i18n.language === "en";

  const handleToggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-4">
      {faqs.map((faq, idx) => {
        const isOpen = activeIndex === idx;
        const question = isEn && faq.question_en ? faq.question_en : faq.question;
        const answer = isEn && faq.answer_en ? faq.answer_en : faq.answer;
        return (
          <motion.div
            key={faq.id || idx}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.06, duration: 0.4 }}
            className={`relative overflow-hidden rounded-xl border transition-all duration-500 bg-[var(--glass-bg)] backdrop-blur-sm card-depth ${
              isOpen
                ? "border-[var(--accent-blue)]/50 shadow-[0_0_25px_rgba(0,212,255,0.08)]"
                : "border-[var(--border-color)] hover:border-[var(--accent-blue)]/20"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-[var(--accent-blue)]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 ${isOpen ? 'opacity-100' : ''}`} />
            <button
              onClick={() => handleToggle(idx)}
              className="w-full px-6 py-5 text-left flex items-center justify-between gap-4 font-bold text-sm outline-none text-[var(--text-primary)] relative z-10"
            >
              <span className="flex items-center gap-4">
                <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black font-mono border transition-all duration-300 ${
                  isOpen
                    ? "bg-[var(--accent-blue)] text-white border-[var(--accent-blue)] shadow-[0_0_12px_var(--accent-blue)]"
                    : "bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border-[var(--accent-blue)]/20"
                }`}>
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span className="text-[13px]">{question}</span>
              </span>
              <div className={`w-7 h-7 flex items-center justify-center rounded-full border transition-all duration-300 ${
                isOpen
                  ? "bg-[var(--accent-blue)]/10 border-[var(--accent-blue)]/30 text-[var(--accent-blue)]"
                  : "border-[var(--border-color)] text-[var(--text-secondary)]"
              }`}>
                <i className={`fas fa-chevron-down text-[10px] transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
              </div>
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.25, 0.1, 0, 1] as const }}
                  className="border-t border-[var(--accent-blue)]/10 relative z-10"
                >
                  <div className="px-6 py-5 text-xs leading-relaxed text-[var(--text-secondary)]">
                    <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-[var(--accent-blue)]/30 to-transparent" />
                    <div className="pl-5 border-l border-[var(--border-color)]">
                      {answer}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        );
      })}
    </div>
  );
};
