import { useEffect, useState } from "react";
import { adminApi } from "../context/AdminAuthContext";
import { Empty, Loading, PageHeader, Pagination, shortAddr } from "../components/ui";
import { IconSearch } from "../components/Icons";

const KYC_BADGE: Record<string, string> = {
  APPROVED:     "badge-success",
  PENDING:      "badge-warning",
  REJECTED:     "badge-danger",
  UNDER_REVIEW: "badge-info",
  NOT_STARTED:  "badge-light",
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

  const initials = (u: any) =>
    `${u.firstName?.[0] ?? ""}${u.lastName?.[0] ?? ""}`.toUpperCase() || (u.email?.[0] ?? "?").toUpperCase();

  return (
    <>
      <PageHeader title="Users" subtitle="View all users, wallets, account status, and activity." />

      <div className="card">
        <div className="card-header">
          <span>All users</span>
          <span className="text-sm font-normal text-medium-emphasis">{pagination.total} total</span>
        </div>

        {/* Filters */}
        <div className="card-body border-b border-line grid grid-cols-1 md:grid-cols-3 gap-3">
          <div className="input-group">
            <span className="input-group-text"><IconSearch size={16} /></span>
            <input
              type="text"
              placeholder="Search name or email…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
            />
          </div>
          <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)} className="form-select">
            <option value="">All Roles</option>
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
          <select value={kycFilter} onChange={(e) => setKycFilter(e.target.value)} className="form-select">
            <option value="">All KYC Status</option>
            <option value="APPROVED">Approved</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
            <option value="UNDER_REVIEW">Under Review</option>
            <option value="NOT_STARTED">Not Started</option>
          </select>
        </div>

        {loading ? (
          <Loading label="Loading users…" />
        ) : users.length === 0 ? (
          <Empty>No users found.</Empty>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Wallet</th>
                    <th>KYC</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th className="text-center">Invested</th>
                    <th className="text-center">Bookings</th>
                    <th>Joined</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className={!user.isActive ? "bg-danger-subtle/40 opacity-75" : ""}>
                      <td>
                        <div className="flex items-center gap-3">
                          <span className="relative shrink-0 inline-flex items-center justify-center w-9 h-9 rounded-full bg-secondary-subtle text-secondary-emphasis text-xs font-semibold">
                            {initials(user)}
                            <span className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full ring-2 ring-white ${user.isActive ? "bg-success" : "bg-danger"}`} />
                          </span>
                          <div className="min-w-0">
                            <div className="font-medium whitespace-nowrap">
                              {user.firstName || user.lastName
                                ? `${user.firstName || ""} ${user.lastName || ""}`
                                : <span className="text-medium-emphasis italic">—</span>}
                            </div>
                            <div className="text-xs text-medium-emphasis">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="font-mono text-xs text-medium-emphasis">{shortAddr(user.walletAddress)}</td>
                      <td>
                        <span className={`badge ${KYC_BADGE[user.kycStatus] || "badge-light"}`}>
                          {user.kycStatus?.replace("_", " ") || "—"}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${user.role === "ADMIN" ? "badge-primary" : "badge-light"}`}>{user.role}</span>
                      </td>
                      <td>
                        <span className={`badge ${user.isActive ? "badge-success" : "badge-danger"}`}>
                          {user.isActive ? "Active" : "Deactivated"}
                        </span>
                      </td>
                      <td className="text-center font-semibold">{user._count?.investments ?? 0}</td>
                      <td className="text-center font-semibold">{user._count?.bookings ?? 0}</td>
                      <td className="text-xs text-medium-emphasis whitespace-nowrap">{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => handleChangeRole(user.id, user.role)}
                            disabled={actionLoading === user.id + "-role"}
                            title={user.role === "ADMIN" ? "Demote to User" : "Promote to Admin"}
                            className="btn btn-sm btn-outline-primary"
                          >
                            {actionLoading === user.id + "-role" ? "…" : user.role === "ADMIN" ? "↓ User" : "↑ Admin"}
                          </button>
                          <button
                            onClick={() => handleToggleActive(user.id, user.isActive)}
                            disabled={actionLoading === user.id + "-active"}
                            className={`btn btn-sm ${user.isActive ? "btn-outline-danger" : "btn-success"}`}
                          >
                            {actionLoading === user.id + "-active" ? "…" : user.isActive ? "Deactivate" : "Reactivate"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card-footer">
              <Pagination
                page={page}
                totalPages={pagination.totalPages}
                onChange={setPage}
                summary={`Page ${page} of ${Math.max(pagination.totalPages, 1)} — ${pagination.total} users`}
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
