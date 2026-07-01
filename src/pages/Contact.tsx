import { useTranslation } from "react-i18next";
import { PageTitle } from "../components/PageTitle";
import React, { useState } from "react";
import { useContactSubmissions } from "../hooks/useFirestore";
import { motion } from "motion/react";

export const Contact: React.FC = () => {
  const { t } = useTranslation();
  const { submitContactMessage } = useContactSubmissions();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await submitContactMessage({ name, email, subject, message });
      setIsSubmitted(true);
      setName("");
      setEmail("");
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error("Error submitting contact form:", err);
      alert(t('contact.form_error'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactChannels = [
    {
      title: t('contact.discord_title'),
      value: t('contact.discord_value'),
      icon: "fab fa-discord text-indigo-400",
      link: "https://discord.gg/Nz9b6bMuNe",
    },
    {
      title: t('contact.whatsapp_title'),
      value: t('contact.whatsapp_value'),
      icon: "fab fa-whatsapp text-green-400",
      link: "https://wa.me/6287844812351",
    },
    {
      title: t('contact.email_title'),
      value: t('contact.email_value'),
      icon: "fas fa-envelope text-blue-400",
      link: "mailto:support@tinnzstore.com",
    },
  ];

  const stagger = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const slideUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.1, 0, 1] as const } },
  };

  return (
    <div className="pt-24 pb-16 min-h-screen flex flex-col gap-12 max-w-7xl mx-auto px-6 md:px-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.25, 0.1, 0, 1] as const }}
        className="text-center flex flex-col items-center"
      >
        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5 mb-4">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
          {t('contact.badge')}
        </span>
        <PageTitle text={t('contact.title')} className="text-3xl md:text-5xl font-black uppercase tracking-tight mt-3" />
        <p className="text-sm mt-4 max-w-xl text-[var(--text-secondary)] font-light leading-relaxed">
          {t('contact.subtitle')}
        </p>
      </motion.div>

      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-4 items-start"
      >
        <motion.div variants={slideUp} className="flex flex-col gap-6">
          <h2 className="text-xl font-black uppercase tracking-tight text-[var(--text-primary)]">{t('contact.direct_title')}</h2>
          <p className="text-xs md:text-sm leading-relaxed text-[var(--text-secondary)] font-light">
            {t('contact.direct_desc')}
          </p>
          <div className="flex flex-col gap-4 mt-2">
            {contactChannels.map((channel, idx) => (
              <motion.a
                key={idx}
                href={channel.link}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="card-depth p-5 flex items-center justify-between gap-4 group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 flex items-center justify-center card-depth border-[var(--border-color)] text-base">
                    <i className={channel.icon} />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-[var(--text-primary)]">{channel.title}</h3>
                    <span className="text-[11px] text-[var(--text-secondary)] block mt-0.5">{channel.value}</span>
                  </div>
                </div>
                <i className="fas fa-arrow-right text-xs text-[var(--text-secondary)] group-hover:text-[var(--accent-blue)] transition-colors" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        <motion.div
          variants={slideUp}
          className="card-depth p-6 md:p-8"
        >
          <h2 className="text-base font-black uppercase tracking-tight mb-5 text-[var(--text-primary)]">{t('contact.form_title')}</h2>

          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-5 border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-xs leading-relaxed flex flex-col gap-3"
            >
              <div className="flex items-center gap-2.5">
                <i className="fas fa-check-circle text-base" />
                <strong className="font-extrabold">{t('contact.form_success_title')}</strong>
              </div>
              <p>{t('contact.form_success_desc')}</p>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-[10px] font-bold text-white bg-emerald-600 hover:bg-emerald-500 py-2 px-4 self-start mt-2 transition-colors cursor-pointer rounded-lg btn-depth"
              >
                {t('contact.form_send_another')}
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              {[
                { label: t('contact.form_name'), placeholder: t('contact.form_name_placeholder'), value: name, type: "text", setter: setName },
                { label: t('contact.form_email'), placeholder: t('contact.form_email_placeholder'), value: email, type: "email", setter: setEmail },
              ].map((field) => (
                <motion.div
                  key={field.label}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col gap-1.5"
                >
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{field.label}</label>
                  <input
                    type={field.type}
                    required
                    placeholder={field.placeholder}
                    value={field.value}
                    onChange={(e) => field.setter(e.target.value)}
                    className="w-full px-4 py-3 text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-[var(--accent-blue)] outline-none"
                  />
                </motion.div>
              ))}

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="flex flex-col gap-1.5"
              >
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{t('contact.form_subject')}</label>
                <input
                  type="text"
                  required
                  placeholder={t('contact.form_subject_placeholder')}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-3 text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-[var(--accent-blue)] outline-none"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="flex flex-col gap-1.5"
              >
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{t('contact.form_message')}</label>
                <textarea
                  required
                  rows={4}
                  placeholder={t('contact.form_message_placeholder')}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-[var(--accent-blue)] outline-none resize-none"
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isSubmitting}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="w-full py-4 text-xs font-bold text-center text-white rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-lg shadow-[rgba(0,212,255,0.15)] flex items-center justify-center gap-2 mt-2 cursor-pointer btn-depth"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner animate-spin" />
                    <span>{t('contact.form_submitting')}</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane" />
                    <span>{t('contact.form_submit')}</span>
                  </>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>
      </motion.div>

      
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        variants={stagger}
        className="relative overflow-hidden"
      >
        
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-transparent to-purple-500/5 animate-gradient-x pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

        <div className="relative grid md:grid-cols-2 gap-8 items-center card-depth p-8 md:p-12 border-indigo-500/20">
          
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] pointer-events-none" />

          <motion.div variants={slideUp}>
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-indigo-400/40 text-[10px] font-mono uppercase tracking-[0.2em] text-indigo-400 bg-indigo-400/5 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              {t('contact.discord_community_badge')}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)] mb-4">
              {t('contact.discord_community_title')}{' '}
              <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">{t('contact.discord_community_highlight')}</span>
            </h2>
            <p className="text-sm text-[var(--text-secondary)] font-light leading-relaxed mb-6">
              {t('contact.discord_community_desc')}
            </p>
            <a
              href="https://dsc.gg/tinnzstore"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2.5 px-6 py-3.5 text-xs font-bold text-center text-white bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-400 hover:to-purple-500 transition-all duration-300 shadow-lg shadow-indigo-500/20 rounded-xl btn-depth"
            >
              <i className="fab fa-discord text-base" />
              {t('contact.discord_community_cta')}
            </a>
          </motion.div>

          <motion.div variants={slideUp} className="relative group">
            
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500/20 via-purple-500/10 to-indigo-500/20 rounded-2xl blur-2xl group-hover:blur-3xl transition duration-500 opacity-60 group-hover:opacity-100" />
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-transparent to-purple-500/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative card-depth border-2 border-indigo-500/30 rounded-2xl overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent" />
              <iframe
                src="https://discord.com/widget?id=1124872876718293084&theme=dark"
                width="100%"
                height="450"
                allowTransparency={true}
                frameBorder="0"
                sandbox="allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts"
                className="rounded-xl shadow-lg"
              ></iframe>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};
