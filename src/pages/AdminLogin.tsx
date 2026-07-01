import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { ADMIN_EMAILS } from "../firebase/config";
import { useTranslation } from "react-i18next";
import { PageTitle } from "../components/PageTitle";

export const AdminLogin: React.FC = () => {
  const { t } = useTranslation();
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authError, setAuthError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetMode, setResetMode] = useState(false);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      if (ADMIN_EMAILS.includes(user.email || "")) {
        navigate("/admin");
      }
    }
  }, [user, loading, navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/admin");
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error("Admin auth error:", error);
      if (error.code === "auth/user-not-found" && ADMIN_EMAILS.includes(email)) {
        try {
          await createUserWithEmailAndPassword(auth, email, password);
          navigate("/admin");
          return;
        } catch {
          setAuthError(t('admin.login_error_create'));
        }
      } else if (error.code === "auth/invalid-credential" || error.code === "auth/wrong-password") {
        setAuthError(t('admin.login_error_invalid'));
      } else if (error.code === "auth/too-many-requests") {
        setAuthError(t('admin.login_error_too_many'));
      } else if (error.code === "auth/email-already-in-use") {
        setAuthError(t('admin.login_error_invalid'));
      } else {
        setAuthError(t('admin.login_error_generic') + (error.message || "Kesalahan tidak dikenal."));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    setIsSubmitting(true);

    try {
      await sendPasswordResetEmail(auth, email);
      setResetSent(true);
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error("Reset password error:", error);
      if (error.code === "auth/user-not-found") {
        setAuthError(t('admin.reset_error_not_found'));
      } else if (error.code === "auth/invalid-email") {
        setAuthError(t('admin.reset_error_invalid_email'));
      } else {
        setAuthError(t('admin.reset_error_generic'));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-xs font-bold text-[var(--text-secondary)]">
        <i className="fas fa-spinner animate-spin mr-2" /> {t('admin.loading_auth')}
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-[var(--bg-primary)] pt-24 pb-16 animate-fade-in">
      <div className="w-full max-w-md p-8 card-depth flex flex-col gap-6">
        
        <div className="text-center flex flex-col items-center gap-2">
          <img
            src="/logo.png"
            alt="TinnzStore Logo"
            className="h-10 md:h-12 object-contain"
            referrerPolicy="no-referrer"
          />
          <PageTitle text={t('admin.login_title')} className="text-xl font-extrabold" />
          <p className="text-xs text-[var(--text-secondary)]">
            {t('admin.login_desc')}
          </p>
        </div>

        {authError && (
          <div className="p-4 rounded-xl border bg-red-500/10 border-red-500/20 text-red-400 text-xs leading-relaxed flex items-center gap-2.5">
            <i className="fas fa-exclamation-circle text-sm" />
            <span>{authError}</span>
          </div>
        )}

        {!loading && user && !ADMIN_EMAILS.includes(user.email || "") && (
          <div className="p-4 rounded-xl border bg-amber-500/10 border-amber-500/20 text-amber-400 text-xs leading-relaxed flex flex-col gap-3">
            <div className="flex items-start gap-2.5">
              <i className="fas fa-exclamation-triangle text-sm mt-0.5" />
              <div>
                <p className="font-bold">{t('admin.login_wrong_account')}</p>
                <p className="mt-1 opacity-80">{user.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="self-start px-4 py-2 rounded-lg text-[10px] font-bold border border-amber-500/30 text-amber-400 hover:bg-amber-500/10 transition-all"
            >
              <i className="fas fa-sign-out-alt mr-1.5" /> {t('admin.login_switch')}
            </button>
          </div>
        )}

        {resetMode ? (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{t('admin.login_email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tinnzstore.id@gmail.com"
                className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-[var(--accent-blue)] outline-none font-mono"
              />
            </div>
            {resetSent ? (
              <div className="p-4 rounded-xl border bg-emerald-500/10 border-emerald-500/20 text-emerald-400 text-xs leading-relaxed flex items-center gap-2.5">
                <i className="fas fa-check-circle text-sm" />
                <span>{t('admin.reset_sent')}</span>
              </div>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl text-xs font-bold text-center text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-xl shadow-[rgba(0,212,255,0.15)] flex items-center justify-center gap-2 mt-2 cursor-pointer btn-depth"
              >
                {isSubmitting ? (
                  <>
                    <i className="fas fa-spinner animate-spin" />
                    <span>{t('admin.reset_sending')}</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane" />
                    <span>{t('admin.reset_send')}</span>
                  </>
                )}
              </button>
            )}
            <button
              type="button"
              onClick={() => { setResetMode(false); setResetSent(false); setAuthError(""); }}
              className="text-[10px] text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors text-center"
            >
              <i className="fas fa-arrow-left mr-1" /> {t('admin.reset_back')}
            </button>
          </form>
        ) : (
          <form onSubmit={handleAuth} className="flex flex-col gap-4.5">
            <div className="flex flex-col gap-1.5">
              <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{t('admin.login_email')}</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tinnzstore.id@gmail.com"
                className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-[var(--accent-blue)] outline-none font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">{t('admin.login_password')}</label>
                <button
                  type="button"
                  onClick={() => { setResetMode(true); setAuthError(""); }}
                  className="text-[9px] text-[var(--text-secondary)] hover:text-[var(--accent-blue)] transition-colors"
                >
                  {t('admin.login_forgot')}
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl text-xs border bg-transparent text-[var(--text-primary)] border-[var(--border-color)] focus:border-[var(--accent-blue)] outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl text-xs font-bold text-center text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-xl shadow-[rgba(0,212,255,0.15)] flex items-center justify-center gap-2 mt-2 cursor-pointer btn-depth"
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner animate-spin" />
                  <span>{t('admin.login_verifying')}</span>
                </>
              ) : (
                <>
                  <i className="fas fa-sign-in-alt" />
                  <span>{t('admin.login_submit')}</span>
                </>
              )}
            </button>
          </form>
        )}

        <div className="flex flex-col gap-3 text-center">
          <span className="text-[10px] text-[var(--text-secondary)] italic leading-normal border-t pt-3 border-[var(--border-color)]">
            {t('admin.login_footer')}
          </span>
        </div>
      </div>
    </div>
  );
};
