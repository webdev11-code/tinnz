import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useTranslation } from "react-i18next";
import { PageTitle } from "../components/PageTitle";
import { ADMIN_EMAILS, db } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { 
  useProducts, 
  useTeamMembers, 
  useContactSubmissions, 
  useOrders, 
  useFAQ, 
  useSponsors,
  useReviews,
  useTerms,
  useComparisons,
  usePromoCodes,
  Plan,
  TeamMember, 
  ContactMessage, 
  PurchaseOrder, 
  FAQItem,
  SponsorProject,
  Review,
  TermItem,
  ComparisonData,
  ComparisonMap,
  ComparisonCategory,
  PromoCode,
} from "../hooks/useFirestore";

type TabId = "overview" | "products" | "orders" | "messages" | "team" | "faq" | "sponsors" | "reviews" | "terms" | "comparisons" | "backup" | "promo";

function formatTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 5) return "just now";
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  return `${Math.floor(minutes / 60)}h ago`;
}

export const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const { user, loading: authLoading, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<TabId>("overview");

  const { products, saveProduct, deleteProduct, updateProductStock } = useProducts();
  const { teamMembers, saveTeamMember, deleteTeamMember } = useTeamMembers();
  const { messages, markMessageAsRead, deleteMessage } = useContactSubmissions();
  const { orders, updateOrderStatus, deleteOrder } = useOrders();
  const { faqs, saveFAQ, deleteFAQ } = useFAQ();
  const { sponsors, saveSponsor, deleteSponsor } = useSponsors();
  const { reviews, saveReview, deleteReview } = useReviews();
  const { terms, saveTerm, deleteTerm } = useTerms();
  const { comparisons, loading: compLoading, saveComparison } = useComparisons();
  const { promoCodes, loading: promosLoading, savePromoCode, deletePromoCode } = usePromoCodes();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/admin/login");
    } else if (!authLoading && user && !ADMIN_EMAILS.includes(user.email || "")) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  const [backupDue, setBackupDue] = useState(false);
  const [firestoreOnline, setFirestoreOnline] = useState(true);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const pingRef = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  useEffect(() => {
    const ping = async () => {
      try {
        await getDocs(collection(db, "products"));
        setFirestoreOnline(true);
        setLastSyncTime(new Date());
      } catch {
        setFirestoreOnline(false);
      }
    };
    ping();
    pingRef.current = setInterval(ping, 30_000);
    return () => clearInterval(pingRef.current);
  }, []);

  useEffect(() => {
    if (!user) return;
    let cleanup: (() => void) | null = null;
    (async () => {
      const mod = await import("../utils/backup");
      if (mod.shouldAutoBackup()) {
        await mod.exportAllCollections();
      }
      cleanup = mod.startScheduler(async () => {
        const m = await import("../utils/backup");
        await m.exportAllCollections();
      });
    })();
    return () => cleanup?.();
  }, [user]);

  useEffect(() => {
    if (activeTab === "backup") {
      (async () => {
        const { renderBackupHistory } = await import("../utils/backup");
        renderBackupHistory();
      })();
    }
  }, [activeTab]);

  const [editingProduct, setEditingProduct] = useState<Partial<Plan> | null>(null);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const [editingMember, setEditingMember] = useState<Partial<TeamMember> | null>(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);

  const [editingFAQ, setEditingFAQ] = useState<Partial<FAQItem> | null>(null);
  const [isFAQModalOpen, setIsFAQModalOpen] = useState(false);

  const [editingSponsor, setEditingSponsor] = useState<Partial<SponsorProject> | null>(null);
  const [isSponsorModalOpen, setIsSponsorModalOpen] = useState(false);

  const [editingReview, setEditingReview] = useState<Partial<Review> | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [editingTerm, setEditingTerm] = useState<Partial<TermItem> | null>(null);
  const [isTermModalOpen, setIsTermModalOpen] = useState(false);

  const [editingPromo, setEditingPromo] = useState<Partial<PromoCode> | null>(null);
  const [isPromoModalOpen, setIsPromoModalOpen] = useState(false);

  useEffect(() => {
    const anyOpen = isProductModalOpen || isMemberModalOpen || isFAQModalOpen || isSponsorModalOpen || isReviewModalOpen || isTermModalOpen || isPromoModalOpen;
    document.body.style.overflow = anyOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [isProductModalOpen, isMemberModalOpen, isFAQModalOpen, isSponsorModalOpen, isReviewModalOpen, isTermModalOpen, isPromoModalOpen]);

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editingProduct.id || !editingProduct.name) return;

    try {
      const parseSlot = (v: unknown): number | string => {
        if (v === null || v === undefined || v === "") return 1;
        const n = Number(v);
        return isNaN(n) ? String(v) : n;
      };
      const productData: Plan = {
        id: editingProduct.id,
        category: editingProduct.category || "minecraft-nexa",
        name: editingProduct.name,
        price_idr: Number(editingProduct.price_idr) || 0,
        cpu: editingProduct.cpu !== undefined ? editingProduct.cpu : "1 Core 100%",
        ram: editingProduct.ram !== undefined ? editingProduct.ram : "1 GiB",
        storage: editingProduct.storage !== undefined ? editingProduct.storage : "5 GiB NVMe",
        backup_slot: parseSlot(editingProduct.backup_slot),
        allocation_slot: parseSlot(editingProduct.allocation_slot),
        stock_status: editingProduct.stock_status || "available",
        redirect_url: editingProduct.redirect_url || "",
        order: Number(editingProduct.order) || 1,
        specs_list: editingProduct.specs_list || []
      };
      if (editingProduct.badge) {
        productData.badge = editingProduct.badge;
      }
      if (editingProduct.stock_badge) {
        productData.stock_badge = editingProduct.stock_badge;
      }
      await saveProduct(productData);
      setIsProductModalOpen(false);
      setEditingProduct(null);
    } catch (err) {
      alert("Error saving product: " + err);
    }
  };

  const handleMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMember || !editingMember.id || !editingMember.name || !editingMember.role) return;

    try {
      await saveTeamMember({
        id: editingMember.id,
        name: editingMember.name,
        role: editingMember.role,
        image_url: editingMember.image_url || "",
        order: Number(editingMember.order) || 1,
        socials: {
          discord: editingMember.socials?.discord || "https://discord.gg/Nz9b6bMuNe",
          instagram: editingMember.socials?.instagram || "https://www.instagram.com/tinnzstore_id",
          whatsapp: editingMember.socials?.whatsapp || "https://wa.me/6287844812351",
          tiktok: editingMember.socials?.tiktok || "",
          portfolio: editingMember.socials?.portfolio || ""
        }
      });
      setIsMemberModalOpen(false);
      setEditingMember(null);
    } catch (err) {
      alert("Error saving team member: " + err);
    }
  };

  const handleFAQSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFAQ || !editingFAQ.question || !editingFAQ.answer) return;
    try {
      await saveFAQ({
        id: editingFAQ.id || "faq-" + Date.now(),
        question: editingFAQ.question,
        answer: editingFAQ.answer,
        question_en: editingFAQ.question_en || "",
        answer_en: editingFAQ.answer_en || "",
        order: Number(editingFAQ.order) || faqs.length + 1
      });
      setIsFAQModalOpen(false);
      setEditingFAQ(null);
    } catch (err) {
      alert("Error saving FAQ: " + err);
    }
  };

  const handleSponsorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSponsor || !editingSponsor.title) return;
    try {
      await saveSponsor({
        id: editingSponsor.id || "sponsor-" + Date.now(),
        title: editingSponsor.title,
        image: editingSponsor.image || "/projects.png",
        game: editingSponsor.game || "MINECRAFT",
        status: editingSponsor.status || "AKTIF",
        desc: editingSponsor.desc || "",
        desc_en: editingSponsor.desc_en || "",
        owners: editingSponsor.owners || "",
        order: Number(editingSponsor.order) || sponsors.length + 1
      });
      setIsSponsorModalOpen(false);
      setEditingSponsor(null);
    } catch (err) {
      alert("Error saving sponsor: " + err);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReview || !editingReview.name || !editingReview.text) return;
    try {
      await saveReview({
        id: editingReview.id || "review-" + Date.now(),
        name: editingReview.name,
        role: editingReview.role || "",
        photo: editingReview.photo || "",
        rating: Number(editingReview.rating) || 5,
        text: editingReview.text,
        text_en: editingReview.text_en || "",
        order: Number(editingReview.order) || reviews.length + 1
      });
      setIsReviewModalOpen(false);
      setEditingReview(null);
    } catch (err) {
      alert("Error saving review: " + err);
    }
  };

  const handleTermSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTerm || !editingTerm.title || !editingTerm.content || !editingTerm.tab) return;
    try {
      await saveTerm({
        id: editingTerm.id || "term-" + Date.now(),
        title: editingTerm.title,
        content: editingTerm.content,
        title_en: editingTerm.title_en || "",
        content_en: editingTerm.content_en || "",
        tab: editingTerm.tab,
        order: Number(editingTerm.order) || terms.length + 1
      });
      setIsTermModalOpen(false);
      setEditingTerm(null);
    } catch (err) {
      alert("Error saving term: " + err);
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]">
        <i className="fas fa-spinner animate-spin mr-2" /> {t('admin.loading_admin')}
      </div>
    );
  }

  return (
    <div className="pt-20 pb-16 min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
      
      <header className="border-b py-4 px-4 md:px-12 bg-[var(--bg-card)] border-[var(--border-color)] flex flex-col md:flex-row md:items-center justify-between gap-3 md:gap-4">
        <div className="min-w-0">
          <PageTitle text={t('admin.console_title')} className="text-lg md:text-xl font-extrabold tracking-tight truncate" />
          <p className="text-xs md:text-xs text-[var(--text-secondary)] mt-0.5 truncate">{t('admin.console_logged')} {user.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2.5 md:py-2 rounded-lg text-xs md:text-xs font-bold border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all self-start active:scale-95 shrink-0"
        >
          <i className="fas fa-sign-out-alt mr-1.5" /> {t('admin.logout')}
        </button>
      </header>

      
      <div className="max-w-7xl mx-auto px-4 md:px-12 py-6 md:py-8 flex flex-col lg:grid lg:grid-cols-5 gap-4 md:gap-8">
        
        <aside className="lg:col-span-1 overflow-x-auto overflow-y-hidden lg:overflow-visible scrollbar-hide">
          <div className="flex lg:flex-col gap-1.5 card-depth p-2 lg:p-4 min-w-max lg:min-w-0 w-max lg:w-full">
            {[
              { id: "overview", label: t('admin.overview'), icon: "fas fa-chart-line" },
              { id: "products", label: t('admin.products'), icon: "fas fa-cubes" },
              { id: "orders", label: t('admin.orders'), icon: "fas fa-shopping-cart" },
              { id: "messages", label: t('admin.messages'), icon: "fas fa-envelope" },
              { id: "team", label: t('admin.team'), icon: "fas fa-users" },
              { id: "faq", label: t('admin.faq'), icon: "fas fa-question-circle" },
              { id: "sponsors", label: t('admin.sponsors'), icon: "fas fa-star" },
              { id: "reviews", label: t('admin.reviews'), icon: "fas fa-comment-dots" },
              { id: "terms", label: t('admin.terms'), icon: "fas fa-file-contract" },
              { id: "comparisons", label: t('admin.comparisons'), icon: "fas fa-table" },
              { id: "promo", label: "Promo", icon: "fas fa-tag" },
              { id: "backup", label: t('admin.backup'), icon: "fas fa-database", badge: backupDue }
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`shrink-0 lg:w-full px-4 py-3 rounded-xl text-sm font-bold text-left flex items-center gap-3 transition-all whitespace-nowrap ${
                    isActive
                      ? "bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]"
                      : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5"
                  }`}
                >
                  <i className={`${tab.icon} w-4 text-center`} />
                  <span>{tab.label}</span>
                  {(tab as any).badge && (
                    <span className="ml-auto w-2 h-2 rounded-full bg-amber-400 animate-pulse" title="Backup needed" />
                  )}
                </button>
              );
            })}
          </div>
        </aside>

        
        <main className="lg:col-span-4 flex flex-col gap-6">
          
          {activeTab === "overview" && (
            <div className="animate-fade-in flex flex-col gap-6">
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
                {[
                  { label: t('admin.stat_plans'), value: products.length, icon: "fas fa-cubes text-cyan-400" },
                  { label: t('admin.stat_total_orders'), value: orders.length, icon: "fas fa-shopping-cart text-purple-400" },
                  { label: t('admin.stat_pending'), value: orders.filter(o => o.status === "pending").length, icon: "fas fa-clock text-amber-500" },
                  { label: t('admin.stat_unread'), value: messages.filter(m => !m.read).length, icon: "fas fa-envelope text-blue-400" }
                ].map((stat, idx) => (
                  <div key={idx} className="card-depth p-5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs uppercase font-bold text-[var(--text-secondary)]">{stat.label}</span>
                      <i className={stat.icon} />
                    </div>
                    <strong className="text-2xl font-black text-[var(--text-primary)] block mt-3">{stat.value}</strong>
                  </div>
                ))}
              </div>

              
              <div className="card-depth p-6">
                <h3 className="text-base font-extrabold mb-4">{t('admin.activity_title')}</h3>
                <div className="divide-y text-sm text-[var(--text-secondary)] divide-[var(--border-color)]">
                  <div className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${firestoreOnline ? "bg-emerald-500" : "bg-red-500"} ${firestoreOnline ? "animate-pulse" : ""}`} />
                      <span>{t('admin.activity_sync')}</span>
                    </div>
                    <span className={`text-xs font-semibold ${firestoreOnline ? "text-emerald-500" : "text-red-500"}`}>
                      {firestoreOnline
                        ? lastSyncTime
                          ? formatTimeAgo(lastSyncTime)
                          : t('common.just_now')
                        : t('common.disconnected')}
                    </span>
                  </div>
                  <div className="py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`w-2 h-2 rounded-full ${user ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                      <span>{t('admin.activity_active')}</span>
                    </div>
                    <span className={`text-xs font-semibold ${user ? "text-emerald-500" : "text-red-500"}`}>
                      {user ? t('common.active') : t('common.inactive')}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          
          {activeTab === "products" && (
            <div className="animate-fade-in flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-4 border-[var(--border-color)]">
                <h2 className="text-lg font-extrabold">{t('admin.product_title')} ({products.length})</h2>
                <button
                  onClick={() => {
                    setEditingProduct({
                      id: "plan-" + Date.now().toString().slice(-6),
                      category: "minecraft-nexa",
                      name: "",
                      price_idr: 10000,
                      cpu: "1 Core",
                      ram: "1 GiB",
                      storage: "5 GiB NVMe",
                      backup_slot: 1,
                      allocation_slot: 1,
                      stock_status: "available",
                      redirect_url: "",
                      order: products.length + 1,
                      specs_list: []
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[var(--accent-blue)] text-white text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all"
                >
                  <i className="fas fa-plus mr-1.5" /> {t('admin.product_add')}
                </button>
              </div>

              
              {[
                { key: "nexa", label: "Shared — Nexa Plans", icon: "fas fa-bolt", filter: (p: Plan) => p.category === "minecraft-nexa" },
                { key: "neon", label: "Shared — Neon Plans", icon: "fas fa-microchip", filter: (p: Plan) => p.category === "minecraft-neon" },
                { key: "nano", label: "Shared — Nano Plans", icon: "fas fa-shield-alt", filter: (p: Plan) => p.category === "minecraft-nano" },
              { key: "private-atomic", label: "Private — Atomic", icon: "fas fa-atom", filter: (p: Plan) => p.category === "private-atomic" },
                { key: "private-catalyst", label: "Private — Catalyst", icon: "fas fa-flask", filter: (p: Plan) => p.category === "private-catalyst" },
                { key: "private-spectrum", label: "Private — Spectrum", icon: "fas fa-chart-bar", filter: (p: Plan) => p.category === "private-spectrum" },
                { key: "terraria", label: "Terraria Hosting", icon: "fas fa-tree", filter: (p: Plan) => p.category === "terraria" },
                { key: "samp", label: "SAMP Hosting", icon: "fas fa-car", filter: (p: Plan) => p.category === "samp" },
                { key: "hytale", label: "Hytale Hosting", icon: "fas fa-gamepad", filter: (p: Plan) => p.category === "hytale" },
                { key: "bot", label: "App Hosting", icon: "fas fa-robot", filter: (p: Plan) => p.category === "bot" },
                { key: "web", label: "Web Hosting", icon: "fas fa-globe", filter: (p: Plan) => p.category === "web" },
                { key: "vps-milan", label: "Cloud VPS — AMD Milan", icon: "fas fa-server", filter: (p: Plan) => p.category === "vps" && !p.id.includes("genoa") },
                { key: "vps-genoa", label: "Cloud VPS — AMD Genoa", icon: "fas fa-microchip", filter: (p: Plan) => p.category === "vps" && p.id.includes("genoa") },
                { key: "bare-metal-intel-core", label: "Bare Metal — Intel Core", icon: "fas fa-server", filter: (p: Plan) => p.category === "bare-metal" && p.id.startsWith("icbr") },
                { key: "bare-metal-intel-xeon", label: "Bare Metal — Intel Xeon", icon: "fas fa-server", filter: (p: Plan) => p.category === "bare-metal" && p.id.startsWith("ixbr") },
                { key: "bare-metal-amd-ryzen", label: "Bare Metal — AMD Ryzen 5", icon: "fas fa-microchip", filter: (p: Plan) => p.category === "bare-metal" && p.id.startsWith("ar5br") },
                { key: "bare-metal-intel", label: "Bare Metal — Intel (legacy)", icon: "fas fa-server", filter: (p: Plan) => p.category === "bare-metal" && p.id.includes("intel") && !p.id.startsWith("icbr") && !p.id.startsWith("ixbr") },
                { key: "bare-metal-ryzen", label: "Bare Metal — AMD Ryzen (legacy)", icon: "fas fa-microchip", filter: (p: Plan) => p.category === "bare-metal" && p.id.includes("ryzen") && !p.id.startsWith("ar5br") },
                { key: "bare-metal-epyc", label: "Bare Metal — AMD EPYC (legacy)", icon: "fas fa-microchip", filter: (p: Plan) => p.category === "bare-metal" && p.id.includes("epyc") },
                { key: "bare-metal-genoa", label: "Bare Metal — EPYC Genoa (legacy)", icon: "fas fa-microchip", filter: (p: Plan) => p.category === "bare-metal" && p.id.includes("genoa") },
              ].map((group) => {
                const groupPlans = products.filter(group.filter);
                if (groupPlans.length === 0) return null;
                const isOpen = expandedGroup === group.key;
                return (
                  <div key={group.key} className="border rounded-xl md:rounded-2xl overflow-hidden border-[var(--border-color)]">
                    <div className="flex items-center bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)]">
                      <button
                        onClick={() => setExpandedGroup(isOpen ? null : group.key)}
                        className="flex-1 px-4 md:px-5 py-3 flex items-center gap-2.5 cursor-pointer hover:bg-black/10 dark:hover:bg-white/10 transition-colors text-left"
                      >
                        <i className={`${group.icon} text-[var(--accent-blue)] text-sm`} />
                        <span className="text-sm font-extrabold text-[var(--text-primary)]">{group.label}</span>
                        <span className="text-xs text-[var(--text-secondary)] font-mono">{groupPlans.length} plans</span>
                        <i className={`fas fa-chevron-down text-xs text-[var(--text-secondary)] ml-auto transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          const idPrefix =
                            group.key === "nexa" ? "nexa-" :
                            group.key === "neon" ? "neon-" :
                            group.key === "nano" ? "nano-" :
                            group.key === "terraria" ? "terra-" :
                            group.key === "hytale" ? "hytale-" :
                            group.key === "samp" ? "samp-" :
                            group.key === "bot" ? "bot-" :
                            group.key === "web" ? "web-" :
                            group.key === "vps-milan" ? "vps-" :
                            group.key === "vps-genoa" ? "vps-genoa-" :
                            group.key === "bare-metal-intel-core" ? "icbr-" :
                            group.key === "bare-metal-intel-xeon" ? "ixbr-" :
                            group.key === "bare-metal-amd-ryzen" ? "ar5br-" :
                            group.key.startsWith("bare-metal-") ? `${group.key}-` :
                            group.key + "-";
                          const cat =
                            group.key === "nexa" ? "minecraft-nexa" :
                            group.key === "neon" ? "minecraft-neon" :
                            group.key === "nano" ? "minecraft-nano" :
                            group.key.startsWith("vps-") ? "vps" :
                            group.key.startsWith("bare-metal-") ? "bare-metal" :
                            group.key as Plan["category"];
                          setEditingProduct({
                            id: idPrefix + Date.now().toString().slice(-6),
                            category: cat,
                            name: "",
                            price_idr: (group.key.startsWith("bare-metal-") || group.key.startsWith("vps-") || group.key.startsWith("private-")) ? 0 : 10000,
                            cpu: group.key.startsWith("bare-metal-") ? "Intel Xeon / Core" : group.key.startsWith("private-") ? "" : "1 Core",
                            ram: group.key.startsWith("bare-metal-") ? "Up to 512GB DDR5" : group.key.startsWith("private-") ? "" : "1 GiB",
                            storage: group.key.startsWith("bare-metal-") ? "Up to 4TB NVMe SSD" : group.key.startsWith("private-") ? "" : "5 GiB NVMe",
                            backup_slot: 1,
                            allocation_slot: 1,
                            stock_status: "available",
                            redirect_url: "",
                            order: groupPlans.length + 1,
                            specs_list: group.key.startsWith("bare-metal-")
                              ? ["Dedicated Bandwidth 1Gbps", "DDoS Protection", "Full Root Access", "SLA 99.9% Uptime"]
                              : []
                          });
                          setIsProductModalOpen(true);
                        }}
                        className="px-3 py-3 text-[var(--accent-blue)] hover:bg-black/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
                        aria-label={`Add ${group.label}`}
                      >
                        <i className="fas fa-plus text-xs" />
                      </button>
                    </div>
                    <div className={`transition-all duration-200 overflow-hidden ${isOpen ? 'max-h-[2000px] opacity-100' : 'max-h-0 opacity-0'}`}>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm bg-[var(--bg-card)] min-w-[550px]">
                          <thead className="bg-black/5 dark:bg-white/5 text-[var(--text-primary)] font-bold">
                            <tr>
                              <th className="p-4">{t('admin.product_col_name')}</th>
                              <th className="p-4">{t('admin.product_col_price')}</th>
                              <th className="p-4">{t('admin.product_col_specs')}</th>
                              <th className="p-4">{t('admin.product_col_badge')}</th>
                              <th className="p-4">{t('admin.product_col_stock')}</th>
                              <th className="p-4 text-right">{t('admin.product_col_actions')}</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-secondary)]">
                            {groupPlans.map((plan) => (
                              <tr key={plan.id} className="hover:bg-black/5 dark:hover:bg-white/5">
<td className="p-4">
                                  <div className="font-semibold text-[var(--text-primary)] text-sm">{plan.name}</div>
                                  <div className="text-xs text-[var(--text-secondary)] mt-0.5">{plan.id}</div>
                                </td>
                                <td className="p-4 font-bold text-[var(--text-primary)] text-sm">Rp {plan.price_idr.toLocaleString("id-ID")}</td>
                                <td className="p-4">
                                  <div className="flex flex-wrap gap-1">
{plan.specs_list && plan.specs_list.length > 0 ? plan.specs_list.slice(0, 3).map((s, i) => (
                                          <span key={i} className="px-1.5 py-0.5 rounded text-xs md:text-xs font-mono border border-[var(--border-color)]">{s}</span>
                                        )) : (
                                      <>
                                        {plan.cpu && <span className="px-1.5 py-0.5 rounded text-xs md:text-xs font-mono border border-[var(--border-color)]">{plan.cpu}</span>}
                                        {plan.ram && <span className="px-1.5 py-0.5 rounded text-xs md:text-xs font-mono border border-[var(--border-color)]">{plan.ram}</span>}
                                        {plan.storage && <span className="px-1.5 py-0.5 rounded text-xs md:text-xs font-mono border border-[var(--border-color)]">{plan.storage}</span>}
                                      </>
                                    )}
                                  </div>
                                </td>
                                <td className="p-4">
                                  {plan.stock_badge ? (
                                    <span className={`px-2 py-1 rounded text-xs font-extrabold border ${
                                      plan.stock_badge === "ready"
                                        ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20"
                                        : plan.stock_badge === "limited"
                                        ? "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20"
                                        : "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                    }`}>
                                      {plan.stock_badge === "ready" ? "Ready" :
                                       plan.stock_badge === "limited" ? "Limited" : "Ask Stock"}
                                    </span>
                                  ) : (
                                    <span className="text-xs text-[var(--text-secondary)] opacity-50">—</span>
                                  )}
                                </td>
                                <td className="p-4">
                                  <button
                                    onClick={() => updateProductStock(
                                      plan.id,
                                      plan.stock_status === "coming_soon" ? "available" :
                                      plan.stock_status === "available" ? "limited" :
                                      plan.stock_status === "limited" ? "out_of_stock" : "coming_soon"
                                    )}
                                    className={`px-2 py-1 rounded text-xs md:text-xs font-extrabold border ${
                                      plan.stock_status === "available"
                                        ? "bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 border-emerald-500/20"
                                        : plan.stock_status === "limited"
                                        ? "bg-amber-500/10 text-amber-500 dark:text-amber-400 border-amber-500/20"
                                        : plan.stock_status === "coming_soon"
                                        ? "bg-blue-500/10 text-blue-500 border-blue-500/20"
                                        : "bg-red-500/10 text-red-500 border-red-500/20"
                                    }`}
                                  >
                                    {plan.stock_status === "available" ? t('admin.in_stock') :
                                     plan.stock_status === "limited" ? t('admin.limited') :
                                     plan.stock_status === "coming_soon" ? t('admin.coming_soon') : t('admin.out_of_stock')}
                                  </button>
                                </td>
                                <td className="p-4 text-right flex items-center justify-end gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingProduct(plan);
                                      setIsProductModalOpen(true);
                                    }}
                                    className="p-1.5 md:p-2 rounded bg-cyan-500/10 text-[var(--accent-blue)] hover:bg-[var(--accent-blue)] hover:text-white transition-all"
                                    aria-label="Edit plan"
                                  >
                                    <i className="fas fa-edit text-xs md:text-xs" />
                                  </button>
                                  <button
                                    onClick={async () => {
                                      if (confirm(`${t('admin.product_delete_confirm')} ${plan.name}?`)) {
                                        try {
                                          await deleteProduct(plan.id);
                                        } catch {
                                          alert("Failed to delete product. Check console for details.");
                                        }
                                      }
                                    }}
                                    className="p-1.5 md:p-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                                    aria-label="Delete plan"
                                  >
                                    <i className="fas fa-trash-alt text-xs md:text-xs" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          
          {activeTab === "orders" && (
            <div className="animate-fade-in flex flex-col gap-4">
              <h2 className="text-lg font-extrabold border-b pb-4 border-[var(--border-color)]">{t('admin.order_title')} ({orders.length})</h2>

              <div className="border rounded-xl md:rounded-2xl overflow-x-auto border-[var(--border-color)]">
                  <table className="w-full text-left text-sm bg-[var(--bg-card)] min-w-[500px]">
                    <thead className="bg-black/5 dark:bg-white/5 border-b border-[var(--border-color)] text-[var(--text-primary)] font-bold">
                      <tr>
                        <th className="p-4">{t('admin.order_col_customer')}</th>
                        <th className="p-4">{t('admin.order_col_plan')}</th>
                        <th className="p-4">{t('admin.order_col_total')}</th>
                        <th className="p-4">{t('admin.order_col_status')}</th>
                        <th className="p-4 text-right">{t('admin.order_col_actions')}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[var(--border-color)] text-[var(--text-secondary)]">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-black/5 dark:hover:bg-white/5">
                          <td className="p-4">
                            <div className="font-semibold text-[var(--text-primary)] text-sm">{ord.user_name || ord.user_email}</div>
                            <div className="text-xs mt-0.5">{ord.user_email} — {ord.user_phone}</div>
                          </td>
                        <td className="p-4">
                          <div className="font-semibold text-[var(--text-primary)] text-sm">{ord.plan_name}</div>
                          <span className="text-xs uppercase font-bold text-[var(--text-secondary)]">{ord.category}</span>
                        </td>
                        <td className="p-4 font-bold text-[var(--text-primary)] text-sm">Rp {ord.price_idr.toLocaleString("id-ID")}</td>
                        <td className="p-4">
                          <select
                            value={ord.status}
                            onChange={(e) => updateOrderStatus(ord.id!, e.target.value as "pending" | "processing" | "completed")}
                            className={`px-2 py-1 rounded text-xs font-bold border bg-transparent ${
                              ord.status === "completed"
                                ? "border-emerald-500/20 text-emerald-400 bg-emerald-500/5"
                                : ord.status === "processing"
                                ? "border-blue-500/20 text-blue-400 bg-blue-500/5"
                                : "border-amber-500/20 text-amber-500 bg-amber-500/5"
                            }`}
                          >
                            <option value="pending" className="bg-[var(--bg-card)]">Pending</option>
                            <option value="processing" className="bg-[var(--bg-card)]">Processing</option>
                            <option value="completed" className="bg-[var(--bg-card)]">Completed</option>
                          </select>
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={async () => {
                              if (confirm(t('admin.order_delete_confirm'))) {
                                await deleteOrder(ord.id!);
                              }
                            }}
                            className="p-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                            aria-label="Delete order"
                          >
                            <i className="fas fa-trash-alt text-xs" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          
          {activeTab === "messages" && (
            <div className="animate-fade-in flex flex-col gap-4">
              <h2 className="text-lg font-extrabold border-b pb-4 border-[var(--border-color)]">{t('admin.message_title')} ({messages.length})</h2>

              <div className="flex flex-col gap-3 md:gap-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-4 md:p-5 card-depth flex flex-col gap-3 relative transition-all ${
                      !msg.read ? "border-[var(--accent-blue)]/50 bg-[var(--accent-blue)]/5" : ""
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:flex-wrap items-start md:items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-extrabold text-sm text-[var(--text-primary)] truncate">{msg.subject}</h3>
                        <span className="text-xs font-semibold text-[var(--text-secondary)]">{t('admin.message_from')} {msg.name} ({msg.email})</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => markMessageAsRead(msg.id!, !msg.read)}
                          className={`px-2.5 py-1.5 md:py-1 rounded text-xs font-bold border ${
                            msg.read
                              ? "bg-zinc-700/10 text-zinc-400 border-zinc-700/15"
                              : "bg-[var(--accent-blue)]/10 text-[var(--accent-blue)] border-[var(--accent-blue)]/20"
                          }`}
                        >
                          {msg.read ? t('admin.message_mark_unread') : t('admin.message_mark_read')}
                        </button>
                        <button
                          onClick={async () => {
                            if (confirm(t('admin.message_delete_confirm'))) {
                              await deleteMessage(msg.id!);
                            }
                          }}
                          className="p-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-500/15"
                          aria-label="Delete message"
                        >
                          <i className="fas fa-trash-alt text-xs" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm leading-relaxed text-[var(--text-secondary)] border-t pt-3 border-[var(--border-color)]">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          
          {activeTab === "team" && (
            <div className="animate-fade-in flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-4 border-[var(--border-color)]">
                <h2 className="text-lg font-extrabold">{t('admin.team_title')} ({teamMembers.length})</h2>
                <button
                  onClick={() => {
                    setEditingMember({
                      id: "member-" + Date.now().toString().slice(-4),
                      name: "",
                      role: "",
                      image_url: "",
                      order: teamMembers.length + 1,
                      socials: {
                          discord: "https://discord.gg/Nz9b6bMuNe",
                          instagram: "https://www.instagram.com/tinnzstore_id",
                          whatsapp: "https://wa.me/6287844812351",
                          tiktok: "",
                          portfolio: ""
                        }
                    });
                    setIsMemberModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[var(--accent-blue)] text-white text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all"
                >
                  <i className="fas fa-plus mr-1.5" /> {t('admin.team_add')}
                </button>
              </div>

              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {teamMembers.map((member) => (
                  <div
                    key={member.id}
                    className="card-depth p-3 md:p-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3">
                      <img src={member.image_url} alt={member.name} className="w-10 h-10 rounded-full object-cover" referrerPolicy="no-referrer" />
                      <div>
                        <h4 className="text-sm font-extrabold text-[var(--text-primary)]">{member.name}</h4>
                        <span className="text-xs text-[var(--text-secondary)]">{member.role}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setEditingMember(member);
                          setIsMemberModalOpen(true);
                        }}
                        className="p-2 rounded bg-cyan-500/10 text-[var(--accent-blue)] hover:bg-[var(--accent-blue)] hover:text-white transition-all"
                        aria-label="Edit member"
                      >
                        <i className="fas fa-edit text-xs" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`${t('admin.team_delete_confirm')} ${member.name}?`)) {
                            await deleteTeamMember(member.id);
                          }
                        }}
                        className="p-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                        aria-label="Delete member"
                      >
                        <i className="fas fa-trash-alt text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "faq" && (
            <div className="animate-fade-in flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-4 border-[var(--border-color)]">
                <h2 className="text-lg font-extrabold">{t('admin.faq_title')} ({faqs.length})</h2>
                <button
                  onClick={() => {
                    setEditingFAQ({ id: "faq-" + Date.now(), question: "", answer: "", order: faqs.length + 1 });
                    setIsFAQModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[var(--accent-blue)] text-white text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all"
                >
                  <i className="fas fa-plus mr-1.5" /> {t('admin.faq_add')}
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {faqs.map((faq) => (
                  <div
                    key={faq.id}
                    className="card-depth p-4 md:p-5 flex flex-col md:flex-row md:items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-extrabold text-[var(--text-primary)]">{faq.question}</h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed line-clamp-2">{faq.answer}</p>
                      <span className="text-xs font-mono text-[var(--text-secondary)] mt-1 block">Order: {faq.order}</span>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingFAQ(faq);
                          setIsFAQModalOpen(true);
                        }}
                        className="p-2 rounded bg-cyan-500/10 text-[var(--accent-blue)] hover:bg-[var(--accent-blue)] hover:text-white transition-all"
                      >
                        <i className="fas fa-edit text-xs" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`${t('admin.faq_delete_confirm')} "${faq.question}"?`)) {
                            await deleteFAQ(faq.id!);
                          }
                        }}
                        className="p-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <i className="fas fa-trash-alt text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "sponsors" && (
            <div className="animate-fade-in flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-4 border-[var(--border-color)]">
                <h2 className="text-lg font-extrabold">{t('admin.sponsor_title')} ({sponsors.length})</h2>
                <button
                  onClick={() => {
                    setEditingSponsor({
                      id: "sponsor-" + Date.now(),
                      title: "",
                      image: "",
                      game: "MINECRAFT",
                      status: "AKTIF",
                      desc: "",
                      desc_en: "",
                      owners: "",
                      order: sponsors.length + 1
                    });
                    setIsSponsorModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[var(--accent-blue)] text-white text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all"
                >
                  <i className="fas fa-plus mr-1.5" /> {t('admin.sponsor_add')}
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:gap-4">
                {sponsors.map((s) => (
                  <div
                    key={s.id}
                    className="card-depth p-3 md:p-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <img src={s.image} alt={s.title} className="w-12 h-12 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                      <div className="min-w-0">
                        <h4 className="text-sm font-extrabold text-[var(--text-primary)] truncate">{s.title}</h4>
                        <span className="text-xs text-[var(--text-secondary)]">{s.game} — {s.status}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingSponsor(s);
                          setIsSponsorModalOpen(true);
                        }}
                        className="p-2 rounded bg-cyan-500/10 text-[var(--accent-blue)] hover:bg-[var(--accent-blue)] hover:text-white transition-all"
                      >
                        <i className="fas fa-edit text-xs" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`${t('admin.sponsor_delete_confirm')} "${s.title}"?`)) {
                            await deleteSponsor(s.id!);
                          }
                        }}
                        className="p-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <i className="fas fa-trash-alt text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "reviews" && (
            <div className="animate-fade-in flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-4 border-[var(--border-color)]">
                <h2 className="text-lg font-extrabold">{t('admin.review_title')} ({reviews.length})</h2>
                <button
                  onClick={() => {
                    setEditingReview({
                      id: "review-" + Date.now(),
                      name: "",
                      role: "",
                      photo: "",
                      rating: 5,
                      text: "",
                      order: reviews.length + 1
                    });
                    setIsReviewModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[var(--accent-blue)] text-white text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all"
                >
                  <i className="fas fa-plus mr-1.5" /> Add Review
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 md:gap-4">
                {reviews.map((r) => (
                  <div
                    key={r.id}
                    className="card-depth p-3 md:p-4 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {r.photo ? (
                        <img src={r.photo} alt={r.name} className="w-12 h-12 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[var(--accent-blue)]/10 flex items-center justify-center shrink-0">
                          <i className="fas fa-user text-[var(--accent-blue)] text-sm" />
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="text-sm font-extrabold text-[var(--text-primary)]">{r.name}</h4>
                        {r.role && <span className="text-xs text-[var(--text-secondary)] font-mono">{r.role}</span>}
                        <div className="flex items-center gap-1 text-xs text-amber-400 mt-0.5">
                          {Array.from({ length: r.rating }, (_, i) => (
                            <i key={i} className="fas fa-star" />
                          ))}
                        </div>
                        <p className="text-sm text-[var(--text-secondary)] mt-0.5 line-clamp-2">{r.text}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingReview(r);
                          setIsReviewModalOpen(true);
                        }}
                        className="p-2 rounded bg-cyan-500/10 text-[var(--accent-blue)] hover:bg-[var(--accent-blue)] hover:text-white transition-all"
                      >
                        <i className="fas fa-edit text-xs" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`Hapus review dari "${r.name}"?`)) {
                            await deleteReview(r.id!);
                          }
                        }}
                        className="p-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <i className="fas fa-trash-alt text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "terms" && (
            <div className="animate-fade-in flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-4 border-[var(--border-color)]">
                <h2 className="text-lg font-extrabold">{t('admin.term_title')} ({terms.length})</h2>
                <button
                  onClick={() => {
                    setEditingTerm({
                      id: "term-" + Date.now(),
                      title: "",
                      content: "",
                      title_en: "",
                      content_en: "",
                      tab: "syk",
                      order: terms.length + 1
                    });
                    setIsTermModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-[var(--accent-blue)] text-white text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all"
                >
                  <i className="fas fa-plus mr-1.5" /> {t('admin.term_add')}
                </button>
              </div>

              <div className="flex flex-col gap-3">
                {terms.map((term) => (
                  <div
                    key={term.id}
                    className="card-depth p-4 md:p-5 flex flex-col md:flex-row md:items-start justify-between gap-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-xs font-bold ${
                          term.tab === "syk"
                            ? "bg-blue-500/10 text-blue-400"
                            : term.tab === "kebijakan_pengguna"
                            ? "bg-amber-500/10 text-amber-400"
                            : "bg-emerald-500/10 text-emerald-400"
                        }`}>
                          {term.tab === "syk" ? "S&K" : term.tab === "kebijakan_pengguna" ? "Kebijakan Pengguna" : "Kebijakan Privasi"}
                        </span>
                        <span className="text-xs font-mono text-[var(--text-secondary)]">Order: {term.order}</span>
                      </div>
                      <h4 className="text-sm font-extrabold text-[var(--text-primary)] mt-1">{term.title}</h4>
                      <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed line-clamp-2">{term.content}</p>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <button
                        onClick={() => {
                          setEditingTerm(term);
                          setIsTermModalOpen(true);
                        }}
                        className="p-2 rounded bg-cyan-500/10 text-[var(--accent-blue)] hover:bg-[var(--accent-blue)] hover:text-white transition-all"
                      >
                        <i className="fas fa-edit text-xs" />
                      </button>
                      <button
                        onClick={async () => {
                          if (confirm(`${t('admin.term_delete_confirm')} "${term.title}"?`)) {
                            await deleteTerm(term.id!);
                          }
                        }}
                        className="p-2 rounded bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                      >
                        <i className="fas fa-trash-alt text-xs" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {activeTab === "comparisons" && (
            <div className="animate-fade-in flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-4 border-[var(--border-color)]">
                <h2 className="text-lg font-extrabold">{t('admin.comp_title')}</h2>
              </div>
              {compLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-[var(--accent-blue)] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {(Object.entries(comparisons || {}) as [ComparisonCategory, ComparisonData][]).map(([cat, data]) => (
                    <ComparisonEditor
                      key={cat}
                      category={cat}
                      data={data}
                      onSave={async (updated) => {
                        await saveComparison(cat, updated);
                      }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "promo" && (
            <div className="animate-fade-in flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-4 border-[var(--border-color)]">
                <h2 className="text-lg font-extrabold">Kode Promo ({promoCodes.length})</h2>
                <button
                  onClick={() => {
                    setEditingPromo({
                      id: "promo-" + Date.now(),
                      code: "",
                      type: "percent",
                      value: 0,
                      min_purchase: 0,
                      max_uses: 0,
                      used_count: 0,
                      expires_at: null,
                      is_active: true,
                      applicable_categories: [],
                      created_at: new Date().toISOString()
                    });
                    setIsPromoModalOpen(true);
                  }}
                  className="px-5 py-2.5 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all"
                >
                  <i className="fas fa-plus mr-1.5" /> {t('admin.promo_add')}
                </button>
              </div>
              {promosLoading ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-[var(--accent-blue)] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : promoCodes.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-[var(--text-secondary)]">
                  <i className="fas fa-tag text-4xl mb-3 opacity-30" />
                  <p className="text-sm font-bold">Belum ada kode promo</p>
                  <p className="text-xs mt-1">Klik "Add Promo Code" untuk membuat kode promo baru</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {promoCodes.map((promo) => {
                    const isExpired = promo.expires_at && new Date(promo.expires_at) < new Date();
                    return (
                      <div key={promo.id} className="card-depth p-4 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-4 min-w-0">
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm ${promo.is_active && !isExpired ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                            <i className="fas fa-tag" />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-bold font-mono">{promo.code}</span>
                              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${promo.is_active && !isExpired ? "bg-emerald-500/10 text-emerald-400" : "bg-red-500/10 text-red-400"}`}>
                                {promo.is_active && !isExpired ? "Active" : "Inactive"}
                              </span>
                            </div>
                            <p className="text-[10px] text-[var(--text-secondary)] font-mono mt-0.5">
                              {promo.type === "percent" ? `${promo.value}%` : `Rp ${promo.value.toLocaleString("id-ID")}`}
                              {promo.min_purchase > 0 && ` • Min Rp ${promo.min_purchase.toLocaleString("id-ID")}`}
                              {promo.max_uses > 0 && ` • ${promo.used_count}/${promo.max_uses} uses`}
                              {promo.expires_at && ` • Exp: ${new Date(promo.expires_at).toLocaleDateString("id-ID")}`}
                              {promo.applicable_categories.length > 0 && ` • Cat: ${promo.applicable_categories.join(", ")}`}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setEditingPromo({
                                ...promo,
                                created_at: promo.created_at || new Date().toISOString()
                              });
                              setIsPromoModalOpen(true);
                            }}
                            className="px-3 py-2 rounded-lg text-[10px] font-bold border border-[var(--border-color)] hover:bg-[var(--accent-blue)]/10 hover:border-[var(--accent-blue)] transition-all"
                          >
                            <i className="fas fa-edit" />
                          </button>
                          <button
                            onClick={async () => {
                              if (window.confirm(`${t('admin.promo_delete_confirm')} "${promo.code}"?`)) {
                                try {
                                  await deletePromoCode(promo.id);
                                } catch (err) {
                                  alert("Error deleting: " + err);
                                }
                              }
                            }}
                            className="px-3 py-2 rounded-lg text-[10px] font-bold border border-[var(--border-color)] hover:bg-red-500/10 hover:border-red-500 transition-all text-red-400"
                          >
                            <i className="fas fa-trash" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          {activeTab === "backup" && (
            <div className="animate-fade-in flex flex-col gap-4">
              <div className="flex items-center justify-between border-b pb-4 border-[var(--border-color)]">
                <h2 className="text-lg font-extrabold">{t('admin.backup_title')}</h2>
                <button
                  onClick={async () => {
                    const { exportAllCollections } = await import("../utils/backup");
                    await exportAllCollections();
                    setBackupDue(false);
                  }}
                  className="px-5 py-2.5 bg-[var(--accent-blue)] text-white text-sm font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all"
                >
                  <i className="fas fa-download mr-1.5" /> {t('admin.backup_export')}
                </button>
              </div>
              {backupDue && (
                <div className="flex items-center gap-3 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 shrink-0">
                    <i className="fas fa-exclamation-triangle" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-amber-400">{t('admin.backup_due')}</p>
                    <p className="text-[10px] font-mono text-[var(--text-secondary)]">{t('admin.backup_due_desc')}</p>
                  </div>
                </div>
              )}
              <div className="card-depth p-4 md:p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-green-500/10 text-green-500">
                    <i className="fas fa-clock" />
                  </div>
                  <div>
                    <p className="text-xs font-bold">{t('admin.backup_schedule')}</p>
                    <p className="text-[10px] font-mono text-[var(--text-secondary)]">{t('admin.backup_auto_desc')}</p>
                  </div>
                </div>
                <div id="backup-history" className="flex flex-col gap-2">
                  
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 md:px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsProductModalOpen(false)} />
          <div className="relative w-full max-w-lg card-depth p-4 md:p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm md:text-base font-extrabold">{editingProduct.id ? "Edit Plan Details" : "Create New Pricing Plan"}</h3>

            <form onSubmit={handleProductSubmit} className="flex flex-col gap-3 md:gap-4 text-xs md:text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[var(--text-secondary)]">Plan ID (Unique)</label>
                  <input
                    type="text"
                    required
                    disabled={!!products.find(p => p.id === editingProduct.id)}
                    value={editingProduct.id || ""}
                    onChange={(e) => setEditingProduct(p => ({ ...p!, id: e.target.value }))}
                    className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[var(--text-secondary)]">Plan Name</label>
                  <input
                    type="text"
                    required
                    value={editingProduct.name || ""}
                    onChange={(e) => setEditingProduct(p => ({ ...p!, name: e.target.value }))}
                    className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[var(--text-secondary)]">Category</label>
                  <select
                    value={editingProduct.category || "minecraft-nexa"}
                    onChange={(e) => setEditingProduct(p => ({ ...p!, category: e.target.value as Plan["category"] }))}
                    className="px-3.5 py-2.5 rounded-lg border bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)]"
                  >
                    <option value="minecraft-nexa">Shared Nexa</option>
                    <option value="minecraft-neon">Shared Neon</option>
                    <option value="minecraft-nano">Shared Nano</option>
                    <option value="private-atomic">Private Atomic</option>
                    <option value="private-catalyst">Private Catalyst</option>
                    <option value="private-spectrum">Private Spectrum</option>
                    <option value="bot">App Hosting</option>
                    <option value="web">Web Hosting</option>
                    <option value="terraria">Terraria Hosting</option>
                    <option value="samp">SAMP Hosting</option>
                    <option value="hytale">Hytale Hosting</option>
                    <option value="vps">Cloud VPS</option>
                    <option value="bare-metal">Bare Metal</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[var(--text-secondary)]">Price (IDR / Month)</label>
                  <input
                    type="number"
                    required
                    value={editingProduct.price_idr || 0}
                    onChange={(e) => setEditingProduct(p => ({ ...p!, price_idr: Number(e.target.value) }))}
                    className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[var(--text-secondary)]">CPU Specifications</label>
                  <input
                    type="text"
                    value={editingProduct.cpu || ""}
                    onChange={(e) => setEditingProduct(p => ({ ...p!, cpu: e.target.value }))}
                    className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[var(--text-secondary)]">RAM Specifications</label>
                  <input
                    type="text"
                    value={editingProduct.ram || ""}
                    onChange={(e) => setEditingProduct(p => ({ ...p!, ram: e.target.value }))}
                    className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[var(--text-secondary)]">Storage NVMe</label>
                  <input
                    type="text"
                    value={editingProduct.storage || ""}
                    onChange={(e) => setEditingProduct(p => ({ ...p!, storage: e.target.value }))}
                    className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[var(--text-secondary)]">Backup Slots</label>
                  <input
                    type="text"
                    value={editingProduct.backup_slot || ""}
                    onChange={(e) => setEditingProduct(p => ({ ...p!, backup_slot: e.target.value }))}
                    className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[var(--text-secondary)]">Allocation Slots</label>
                  <input
                    type="text"
                    value={editingProduct.allocation_slot || ""}
                    onChange={(e) => setEditingProduct(p => ({ ...p!, allocation_slot: e.target.value }))}
                    className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[var(--text-secondary)]">Sorting Order</label>
                  <input
                    type="number"
                    value={editingProduct.order || 1}
                    onChange={(e) => setEditingProduct(p => ({ ...p!, order: Number(e.target.value) }))}
                    className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Cart Redirect Checkout URL</label>
                <input
                  type="text"
                  value={editingProduct.redirect_url || ""}
                  onChange={(e) => setEditingProduct(p => ({ ...p!, redirect_url: e.target.value }))}
                  placeholder="https://my.tinnzstore.com/store/..."
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Badge Label (opsional)</label>
                <select
                  value={editingProduct.badge || ""}
                  onChange={(e) => setEditingProduct(p => ({ ...p!, badge: e.target.value || undefined }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                >
                  <option value="">— Tanpa Badge —</option>
                  <option value="POPULAR">POPULAR</option>
                  <option value="BEST SELLER">BEST SELLER</option>
                  <option value="ADVANCED">ADVANCED</option>
                  <option value="ENTERPRISE">ENTERPRISE</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Stock Badge (opsional)</label>
                <select
                  value={editingProduct.stock_badge || ""}
                  onChange={(e) => setEditingProduct(p => ({ ...p!, stock_badge: e.target.value || undefined }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                >
                  <option value="">— Default —</option>
                  <option value="ready">Ready — Siap</option>
                  <option value="limited">Limited — Terbatas</option>
                  <option value="ask_stock">Ask Stock — Tanya Stock</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Specs List (satu per baris)</label>
                <textarea
                  rows={4}
                  value={(editingProduct.specs_list || []).join("\n")}
                  onChange={(e) => setEditingProduct(p => ({ ...p!, specs_list: e.target.value.split("\n").filter(Boolean) }))}
                  placeholder="4vCPU AMD EPYC Genoa&#10;8GB DDR5 RAM&#10;128GB NVMe SSD Storage"
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] resize-y"
                />
              </div>

              <div className="flex items-center gap-3.5 mt-4">
                <button
                  type="submit"
                  className="px-5 py-3 rounded-lg font-bold text-white bg-[var(--accent-blue)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  Save Product Configuration
                </button>
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-3 rounded-lg font-bold border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      
      {isMemberModalOpen && editingMember && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 md:px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMemberModalOpen(false)} />
          <div className="relative w-full max-w-md card-depth p-4 md:p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm md:text-base font-extrabold">{editingMember.id ? "Edit Member Profile" : "Add New Team Member"}</h3>

            <form onSubmit={handleMemberSubmit} className="flex flex-col gap-3 md:gap-4 text-xs md:text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Member ID</label>
                <input
                  type="text"
                  required
                  disabled={!!teamMembers.find(t => t.id === editingMember.id)}
                  value={editingMember.id || ""}
                  onChange={(e) => setEditingMember(m => ({ ...m!, id: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Full Name</label>
                <input
                  type="text"
                  required
                  value={editingMember.name || ""}
                  onChange={(e) => setEditingMember(m => ({ ...m!, name: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Role / Title</label>
                <input
                  type="text"
                  required
                  value={editingMember.role || ""}
                  onChange={(e) => setEditingMember(m => ({ ...m!, role: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Avatar Photo URL</label>
                <input
                  type="text"
                  value={editingMember.image_url || ""}
                  onChange={(e) => setEditingMember(m => ({ ...m!, image_url: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Sorting Order</label>
                <input
                  type="number"
                  value={editingMember.order || 1}
                  onChange={(e) => setEditingMember(m => ({ ...m!, order: Number(e.target.value) }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <span className="text-sm font-bold text-[var(--text-secondary)] uppercase mt-2 border-t pt-3 border-[var(--border-color)]">Social Media Links</span>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">
                  <i className="fab fa-instagram mr-1.5 text-pink-400" /> Instagram URL
                </label>
                <input
                  type="text"
                  value={editingMember.socials?.instagram || ""}
                  onChange={(e) => setEditingMember(m => ({ ...m!, socials: { ...m!.socials, instagram: e.target.value } }))}
                  placeholder="https://www.instagram.com/username"
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">
                  <i className="fab fa-whatsapp mr-1.5 text-emerald-400" /> WhatsApp URL
                </label>
                <input
                  type="text"
                  value={editingMember.socials?.whatsapp || ""}
                  onChange={(e) => setEditingMember(m => ({ ...m!, socials: { ...m!.socials, whatsapp: e.target.value } }))}
                  placeholder="https://wa.me/6287844812351"
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">
                  <i className="fab fa-discord mr-1.5 text-indigo-400" /> Discord URL
                </label>
                <input
                  type="text"
                  value={editingMember.socials?.discord || ""}
                  onChange={(e) => setEditingMember(m => ({ ...m!, socials: { ...m!.socials, discord: e.target.value } }))}
                  placeholder="https://discord.gg/Nz9b6bMuNe"
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">
                  <i className="fab fa-tiktok mr-1.5" /> TikTok URL
                </label>
                <input
                  type="text"
                  value={editingMember.socials?.tiktok || ""}
                  onChange={(e) => setEditingMember(m => ({ ...m!, socials: { ...m!.socials, tiktok: e.target.value } }))}
                  placeholder="https://www.tiktok.com/@username"
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">
                  <i className="fas fa-globe mr-1.5 text-blue-400" /> Portfolio URL
                </label>
                <input
                  type="text"
                  value={editingMember.socials?.portfolio || ""}
                  onChange={(e) => setEditingMember(m => ({ ...m!, socials: { ...m!.socials, portfolio: e.target.value } }))}
                  placeholder="https://portofolio.example.com"
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex items-center gap-3.5 mt-4">
                <button
                  type="submit"
                  className="px-5 py-3 rounded-lg font-bold text-white bg-[var(--accent-blue)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  Save Team Member
                </button>
                <button
                  type="button"
                  onClick={() => setIsMemberModalOpen(false)}
                  className="px-5 py-3 rounded-lg font-bold border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isFAQModalOpen && editingFAQ && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 md:px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsFAQModalOpen(false)} />
          <div className="relative w-full max-w-lg card-depth p-4 md:p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm md:text-base font-extrabold">{editingFAQ.id ? "Edit FAQ" : "Add New FAQ"}</h3>

            <form onSubmit={handleFAQSubmit} className="flex flex-col gap-3 md:gap-4 text-xs md:text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Question (Indonesia)</label>
                <input
                  type="text"
                  required
                  value={editingFAQ.question || ""}
                  onChange={(e) => setEditingFAQ(f => ({ ...f!, question: e.target.value }))}
                  placeholder="Masukkan pertanyaan FAQ"
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Question (English)</label>
                <input
                  type="text"
                  value={editingFAQ.question_en || ""}
                  onChange={(e) => setEditingFAQ(f => ({ ...f!, question_en: e.target.value }))}
                  placeholder="FAQ question in English"
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Answer (Indonesia)</label>
                <textarea
                  rows={4}
                  required
                  value={editingFAQ.answer || ""}
                  onChange={(e) => setEditingFAQ(f => ({ ...f!, answer: e.target.value }))}
                  placeholder="Masukkan jawaban FAQ"
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] resize-y"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Answer (English)</label>
                <textarea
                  rows={4}
                  value={editingFAQ.answer_en || ""}
                  onChange={(e) => setEditingFAQ(f => ({ ...f!, answer_en: e.target.value }))}
                  placeholder="FAQ answer in English"
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] resize-y"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Sorting Order</label>
                <input
                  type="number"
                  value={editingFAQ.order || 1}
                  onChange={(e) => setEditingFAQ(f => ({ ...f!, order: Number(e.target.value) }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex items-center gap-3.5 mt-4">
                <button
                  type="submit"
                  className="px-5 py-3 rounded-lg font-bold text-white bg-[var(--accent-blue)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  Save FAQ
                </button>
                <button
                  type="button"
                  onClick={() => setIsFAQModalOpen(false)}
                  className="px-5 py-3 rounded-lg font-bold border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isSponsorModalOpen && editingSponsor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 md:px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSponsorModalOpen(false)} />
          <div className="relative w-full max-w-lg card-depth p-4 md:p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm md:text-base font-extrabold">{editingSponsor.id ? "Edit Sponsor Project" : "Add New Sponsor Project"}</h3>

            <form onSubmit={handleSponsorSubmit} className="flex flex-col gap-3 md:gap-4 text-xs md:text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Project Title</label>
                <input
                  type="text"
                  required
                  value={editingSponsor.title || ""}
                  onChange={(e) => setEditingSponsor(s => ({ ...s!, title: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Game</label>
                <input
                  type="text"
                  value={editingSponsor.game || ""}
                  onChange={(e) => setEditingSponsor(s => ({ ...s!, game: e.target.value }))}
                  placeholder="MINECRAFT"
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Status</label>
                <select
                  value={editingSponsor.status || "AKTIF"}
                  onChange={(e) => setEditingSponsor(s => ({ ...s!, status: e.target.value as "AKTIF" | "ALUMNI" }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)]"
                >
                  <option value="AKTIF">AKTIF</option>
                  <option value="ALUMNI">ALUMNI</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Profile Image</label>
                <div className="flex items-center gap-3">
                  {(editingSponsor.image) && (
                    <img src={editingSponsor.image} alt="preview" className="w-12 h-12 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const dataUrl = await fileToBase64(file);
                        setEditingSponsor(s => ({ ...s!, image: dataUrl }));
                      }
                    }}
                    className="flex-1 px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] file:mr-2 file:px-2 file:py-1 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[var(--accent-blue)] file:text-white"
                  />
                </div>
                {editingSponsor.image && editingSponsor.image.startsWith("http") && (
                  <input
                    type="text"
                    value={editingSponsor.image}
                    onChange={(e) => setEditingSponsor(s => ({ ...s!, image: e.target.value }))}
                    placeholder="Atau masukkan URL gambar"
                    className="mt-2 px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                  />
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Description (Indonesia)</label>
                <textarea
                  rows={3}
                  value={editingSponsor.desc || ""}
                  onChange={(e) => setEditingSponsor(s => ({ ...s!, desc: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] resize-y"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Description (English)</label>
                <textarea
                  rows={3}
                  value={editingSponsor.desc_en || ""}
                  onChange={(e) => setEditingSponsor(s => ({ ...s!, desc_en: e.target.value }))}
                  placeholder="Leave empty to fall back to Indonesian description"
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] resize-y"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Owners / Founders</label>
                <input
                  type="text"
                  value={editingSponsor.owners || ""}
                  onChange={(e) => setEditingSponsor(s => ({ ...s!, owners: e.target.value }))}
                  placeholder="Mefalz, Mownd, UrekanFaiz"
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Sorting Order</label>
                <input
                  type="number"
                  value={editingSponsor.order || 1}
                  onChange={(e) => setEditingSponsor(s => ({ ...s!, order: Number(e.target.value) }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex items-center gap-3.5 mt-4">
                <button
                  type="submit"
                  className="px-5 py-3 rounded-lg font-bold text-white bg-[var(--accent-blue)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  Save Sponsor
                </button>
                <button
                  type="button"
                  onClick={() => setIsSponsorModalOpen(false)}
                  className="px-5 py-3 rounded-lg font-bold border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isReviewModalOpen && editingReview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 md:px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsReviewModalOpen(false)} />
          <div className="relative w-full max-w-lg card-depth p-4 md:p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm md:text-base font-extrabold">{editingReview.id ? "Edit Customer Review" : "Add New Customer Review"}</h3>

            <form onSubmit={handleReviewSubmit} className="flex flex-col gap-3 md:gap-4 text-xs md:text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Customer Name</label>
                <input
                  type="text"
                  required
                  value={editingReview.name || ""}
                  onChange={(e) => setEditingReview(r => ({ ...r!, name: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Role / Title</label>
                <input
                  type="text"
                  value={editingReview.role || ""}
                  onChange={(e) => setEditingReview(r => ({ ...r!, role: e.target.value }))}
                  placeholder="Content Creator"
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Profile Photo</label>
                <div className="flex items-center gap-3">
                  {(editingReview.photo) && (
                    <img src={editingReview.photo} alt="preview" className="w-12 h-12 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const dataUrl = await fileToBase64(file);
                        setEditingReview(r => ({ ...r!, photo: dataUrl }));
                      }
                    }}
                    className="flex-1 px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] file:mr-2 file:px-2 file:py-1 file:rounded file:border-0 file:text-xs file:font-bold file:bg-[var(--accent-blue)] file:text-white"
                  />
                </div>
                {editingReview.photo && editingReview.photo.startsWith("http") && (
                  <input
                    type="text"
                    value={editingReview.photo}
                    onChange={(e) => setEditingReview(r => ({ ...r!, photo: e.target.value }))}
                    placeholder="Atau masukkan URL foto"
                    className="mt-2 px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                  />
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Rating (1-5)</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={editingReview.rating || 5}
                  onChange={(e) => setEditingReview(r => ({ ...r!, rating: Number(e.target.value) }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Review Text (Indonesia)</label>
                <textarea
                  rows={3}
                  required
                  value={editingReview.text || ""}
                  onChange={(e) => setEditingReview(r => ({ ...r!, text: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] resize-y"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Review Text (English)</label>
                <textarea
                  rows={3}
                  value={editingReview.text_en || ""}
                  onChange={(e) => setEditingReview(r => ({ ...r!, text_en: e.target.value }))}
                  placeholder="Review text in English"
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] resize-y"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Sorting Order</label>
                <input
                  type="number"
                  value={editingReview.order || 1}
                  onChange={(e) => setEditingReview(r => ({ ...r!, order: Number(e.target.value) }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex items-center gap-3.5 mt-4">
                <button
                  type="submit"
                  className="px-5 py-3 rounded-lg font-bold text-white bg-[var(--accent-blue)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  Save Review
                </button>
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-5 py-3 rounded-lg font-bold border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isTermModalOpen && editingTerm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 md:px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsTermModalOpen(false)} />
          <div className="relative w-full max-w-lg card-depth p-4 md:p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm md:text-base font-extrabold">{editingTerm.id ? "Edit Term" : "Add New Term"}</h3>

            <form onSubmit={handleTermSubmit} className="flex flex-col gap-3 md:gap-4 text-xs md:text-xs">
              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Tab</label>
                <select
                  value={editingTerm.tab || "syk"}
                  onChange={(e) => setEditingTerm(t => ({ ...t!, tab: e.target.value as TermItem["tab"] }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)]"
                >
                  <option value="syk">Syarat & Ketentuan</option>
                  <option value="kebijakan_pengguna">Kebijakan Pengguna</option>
                  <option value="kebijakan_privasi">Kebijakan Privasi</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Title (Indonesia)</label>
                <input
                  type="text"
                  required
                  value={editingTerm.title || ""}
                  onChange={(e) => setEditingTerm(t => ({ ...t!, title: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Title (English)</label>
                <input
                  type="text"
                  value={editingTerm.title_en || ""}
                  onChange={(e) => setEditingTerm(t => ({ ...t!, title_en: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Content (Indonesia)</label>
                <textarea
                  rows={4}
                  required
                  value={editingTerm.content || ""}
                  onChange={(e) => setEditingTerm(t => ({ ...t!, content: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] resize-y"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Content (English)</label>
                <textarea
                  rows={4}
                  value={editingTerm.content_en || ""}
                  onChange={(e) => setEditingTerm(t => ({ ...t!, content_en: e.target.value }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] resize-y"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Sorting Order</label>
                <input
                  type="number"
                  value={editingTerm.order || 1}
                  onChange={(e) => setEditingTerm(t => ({ ...t!, order: Number(e.target.value) }))}
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Tanggal Diperbarui</label>
                <input
                  type="text"
                  value={editingTerm.lastUpdated || ""}
                  onChange={(e) => setEditingTerm(t => ({ ...t!, lastUpdated: e.target.value }))}
                  placeholder="27 Oktober 2025"
                  className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                />
              </div>

              <div className="flex items-center gap-3.5 mt-4">
                <button
                  type="submit"
                  className="px-5 py-3 rounded-lg font-bold text-white bg-[var(--accent-blue)] hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  Save Term
                </button>
                <button
                  type="button"
                  onClick={() => setIsTermModalOpen(false)}
                  className="px-5 py-3 rounded-lg font-bold border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isPromoModalOpen && editingPromo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-3 md:px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsPromoModalOpen(false)} />
          <div className="relative w-full max-w-lg card-depth p-4 md:p-6 flex flex-col gap-4 max-h-[90vh] overflow-y-auto">
            <h3 className="text-sm md:text-base font-extrabold">
              {editingPromo.id?.startsWith("promo-") && !promoCodes.find(p => p.id === editingPromo.id)
                ? "Create Promo Code"
                : "Edit Promo Code"}
            </h3>

            <form onSubmit={async (e) => {
              e.preventDefault();
              if (!editingPromo || !editingPromo.code || !editingPromo.value) return;
              try {
                await savePromoCode({
                  id: editingPromo.id || "promo-" + Date.now(),
                  code: editingPromo.code.toUpperCase(),
                  type: editingPromo.type as "percent" | "nominal",
                  value: Number(editingPromo.value),
                  min_purchase: Number(editingPromo.min_purchase) || 0,
                  max_uses: Number(editingPromo.max_uses) || 0,
                  used_count: editingPromo.used_count || 0,
                  expires_at: editingPromo.expires_at || null,
                  is_active: editingPromo.is_active ?? true,
                  applicable_categories: editingPromo.applicable_categories || [],
                  created_at: editingPromo.created_at || new Date().toISOString()
                });
                setIsPromoModalOpen(false);
                setEditingPromo(null);
              } catch (err) {
                alert("Error saving promo code: " + err);
              }
            }} className="flex flex-col gap-3 md:gap-4 text-xs md:text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[var(--text-secondary)]">Kode Promo</label>
                  <input
                    type="text"
                    required
                    value={editingPromo.code || ""}
                    onChange={(e) => setEditingPromo(p => ({ ...p!, code: e.target.value.toUpperCase() }))}
                    className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[var(--text-secondary)]">Tipe Diskon</label>
                  <select
                    value={editingPromo.type || "percent"}
                    onChange={(e) => setEditingPromo(p => ({ ...p!, type: e.target.value as "percent" | "nominal" }))}
                    className="px-3.5 py-2.5 rounded-lg border bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)]"
                  >
                    <option value="percent">Percentage</option>
                    <option value="nominal">Fixed Amount</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[var(--text-secondary)]">Nilai Diskon</label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={editingPromo.value || 0}
                    onChange={(e) => setEditingPromo(p => ({ ...p!, value: Number(e.target.value) }))}
                    className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[var(--text-secondary)]">Min. Pembelian (IDR)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingPromo.min_purchase || 0}
                    onChange={(e) => setEditingPromo(p => ({ ...p!, min_purchase: Number(e.target.value) }))}
                    className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[var(--text-secondary)]">Maks. Pemakaian (0 = unlimited)</label>
                  <input
                    type="number"
                    min={0}
                    value={editingPromo.max_uses || 0}
                    onChange={(e) => setEditingPromo(p => ({ ...p!, max_uses: Number(e.target.value) }))}
                    className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-[var(--text-secondary)]">Kadaluwarsa</label>
                  <input
                    type="date"
                    value={editingPromo.expires_at ? editingPromo.expires_at.split("T")[0] : ""}
                    onChange={(e) => setEditingPromo(p => ({ ...p!, expires_at: e.target.value ? new Date(e.target.value).toISOString() : null }))}
                    className="px-3.5 py-2.5 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)]"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="font-bold text-[var(--text-secondary)]">Kategori (kosongkan untuk semua)</label>
                <select
                  multiple
                  value={editingPromo.applicable_categories || []}
                  onChange={(e) => {
                    const vals = Array.from(e.target.selectedOptions, opt => opt.value);
                    setEditingPromo(p => ({ ...p!, applicable_categories: vals }));
                  }}
                  className="px-3.5 py-2.5 rounded-lg border bg-[var(--bg-card)] text-[var(--text-primary)] border-[var(--border-color)] min-h-[120px]"
                >
                  <option value="minecraft-nexa">Shared Nexa</option>
                  <option value="minecraft-neon">Shared Neon</option>
                  <option value="minecraft-nano">Shared Nano</option>
                  <option value="private-atomic">Private Atomic</option>
                  <option value="private-catalyst">Private Catalyst</option>
                  <option value="private-spectrum">Private Spectrum</option>
                  <option value="bot">App Hosting</option>
                  <option value="web">Web Hosting</option>
                  <option value="terraria">Terraria Hosting</option>
                  <option value="samp">SAMP Hosting</option>
                  <option value="hytale">Hytale Hosting</option>
                  <option value="vps">Cloud VPS</option>
                  <option value="bare-metal">Bare Metal</option>
                </select>
                <p className="text-[9px] text-[var(--text-secondary)]">Tekan Ctrl/Cmd+klik untuk memilih beberapa. Kosongkan = berlaku untuk semua kategori.</p>
              </div>

              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingPromo.is_active ?? true}
                    onChange={(e) => setEditingPromo(p => ({ ...p!, is_active: e.target.checked }))}
                    className="w-4 h-4 accent-emerald-500"
                  />
                  <span className="font-bold text-[var(--text-secondary)]">Active</span>
                </label>
              </div>

              <div className="flex items-center gap-3.5 mt-4">
                <button
                  type="submit"
                  className="px-5 py-3 rounded-lg font-bold text-white bg-emerald-500 hover:opacity-90 active:scale-95 transition-all cursor-pointer"
                >
                  Save Promo Code
                </button>
                <button
                  type="button"
                  onClick={() => setIsPromoModalOpen(false)}
                  className="px-5 py-3 rounded-lg font-bold border border-[var(--border-color)] text-[var(--text-primary)] hover:bg-black/5 dark:hover:bg-white/5 transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const ComparisonEditor: React.FC<{
  category: string;
  data: ComparisonData;
  onSave: (data: ComparisonData) => Promise<void>;
}> = ({ category, data: initial, onSave }) => {
  const [open, setOpen] = useState(false);
  const [plans, setPlans] = useState(initial.plans.join(", "));
  const [note, setNote] = useState(initial.note || "");
  const [rows, setRows] = useState(initial.rows.map(r => ({ ...r, values: [...r.values] })));
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const planList = plans.split(",").map(s => s.trim()).filter(Boolean);

  const updateRowValue = (ri: number, vi: number, val: string) => {
    setRows(prev => {
      const next = [...prev];
      next[ri] = { ...next[ri], values: [...next[ri].values] };
      next[ri].values[vi] = val;
      return next;
    });
  };

  const addRow = () => {
    setRows(prev => [...prev, { feature: "", values: planList.map(() => "") }]);
  };

  const removeRow = (ri: number) => {
    setRows(prev => prev.filter((_, i) => i !== ri));
  };

  const syncPlanCount = () => {
    setRows(prev => prev.map(r => {
      const vals = [...r.values];
      while (vals.length < planList.length) vals.push("");
      if (vals.length > planList.length) vals.length = planList.length;
      return { ...r, values: vals };
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const adjustedRows = rows.map(r => {
        const vals = [...r.values];
        while (vals.length < planList.length) vals.push("");
        if (vals.length > planList.length) vals.length = planList.length;
        return { feature: r.feature, values: vals };
      });
      const payload: ComparisonData = { plans: planList, rows: adjustedRows };
      if (note.trim()) payload.note = note.trim();
      await onSave(payload);
      setSaveMsg({ ok: true, text: "Saved successfully!" });
    } catch (e) {
      console.error("Comparison save error:", e);
      setSaveMsg({ ok: false, text: "Save failed: " + (e instanceof Error ? e.message : "Unknown error") });
    }
    setSaving(false);
  };

  return (
    <div className={`card-depth overflow-hidden transition-all ${open ? "border-[var(--accent-blue)]/30" : ""}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full px-4 md:px-5 py-3.5 md:py-4 flex items-center justify-between cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-xs md:text-sm font-bold uppercase tracking-wider"
      >
        <span>{category} — {initial.plans.join(", ")}</span>
        <i className={`fas fa-chevron-down transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="px-4 md:px-5 pb-4 md:pb-5 pt-3 border-t border-[var(--border-color)] flex flex-col gap-4">
          
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[var(--text-secondary)]">Plan Names (comma separated)</label>
            <input
              type="text"
              value={plans}
              onChange={e => { setPlans(e.target.value); }}
              onBlur={syncPlanCount}
              className="px-3 py-2 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] text-xs font-mono"
            />
          </div>

          
          <div className="flex flex-col gap-1">
            <label className="text-[11px] font-bold text-[var(--text-secondary)]">Note</label>
            <input
              type="text"
              value={note}
              onChange={e => setNote(e.target.value)}
              className="px-3 py-2 rounded-lg border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] text-xs font-mono"
            />
          </div>

          
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold text-[var(--text-secondary)]">Feature Rows</span>
              <button onClick={addRow} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 text-emerald-500 text-[10px] font-bold hover:bg-emerald-500/20 transition-all">
                <i className="fas fa-plus mr-1" />Add Row
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[var(--border-color)]">
                    <th className="text-left py-2 pr-2 text-[10px] font-bold uppercase text-[var(--text-secondary)] w-[120px]">Feature</th>
                    {planList.map((p, i) => (
                      <th key={i} className="text-center py-2 px-1 text-[10px] font-bold uppercase text-[var(--accent-blue)] min-w-[100px]">{p || `Plan ${i + 1}`}</th>
                    ))}
                    <th className="w-10" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, ri) => (
                    <tr key={ri} className="border-b border-[var(--border-color)]/50">
                      <td className="py-1.5 pr-2">
                        <input
                          type="text"
                          value={row.feature}
                          onChange={e => {
                            setRows(prev => {
                              const next = [...prev];
                              next[ri] = { ...next[ri], feature: e.target.value };
                              return next;
                            });
                          }}
                          className="w-full px-2 py-1.5 rounded border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] text-[11px] font-bold uppercase"
                          placeholder="CPU"
                        />
                      </td>
                      {row.values.map((val, vi) => (
                        <td key={vi} className="py-1.5 px-1">
                          <input
                            type="text"
                            value={val}
                            onChange={e => updateRowValue(ri, vi, e.target.value)}
                            className="w-full px-2 py-1.5 rounded border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] text-[11px] font-mono text-center"
                            placeholder="—"
                          />
                        </td>
                      ))}
                      <td className="py-1.5 pl-1">
                        <button onClick={() => removeRow(ri)} className="p-1.5 rounded text-red-500 hover:bg-red-500/10 transition-all">
                          <i className="fas fa-trash-alt text-[10px]" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {rows.length === 0 && (
              <p className="text-[10px] font-mono text-[var(--text-secondary)] text-center py-4">No rows. Click "Add Row" to add a feature.</p>
            )}
          </div>

          
          <div className="flex items-center justify-between pt-2">
            {saveMsg && (
              <span className={`text-[11px] font-bold ${saveMsg.ok ? "text-emerald-500" : "text-red-500"}`}>
                <i className={`fas ${saveMsg.ok ? "fa-check-circle" : "fa-exclamation-circle"} mr-1.5`} />
                {saveMsg.text}
              </span>
            )}
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-2.5 bg-[var(--accent-blue)] text-white text-xs font-bold rounded-xl hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
            >
              {saving ? <i className="fas fa-spinner animate-spin mr-1.5" /> : <i className="fas fa-save mr-1.5" />}
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
