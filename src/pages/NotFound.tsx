import { useTranslation } from "react-i18next";
import { PageTitle } from "../components/PageTitle";
import { Link } from "react-router-dom";

export const NotFound = () => {
  const { t } = useTranslation();
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
      <div className="w-20 h-20 flex items-center justify-center text-3xl border-2 rounded-2xl mb-6" style={{ borderColor: 'var(--accent-blue)', color: 'var(--accent-blue)', backgroundColor: 'var(--accent-glow)' }}>
        <i className="fas fa-map-signs" />
      </div>
      <PageTitle text="404" className="text-5xl font-black mb-3 tracking-tight" />
      <p className="text-sm text-[var(--text-secondary)] mb-8 max-w-md font-light leading-relaxed">
        {t('not_found.desc')}
      </p>
      <Link
        to="/"
        className="px-8 py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-xl shadow-[rgba(0,212,255,0.15)]"
      >
        <i className="fas fa-arrow-left mr-2" />
        {t('not_found.back')}
      </Link>
    </div>
  );
};
