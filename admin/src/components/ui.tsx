// Shared CoreUI-style building blocks
import { ReactNode, ComponentType } from "react";
import { Link } from "react-router-dom";
import { IconChevronLeft, IconChevronRight } from "./Icons";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
      <div>
        <h1 className="text-2xl font-medium leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-medium-emphasis mt-0.5">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export type Tone = "primary" | "info" | "warning" | "danger" | "success" | "secondary" | "dark";

const TONE_BG: Record<Tone, string> = {
  primary: "bg-primary", info: "bg-info", warning: "bg-warning", danger: "bg-danger",
  success: "bg-success", secondary: "bg-secondary", dark: "bg-dark",
};
const TONE_TEXT: Record<Tone, string> = {
  primary: "text-primary", info: "text-info", warning: "text-warning", danger: "text-danger",
  success: "text-success", secondary: "text-secondary", dark: "text-dark",
};

/** Solid colored widget — CoreUI "WidgetStatsA" */
export function StatWidget({ tone, value, title, hint }: { tone: Tone; value: ReactNode; title: string; hint?: string }) {
  const fg = tone === "warning" ? "text-body" : "text-white";
  return (
    <div className={`relative overflow-hidden rounded-md shadow-card ${TONE_BG[tone]} ${fg}`}>
      <div className="px-4 pt-4 pb-3">
        <div className="text-2xl font-semibold leading-tight truncate">{value}</div>
        <div className="text-sm opacity-90">{title}</div>
      </div>
      {/* decorative sparkline, as in CoreUI widgets */}
      <svg viewBox="0 0 200 40" preserveAspectRatio="none" className="block w-full h-10 opacity-40" aria-hidden>
        <path d="M0 30 C 25 28, 35 12, 60 18 S 100 34, 125 22 S 165 6, 200 14 L200 40 L0 40 Z" fill="currentColor" fillOpacity=".25"/>
        <path d="M0 30 C 25 28, 35 12, 60 18 S 100 34, 125 22 S 165 6, 200 14" fill="none" stroke="currentColor" strokeWidth="2"/>
      </svg>
      {hint && <div className="absolute top-4 right-4 text-xs opacity-75">{hint}</div>}
    </div>
  );
}

/** White card with colored icon block — CoreUI "WidgetStatsF" */
export function IconWidget({ tone, icon: Icon, title, desc, to }: {
  tone: Tone; icon: ComponentType<{ size?: number }>; title: string; desc: string; to: string;
}) {
  return (
    <Link to={to} className="card flex items-stretch overflow-hidden no-underline group hover:border-primary/40 transition-colors">
      <div className={`flex items-center justify-center w-16 shrink-0 ${TONE_BG[tone]} ${tone === "warning" ? "text-body" : "text-white"}`}>
        <Icon size={24} />
      </div>
      <div className="p-3 min-w-0">
        <div className={`text-sm font-semibold ${TONE_TEXT[tone]}`}>{title}</div>
        <div className="text-xs text-medium-emphasis mt-0.5 line-clamp-2">{desc}</div>
      </div>
    </Link>
  );
}

/** Small metric tile used inside cards — CoreUI "border-start" callout */
export function Callout({ tone, label, value }: { tone: Tone; label: string; value: ReactNode }) {
  const border: Record<Tone, string> = {
    primary: "border-primary", info: "border-info", warning: "border-warning", danger: "border-danger",
    success: "border-success", secondary: "border-secondary", dark: "border-dark",
  };
  return (
    <div className={`border-l-4 ${border[tone]} pl-3 py-1`}>
      <div className="text-xs text-medium-emphasis truncate">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

export function Pagination({ page, totalPages, onChange, summary }: {
  page: number; totalPages: number; onChange: (p: number) => void; summary?: ReactNode;
}) {
  const pages = Math.max(totalPages, 1);
  const start = Math.max(1, Math.min(page - 2, pages - 4));
  const nums  = Array.from({ length: Math.min(5, pages) }, (_, i) => start + i);
  const link  = "min-w-[2.25rem] h-9 px-2 inline-flex items-center justify-center text-sm border border-line -ml-px first:ml-0 first:rounded-l-md last:rounded-r-md transition-colors disabled:text-body-muted/60 disabled:bg-white disabled:cursor-not-allowed";

  return (
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="text-sm text-medium-emphasis">{summary ?? `Page ${page} of ${pages}`}</div>
      <nav className="flex" aria-label="Pagination">
        <button className={`${link} bg-white text-primary hover:bg-light`} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Previous">
          <IconChevronLeft size={16} />
        </button>
        {nums.map(n => (
          <button key={n} onClick={() => onChange(n)}
            className={`${link} ${n === page ? "bg-primary border-primary text-white relative z-10" : "bg-white text-primary hover:bg-light"}`}>
            {n}
          </button>
        ))}
        <button className={`${link} bg-white text-primary hover:bg-light`} disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Next">
          <IconChevronRight size={16} />
        </button>
      </nav>
    </div>
  );
}

export function Loading({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12 text-medium-emphasis">
      <span className="spinner" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="py-12 text-center text-sm text-medium-emphasis">{children}</div>;
}

export const shortAddr = (a?: string | null) => (a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "—");
