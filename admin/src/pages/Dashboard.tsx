import { useEffect, useState } from "react";
import { useAdminAuth, adminApi } from "../context/AdminAuthContext";
import { IconWidget, PageHeader, StatWidget } from "../components/ui";
import {
  IconShield, IconUsers, IconDiamond, IconList, IconBuilding, IconDollar,
  IconBank, IconHistory, IconChart, IconLink,
} from "../components/Icons";

const modules = [
  { to: "/kyc",                  title: "KYC Management",         desc: "Review, approve, and reject investor KYC applications.",               tone: "primary",   icon: IconShield },
  { to: "/users",                title: "Users",                  desc: "View all users, wallets, account status, and activity.",               tone: "info",      icon: IconUsers },
  { to: "/investments",          title: "Investments",            desc: "Track all investments across hotel asset projects.",                   tone: "success",   icon: IconDiamond },
  { to: "/kyc/status",           title: "KYC Status Overview",    desc: "Monitor Approved, Pending, Rejected, and Under Review KYC.",           tone: "warning",   icon: IconList },
  { to: "/bookings",             title: "Bookings",               desc: "View hotel bookings, payment status, PMS sync, and transactions.",     tone: "info",      icon: IconBuilding },
  { to: "/revenue",              title: "Revenue Analytics",      desc: "Track hotel earnings, pending revenue, and payout summaries.",         tone: "danger",    icon: IconDollar },
  { to: "/settlements",          title: "Payout Control",         desc: "Trigger weekly blockchain USDC payouts to hotel wallets.",             tone: "warning",   icon: IconBank },
  { to: "/settlements/history",  title: "Settlement History",     desc: "Audit all payouts, TX hashes, hotel earnings, and payment history.",   tone: "primary",   icon: IconHistory },
  { to: "/snapshot-performance", title: "Snapshot & Performance", desc: "Capture investor snapshots and record occupancy, RevPAR, and yield.",   tone: "dark",      icon: IconChart },
  { to: "/oracle",               title: "Oracle & Engine",        desc: "Monitor Chainlink oracle and thirdweb Engine status.",                 tone: "secondary", icon: IconLink },
] as const;

type Stats = { users?: number; pendingKyc?: number; invested?: number; bookings?: number };

export default function Dashboard() {
  const { admin } = useAdminAuth();
  const [stats, setStats] = useState<Stats>({});

  useEffect(() => {
    const api = adminApi();
    Promise.allSettled([
      api.get("/admin/users", { params: { page: 1, limit: 1 } }),
      api.get("/kyc/admin/pending"),
      api.get("/admin/investments", { params: { page: 1, limit: 1 } }),
      api.get("/admin/bookings", { params: { page: 1, limit: 1 } }),
    ]).then(([u, k, inv, b]) => {
      setStats({
        users:      u.status   === "fulfilled" ? u.value.data.pagination?.total : undefined,
        pendingKyc: k.status   === "fulfilled" ? (k.value.data.data ?? []).length : undefined,
        invested:   inv.status === "fulfilled" ? inv.value.data.stats?.totalInvested : undefined,
        bookings:   b.status   === "fulfilled" ? b.value.data.pagination?.total : undefined,
      });
    });
  }, []);

  const fmt = (v: number | undefined, money = false) =>
    v === undefined || v === null ? "—" : money
      ? `$${Number(v).toLocaleString(undefined, { maximumFractionDigits: 0 })}`
      : Number(v).toLocaleString();

  return (
    <>
      <PageHeader title={`Welcome back, ${admin?.firstName ?? "Admin"}`} subtitle="DRA Admin Control Center" />

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatWidget tone="primary" value={fmt(stats.users)}          title="Registered users" />
        <StatWidget tone="info"    value={fmt(stats.invested, true)} title="Total invested (USDC)" />
        <StatWidget tone="warning" value={fmt(stats.pendingKyc)}     title="Pending KYC reviews" />
        <StatWidget tone="danger"  value={fmt(stats.bookings)}       title="Hotel bookings" />
      </div>

      <div className="card">
        <div className="card-header">
          <div>
            <h4 className="card-title">Modules</h4>
            <div className="text-xs font-normal text-medium-emphasis">Jump straight into any area of the platform</div>
          </div>
        </div>
        <div className="card-body grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {modules.map(m => <IconWidget key={m.to} {...m} />)}
        </div>
      </div>
    </>
  );
}
