export default function AdminDashboard() {
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

      <p className="text-gray-600 mb-6">
        Welcome to the admin area. Choose an action below:
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <a
          href="/admin/kyc"
          className="p-6 border rounded-lg shadow hover:shadow-lg transition bg-white"
        >
          <h2 className="text-xl font-bold mb-2">KYC Management</h2>
          <p className="text-gray-500">
            Review, approve, and reject investor KYC applications.
          </p>
        </a>

        <a
          href="/admin/users"
          className="p-6 border rounded-lg shadow hover:shadow-lg transition bg-white"
        >
          <h2 className="text-xl font-bold mb-2">Users</h2>
          <p className="text-gray-500">
            View all users, wallets, status, and activity.
          </p>
        </a>

        <a
          href="/admin/investments"
          className="p-6 border rounded-lg shadow hover:shadow-lg transition bg-white"
        >
          <h2 className="text-xl font-bold mb-2">Investments</h2>
          <p className="text-gray-500">
            Track all investments across all projects.
          </p>
        </a>

        {/* <a
          href="/admin/projects"
          className="p-6 border rounded-lg shadow hover:shadow-lg transition bg-white"
        >
          <h2 className="text-xl font-bold mb-2">Projects</h2>
          <p className="text-gray-500">
            Manage projects, asset tokens, and funding limits.
          </p>
        </a> */}
        
         <a
          href="/admin/kyc/status"
          className="p-6 border rounded-lg shadow hover:shadow-lg transition bg-white"
        >
          <h2 className="text-xl font-bold mb-2">KYC Status Overview</h2>
          <p className="text-gray-500">
             View all KYC statuses including Approved, Pending, Rejected, Under Review.
          </p>
        </a>
      </div>
    </div>
  );
}
