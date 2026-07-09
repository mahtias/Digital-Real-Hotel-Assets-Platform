import { NavLink, useNavigate } from "react-router-dom";
import { useAdminAuth } from "../context/AdminAuthContext";

const links = [
  { to: "/",                    label: "Dashboard",           icon: "🏠" },
  { to: "/kyc",                 label: "KYC Management",      icon: "🪪" },
  { to: "/kyc/status",          label: "KYC Status",          icon: "📋" },
  { to: "/users",               label: "Users",               icon: "👥" },
  { to: "/investments",         label: "Investments",         icon: "💎" },
  { to: "/bookings",            label: "Bookings",            icon: "🏨" },
  { to: "/revenue",             label: "Revenue Analytics",   icon: "💰" },
  { to: "/settlements",         label: "Payout Control",      icon: "🏦" },
  { to: "/settlements/history", label: "Settlement History",  icon: "📜" },
  { to: "/snapshot-performance",label: "Snapshot & Perf",     icon: "📊" },
  { to: "/oracle",              label: "Oracle & Engine",     icon: "⛓️" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { admin, logout } = useAdminAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-gray-900 border-r border-gray-800 flex flex-col
        transition-transform duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:relative lg:translate-x-0 lg:z-auto lg:shrink-0
      `}
    >
      {/* Logo + close button */}
      <div className="px-6 py-5 border-b border-gray-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">💎</span>
          <div>
            <p className="font-bold text-white text-sm">DRA Admin</p>
            <p className="text-xs text-gray-500">Control Center</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="lg:hidden text-gray-400 hover:text-white text-lg leading-none"
          aria-label="Close menu"
        >
          ✕
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {links.map(({ to, label, icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? "bg-brand-600 text-white"
                  : "text-gray-400 hover:bg-gray-800 hover:text-white"
              }`
            }
          >
            <span>{icon}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Admin info + logout */}
      <div className="px-4 py-4 border-t border-gray-800">
        <p className="text-xs text-gray-500 mb-1">Signed in as</p>
        <p className="text-sm font-medium text-white truncate">
          {admin?.firstName} {admin?.lastName}
        </p>
        <p className="text-xs text-gray-500 truncate mb-3">{admin?.email}</p>
        <button
          onClick={handleLogout}
          className="w-full text-left px-3 py-2 text-sm text-red-400 hover:bg-red-900/30 rounded-lg transition-colors"
        >
          Sign out
        </button>
      </div>
    </aside>
  );
}
