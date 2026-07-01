import React, { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useTranslation } from "react-i18next";
import { PageTitle } from "../components/PageTitle";
import { Link } from "react-router-dom";

const sections = [
  {
    number: "01",
    title: "Komitmen Layanan",
    icon: "fa-handshake",
    content:
      'Tinnzstore berkomitmen untuk menyediakan layanan hosting yang stabil, aman, dan andal bagi seluruh pelanggan. Kami menjamin ketersediaan layanan (uptime) sebesar <strong>99.9%</strong> per bulan untuk layanan yang dikelola langsung oleh infrastruktur Tinnzstore.',
  },
  {
    number: "02",
    title: "Uptime Guarantee",
    icon: "fa-chart-line",
    content:
      "Tinnzstore menjamin:<br/><br/>" +
      "• Game Hosting: <strong>99.9%</strong> Uptime<br/>" +
      "• Web Hosting: <strong>99.9%</strong> Uptime<br/>" +
      "• VPS Hosting: <strong>99.9%</strong> Uptime<br/>" +
      "• Dedicated Services: <strong>99.9%</strong> Uptime<br/><br/>" +
      "Perhitungan uptime dilakukan berdasarkan total waktu layanan tersedia dalam satu bulan kalender.",
  },
  {
    number: "03",
    title: "Downtime yang Termasuk dalam SLA",
    icon: "fa-exclamation-triangle",
    content:
      "Downtime berikut dihitung sebagai pelanggaran SLA:<br/><br/>" +
      "• Gangguan jaringan internal Tinnzstore.<br/>" +
      "• Kegagalan pada node atau server fisik milik Tinnzstore.<br/>" +
      "• Gangguan infrastruktur yang disebabkan oleh kesalahan konfigurasi atau sistem internal Tinnzstore.<br/>" +
      "• Gangguan layanan yang mengakibatkan server pelanggan tidak dapat diakses.",
  },
  {
    number: "04",
    title: "Downtime yang Tidak Termasuk dalam SLA",
    icon: "fa-shield-alt",
    content:
      "Downtime berikut tidak dihitung sebagai pelanggaran SLA:<br/><br/>" +
      "• Maintenance terjadwal yang telah diumumkan sebelumnya.<br/>" +
      "• Force majeure, termasuk bencana alam, kebakaran, perang, atau gangguan skala besar di luar kendali kami.<br/>" +
      "• Serangan DDoS yang melebihi kapasitas mitigasi.<br/>" +
      "• Kesalahan konfigurasi yang dilakukan pelanggan.<br/>" +
      "• Plugin, mod, atau aplikasi pelanggan yang menyebabkan crash atau overload.<br/>" +
      "• Gangguan dari penyedia pihak ketiga, seperti upstream provider, registrar, atau layanan eksternal lainnya.<br/>" +
      "• Pelanggaran Terms of Service yang mengakibatkan layanan ditangguhkan.",
  },
  {
    number: "05",
    title: "Maintenance Terjadwal",
    icon: "fa-calendar-check",
    content:
      "Tinnzstore berhak melakukan maintenance untuk menjaga keamanan dan stabilitas layanan. Kami akan berusaha memberikan pemberitahuan melalui website, Discord, atau media komunikasi resmi lainnya sebelum maintenance dilakukan.<br/><br/>Maintenance terjadwal <strong>tidak</strong> dihitung sebagai downtime SLA.",
  },
  {
    number: "06",
    title: "Kompensasi SLA",
    icon: "fa-coins",
    content:
      "Jika uptime bulanan berada di bawah jaminan yang diberikan, pelanggan dapat mengajukan kompensasi berupa Service Credit sesuai tabel berikut:",
    table: true,
    rows: [
      { uptime: "99.0% – 99.89%", compensation: "Kredit layanan sebesar 10%" },
      { uptime: "95.0% – 98.99%", compensation: "Kredit layanan sebesar 25%" },
      { uptime: "Di bawah 95.0%", compensation: "Kredit layanan sebesar 50%" },
    ],
    footer:
      "Service Credit hanya dapat digunakan untuk memperpanjang atau membeli layanan di Tinnzstore dan tidak dapat ditukarkan menjadi uang tunai atau refund.",
  },
  {
    number: "07",
    title: "Pengajuan Klaim SLA",
    icon: "fa-file-signature",
    content:
      "Pelanggan dapat mengajukan klaim SLA dengan ketentuan berikut:<br/><br/>" +
      "1. Klaim diajukan maksimal 7 hari setelah kejadian.<br/>" +
      "2. Klaim harus disertai informasi layanan yang terdampak.<br/>" +
      "3. Tinnzstore akan melakukan verifikasi terhadap laporan downtime.<br/>" +
      "4. Keputusan akhir mengenai kompensasi berada pada kebijakan Tinnzstore berdasarkan hasil investigasi.",
  },
  {
    number: "08",
    title: "Perubahan SLA",
    icon: "fa-sync-alt",
    content:
      "Tinnzstore berhak mengubah atau memperbarui kebijakan SLA ini sewaktu-waktu demi meningkatkan kualitas layanan. Perubahan akan diumumkan melalui website resmi atau media komunikasi Tinnzstore.",
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0, 1] as const } },
};

