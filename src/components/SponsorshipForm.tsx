import React, { useState } from "react";
import { motion } from "motion/react";
import { useTranslation } from "react-i18next";

type FormData = {
  applicant_name: string;
  applicant_email: string;
  applicant_whatsapp: string;
  applicant_discord: string;
  applicant_position: string;
  community_name: string;
  community_type: string;
  community_desc: string;
  community_established: string;
  community_members_discord: string;
  community_daily_active: string;
  community_peak_players: string;
  community_monthly_active: string;
  social_discord: string;
  social_website: string;
  social_youtube: string;
  social_tiktok: string;
  social_instagram: string;
  cooperation_type: string;
  cooperation_service: string;
  cooperation_specs: string;
  cooperation_duration: string;
  benefits: string;
  reason: string;
  attachment_logo: string;
  attachment_screenshot: string;
  attachment_proposal: string;
  extra_how_did_you_know: string;
  extra_used_before: string;
  agreement: boolean;
};

const initialForm: FormData = {
  applicant_name: "",
  applicant_email: "",
  applicant_whatsapp: "",
  applicant_discord: "",
  applicant_position: "",
  community_name: "",
  community_type: "",
  community_desc: "",
  community_established: "",
  community_members_discord: "",
  community_daily_active: "",
  community_peak_players: "",
  community_monthly_active: "",
  social_discord: "",
  social_website: "",
  social_youtube: "",
  social_tiktok: "",
  social_instagram: "",
  cooperation_type: "",
  cooperation_service: "",
  cooperation_specs: "",
  cooperation_duration: "",
  benefits: "",
  reason: "",
  attachment_logo: "",
  attachment_screenshot: "",
  attachment_proposal: "",
  extra_how_did_you_know: "",
  extra_used_before: "",
  agreement: false,
};

const cooperationTypes = [
  "sponsorship",
  "partnership",
  "event",
  "media",
  "other",
] as const;

const durations = ["1", "3", "6", "12"] as const;

const slideUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.25, 0.1, 0, 1] as const } },
};

