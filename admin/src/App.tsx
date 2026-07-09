import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import AdminLayout from "./components/AdminLayout";

import Login               from "./pages/Login";
import Dashboard           from "./pages/Dashboard";
import KYCManagement       from "./pages/KYCManagement";
import KYCStatusList       from "./pages/KYCStatusList";
import KYCDetail           from "./pages/KYCDetail";
import Bookings            from "./pages/Bookings";
import Revenue             from "./pages/Revenue";
import Settlements         from "./pages/Settlements";
import SettlementHistory   from "./pages/SettlementHistory";
import SnapshotPerformance from "./pages/SnapshotPerformance";
import OracleEngine        from "./pages/OracleEngine";
import Users               from "./pages/Users";
import Investments         from "./pages/Investments";
import Placeholder         from "./pages/Placeholder";

export default function App() {
  return (
    <AdminAuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login />} />

          {/* Protected — all inside AdminLayout */}
          <Route element={<AdminLayout />}>
            <Route path="/"                     element={<Dashboard />} />
            <Route path="/kyc"                  element={<KYCManagement />} />
            <Route path="/kyc/status"           element={<KYCStatusList />} />
            <Route path="/kyc/:kycId"           element={<KYCDetail />} />
            <Route path="/users"                element={<Users />} />
            <Route path="/investments"          element={<Investments />} />
            <Route path="/bookings"             element={<Bookings />} />
            <Route path="/revenue"              element={<Revenue />} />
            <Route path="/settlements"          element={<Settlements />} />
            <Route path="/settlements/history"  element={<SettlementHistory />} />
            <Route path="/snapshot-performance" element={<SnapshotPerformance />} />
            <Route path="/oracle"               element={<OracleEngine />} />
          </Route>

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AdminAuthProvider>
  );
}
