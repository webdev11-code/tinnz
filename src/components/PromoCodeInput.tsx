import React, { useState } from "react";
import { Plan } from "../data/plans";
import { PromoCode } from "../data/promoCodes";

export interface DiscountResult {
  code: string;
  type: "percent" | "nominal";
  value: number;
  originalPrice: number;
  discountedPrice: number;
  promoCodeId: string;
}

interface PromoCodeInputProps {
  value: string;
  onChange: (val: string) => void;
  plan: Plan;
  promoCodes: PromoCode[];
  onDiscountResult: (result: DiscountResult | null) => void;
  discountResult: DiscountResult | null;
}

export const PromoCodeInput: React.FC<PromoCodeInputProps> = ({
  value,
  onChange,
  plan,
  promoCodes,
  onDiscountResult,
  discountResult,
}) => {
  const [checking, setChecking] = useState(false);
  const [message, setMessage] = useState<{ text: string; ok: boolean } | null>(null);

  const handleCheck = () => {
    const code = value.trim().toUpperCase();
    if (!code) {
      setMessage({ text: "Masukkan kode promo terlebih dahulu", ok: false });
      return;
    }

    setChecking(true);
    setMessage(null);

    setTimeout(() => {
      const match = promoCodes.find(
        (p) => p.code.toUpperCase() === code && p.is_active
      );

      if (!match) {
        setMessage({ text: "Kode promo tidak ditemukan atau tidak aktif", ok: false });
        onDiscountResult(null);
        setChecking(false);
        return;
      }

      if (match.expires_at && new Date(match.expires_at) < new Date()) {
        setMessage({ text: "Kode promo sudah kedaluwarsa", ok: false });
        onDiscountResult(null);
        setChecking(false);
        return;
      }

      if (match.max_uses > 0 && match.used_count >= match.max_uses) {
        setMessage({ text: "Kode promo sudah mencapai batas pemakaian", ok: false });
        onDiscountResult(null);
        setChecking(false);
        return;
      }

      if (plan.price_idr < match.min_purchase) {
        setMessage({
          text: `Minimal pembelian Rp ${match.min_purchase.toLocaleString("id-ID")} untuk kode ini`,
          ok: false,
        });
        onDiscountResult(null);
        setChecking(false);
        return;
      }

      if (
        match.applicable_categories.length > 0 &&
        !match.applicable_categories.includes(plan.category)
      ) {
        setMessage({ text: "Kode promo tidak berlaku untuk paket ini", ok: false });
        onDiscountResult(null);
        setChecking(false);
        return;
      }

      let discountedPrice: number;
      if (match.type === "percent") {
        discountedPrice = Math.round(plan.price_idr * (1 - match.value / 100));
      } else {
        discountedPrice = Math.max(0, plan.price_idr - match.value);
      }

      const result: DiscountResult = {
        code: match.code,
        type: match.type,
        value: match.value,
        originalPrice: plan.price_idr,
        discountedPrice,
        promoCodeId: match.id,
      };

      const savings = plan.price_idr - discountedPrice;
      if (match.type === "percent") {
        setMessage({
          text: `✅ Kode valid! Diskon ${match.value}% (hemat Rp ${savings.toLocaleString("id-ID")})`,
          ok: true,
        });
      } else {
        setMessage({
          text: `✅ Kode valid! Diskon Rp ${match.value.toLocaleString("id-ID")}`,
          ok: true,
        });
      }

      onDiscountResult(result);
      setChecking(false);
    }, 300);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[9px] font-bold text-[var(--text-secondary)] uppercase tracking-widest">
        Kode Promo (opsional)
      </label>
      <div className="flex gap-2">
        <input
          type="text"
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            if (discountResult) onDiscountResult(null);
            if (message) setMessage(null);
          }}
          placeholder="Masukkan kode promo"
          className="flex-1 px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-emerald-400 outline-none"
        />
        <button
          type="button"
          onClick={handleCheck}
          disabled={checking || !value.trim()}
          className="px-4 py-3 rounded-xl text-xs font-bold bg-[var(--accent-blue)] text-white hover:opacity-90 transition-all disabled:opacity-40 whitespace-nowrap cursor-pointer"
        >
          {checking ? (
            <i className="fas fa-spinner fa-spin" />
          ) : (
            "Cek Kode"
          )}
        </button>
      </div>
      {message && (
        <p
          className={`text-[10px] font-bold mt-0.5 ${
            message.ok ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {message.text}
        </p>
      )}
      {discountResult && (
        <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 mt-1">
          <div className="flex items-center gap-2">
            <i className="fas fa-tag text-emerald-400 text-xs" />
            <span className="text-xs font-bold text-emerald-400">
              {discountResult.type === "percent"
                ? `Diskon ${discountResult.value}%`
                : `Diskon Rp ${discountResult.value.toLocaleString("id-ID")}`}
            </span>
          </div>
          <div className="text-right">
            <span className="text-[10px] text-[var(--text-secondary)] line-through mr-1">
              Rp {discountResult.originalPrice.toLocaleString("id-ID")}
            </span>
            <span className="text-xs font-black text-emerald-400">
              Rp {discountResult.discountedPrice.toLocaleString("id-ID")}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
