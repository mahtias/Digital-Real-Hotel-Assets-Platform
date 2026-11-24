import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";
import { breadcrumbFor } from "./nav";
import { IconBell, IconEnvelope, IconList, IconLogout, IconMenu, IconUser } from "./Icons";

export default function Header({ onToggleSidebar }: { onToggleSidebar: () => void }) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) => { if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false); };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const initials = `${admin?.firstName?.[0] ?? ""}${admin?.lastName?.[0] ?? ""}`.toUpperCase() || "A";
  const trail = breadcrumbFor(pathname);
  const handleLogout = () => { logout(); navigate("/login"); };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-line">
      {/* Top row */}
      <div className="flex items-center h-16 px-3 sm:px-4 gap-2">
        <button onClick={onToggleSidebar} className="btn btn-ghost px-2 -ml-1" aria-label="Toggle sidebar">
          <IconMenu size={22} />
        </button>

        <nav className="hidden md:flex items-center gap-1 ml-2 text-sm">
          <Link to="/" className="px-2 py-1 text-body-muted hover:text-body no-underline">Dashboard</Link>
          <Link to="/users" className="px-2 py-1 text-body-muted hover:text-body no-underline">Users</Link>
          <Link to="/settlements" className="px-2 py-1 text-body-muted hover:text-body no-underline">Payouts</Link>
        </nav>

        <div className="ml-auto flex items-center gap-1">
          <Link to="/kyc" className="btn btn-ghost px-2" title="Pending KYC"><IconBell size={20} /></Link>
          <Link to="/kyc/status" className="hidden sm:inline-flex btn btn-ghost px-2" title="KYC status"><IconList size={20} /></Link>
          <button className="hidden sm:inline-flex btn btn-ghost px-2" title="Messages" type="button"><IconEnvelope size={20} /></button>

          <div className="h-6 w-px bg-line mx-2" />

          {/* User dropdown */}
          <div className="relative" ref={menuRef}>
            <button onClick={() => setMenuOpen(o => !o)} className="flex items-center gap-2 rounded-full focus:outline-none focus-visible:ring-4 focus-visible:ring-primary/25" aria-haspopup="menu" aria-expanded={menuOpen}>
              <span className="relative inline-flex items-center justify-center w-9 h-9 rounded-full bg-primary text-white text-sm font-semibold">
                {initials}
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-white" />
              </span>
            </button>
            {menuOpen && (
              <div role="menu" className="absolute right-0 mt-2 w-60 card py-0 overflow-hidden z-50">
                <div className="px-4 py-2 bg-light border-b border-line text-xs font-semibold text-body-muted uppercase tracking-wide">Account</div>
                <div className="px-4 py-3 border-b border-line">
                  <div className="text-sm font-medium truncate">{admin?.firstName} {admin?.lastName}</div>
                  <div className="text-xs text-medium-emphasis truncate">{admin?.email}</div>
                  <span className="badge badge-primary mt-2">{admin?.role ?? "ADMIN"}</span>
                </div>
                <button type="button" className="w-full flex items-center gap-2 px-4 py-2 text-sm hover:bg-light text-left" disabled>
                  <IconUser size={16} className="text-body-muted" /> Profile
                </button>
                <button type="button" onClick={handleLogout} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-danger-subtle text-left border-t border-line">
                  <IconLogout size={16} /> Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Breadcrumb row */}
      <div className="flex items-center h-11 px-4 border-t border-line text-sm">
        <ol className="flex items-center gap-2 min-w-0">
          <li><Link to="/" className="text-primary no-underline hover:underline">Home</Link></li>
          {trail.map((c, i) => (
            <li key={i} className="flex items-center gap-2 min-w-0">
              <span className="text-body-muted/60">/</span>
              <span className={`truncate ${i === trail.length - 1 ? "text-body-muted" : "text-body"}`}>{c}</span>
            </li>
          ))}
        </ol>
      </div>
    </header>
  );
}
