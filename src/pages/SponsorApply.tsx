import React from "react";
import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { PageTitle } from "../components/PageTitle";
import SponsorshipForm from "../components/SponsorshipForm";
import { useTranslation } from "react-i18next";

export const SponsorApply: React.FC = () => {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-16 min-h-screen flex flex-col gap-10 max-w-7xl mx-auto px-6 md:px-12 overflow-hidden relative">
      <div className="absolute top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-[var(--accent-blue)]/5 rounded-full blur-[150px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
        className="flex flex-col items-center text-center"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5 mb-5">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
          {t('sponsor_form.badge')}
        </span>
        <PageTitle text={t('sponsor_form.title')} className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-2 leading-tight" />
        <p className="text-sm mt-4 max-w-xl text-[var(--text-secondary)] font-light leading-relaxed">
          {t('sponsor_form.subtitle')}
        </p>
        <Link
          to="/sponsor"
          className="group inline-flex items-center gap-2 px-4 py-2 mt-5 text-[10px] font-bold rounded-xl text-[var(--text-secondary)] border border-[var(--border-color)] hover:text-[var(--accent-blue)] hover:border-[var(--accent-blue)]/40 transition-all duration-300 active:scale-95"
        >
          <i className="fas fa-arrow-left text-[9px] group-hover:-translate-x-1 transition-transform" />
          Kembali ke Sponsorship
        </Link>
      </motion.div>

      <SponsorshipForm />
    </div>
  );
};
