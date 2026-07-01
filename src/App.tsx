import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider } from "./context/LanguageContext";
import { AuthProvider } from "./context/AuthContext";

import { HelmetProvider } from "react-helmet-async";
import { SeoHelmet } from "./components/SeoHelmet";
import { JsonLd } from "./components/JsonLd";
import { Navbar } from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";
import { CartModal } from "./components/CartModal";
import { BackToTop } from "./components/BackToTop";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { Plan } from "./hooks/useFirestore";

const Home = lazy(() => import("./pages/Home").then(m => ({ default: m.Home })));
const GameHosting = lazy(() => import("./pages/GameHosting").then(m => ({ default: m.GameHosting })));
const SharedHosting = lazy(() => import("./pages/MinecraftHosting").then(m => ({ default: m.SharedHosting })));
const PrivateHosting = lazy(() => import("./pages/PrivateHosting").then(m => ({ default: m.PrivateHosting })));
const AppHosting = lazy(() => import("./pages/BotHosting").then(m => ({ default: m.BotHosting })));
const WebHosting = lazy(() => import("./pages/WebHosting").then(m => ({ default: m.WebHosting })));
const TerrariaHosting = lazy(() => import("./pages/TerrariaHosting").then(m => ({ default: m.TerrariaHosting })));
const SampHosting = lazy(() => import("./pages/SampHosting").then(m => ({ default: m.SampHosting })));
const HytaleHosting = lazy(() => import("./pages/HytaleHosting").then(m => ({ default: m.HytaleHosting })));
const CloudVPS = lazy(() => import("./pages/CloudVPS").then(m => ({ default: m.CloudVPS })));
const BareMetal = lazy(() => import("./pages/BareMetal").then(m => ({ default: m.default })));
const About = lazy(() => import("./pages/About").then(m => ({ default: m.About })));
const Contact = lazy(() => import("./pages/Contact").then(m => ({ default: m.Contact })));
const Hardware = lazy(() => import("./pages/Hardware").then(m => ({ default: m.Hardware })));
const AdminLogin = lazy(() => import("./pages/AdminLogin").then(m => ({ default: m.AdminLogin })));
const AdminDashboard = lazy(() => import("./pages/AdminDashboard").then(m => ({ default: m.AdminDashboard })));
const HostComparison = lazy(() => import("./pages/HostComparison").then(m => ({ default: m.HostComparison })));
const Sponsor = lazy(() => import("./pages/Sponsor").then(m => ({ default: m.Sponsor })));
const SponsorApply = lazy(() => import("./pages/SponsorApply").then(m => ({ default: m.SponsorApply })));
const Terms = lazy(() => import("./pages/Terms").then(m => ({ default: m.Terms })));
const Sla = lazy(() => import("./pages/Sla").then(m => ({ default: m.Sla })));
const NotFound = lazy(() => import("./pages/NotFound").then(m => ({ default: m.NotFound })));

const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: "instant" });
    });
  }, [pathname]);
  return null;
};

const BodyOverflowGuard: React.FC = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    document.body.style.overflow = "";
  }, [pathname]);
  return null;
};

export default function App() {
  const { t } = useTranslation();
  const [cartItems, setCartItems] = useState<Plan[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleAddToCart = (plan: Plan) => {
    setCartItems((prev) => [...prev, plan]);
    setIsCartOpen(true);
  };

  const handleRemoveItem = (index: number) => {
    setCartItems((prev) => prev.filter((_, idx) => idx !== index));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  return (
    <Router>
      <ThemeProvider>
        <LanguageProvider>
          <AuthProvider>
            <HelmetProvider>
            <SeoHelmet />
            <JsonLd />
            <JsonLd />
            <ScrollToTop />
            <BodyOverflowGuard />
            <ErrorBoundary>
            <div className="min-h-screen flex flex-col transition-colors duration-300 relative">
              <div className="ambient-bg">
                <div className="ambient-glow ambient-glow-1" />
                <div className="ambient-glow ambient-glow-2" />
                <div className="ambient-glow ambient-glow-3" />
                <div className="ambient-glow ambient-glow-4" />
                <div className="ambient-glow ambient-glow-5" />
              </div>
              <Navbar
                cartCount={cartItems.length}
                onOpenCart={() => setIsCartOpen(true)}
                onToggleSidebar={() => setIsSidebarOpen(true)}
              />

              <Sidebar
                isOpen={isSidebarOpen}
                onClose={() => setIsSidebarOpen(false)}
              />

              <CartModal
                isOpen={isCartOpen}
                onClose={() => setIsCartOpen(false)}
                cartItems={cartItems}
                onRemoveItem={handleRemoveItem}
                onClearCart={handleClearCart}
              />

              <div className="flex-grow">
                <Suspense fallback={
                  <div className="min-h-[70vh] flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-8 h-8 border-2 border-[var(--accent-blue)] border-t-transparent rounded-full animate-spin" />
                      <span className="text-[10px] font-mono font-bold text-[var(--text-secondary)] uppercase tracking-widest">{t("common.loading")}</span>
                    </div>
                  </div>
                }>
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/game-hosting" element={<GameHosting />} />
                    <Route path="/shared-hosting" element={<SharedHosting onAddToCart={handleAddToCart} />} />
                    <Route path="/private-hosting" element={<PrivateHosting onAddToCart={handleAddToCart} />} />
                    <Route path="/app-hosting" element={<AppHosting onAddToCart={handleAddToCart} />} />
                    <Route path="/web-hosting" element={<WebHosting onAddToCart={handleAddToCart} />} />
                    <Route path="/terraria-hosting" element={<TerrariaHosting onAddToCart={handleAddToCart} />} />
                    <Route path="/samp-hosting" element={<SampHosting onAddToCart={handleAddToCart} />} />
                    <Route path="/hytale-hosting" element={<HytaleHosting onAddToCart={handleAddToCart} />} />
                    <Route path="/bare-metal" element={<BareMetal />} />
                    <Route path="/cloud-vps" element={<CloudVPS />} />
                    <Route path="/about" element={<About />} />
                    <Route path="/contact" element={<Contact />} />
                    <Route path="/hardware" element={<Hardware />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/host-comparison" element={<HostComparison />} />
                    <Route path="/sponsor" element={<Sponsor />} />
                    <Route path="/sponsor/apply" element={<SponsorApply />} />
                    <Route path="/terms" element={<Terms />} />
                    <Route path="/sla" element={<Sla />} />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </div>

              <Footer />
              <BackToTop />
            </div>
            </ErrorBoundary>
            </HelmetProvider>
          </AuthProvider>
        </LanguageProvider>
      </ThemeProvider>
    </Router>
  );
}
