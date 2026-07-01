import React, { Component, type ReactNode, type ErrorInfo } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 text-center">
          <div
            className="w-20 h-20 flex items-center justify-center text-3xl border-2 rounded-2xl mb-6"
            style={{
              borderColor: "var(--accent-blue)",
              color: "var(--accent-blue)",
              backgroundColor: "var(--accent-glow)",
            }}
          >
            <i className="fas fa-exclamation-triangle" />
          </div>
          <h1 className="text-3xl font-black mb-3 tracking-tight" style={{ color: "var(--text-primary)" }}>
            Ada yang salah
          </h1>
          <p className="text-sm mb-8 max-w-md font-light leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Terjadi kesalahan saat memuat halaman. Silakan coba lagi.
          </p>
          <div className="flex gap-3">
            <a
              href="/"
              className="px-8 py-3.5 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 transition-all duration-300 shadow-xl"
              style={{ boxShadow: "rgba(0,212,255,0.15) 0px 10px 30px" }}
            >
              <i className="fas fa-rotate-right mr-2" />
              Coba Lagi
            </a>
            <a
              href="/"
              className="px-8 py-3.5 rounded-xl text-xs font-bold transition-all duration-300 border"
              style={{
                color: "var(--text-primary)",
                borderColor: "var(--border-color)",
              }}
            >
              <i className="fas fa-arrow-left mr-2" />
              Kembali ke Beranda
            </a>
          </div>
          {this.state.error && (
            <details className="mt-6 max-w-lg text-left" style={{ color: "var(--text-secondary)" }}>
              <summary className="text-[10px] font-mono cursor-pointer opacity-50 hover:opacity-100">
                Detail Error
              </summary>
              <pre className="mt-2 text-[10px] font-mono leading-relaxed p-3 rounded-lg overflow-auto max-h-32" style={{ backgroundColor: "var(--card-bg)", border: "1px solid var(--border-color)" }}>
                {this.state.error.message}
              </pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
