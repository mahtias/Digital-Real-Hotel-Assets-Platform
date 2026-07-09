import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API = import.meta.env.VITE_API_URL;
const token = () => localStorage.getItem("authToken");

interface Snapshot {
  id: string;
  status: string;
  totalEntries: number;
  takenAt: string;
  hotelAsset?: { name: string };
  takenByUser?: { firstName?: string; lastName?: string; email: string };
}

interface Hotel {
  id: string;
  name: string;
  location: string;
  occupancyRate?: number;
  revpar?: number;
}

interface Performance {
  id: string;
  period: string;
  occupancyRate: number;
  revpar: number;
  investorYield: number;
  totalRevenue: number;
  bookingCount: number;
}

export default function AdminSnapshotPerformance() {
  const navigate = useNavigate();
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [hotels, setHotels] = useState<Hotel[]>([]);
  const [performances, setPerformances] = useState<Record<string, Performance | null>>({});
  const [loadingSnap, setLoadingSnap] = useState(false);
  const [loadingPerf, setLoadingPerf] = useState<string | null>(null);
  const [snapMsg, setSnapMsg] = useState("");
  const [perfMsg, setPerfMsg] = useState<Record<string, string>>({});

  const fetchSnapshots = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/admin/snapshot/list`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      setSnapshots(res.data.data ?? []);
    } catch {
      setSnapshots([]);
    }
  };

  const fetchHotels = async () => {
    try {
      const res = await axios.get(`${API}/api/v1/hotels`, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const list: Hotel[] = res.data.data ?? res.data ?? [];
      setHotels(list);
      // Fetch latest performance for each hotel
      list.forEach(async (h) => {
        try {
          const p = await axios.get(`${API}/api/v1/performance/${h.id}/latest`, {
            headers: { Authorization: `Bearer ${token()}` },
          });
          setPerformances((prev) => ({ ...prev, [h.id]: p.data.data ?? null }));
        } catch {
          setPerformances((prev) => ({ ...prev, [h.id]: null }));
        }
      });
    } catch {
      setHotels([]);
    }
  };

  useEffect(() => {
    fetchSnapshots();
    fetchHotels();
  }, []);

  const handleTakeSnapshot = async (hotelAssetId?: string) => {
    setLoadingSnap(true);
    setSnapMsg("");
    try {
      const body = hotelAssetId ? { hotelAssetId } : {};
      const res = await axios.post(`${API}/api/v1/admin/snapshot/take`, body, {
        headers: { Authorization: `Bearer ${token()}` },
      });
      const { totalEntries } = res.data.data;
      setSnapMsg(`Snapshot taken — ${totalEntries} investor${totalEntries !== 1 ? "s" : ""} captured.`);
      fetchSnapshots();
    } catch (err: any) {
      setSnapMsg(`Error: ${err.response?.data?.message ?? err.message}`);
    } finally {
      setLoadingSnap(false);
    }
  };

  const handleRecordPerformance = async (hotelId: string) => {
    setLoadingPerf(hotelId);
    setPerfMsg((prev) => ({ ...prev, [hotelId]: "" }));
    try {
      const res = await axios.post(
        `${API}/api/v1/performance/record`,
        { hotelAssetId: hotelId },
        { headers: { Authorization: `Bearer ${token()}` } }
      );
      const d = res.data.data;
      setPerfMsg((prev) => ({
        ...prev,
        [hotelId]: `Recorded — Occupancy: ${Number(d.occupancyRate).toFixed(1)}% | RevPAR: $${Number(d.revpar).toFixed(2)} | Yield: ${Number(d.investorYield).toFixed(2)}%`,
      }));
      setPerformances((prev) => ({ ...prev, [hotelId]: d }));
    } catch (err: any) {
      setPerfMsg((prev) => ({
        ...prev,
        [hotelId]: `Error: ${err.response?.data?.message ?? err.message}`,
      }));
    } finally {
      setLoadingPerf(null);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-4 text-sm text-gray-500 hover:text-gray-800">
        ← Back
      </button>

      <h1 className="text-4xl font-bold text-gray-900 mb-1">Snapshot & Performance</h1>
      <p className="text-gray-500 mb-8">
        Take investor snapshots before yield distribution, then record monthly hotel performance.
      </p>

      {/* ── SNAPSHOT SECTION ───────────────────────────── */}
      <div className="bg-white rounded-2xl shadow border p-6 mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Investor Snapshot</h2>
            <p className="text-gray-500 text-sm mt-1">
              Captures all CONFIRMED investors at this moment. Yield distribution will use the latest snapshot.
            </p>
          </div>
          <button
            onClick={() => handleTakeSnapshot()}
            disabled={loadingSnap}
            className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white px-6 py-3 rounded-xl font-semibold hover:opacity-90 disabled:opacity-50 transition"
          >
            {loadingSnap ? "Taking snapshot..." : "Take Snapshot (All Hotels)"}
          </button>
        </div>

        {snapMsg && (
          <div className={`px-4 py-3 rounded-lg text-sm mb-4 ${snapMsg.startsWith("Error") ? "bg-red-50 text-red-700" : "bg-emerald-50 text-emerald-700"}`}>
            {snapMsg}
          </div>
        )}

        {snapshots.length === 0 ? (
          <p className="text-gray-400 text-sm">No snapshots yet. Click "Take Snapshot" to start.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="text-left p-3 text-gray-600 font-semibold">Taken At</th>
                  <th className="text-left p-3 text-gray-600 font-semibold">Hotel</th>
                  <th className="text-left p-3 text-gray-600 font-semibold">Investors</th>
                  <th className="text-left p-3 text-gray-600 font-semibold">By</th>
                  <th className="text-left p-3 text-gray-600 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {snapshots.map((s) => (
                  <tr key={s.id} className="border-t hover:bg-gray-50">
                    <td className="p-3">{new Date(s.takenAt).toLocaleString()}</td>
                    <td className="p-3">{s.hotelAsset?.name ?? "All Hotels"}</td>
                    <td className="p-3 font-bold text-indigo-700">{s.totalEntries}</td>
                    <td className="p-3 text-gray-500">{s.takenByUser?.email ?? "—"}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${s.status === "ACTIVE" ? "bg-emerald-100 text-emerald-700" : "bg-gray-100 text-gray-500"}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── PERFORMANCE SECTION ───────────────────────── */}
      <div className="bg-white rounded-2xl shadow border p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-1">Hotel Performance</h2>
        <p className="text-gray-500 text-sm mb-6">
          Record monthly occupancy, RevPAR, and investor yield. This data appears in investor Portfolio.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {hotels.map((hotel) => {
            const perf = performances[hotel.id];
            const msg = perfMsg[hotel.id];
            const recording = loadingPerf === hotel.id;

            return (
              <div key={hotel.id} className="border rounded-xl p-5 hover:shadow-md transition">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <p className="font-bold text-gray-900">{hotel.name}</p>
                    <p className="text-sm text-gray-500">{hotel.location}</p>
                  </div>
                  <button
                    onClick={() => handleRecordPerformance(hotel.id)}
                    disabled={recording}
                    className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50 transition whitespace-nowrap"
                  >
                    {recording ? "Recording..." : "Record Performance"}
                  </button>
                </div>

                {perf ? (
                  <div className="grid grid-cols-3 gap-3 text-center mt-2">
                    <div className="bg-blue-50 rounded-lg p-3">
                      <p className="text-xs text-blue-500 font-medium">Occupancy</p>
                      <p className="text-xl font-bold text-blue-700">{Number(perf.occupancyRate).toFixed(1)}%</p>
                    </div>
                    <div className="bg-emerald-50 rounded-lg p-3">
                      <p className="text-xs text-emerald-500 font-medium">RevPAR</p>
                      <p className="text-xl font-bold text-emerald-700">${Number(perf.revpar).toFixed(2)}</p>
                    </div>
                    <div className="bg-violet-50 rounded-lg p-3">
                      <p className="text-xs text-violet-500 font-medium">Investor Yield</p>
                      <p className="text-xl font-bold text-violet-700">{Number(perf.investorYield).toFixed(2)}%</p>
                    </div>
                    <div className="col-span-3 text-xs text-gray-400 text-center">
                      Last recorded: {perf.period} • {perf.bookingCount} booking{perf.bookingCount !== 1 ? "s" : ""} • Revenue: ${Number(perf.totalRevenue).toFixed(2)}
                    </div>
                  </div>
                ) : (
                  <p className="text-sm text-gray-400">No performance data yet.</p>
                )}

                {msg && (
                  <p className={`text-xs mt-2 ${msg.startsWith("Error") ? "text-red-500" : "text-emerald-600"}`}>
                    {msg}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
