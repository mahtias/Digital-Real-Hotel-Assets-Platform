import { useAdminAuth } from "../context/AdminAuthContext";

const cards = [
  { href: "/kyc",                  label: "KYC Management",       desc: "Review, approve, and reject investor KYC applications.",                           color: "from-blue-600 to-blue-800",      icon: "🪪" },
  { href: "/users",                label: "Users",                 desc: "View all users, wallets, account status, and activity.",                           color: "from-purple-600 to-purple-800",  icon: "👥" },
  { href: "/investments",          label: "Investments",           desc: "Track all investments across hotel asset projects.",                                color: "from-emerald-600 to-emerald-800",icon: "💎" },
  { href: "/kyc/status",           label: "KYC Status Overview",   desc: "Monitor Approved, Pending, Rejected, and Under Review KYC.",                       color: "from-orange-500 to-orange-700",  icon: "📋" },
  { href: "/bookings",             label: "Bookings",              desc: "View hotel bookings, payment status, PMS sync, and transactions.",                  color: "from-cyan-600 to-cyan-800",      icon: "🏨" },
  { href: "/revenue",              label: "Revenue Analytics",     desc: "Track hotel earnings, pending revenue, and payout summaries.",                      color: "from-pink-600 to-rose-700",      icon: "💰" },
  { href: "/settlements",          label: "Payout Control",        desc: "Trigger weekly blockchain USDC payouts to hotel wallets.",                          color: "from-yellow-500 to-amber-600",   icon: "🏦" },
  { href: "/settlements/history",  label: "Settlement History",    desc: "Audit all payouts, TX hashes, hotel earnings, and payment history.",                color: "from-indigo-600 to-indigo-800",  icon: "📜" },
  { href: "/snapshot-performance", label: "Snapshot & Performance",desc: "Capture investor snapshots and record monthly hotel occupancy, RevPAR, and yield.", color: "from-violet-600 to-indigo-700",  icon: "📊" },
];

export default function Dashboard() {
  const { admin } = useAdminAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {admin?.firstName}
        </h1>
        <p className="text-gray-500 mt-1">DRA Admin Control Center</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
        {cards.map(({ href, label, desc, color, icon }) => (
          <a
            key={href}
            href={href}
            className={`bg-gradient-to-br ${color} rounded-2xl p-6 hover:scale-[1.02] transition-transform`}
          >
            <div className="text-3xl mb-3">{icon}</div>
            <h2 className="text-lg font-bold text-white mb-1">{label}</h2>
            <p className="text-sm text-white/70">{desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
