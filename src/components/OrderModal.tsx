import React, { useState, useEffect } from "react";
import { Plan } from "../data/plans";
import { PromoCodeInput, DiscountResult } from "./PromoCodeInput";
import { usePromoCodes } from "../hooks/useFirestore";

export interface OrderField {
  key: string;
  label: string;
  type: "text" | "email" | "tel" | "select";
  required: boolean;
  placeholder: string;
  options?: { label: string; value: string }[];
  tab: "new" | "renewal" | "both";
}

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: Plan | null;
  titleKey?: string;
  accentColor?: string;
  fields: OrderField[];
  newOrderMessage: (plan: Plan, values: Record<string, string>) => string;
  renewalMessage: (plan: Plan, values: Record<string, string>) => string;
}

const initialValues = (fields: OrderField[]) => {
  const vals: Record<string, string> = {};
  for (const f of fields) {
    vals[f.key] = "";
  }
  return vals;
};

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  plan,
  titleKey = "Form Pemesanan",
  accentColor = "#10B981",
  fields,
  newOrderMessage,
  renewalMessage,
}) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const [tab, setTab] = useState<"new" | "renewal">("new");
  const [values, setValues] = useState<Record<string, string>>(initialValues(fields));
  const { promoCodes } = usePromoCodes();
  const [discountResult, setDiscountResult] = useState<DiscountResult | null>(null);
  const { incrementPromoCodeUsage } = usePromoCodes();

  const switchTab = (t: "new" | "renewal") => {
    setTab(t);
    setDiscountResult(null);
  };

  useEffect(() => {
    setValues(initialValues(fields));
    switchTab("new");
  }, [fields, plan?.id]);

  const setValue = (key: string, val: string) => {
    setValues((prev) => ({ ...prev, [key]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!plan) return;
    const enriched = { ...values };
    if (discountResult) {
      enriched._discountLabel = discountResult.type === "percent"
        ? `Diskon ${discountResult.value}%`
        : `Diskon Rp ${discountResult.value.toLocaleString("id-ID")}`;
      enriched._discountOriginal = String(discountResult.originalPrice);
      enriched._discountFinal = String(discountResult.discountedPrice);
      incrementPromoCodeUsage(discountResult.promoCodeId);
    }
    const msg = tab === "new" ? newOrderMessage(plan, enriched) : renewalMessage(plan, enriched);
    window.location.href = `https://wa.me/6287844812351?text=${encodeURIComponent(msg)}`;
  };

  const tabFields = fields.filter((f) => f.tab === tab || f.tab === "both");

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto bg-[var(--bg-card)] border border-[var(--border-color)] shadow-2xl z-10 animate-fade-in text-[var(--text-primary)] mx-4">
        <div className="p-5 border-b border-[var(--border-color)] flex items-center justify-between sticky top-0 bg-[var(--bg-card)] z-20">
          <div className="flex items-center gap-2.5">
            <i className="fab fa-whatsapp text-emerald-400 text-lg" />
            <h2 className="text-base font-extrabold tracking-tight">{titleKey}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg border hover:border-red-500 hover:text-red-500 transition-all bg-transparent border-[var(--border-color)] text-[var(--text-secondary)]"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        <div className="flex border-b border-[var(--border-color)]">
          <button
            onClick={() => switchTab("new")}
            className={`flex-1 py-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
              tab === "new"
                ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Pemesanan Baru
          </button>
          <button
            onClick={() => switchTab("renewal")}
            className={`flex-1 py-3 text-[10px] font-mono font-bold uppercase tracking-wider transition-all duration-200 ${
              tab === "renewal"
                ? "text-emerald-400 border-b-2 border-emerald-400 bg-emerald-500/5"
                : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
            }`}
          >
            Perpanjangan
          </button>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-[var(--border-color)] bg-[rgba(0,0,0,0.1)] mb-5">
            <div>
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                Paket
              </span>
              <p className="text-base font-extrabold mt-0.5">{plan.name}</p>
            </div>
            <div className="text-right">
              <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--text-secondary)]">
                Harga
              </span>
              {discountResult ? (
                <div className="flex flex-col items-end">
                  <span className="text-xs text-[var(--text-secondary)] line-through">
                    Rp {plan.price_idr.toLocaleString("id-ID")}
                  </span>
                  <span className="text-base font-black text-emerald-400 mt-0.5">
                    Rp {discountResult.discountedPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              ) : (
                <p className="text-base font-black text-[var(--accent-blue)] mt-0.5">
                  {plan.price_idr > 0
                    ? `Rp ${plan.price_idr.toLocaleString("id-ID")}`
                    : "Custom"}
                </p>
              )}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {tabFields.map((field) => {
              if (field.key === "promo" || field.key === "renewalPromo") {
                return (
                  <PromoCodeInput
                    key={field.key}
                    value={values[field.key] || ""}
                    onChange={(val) => setValue(field.key, val)}
                    plan={plan}
                    promoCodes={promoCodes}
                    onDiscountResult={setDiscountResult}
                    discountResult={discountResult}
                  />
                );
              }
              return (
                <div key={field.key} className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
                    {field.label}
                  </label>
                  {field.type === "select" && field.options ? (
                    <div className="relative">
                      <select
                        required={field.required}
                        value={values[field.key] || ""}
                        onChange={(e) => setValue(field.key, e.target.value)}
                        className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-emerald-400 outline-none appearance-none cursor-pointer"
                      >
                        <option value="" disabled className="bg-[var(--bg-card)]">{field.placeholder}</option>
                        {field.options.map((opt) => (
                          <option key={opt.value} value={opt.value} className="bg-[var(--bg-card)]">
                            {opt.label}
                          </option>
                        ))}
                      </select>
                      <i className="fas fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[var(--text-secondary)] pointer-events-none" />
                    </div>
                  ) : (
                    <input
                      type={field.type}
                      required={field.required}
                      value={values[field.key] || ""}
                      onChange={(e) => setValue(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-emerald-400 outline-none"
                    />
                  )}
                </div>
              );
            })}

            <button
              type="submit"
              className="w-full py-4 rounded-xl text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/15 flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <i className="fab fa-whatsapp text-sm" />
              Kirim ke WhatsApp
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
