import { useEffect, useState } from "react";
import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { useAdminAuth } from "../context/AdminAuthContext";

const isDesktop = () => window.matchMedia("(min-width: 1024px)").matches;

export default function AdminLayout() {
  const { token, isLoading } = useAdminAuth();
  const [sidebarOpen, setSidebarOpen] = useState(() => isDesktop() && localStorage.getItem("dra.sidebar.hidden") !== "1");
  const [narrow, setNarrow] = useState(() => localStorage.getItem("dra.sidebar.narrow") === "1");

  useEffect(() => { localStorage.setItem("dra.sidebar.narrow", narrow ? "1" : "0"); }, [narrow]);

  const toggleSidebar = () => setSidebarOpen(o => {
    if (isDesktop()) localStorage.setItem("dra.sidebar.hidden", o ? "1" : "0");
    return !o;
  });
  const closeOnMobile = () => { if (!isDesktop()) setSidebarOpen(false); };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-light">
        <span className="spinner" />
      </div>
    );
  }

  if (!token) return <Navigate to="/login" replace />;

  return (
    <div className="flex min-h-screen bg-light">
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-dark/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      <Sidebar
        isOpen={sidebarOpen}
        narrow={narrow}
        onClose={closeOnMobile}
        onToggleNarrow={() => setNarrow(n => !n)}
      />

      <div className="flex-1 flex flex-col min-w-0">
        <Header onToggleSidebar={toggleSidebar} />

        <main className="flex-1 px-3 sm:px-6 py-6">
          <div className="max-w-[1400px] mx-auto">
            <Outlet />
          </div>
        </main>

        <footer className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 h-12 bg-white border-t border-line text-sm">
          <div>
            <span className="text-primary font-medium">DigiRealAssets</span>
            <span className="text-medium-emphasis"> © {new Date().getFullYear()} Admin Panel</span>
          </div>
          <div className="text-medium-emphasis">Hotel tokenization on Base</div>
        </footer>
      </div>
    </div>
  );
}
