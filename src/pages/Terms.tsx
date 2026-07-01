import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";
import { PageTitle } from "../components/PageTitle";
import { useTerms, TermItem } from "../hooks/useFirestore";

const tabMeta: { id: TermItem["tab"]; label: string; labelEn: string }[] = [
  { id: "syk", label: "Syarat dan Ketentuan", labelEn: "Terms and Conditions" },
  { id: "kebijakan_pengguna", label: "Kebijakan Pengguna", labelEn: "User Policy" },
  { id: "kebijakan_privasi", label: "Kebijakan Privasi", labelEn: "Privacy Policy" }
];

const AccordionSection: React.FC<{
  articles: TermItem[];
  baseIndex?: number;
  lang: "id" | "en";
}> = ({ articles, baseIndex = 0, lang }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div className="w-full flex flex-col gap-3">
      {articles.map((article, idx) => {
        const isOpen = activeIndex === idx;
        const title = lang === "en" && article.title_en ? article.title_en : article.title;
        const content = lang === "en" && article.content_en ? article.content_en : article.content;
        return (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05, duration: 0.4 }}
            className={`relative overflow-hidden rounded-xl border transition-all duration-500 bg-[var(--glass-bg)] backdrop-blur-sm card-depth ${
              isOpen
                ? "border-[var(--accent-blue)]/50 shadow-[0_0_25px_rgba(0,212,255,0.08)]"
                : "border-[var(--border-color)] hover:border-[var(--accent-blue)]/20"
            }`}
          >
            <div className={`absolute inset-0 bg-gradient-to-r from-[var(--accent-blue)]/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 ${isOpen ? 'opacity-100' : ''}`} />
            <button
              onClick={() => setActiveIndex(isOpen ? null : idx)}
              className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 text-sm outline-none text-[var(--text-primary)] relative z-10"
            >
              <span className="flex items-center gap-4">
                <span className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-black font-mono border transition-all duration-300 shrink-0 ${
                  isOpen
                    ? "bg-[var(--accent-blue)] text-white border-[var(--accent-blue)] shadow-[0_0_12px_var(--accent-blue)]"
                    : "bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border-[var(--accent-blue)]/20"
                }`}>
                  {String(baseIndex + idx + 1).padStart(2, "0")}
                </span>
                <span className="font-bold text-[13px]">{title}</span>
              </span>
              <div className={`w-7 h-7 flex items-center justify-center rounded-full border transition-all duration-300 shrink-0 ${
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
                  <div className="px-5 pb-5 pt-4 text-xs leading-relaxed text-[var(--text-secondary)]">
                    <div className="pl-5 border-l border-[var(--border-color)]">
                      {content}
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

export const Terms: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : "id";
  const [activeTab, setActiveTab] = useState<TermItem["tab"]>("syk");
  const { terms, loading } = useTerms();

  const filteredTerms = useMemo(() => {
    return terms.filter((t) => t.tab === activeTab).sort((a, b) => (a.order || 0) - (b.order || 0));
  }, [terms, activeTab]);

  const tabConfig = useMemo(() => tabMeta.map((t) => ({
    ...t,
    labelDisplay: lang === "en" ? t.labelEn : t.label,
    count: terms.filter((term) => term.tab === t.id).length
  })), [terms, lang]);

  const baseIndex = useMemo(() => {
    const preceding = tabMeta.slice(0, tabMeta.findIndex((t) => t.id === activeTab));
    return preceding.reduce((acc, t) => acc + terms.filter((term) => term.tab === t.id).length, 0);
  }, [terms, activeTab]);

  return (
    <div className="pt-24 pb-16 min-h-screen flex flex-col max-w-7xl mx-auto px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
        className="text-center flex flex-col items-center mb-6"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
          {t('terms_page.badge_legal')} · TinnzStore · 2026
        </span>

        <PageTitle
          text={t('terms_page.title')}
          className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-3"
        />

        <p className="text-sm mt-5 max-w-2xl text-[var(--text-secondary)] font-light leading-relaxed">
          {lang === "en"
            ? "By registering or using TinnzStore services, you are deemed to have read and agreed to all legal documents below."
            : "Dengan mendaftar atau menggunakan layanan TinnzStore, Anda dianggap telah membaca dan menyetujui seluruh dokumen hukum berikut."}
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 mt-6 text-[11px] font-mono">
          {tabConfig.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 rounded-lg border transition-all duration-300 ${
                activeTab === tab.id
                  ? "bg-[var(--accent-blue)]/10 border-[var(--accent-blue)]/30 text-[var(--accent-blue)] font-bold"
                  : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-blue)]/30"
              }`}
            >
              {tab.labelDisplay} <span className="text-[var(--accent-blue)]">{String(tab.count).padStart(2, "0")}</span>
            </button>
          ))}
        </div>
      </motion.div>

      <div className="flex border-b border-[var(--border-color)] mb-8">
        {tabConfig.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-5 py-3 text-[10px] font-mono uppercase tracking-[0.15em] font-bold transition-all duration-300 ${
              activeTab === tab.id
                ? "text-[var(--accent-blue)]"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            {tab.labelDisplay}
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-underline"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-blue)]"
              />
            )}
          </button>
        ))}
      </div>

      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-6"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/30 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)]/80 bg-[var(--accent-blue)]/3">
          {t('terms_page.badge_official')} · TINNZSTORE
        </span>
      </motion.div>

      <motion.div
        key={`title-${activeTab}`}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="mb-2"
      >
        <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--text-primary)]">
          {tabConfig.find((t) => t.id === activeTab)?.labelDisplay}
        </h2>
        <p className="text-[11px] font-mono text-[var(--text-secondary)] mt-1">
          {filteredTerms.length} pasal · Terakhir diperbarui {terms.filter(t => t.lastUpdated).sort((a, b) => new Date(b.lastUpdated!).getTime() - new Date(a.lastUpdated!).getTime())[0]?.lastUpdated || "27 Oktober 2025"}
        </p>
      </motion.div>

      <p className="text-[10px] font-mono text-[var(--text-secondary)]/60 mb-5 tracking-wide">
        {lang === "en" ? "Click each article to read its contents." : "Klik setiap pasal untuk membaca isinya."}
      </p>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <i className="fas fa-spinner animate-spin text-2xl text-[var(--accent-blue)]" />
        </div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0, 1] as const }}
          >
            <AccordionSection articles={filteredTerms} baseIndex={baseIndex} lang={lang} />
          </motion.div>
        </AnimatePresence>
      )}

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mt-12 pt-8 border-t border-[var(--border-color)] text-center"
      >
        <div className="flex items-center justify-center gap-2 text-[var(--accent-blue)] mb-4">
          <img src="/logo.png" alt="TinnzStore" className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
        </div>
        <p className="text-[10px] font-mono uppercase tracking-[0.15em] text-[var(--text-secondary)]">
          &copy; 2026 · All rights reserved
        </p>
        <div className="flex items-center justify-center gap-4 mt-3 text-[10px] font-mono text-[var(--text-secondary)]">
          <a href="mailto:support@tinnzstore.com" className="hover:text-[var(--accent-blue)] transition-colors">support@tinnzstore.com</a>
          <span className="text-[var(--border-color)]">|</span>
          <a href="https://discord.gg/Nz9b6bMuNe" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-blue)] transition-colors">Discord</a>
        </div>
      </motion.div>
    </div>
  );
};