export default function SponsorshipForm() {
  const { t } = useTranslation();
  const [form, setForm] = useState<FormData>(initialForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const update = (key: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const kw = (key: string) => t(`sponsor_form.${key}`);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      applicant_name: form.applicant_name,
      applicant_email: form.applicant_email,
      applicant_whatsapp: form.applicant_whatsapp,
      applicant_discord: form.applicant_discord,
      applicant_position: form.applicant_position,
      community_name: form.community_name,
      community_type: form.community_type,
      community_desc: form.community_desc,
      community_established: form.community_established,
      community_members_discord: form.community_members_discord,
      community_daily_active: form.community_daily_active,
      community_peak_players: form.community_peak_players,
      community_monthly_active: form.community_monthly_active,
      social_discord: form.social_discord,
      social_website: form.social_website,
      social_youtube: form.social_youtube,
      social_tiktok: form.social_tiktok,
      social_instagram: form.social_instagram,
      cooperation_type: kw(`cooperation_type_${form.cooperation_type}`),
      cooperation_service: form.cooperation_service,
      cooperation_specs: form.cooperation_specs,
      cooperation_duration: kw(`cooperation_duration_${form.cooperation_duration}`),
      benefits: form.benefits,
      reason: form.reason,
      attachment_logo: form.attachment_logo,
      attachment_screenshot: form.attachment_screenshot,
      attachment_proposal: form.attachment_proposal,
      extra_how_did_you_know: form.extra_how_did_you_know,
      extra_used_before: form.extra_used_before,
      status: "🟡 Pending Review",
      submitted_at: new Date().toISOString(),
    };

    try {
      const webhookUrl = import.meta.env.VITE_DISCORD_SPONSOR_WEBHOOK as string | undefined;

      if (!webhookUrl) {
        console.error("Sponsorship webhook: VITE_DISCORD_SPONSOR_WEBHOOK tidak dikonfigurasi.");
        alert("Webhook Discord belum dikonfigurasi. Hubungi admin untuk menyetel VITE_DISCORD_SPONSOR_WEBHOOK.");
        return;
      }

      const embed = {
        username: "Sponsorship System",
        avatar_url: "",
        embeds: [
          {
            title: `📋 Pengajuan Sponsorship Baru - ${form.community_name}`,
            color: 0xf59e0b,
            fields: [
              { name: "👤 Informasi Pengaju", value: [
                `**Nama:** ${form.applicant_name}`,
                `**Email:** ${form.applicant_email}`,
                `**WhatsApp:** ${form.applicant_whatsapp}`,
                `**Discord:** ${form.applicant_discord}`,
                `**Jabatan:** ${form.applicant_position}`,
              ].join("\n"), inline: false },
              { name: "🏠 Informasi Komunitas", value: [
                `**Nama:** ${form.community_name}`,
                `**Jenis:** ${form.community_type}`,
                `**Berdiri:** ${form.community_established}`,
                `**Member Discord:** ${form.community_members_discord}`,
                `**Daily Active:** ${form.community_daily_active}`,
                `**Peak Players:** ${form.community_peak_players}`,
                form.community_monthly_active ? `**Monthly Active:** ${form.community_monthly_active}` : "",
              ].filter(Boolean).join("\n"), inline: false },
              { name: "🔗 Media Sosial", value: [
                `**Discord:** ${form.social_discord}`,
                form.social_website ? `**Website:** ${form.social_website}` : "",
                form.social_youtube ? `**YouTube:** ${form.social_youtube}` : "",
                form.social_tiktok ? `**TikTok:** ${form.social_tiktok}` : "",
                form.social_instagram ? `**Instagram:** ${form.social_instagram}` : "",
              ].filter(Boolean).join("\n"), inline: false },
              { name: "🤝 Pengajuan Kerja Sama", value: [
                `**Jenis:** ${kw(`cooperation_type_${form.cooperation_type}`)}`,
                `**Layanan:** ${form.cooperation_service}`,
                `**Spesifikasi:** ${form.cooperation_specs}`,
                `**Durasi:** ${kw(`cooperation_duration_${form.cooperation_duration}`)}`,
              ].join("\n"), inline: false },
              { name: "🎯 Benefit & Alasan", value: [
                `**Benefit:** ${form.benefits || "-"}`,
                `**Alasan:** ${form.reason}`,
              ].join("\n"), inline: false },
              ...(form.attachment_logo || form.attachment_screenshot || form.attachment_proposal ? [{
                name: "📎 Lampiran",
                value: [
                  form.attachment_logo ? `[Logo](${form.attachment_logo})` : "",
                  form.attachment_screenshot ? `[Screenshot](${form.attachment_screenshot})` : "",
                  form.attachment_proposal ? `[Proposal](${form.attachment_proposal})` : "",
                ].filter(Boolean).join(" | "),
                inline: false,
              }] : []),
              { name: "ℹ️ Informasi Tambahan", value: [
                `**Tahu dari:** ${form.extra_how_did_you_know || "-"}`,
                `**Pernah pakai layanan:** ${form.extra_used_before}`,
              ].join("\n"), inline: false },
            ],
            footer: { text: `Status: 🟡 Pending Review • ${new Date().toLocaleString("id-ID")}` },
            timestamp: new Date().toISOString(),
          },
        ],
      };

      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(embed),
      });

      if (!res.ok) {
        console.error("Sponsorship webhook error:", res.status, await res.text().catch(() => ""));
        alert(kw("error"));
        return;
      }

      setIsSubmitted(true);
      setForm(initialForm);
    } catch {
      alert(kw("error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-[var(--accent-blue)] outline-none transition-colors";
  const labelClass = "text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-wider";
  const sectionBadge = "inline-flex items-center gap-2 px-3 py-1 rounded-lg border border-[var(--accent-blue)]/40 text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--accent-blue)] bg-[var(--accent-blue)]/5 mb-5";
  const Req = () => <span className="text-red-400 ml-0.5">*</span>;

  const requiredFields: (keyof FormData)[] = [
    "applicant_name", "applicant_email", "applicant_whatsapp", "applicant_discord",
    "applicant_position", "community_name", "community_type", "community_desc",
    "community_established", "community_members_discord", "community_daily_active",
    "community_peak_players", "social_discord", "cooperation_type", "cooperation_service",
    "cooperation_specs", "cooperation_duration", "benefits", "reason",
    "extra_how_did_you_know", "extra_used_before", "agreement"
  ];

  const isFormValid = requiredFields.every((key) => {
    const val = form[key];
    if (typeof val === "boolean") return val === true;
    return val.trim() !== "";
  });

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-depth p-8 md:p-14 text-center relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 pointer-events-none" />
        <div className="relative flex flex-col items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-emerald-500/20 flex items-center justify-center">
            <i className="fas fa-check text-2xl text-emerald-400" />
          </div>
          <h3 className="text-xl md:text-2xl font-black uppercase tracking-tight text-[var(--text-primary)]">{kw("success_title")}</h3>
          <p className="text-sm text-[var(--text-secondary)] font-light max-w-lg leading-relaxed">{kw("success_desc")}</p>
          <button
            onClick={() => setIsSubmitted(false)}
            className="inline-flex items-center gap-2 px-6 py-3 text-xs font-bold text-white rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 transition-all duration-300 btn-depth mt-2 cursor-pointer"
          >
            {kw("success_new")}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-80px" }}
      variants={slideUp}
      className="relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-[var(--accent-blue)]/5 via-transparent to-[var(--accent-purple)]/5 animate-gradient-x pointer-events-none" />
      <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[var(--accent-blue)]/40 to-transparent" />

      <form onSubmit={handleSubmit} className="relative card-depth p-8 md:p-12 border-[var(--accent-blue)]/10">
        <div className="flex flex-col items-center text-center mb-10">
          <span className={sectionBadge}>
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-blue)] animate-pulse" />
            {kw("badge")}
          </span>
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight text-[var(--text-primary)]">{kw("title")}</h2>
          <p className="text-sm text-[var(--text-secondary)] font-light mt-3 max-w-2xl">{kw("subtitle")}</p>
        </div>

        <div className="flex flex-col gap-10">
          
          <motion.div variants={slideUp} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 flex items-center justify-center text-xs font-black font-mono text-[var(--accent-blue)] border border-[var(--accent-blue)]/20 bg-[var(--accent-blue)]/10">01</span>
              <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)]">{kw("section_applicant")}</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--accent-blue)]/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "applicant_name" as const, type: "text" },
                { key: "applicant_email" as const, type: "email" },
                { key: "applicant_whatsapp" as const, type: "text" },
                { key: "applicant_discord" as const, type: "text" },
              ].map((f) => (
                <div key={f.key} className="flex flex-col gap-1.5">
                  <label className={labelClass}>{kw(`${f.key}`)} <Req /></label>
                  <input
                    type={f.type}
                    required
                    placeholder={kw(`${f.key}_placeholder`)}
                    value={form[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className={labelClass}>{kw("applicant_position")} <Req /></label>
                <input
                  type="text"
                  required
                  placeholder={kw("applicant_position_placeholder")}
                  value={form.applicant_position}
                  onChange={(e) => update("applicant_position", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </motion.div>

          
          <motion.div variants={slideUp} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 flex items-center justify-center text-xs font-black font-mono text-[var(--accent-blue)] border border-[var(--accent-blue)]/20 bg-[var(--accent-blue)]/10">02</span>
              <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)]">{kw("section_community")}</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--accent-blue)]/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "community_name" as const, type: "text", col: "md:col-span-2" },
                { key: "community_type" as const, type: "text", col: "md:col-span-2" },
              ].map((f) => (
                <div key={f.key} className={`flex flex-col gap-1.5 ${f.col || ""}`}>
                  <label className={labelClass}>{kw(`${f.key}`)} <Req /></label>
                  <input
                    type={f.type}
                    required
                    placeholder={kw(`${f.key}_placeholder`)}
                    value={form[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1.5 md:col-span-2">
                <label className={labelClass}>{kw("community_desc")} <Req /></label>
                <textarea
                  required
                  rows={3}
                  placeholder={kw("community_desc_placeholder")}
                  value={form.community_desc}
                  onChange={(e) => update("community_desc", e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </div>
              {([
                { key: "community_established" as const, type: "date" },
                { key: "community_members_discord" as const, type: "number" },
                { key: "community_daily_active" as const, type: "number" },
                { key: "community_peak_players" as const, type: "number" },
              ]).map((f) => (
                <div key={f.key} className="flex flex-col gap-1.5">
                  <label className={labelClass}>{kw(`${f.key}`)} <Req /></label>
                  <input
                    type={f.type}
                    required
                    placeholder={kw(`${f.key}_placeholder`)}
                    value={form[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>{kw("community_monthly_active")}</label>
                <input
                  type="number"
                  placeholder={kw("community_monthly_active")}
                  value={form.community_monthly_active}
                  onChange={(e) => update("community_monthly_active", e.target.value)}
                  className={inputClass}
                />
              </div>
            </div>
          </motion.div>

          
          <motion.div variants={slideUp} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 flex items-center justify-center text-xs font-black font-mono text-[var(--accent-blue)] border border-[var(--accent-blue)]/20 bg-[var(--accent-blue)]/10">03</span>
              <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)]">{kw("section_social")}</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--accent-blue)]/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { key: "social_discord" as const, required: true },
                { key: "social_website" as const, required: false },
                { key: "social_youtube" as const, required: false },
                { key: "social_tiktok" as const, required: false },
                { key: "social_instagram" as const, required: false, col: "md:col-span-2" },
              ].map((f) => (
                <div key={f.key} className={`flex flex-col gap-1.5 ${f.col || ""}`}>
                  <label className={labelClass}>{kw(`${f.key}`)}{f.required ? <Req /> : ""}</label>
                  <input
                    type="url"
                    required={f.required}
                    placeholder={kw(`${f.key}_placeholder`)}
                    value={form[f.key]}
                    onChange={(e) => update(f.key, e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          
          <motion.div variants={slideUp} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 flex items-center justify-center text-xs font-black font-mono text-[var(--accent-blue)] border border-[var(--accent-blue)]/20 bg-[var(--accent-blue)]/10">04</span>
              <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)]">{kw("section_cooperation")}</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--accent-blue)]/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>{kw("cooperation_type")} <Req /></label>
                <select
                  required
                  value={form.cooperation_type}
                  onChange={(e) => update("cooperation_type", e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="" disabled>{kw("cooperation_type_placeholder")}</option>
                  {cooperationTypes.map((ct) => (
                    <option key={ct} value={ct}>{kw(`cooperation_type_${ct}`)}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>{kw("cooperation_service")} <Req /></label>
                <input
                  type="text"
                  required
                  placeholder={kw("cooperation_service_placeholder")}
                  value={form.cooperation_service}
                  onChange={(e) => update("cooperation_service", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>{kw("cooperation_specs")} <Req /></label>
                <input
                  type="text"
                  required
                  placeholder={kw("cooperation_specs_placeholder")}
                  value={form.cooperation_specs}
                  onChange={(e) => update("cooperation_specs", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>{kw("cooperation_duration")} <Req /></label>
                <select
                  required
                  value={form.cooperation_duration}
                  onChange={(e) => update("cooperation_duration", e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="" disabled>{kw("cooperation_duration")}</option>
                  {durations.map((d) => (
                    <option key={d} value={d}>{kw(`cooperation_duration_${d}`)}</option>
                  ))}
                </select>
              </div>
            </div>
          </motion.div>

          
          <motion.div variants={slideUp} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 flex items-center justify-center text-xs font-black font-mono text-[var(--accent-blue)] border border-[var(--accent-blue)]/20 bg-[var(--accent-blue)]/10">05</span>
              <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)]">{kw("section_benefits")}</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--accent-blue)]/30 to-transparent" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>{kw("benefits_label")} <Req /></label>
              <textarea
                required
                rows={4}
                placeholder={kw("benefits_placeholder")}
                value={form.benefits}
                onChange={(e) => update("benefits", e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>
          </motion.div>

          
          <motion.div variants={slideUp} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 flex items-center justify-center text-xs font-black font-mono text-[var(--accent-blue)] border border-[var(--accent-blue)]/20 bg-[var(--accent-blue)]/10">06</span>
              <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)]">{kw("section_reason")}</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--accent-blue)]/30 to-transparent" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>{kw("reason_label")} <Req /></label>
              <textarea
                required
                rows={4}
                placeholder={kw("reason_placeholder")}
                value={form.reason}
                onChange={(e) => update("reason", e.target.value)}
                className={`${inputClass} resize-none`}
              />
            </div>
          </motion.div>

          
          <motion.div variants={slideUp} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 flex items-center justify-center text-xs font-black font-mono text-[var(--accent-blue)] border border-[var(--accent-blue)]/20 bg-[var(--accent-blue)]/10">07</span>
              <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)]">{kw("section_attachments")}</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--accent-blue)]/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(["logo", "screenshot", "proposal"] as const).map((att) => (
                <div key={att} className="flex flex-col gap-1.5">
                  <label className={labelClass}>{kw(`attachment_${att}`)}</label>
                  <input
                    type="url"
                    placeholder={kw(`attachment_${att}_placeholder`)}
                    value={form[`attachment_${att}`]}
                    onChange={(e) => update(`attachment_${att}` as keyof FormData, e.target.value)}
                    className={inputClass}
                  />
                </div>
              ))}
            </div>
          </motion.div>

          
          <motion.div variants={slideUp} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 flex items-center justify-center text-xs font-black font-mono text-[var(--accent-blue)] border border-[var(--accent-blue)]/20 bg-[var(--accent-blue)]/10">08</span>
              <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)]">{kw("section_extra")}</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--accent-blue)]/30 to-transparent" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>{kw("extra_how_did_you_know")} <Req /></label>
                <input
                  type="text"
                  required
                  placeholder={kw("extra_how_did_you_know_placeholder")}
                  value={form.extra_how_did_you_know}
                  onChange={(e) => update("extra_how_did_you_know", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>{kw("extra_used_before")} <Req /></label>
                <div className="flex gap-4 h-full items-center">
                  {(["yes", "no"] as const).map((opt) => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2 px-4 py-3 text-xs border rounded-xl cursor-pointer transition-colors ${
                        form.extra_used_before === opt
                          ? "border-[var(--accent-blue)] text-[var(--accent-blue)] bg-[var(--accent-blue)]/10"
                          : "border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--accent-blue)]/40"
                      }`}
                    >
                      <input
                        type="radio"
                        name="extra_used_before"
                        required
                        value={opt}
                        checked={form.extra_used_before === opt}
                        onChange={(e) => update("extra_used_before", e.target.value)}
                        className="hidden"
                      />
                      {kw(`extra_used_before_${opt}`)}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          
          <motion.div variants={slideUp} className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 flex items-center justify-center text-xs font-black font-mono text-[var(--accent-blue)] border border-[var(--accent-blue)]/20 bg-[var(--accent-blue)]/10">09</span>
              <h3 className="text-sm font-black uppercase tracking-tight text-[var(--text-primary)]">{kw("section_agreement")}</h3>
              <div className="h-px flex-1 bg-gradient-to-r from-[var(--accent-blue)]/30 to-transparent" />
            </div>
            <label className="flex items-start gap-3 cursor-pointer group">
              <input
                type="checkbox"
                required
                checked={form.agreement}
                onChange={(e) => update("agreement", e.target.checked)}
                className="hidden"
              />
              <span className={`w-5 h-5 flex items-center justify-center border rounded text-xs shrink-0 mt-0.5 transition-colors ${
                form.agreement
                  ? "bg-[var(--accent-blue)] border-[var(--accent-blue)] text-white"
                  : "border-[var(--border-color)] group-hover:border-[var(--accent-blue)]/40"
              }`}>
                {form.agreement && <i className="fas fa-check text-[10px]" />}
              </span>
              <span className="text-xs text-[var(--text-secondary)] font-light leading-relaxed">{kw("agreement_label")} <Req /></span>
            </label>
          </motion.div>

          
          <motion.div variants={slideUp} className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !isFormValid}
              className="inline-flex items-center gap-2.5 px-10 py-4 text-xs font-bold text-center text-white bg-emerald-500 hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/15 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner animate-spin" />
                  {kw("submitting")}
                </>
              ) : (
                <>
                  <i className="fas fa-paper-plane" />
                  {kw("submit")}
                </>
              )}
            </button>
          </motion.div>
        </div>
      </form>
    </motion.div>
  );
}