const ScaleIn: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.5, delay, ease: [0.25, 0.1, 0, 1] as const }}
  >
    {children}
  </motion.div>
);

export const Sla: React.FC = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.startsWith("en") ? "en" : "id";
  const [activeSection, setActiveSection] = useState(0);
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 0.12], [1, 0.95]);

  useEffect(() => {
    const observers = sections.map((_, idx) => {
      const el = document.getElementById(`section-${idx}`);
      if (!el) return null;
      const observer = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(idx); },
        { rootMargin: "-40% 0px -40% 0px" }
      );
      observer.observe(el);
      return observer;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, []);

  return (
    <>
      
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-40 -left-32 w-[500px] h-[500px] rounded-full bg-[var(--accent-blue)]/2 blur-[120px]" />
        <div className="absolute top-80 -right-32 w-[400px] h-[400px] rounded-full bg-[var(--accent-purple)]/2 blur-[120px]" />
      </div>

      <div className="relative z-10 pt-28 pb-20 min-h-screen flex flex-col max-w-7xl mx-auto px-6 md:px-12">
        
        <motion.div style={{ opacity: heroOpacity, scale: heroScale }} className="text-center flex flex-col items-center mb-16 md:mb-24">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="relative inline-flex items-center gap-2 px-3 py-1 border border-[var(--accent-blue)]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5 mb-6"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--accent-blue)]/5 to-transparent animate-pulse" />
            <span className="relative w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)]" />
            <span className="relative">SLA · TinnzStore · 2026</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.25, 0.1, 0, 1] as const }}
          >
            <PageTitle
              text="Service Level Agreement"
              className="text-4xl md:text-6xl lg:text-7xl font-black uppercase tracking-tight"
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.25, 0.1, 0, 1] as const }}
            className="text-sm md:text-base mt-6 max-w-2xl text-[var(--text-secondary)] font-light leading-relaxed"
          >
            {lang === "en"
              ? "Our commitment to service reliability and performance guarantees."
              : "Komitmen kami terhadap keandalan layanan dan jaminan performa."}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.25, 0.1, 0, 1] as const }}
            className="flex items-center gap-3 mt-8 text-[11px] font-mono text-[var(--text-secondary)] px-4 py-2 rounded-lg border border-[var(--border-color)] bg-[var(--glass-bg)] backdrop-blur-sm"
          >
            <i className="fas fa-calendar-alt text-[var(--accent-blue)]" />
            <span>
              {lang === "en" ? "Last updated: " : "Terakhir diperbarui: "}
              <strong className="text-[var(--text-primary)]">28 Juni 2026</strong>
            </span>
            <span className="w-px h-4 bg-[var(--border-color)]" />
            <span className="text-[var(--accent-blue)]">8 Pasal</span>
          </motion.div>
        </motion.div>

        
        <div className="flex gap-8 lg:gap-12">
          
          <div className="hidden lg:flex flex-col items-center gap-0 shrink-0 pt-2">
            <div className="relative w-px flex-1 bg-[var(--border-color)]">
              <motion.div
                className="absolute top-0 left-0 right-0 bg-gradient-to-b from-[var(--accent-blue)] via-[var(--accent-blue)]/50 to-transparent"
                style={{ height: useTransform(scrollYProgress, [0.15, 0.85], ["0%", "100%"]) }}
              />
            </div>
            <div className="flex flex-col items-center gap-0 -ml-[13px] mt-2">
              {sections.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => document.getElementById(`section-${idx}`)?.scrollIntoView({ behavior: "smooth" })}
                  className={`w-full flex items-center gap-3 py-2 transition-all duration-300 group cursor-pointer`}
                >
                  <div className={`w-[6px] h-[6px] rounded-full transition-all duration-500 ${
                    idx <= activeSection
                      ? "bg-[var(--accent-blue)] shadow-[0_0_8px_var(--accent-blue)]"
                      : "bg-[var(--border-color)] group-hover:bg-[var(--accent-blue)]/50"
                  }`} />
                  <span className={`text-[9px] font-mono uppercase tracking-wider transition-all duration-300 ${
                    idx === activeSection
                      ? "text-[var(--accent-blue)] font-bold opacity-100"
                      : "text-[var(--text-secondary)] opacity-0 group-hover:opacity-60"
                  }`}>
                    {sections[idx].number}
                  </span>
                </button>
              ))}
            </div>
          </div>

          
          <div className="flex-1 min-w-0">
            <motion.div
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-6"
            >
              {sections.map((section, idx) => (
                <ScaleIn key={idx} delay={idx * 0.03}>
                  <div id={`section-${idx}`} className="scroll-mt-28">
                    <div className="relative group">
                      
                      <div className="absolute -inset-x-2 -inset-y-2 rounded-2xl bg-gradient-to-r from-[var(--accent-blue)]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-xl" />

                      
                      <div className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] group-hover:border-[var(--accent-blue)]/25 transition-all duration-500 bg-[var(--glass-bg)] backdrop-blur-sm card-depth">
                        
                        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-[var(--accent-blue)] via-[var(--accent-blue)]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        
                        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[var(--accent-blue)]/5 blur-[60px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                        <div className="relative z-10 p-6 md:p-8 lg:p-10">
                          <div className="flex items-start gap-5 md:gap-7">
                            
                            <div className="relative shrink-0">
                              <div className="w-12 h-12 md:w-14 md:h-14 rounded-2xl bg-gradient-to-br from-[var(--accent-blue)]/15 to-[var(--accent-blue)]/5 flex items-center justify-center border border-[var(--accent-blue)]/20 group-hover:border-[var(--accent-blue)]/40 transition-all duration-500 group-hover:shadow-[0_0_20px_var(--accent-blue)]/20">
                                <i className={`fas ${section.icon} text-sm md:text-base text-[var(--accent-blue)]`} />
                              </div>
                              
                              <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[var(--accent-blue)] text-white text-[8px] font-black font-mono flex items-center justify-center shadow-[0_0_8px_var(--accent-blue)]">
                                {section.number}
                              </div>
                            </div>

                            <div className="flex-1 min-w-0">
                              
                              <div className="flex items-center gap-4 mb-4">
                                <h2 className="text-sm md:text-lg font-bold text-[var(--text-primary)]">
                                  {section.number}. {section.title}
                                </h2>
                                <div className="hidden sm:block flex-1 h-px bg-gradient-to-r from-[var(--accent-blue)]/30 via-[var(--accent-blue)]/10 to-transparent" />
                              </div>

                              
                              <div
                                className="text-xs md:text-sm leading-[1.8] text-[var(--text-secondary)] [&_strong]:text-[var(--text-primary)] [&_strong]:font-semibold"
                                dangerouslySetInnerHTML={{ __html: section.content }}
                              />

                              
                              {section.table && (
                                <div className="mt-5 overflow-hidden rounded-xl border border-[var(--border-color)]">
                                  <table className="w-full text-[11px] md:text-xs font-mono">
                                    <thead>
                                      <tr>
                                        <th className="text-left px-5 py-3.5 bg-gradient-to-r from-[var(--accent-blue)]/10 to-transparent text-[var(--text-primary)] font-bold uppercase tracking-wider text-[10px] border-b border-[var(--border-color)]">
                                          {lang === "en" ? "Monthly Uptime" : "Uptime Bulanan"}
                                        </th>
                                        <th className="text-left px-5 py-3.5 bg-gradient-to-r from-[var(--accent-blue)]/10 to-transparent text-[var(--text-primary)] font-bold uppercase tracking-wider text-[10px] border-b border-[var(--border-color)]">
                                          {lang === "en" ? "Compensation" : "Kompensasi"}
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {section.rows!.map((row, i) => (
                                        <tr key={i} className="group/row transition-colors duration-300 hover:bg-[var(--accent-blue)]/3">
                                          <td className="px-5 py-3.5 border-b border-[var(--border-color)]/50 text-[var(--text-secondary)] group-hover/row:text-[var(--text-primary)] transition-colors">
                                            <span className="flex items-center gap-2">
                                              <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)]/40 group-hover/row:bg-[var(--accent-blue)] transition-colors" />
                                              {row.uptime}
                                            </span>
                                          </td>
                                          <td className="px-5 py-3.5 border-b border-[var(--border-color)]/50 text-[var(--text-secondary)] group-hover/row:text-[var(--text-primary)] transition-colors font-semibold">
                                            {row.compensation}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                  {section.footer && (
                                    <div className="px-5 py-3 bg-[var(--accent-blue)]/3 border-t border-[var(--border-color)]">
                                      <p className="text-[10px] md:text-[11px] text-[var(--text-secondary)]/70 italic flex items-start gap-2">
                                        <i className="fas fa-info-circle text-[var(--accent-blue)] mt-0.5 shrink-0" />
                                        {section.footer}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScaleIn>
              ))}
            </motion.div>

            
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              className="mt-16 pt-10 border-t border-[var(--border-color)] text-center"
            >
              <div className="max-w-lg mx-auto">
                <div className="flex items-center justify-center gap-3 mb-5">
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-[var(--accent-blue)]/30 to-transparent" />
                  <img src="/logo.png" alt="TinnzStore" className="h-8 w-auto object-contain" referrerPolicy="no-referrer" />
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-[var(--accent-blue)]/30 to-transparent" />
                </div>
                <p className="text-[10px] md:text-[11px] font-mono leading-relaxed text-[var(--text-secondary)]/80">
                  {lang === "en"
                    ? "By using TinnzStore services, you agree to this Service Level Agreement."
                    : "Dengan menggunakan layanan TinnzStore, Anda menyetujui Service Level Agreement ini."}
                </p>
                <div className="flex items-center justify-center gap-5 mt-5 text-[10px] font-mono text-[var(--text-secondary)]/60">
                  <Link to="/terms" className="hover:text-[var(--accent-blue)] transition-colors">
                    {t("footer.terms")}
                  </Link>
                  <span className="w-px h-3 bg-[var(--border-color)]" />
                  <a href="mailto:support@tinnzstore.com" className="hover:text-[var(--accent-blue)] transition-colors">
                    support@tinnzstore.com
                  </a>
                  <span className="w-px h-3 bg-[var(--border-color)]" />
                  <a href="https://discord.gg/Nz9b6bMuNe" target="_blank" rel="noopener noreferrer" className="hover:text-[var(--accent-blue)] transition-colors">
                    Discord
                  </a>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </>
  );
};
