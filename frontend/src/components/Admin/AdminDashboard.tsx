export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-3 text-gray-900">
        DRA Admin Dashboard
      </h1>

      <p className="text-gray-600 mb-8 text-lg">
        Welcome to the admin control center. Manage platform operations,
        treasury flows, bookings, settlements, and investor activity.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

        {/* KYC */}
        <a
          href="/admin/kyc"
          className="p-6 rounded-2xl shadow-md hover:shadow-2xl transition bg-gradient-to-br from-blue-500 to-blue-700 text-white"
        >
          <h2 className="text-2xl font-bold mb-2">KYC Management</h2>
          <p className="text-blue-100">
            Review, approve, and reject investor KYC applications.
          </p>
        </a>

        {/* USERS */}
        <a
          href="/admin/users"
          className="p-6 rounded-2xl shadow-md hover:shadow-2xl transition bg-gradient-to-br from-purple-500 to-purple-700 text-white"
        >
          <h2 className="text-2xl font-bold mb-2">Users</h2>
          <p className="text-purple-100">
            View all users, wallets, account status, and activity.
          </p>
        </a>

        {/* INVESTMENTS */}
        <a
          href="/admin/investments"
          className="p-6 rounded-2xl shadow-md hover:shadow-2xl transition bg-gradient-to-br from-emerald-500 to-emerald-700 text-white"
        >
          <h2 className="text-2xl font-bold mb-2">Investments</h2>
          <p className="text-emerald-100">
            Track all investments across hotel asset projects.
          </p>
        </a>

        {/* KYC STATUS */}
        <a
          href="/admin/kyc/status"
          className="p-6 rounded-2xl shadow-md hover:shadow-2xl transition bg-gradient-to-br from-orange-400 to-orange-600 text-white"
        >
          <h2 className="text-2xl font-bold mb-2">
            KYC Status Overview
          </h2>
          <p className="text-orange-100">
            Monitor Approved, Pending, Rejected, and Under Review KYC.
          </p>
        </a>

        {/* BOOKINGS */}
        <a
          href="/admin/bookings"
          className="p-6 rounded-2xl shadow-md hover:shadow-2xl transition bg-gradient-to-br from-cyan-500 to-cyan-700 text-white"
        >
          <h2 className="text-2xl font-bold mb-2">Bookings</h2>
          <p className="text-cyan-100">
            View hotel bookings, payment status, PMS sync, and transactions.
          </p>
        </a>

        {/* REVENUE */}
        <a
          href="/admin/revenue"
          className="p-6 rounded-2xl shadow-md hover:shadow-2xl transition bg-gradient-to-br from-pink-500 to-rose-700 text-white"
        >
          <h2 className="text-2xl font-bold mb-2">Revenue Analytics</h2>
          <p className="text-pink-100">
            Track hotel earnings, pending revenue, and payout summaries.
          </p>
        </a>

        {/* SETTLEMENT CONTROL (ACTION) */}
        <a
          href="/admin/settlements"
          className="p-6 rounded-2xl shadow-md hover:shadow-2xl transition bg-gradient-to-br from-yellow-400 to-amber-600 text-white"
        >
          <h2 className="text-2xl font-bold mb-2">
            Payout Control
          </h2>
          <p className="text-yellow-100">
            Trigger weekly blockchain USDC payouts to hotel wallets.
          </p>
        </a>

        {/* SETTLEMENT HISTORY (NEW) */}
        <a
          href="/admin/settlements/history"
          className="p-6 rounded-2xl shadow-md hover:shadow-2xl transition bg-gradient-to-br from-indigo-500 to-indigo-700 text-white"
        >
          <h2 className="text-2xl font-bold mb-2">
            Settlement History
          </h2>
          <p className="text-indigo-100">
            Audit all payouts, TX hashes, hotel earnings, and payment history.
          </p>
        </a>

      </div>
    </div>
  );
}