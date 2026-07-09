import { useEffect, useState } from "react";
import { adminApi } from "../context/AdminAuthContext";

const KYC_BADGE: Record<string, string> = {
  APPROVED:     "bg-emerald-100 text-emerald-700",
  PENDING:      "bg-yellow-100 text-yellow-700",
  REJECTED:     "bg-red-100 text-red-700",
  UNDER_REVIEW: "bg-blue-100 text-blue-700",
  NOT_STARTED:  "bg-gray-100 text-gray-500",
};

export default function Users() {
  const [users, setUsers]           = useState<any[]>([]);
  const [loading, setLoading]       = useState(true);
  const [search, setSearch]         = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [kycFilter, setKycFilter]   = useState("");
  const [page, setPage]             = useState(1);
  const [pagination, setPagination] = useState({
    total: 0, totalPages: 0, hasNextPage: false, hasPrevPage: false,
  });
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi().get("/admin/users", {
        params: { page, search, role: roleFilter, kyc: kycFilter, limit: 20 },
      });
      setUsers(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Failed to fetch users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, [page, search, roleFilter, kycFilter]);
  useEffect(() => { setPage(1); }, [search, roleFilter, kycFilter]);

  const handleChangeRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "ADMIN" ? "USER" : "ADMIN";
    if (!window.confirm(`Change this user's role to ${newRole}?`)) return;
    setActionLoading(userId + "-role");
    try {
      await adminApi().put(`/user/${userId}/role`, { role: newRole });
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to change role");
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    const action = isActive ? "deactivate" : "reactivate";
    if (!window.confirm(`Are you sure you want to ${action} this user?`)) return;
    setActionLoading(userId + "-active");
    try {
      if (isActive) {
        await adminApi().delete(`/user/${userId}`);
      } else {
        await adminApi().post(`/user/${userId}/reactivate`);
      }
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, isActive: !isActive } : u));
    } catch (err: any) {
      alert(err.response?.data?.message || `Failed to ${action} user`);
    } finally {
      setActionLoading(null);
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Users</h1>
        <p className="text-gray-500 mt-1">
          View all users, wallets, account status, and activity.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          >
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <select
            value={kycFilter}
            onChange={(e) => setKycFilter(e.target.value)}
            className="border border-gray-300 rounded-lg px-4 py-2 text-sm"
          >
            <option value="">All KYC Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="NOT_STARTED">Not Started</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex justify-between items-center">
          <h2 className="text-lg font-bold text-gray-800">All Users</h2>
          <p className="text-sm text-gray-400">{pagination.total} total</p>
        </div>

        {loading ? (
          <div className="p-10 text-center text-gray-400">Loading users...</div>
        ) : users.length === 0 ? (
          <div className="p-10 text-center text-gray-400">No users found.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  {["Name","Email","Wallet","KYC","Role","Status","Invested","Bookings","Joined","Actions"].map(h => (
                    <th key={h} className="p-4 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className={`border-t border-gray-100 transition ${
                    !user.isActive ? "bg-red-50 opacity-70" : "hover:bg-gray-50"
                  }`}>
                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap">
                      {user.firstName || ""} {user.lastName || ""}
                      {!user.firstName && !user.lastName && <span className="text-gray-400 italic">—</span>}
                    </td>
                    <td className="p-4 text-gray-600 text-xs">{user.email}</td>
                    <td className="p-4 font-mono text-xs text-gray-400">
                      {user.walletAddress
                        ? `${user.walletAddress.slice(0,6)}...${user.walletAddress.slice(-4)}`
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${KYC_BADGE[user.kycStatus] || "bg-gray-100 text-gray-500"}`}>
                        {user.kycStatus?.replace("_", " ") || "—"}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.role === "ADMIN" ? "bg-purple-100 text-purple-700" : "bg-gray-100 text-gray-600"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user.isActive ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                      }`}>
                        {user.isActive ? "Active" : "Deactivated"}
                      </span>
                    </td>
                    <td className="p-4 text-center text-gray-700 font-semibold">{user._count?.investments ?? 0}</td>
                    <td className="p-4 text-center text-gray-700 font-semibold">{user._count?.bookings ?? 0}</td>
                    <td className="p-4 text-gray-400 text-xs whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="p-4">
                      <div className="flex gap-2 flex-nowrap">
                        {/* Change role */}
                        <button
                          onClick={() => handleChangeRole(user.id, user.role)}
                          disabled={actionLoading === user.id + "-role"}
                          title={user.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
                          className="px-2.5 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium hover:bg-purple-200 disabled:opacity-50 whitespace-nowrap"
                        >
                          {actionLoading === user.id + "-role"
                            ? "…"
                            : user.role === "ADMIN" ? "↓ User" : "↑ Admin"}
                        </button>

                        {/* Deactivate / Reactivate */}
                        <button
                          onClick={() => handleToggleActive(user.id, user.isActive)}
                          disabled={actionLoading === user.id + "-active"}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium disabled:opacity-50 whitespace-nowrap ${
                            user.isActive
                              ? "bg-red-100 text-red-700 hover:bg-red-200"
                              : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                          }`}
                        >
                          {actionLoading === user.id + "-active"
                            ? "…"
                            : user.isActive ? "Deactivate" : "Reactivate"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex items-center justify-between p-4 border-t border-gray-100">
              <p className="text-sm text-gray-400">
                Page {page} of {pagination.totalPages} — {pagination.total} users
              </p>
              <div className="flex gap-2">
                <button disabled={!pagination.hasPrevPage} onClick={() => setPage(p => p - 1)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm disabled:opacity-40">
                  Previous
                </button>
                <button disabled={!pagination.hasNextPage} onClick={() => setPage(p => p + 1)}
                  className="px-4 py-2 border border-gray-300 text-gray-600 rounded-lg text-sm disabled:opacity-40">
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
