import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NAV, isActivePath } from "./nav";
import { IconChevronDown, IconChevronLeft, IconClose, IconLogo } from "./Icons";

interface SidebarProps {
  isOpen: boolean;          // shown (mobile overlay / desktop visible)
  narrow: boolean;          // desktop icon-only mode
  onClose: () => void;      // closes mobile overlay after navigation
  onToggleNarrow: () => void;
}

const linkBase =
  "flex items-center gap-3 h-11 px-4 rounded-md text-[0.9375rem] transition-colors hover:bg-white/[0.075] hover:text-white";

export default function Sidebar({ isOpen, narrow, onClose, onToggleNarrow }: SidebarProps) {
  const { pathname } = useLocation();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(
      NAV.filter(n => n.type === "group").map(n =>
        [n.label, n.type === "group" && n.children.some(c => isActivePath(c.to, pathname))]
      )
    )
  );

  const hideWhenNarrow = narrow ? "lg:hidden" : "";
  const centerWhenNarrow = narrow ? "lg:justify-center lg:px-0" : "";
  const width = narrow ? "lg:w-16" : "lg:w-64";
  const hiddenDesktop = narrow ? "lg:-ml-16" : "lg:-ml-64";

  return (
    <aside
      aria-label="Sidebar"
      className={`
        fixed inset-y-0 left-0 z-50 w-64 ${width} flex flex-col bg-dark text-white shadow-xl
        transition-[transform,width,margin] duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:sticky lg:top-0 lg:h-screen lg:z-auto lg:shrink-0 lg:shadow-none lg:translate-x-0
        ${isOpen ? "lg:ml-0" : hiddenDesktop}
      `}
    >
      {/* Brand */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-white/10 shrink-0">
        <Link to="/" className={`flex items-center gap-2.5 min-w-0 text-white no-underline ${narrow ? "lg:mx-auto" : ""}`}>
          <IconLogo size={30} className="shrink-0" />
          <div className={`min-w-0 leading-tight ${hideWhenNarrow}`}>
            <div className="font-semibold tracking-wide">DIGIREAL<span className="font-light opacity-70">ASSETS</span></div>
            <div className="text-[0.68rem] uppercase tracking-wider text-white/40">Admin Control Center</div>
          </div>
        </Link>
        <button onClick={onClose} className="lg:hidden text-white/60 hover:text-white" aria-label="Close menu">
          <IconClose size={20} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto overflow-x-hidden p-2">
        {NAV.map((item, i) => {
          if (item.type === "title") {
            return narrow ? (
              <div key={i} className="lg:my-3 lg:mx-3 lg:border-t lg:border-white/10">
                <div className="lg:hidden px-4 pt-4 pb-2 text-[0.7rem] font-bold uppercase tracking-wider text-white/40">{item.label}</div>
              </div>
            ) : (
              <div key={i} className="px-4 pt-4 pb-2 text-[0.7rem] font-bold uppercase tracking-wider text-white/40">{item.label}</div>
            );
          }

          if (item.type === "link") {
            const Icon = item.icon;
            const active = isActivePath(item.to, pathname);
            return (
              <Link key={item.to} to={item.to} onClick={onClose} title={narrow ? item.label : undefined}
                className={`${linkBase} ${centerWhenNarrow} no-underline ${active ? "bg-white/[0.05] text-white" : "text-white/60"}`}>
                <Icon size={20} className="shrink-0" />
                <span className={`truncate ${hideWhenNarrow}`}>{item.label}</span>
              </Link>
            );
          }

          // Collapsible group (CoreUI nav-group)
          const Icon = item.icon;
          const groupActive = item.children.some(c => isActivePath(c.to, pathname));
          const open = !!openGroups[item.label];
          return (
            <div key={item.label} className={`rounded-md ${open && !narrow ? "bg-black/20" : ""}`}>
              <button
                type="button"
                title={narrow ? item.label : undefined}
                aria-expanded={open}
                onClick={() => {
                  if (narrow) { onToggleNarrow(); setOpenGroups(g => ({ ...g, [item.label]: true })); }
                  else setOpenGroups(g => ({ ...g, [item.label]: !g[item.label] }));
                }}
                className={`${linkBase} ${centerWhenNarrow} w-full ${groupActive ? "text-white" : "text-white/60"}`}
              >
                <Icon size={20} className="shrink-0" />
                <span className={`flex-1 text-left truncate ${hideWhenNarrow}`}>{item.label}</span>
                <IconChevronDown size={14} className={`transition-transform ${open ? "rotate-180" : ""} ${hideWhenNarrow}`} />
              </button>
              {open && (
                <div className={`pb-1 ${hideWhenNarrow}`}>
                  {item.children.map(c => {
                    const active = isActivePath(c.to, pathname);
                    return (
                      <Link key={c.to} to={c.to} onClick={onClose}
                        className={`flex items-center gap-3 h-10 pl-12 pr-4 rounded-md text-sm no-underline transition-colors hover:bg-white/[0.075] hover:text-white ${active ? "bg-white/[0.05] text-white" : "text-white/60"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-primary-subtle" : "bg-white/40"}`} />
                        {c.label}
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar footer toggler (narrow / unfoldable) */}
      <div className="hidden lg:flex h-12 items-center justify-end border-t border-white/10 shrink-0">
        <button onClick={onToggleNarrow}
          className="h-full w-16 flex items-center justify-center text-white/40 hover:text-white hover:bg-white/5 transition-colors"
          aria-label={narrow ? "Expand sidebar" : "Collapse sidebar"}>
          <IconChevronLeft size={18} className={`transition-transform ${narrow ? "rotate-180" : ""}`} />
        </button>
      </div>
    </aside>
  );
}
