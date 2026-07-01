import React, { useState, useEffect } from "react";
import { Plan } from "../data/plans";
import { useOrders } from "../hooks/useFirestore";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: Plan[];
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
}

export const CartModal: React.FC<CartModalProps> = ({
  isOpen,
  onClose,
  cartItems,
  onRemoveItem,
  onClearCart
}) => {
  const { t } = useTranslation();
  const { submitOrder } = useOrders();
  const location = useLocation();

  useEffect(() => {
    if (isOpen) onClose();
  }, [location.pathname]);

  useEffect(() => {
    if (isOpen) {
      setIsSuccess(false);
      setWhatsappLink("");
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [whatsappLink, setWhatsappLink] = useState("");



  const totalPrice = cartItems.reduce((acc, item) => acc + item.price_idr, 0);

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) return;

    setIsSubmitting(true);
    try {
      for (const item of cartItems) {
        await submitOrder({
          plan_id: item.id,
          plan_name: item.name,
          category: item.category,
          price_idr: item.price_idr,
          user_name: name,
          user_email: email,
          user_phone: phone
        });
      }

      const orderNames = cartItems.map((item) => `${item.name} (${item.ram || "Standard"})`).join(", ");
      const message = `Halo TinnzStore, saya telah mengajukan pembelian lewat Website! \n\nNama: ${name}\nEmail: ${email}\nNo HP: ${phone}\nPaket: ${orderNames}\nTotal Harga: Rp ${totalPrice.toLocaleString("id-ID")}\n\nMohon bantuannya untuk memproses pesanan saya. Terima kasih!`;

      setWhatsappLink(`https://wa.me/6287844812351?text=${encodeURIComponent(message)}`);
      setIsSuccess(true);
      onClearCart();
      setName("");
      setEmail("");
      setPhone("");
    } catch (err) {
      console.error("Failed to checkout order:", err);
      alert(t("cart.error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end">
      
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      
      <div className="relative w-full max-w-md h-full bg-[var(--bg-card)] border-l border-[var(--border-color)] flex flex-col justify-between shadow-2xl z-10 animate-fade-in text-[var(--text-primary)]">
        
        <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <i className="fas fa-shopping-cart text-[var(--accent-blue)] text-lg" />
            <h2 className="text-lg font-extrabold tracking-tight">{t("cart.title")}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg border hover:border-red-500 hover:text-red-500 transition-all bg-transparent border-[var(--border-color)] text-[var(--text-secondary)]"
          >
            <i className="fas fa-times" />
          </button>
        </div>

        
        <div className="flex-1 p-6 overflow-y-auto">
          {isSuccess ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4.5 animate-scale-up">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center text-2xl border border-emerald-500/20">
                <i className="fas fa-check-circle" />
              </div>
              <div>
                <h3 className="text-lg font-extrabold">{t("cart.success_title")}</h3>
                <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed">
                  {t("cart.success_desc")}
                </p>
              </div>

              <a
                href={whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 rounded-xl text-xs font-bold text-center text-white bg-emerald-500 hover:bg-emerald-400 transition-all duration-300 shadow-lg shadow-emerald-500/10 flex items-center justify-center gap-2"
              >
                <i className="fab fa-whatsapp text-base" />
                <span>{t("cart.confirm_whatsapp")}</span>
              </a>

              <button
                onClick={() => {
                  setIsSuccess(false);
                  onClose();
                }}
                className="text-xs font-bold text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors mt-2"
              >
                {t("cart.back_shopping")}
              </button>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-[var(--text-secondary)]">
              <i className="fas fa-folder-open text-4xl text-zinc-600" />
              <div className="text-xs font-medium">{t("cart.empty")}</div>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              
              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-secondary)]">
                  {t("cart.selected_plans")}
                </span>
                <div className="divide-y border rounded-xl divide-[var(--border-color)] border-[var(--border-color)] overflow-hidden">
                  {cartItems.map((item, index) => (
                    <div key={index} className="p-4 flex items-center justify-between gap-4 bg-[rgba(0,0,0,0.01)] dark:bg-white/5">
                      <div>
                        <h4 className="text-xs font-extrabold">{item.name}</h4>
                        <span className="text-[10px] text-[var(--text-secondary)] uppercase block mt-0.5">
                          {item.category.replace("-", " ")} {item.ram ? `(${item.ram})` : ""}
                        </span>
                        <span className="text-xs font-bold text-[var(--accent-blue)] block mt-1">
                          Rp {item.price_idr.toLocaleString("id-ID")}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveItem(index)}
                        className="p-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/15"
                        aria-label={t("cart.remove_item")}
                      >
                        <i className="fas fa-trash-alt text-[10px]" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              
              <form onSubmit={handleSubmitOrder} className="flex flex-col gap-4 border-t pt-5 border-[var(--border-color)]">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-secondary)] mb-1">
                  {t("cart.customer_details")}
                </span>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{t("cart.full_name")}</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder={t("cart.full_name_placeholder")}
                    className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-[var(--accent-blue)] outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{t("cart.email")}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t("cart.email_placeholder")}
                    className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-[var(--accent-blue)] outline-none"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{t("cart.phone")}</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder={t("cart.phone_placeholder")}
                    className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-[var(--accent-blue)] outline-none"
                  />
                </div>

                
                <div className="mt-4 p-4 rounded-xl border flex items-center justify-between bg-[rgba(0,212,255,0.05)] border-[var(--accent-blue)]/15">
                  <span className="text-xs font-bold">{t("cart.total")}</span>
                  <span className="text-base font-black text-[var(--accent-blue)]">
                    Rp {totalPrice.toLocaleString("id-ID")}
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-xl shadow-[rgba(0,212,255,0.15)] flex items-center justify-center gap-2 mt-4 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <i className="fas fa-spinner animate-spin" />
                      <span>{t("cart.processing")}</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check-circle" />
                      <span>{t("cart.submit")}</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
