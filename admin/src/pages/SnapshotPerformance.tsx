import { useState, useEffect } from "react";
import { adminApi } from "../context/AdminAuthContext";

interface Hotel { id: string; name: string; location: string; }
interface Snapshot { id: string; status: string; takenAt: string; totalEntries: number; hotelAssetId: string | null; }
interface Perf { period: string; bookingCount: number; totalRevenue: number; occupancyRate: number; revpar: number; investorYield: number; }

export default function SnapshotPerformance() {
  const [hotels,     setHotels]     = useState<Hotel[]>([]);
  const [snapshots,  setSnapshots]  = useState<Snapshot[]>([]);
  const [perfs,      setPerfs]      = useState<Record<string, Perf | null>>({});
  const [snapMsg,    setSnapMsg]    = useState("");
  const [perfMsg,    setPerfMsg]    = useState<Record<string, string>>({});
  const [loadSnap,   setLoadSnap]   = useState(false);
  const [recording,  setRecording]  = useState<string | null>(null);
  const api = adminApi();

  const loadHotels = async () => {
    try {
      const res = await api.get("/hotels");
      const list: Hotel[] = res.data.data ?? res.data ?? [];
      setHotels(list);
      list.forEach(async h => {
        try {
          const p = await api.get(`/performance/${h.id}/latest`);
          setPerfs(prev => ({ ...prev, [h.id]: p.data.data ?? null }));
        } catch { setPerfs(prev => ({ ...prev, [h.id]: null })); }
      });
    } catch { setHotels([]); }
  };

  const loadSnapshots = async () => {
    try {
      const res = await api.get("/admin/snapshot/list");
      setSnapshots(res.data.data ?? []);
    } catch { setSnapshots([]); }
  };

  useEffect(() => { loadHotels(); loadSnapshots(); }, []);

  const takeSnapshot = async (hotelAssetId?: string) => {
    setLoadSnap(true); setSnapMsg("");
    try {
      const res = await api.post("/admin/snapshot/take", hotelAssetId ? { hotelAssetId } : {});
      const { totalEntries } = res.data.data;
      setSnapMsg(`Snapshot taken — ${totalEntries} investor${totalEntries !== 1 ? "s" : ""} captured.`);
      loadSnapshots();
    } catch (e: any) { setSnapMsg(`Error: ${e.response?.data?.message ?? e.message}`); }
    finally { setLoadSnap(false); }
  };

  const recordPerf = async (hotelId: string) => {
    setRecording(hotelId); setPerfMsg(p => ({ ...p, [hotelId]: "" }));
    try {
      const res = await api.post("/performance/record", { hotelAssetId: hotelId });
      const d = res.data.data;
      setPerfMsg(p => ({ ...p, [hotelId]: `Occupancy: ${d.occupancyRate?.toFixed(1)}% | RevPAR: $${d.revpar?.toFixed(2)} | Yield: ${d.investorYield?.toFixed(2)}%` }));
      setPerfs(prev => ({ ...prev, [hotelId]: d }));
    } catch (e: any) { setPerfMsg(p => ({ ...p, [hotelId]: `Error: ${e.response?.data?.message ?? e.message}`})); }
    finally { setRecording(null); }
  };

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-2xl font-bold text-white">Snapshot & Performance</h1>

      {/* ── SNAPSHOT SECTION ── */}
      <section className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold text-white">Investor Snapshot</h2>
            <p className="text-sm text-gray-500 mt-0.5">Locks who the current investors are for fair yield distribution.</p>
          </div>
          <button
            onClick={() => takeSnapshot()}
            disabled={loadSnap}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
          >
            {loadSnap ? "Taking…" : "Take Snapshot (All Hotels)"}
          </button>
        </div>

        {snapMsg && <p className="text-sm text-emerald-400 mb-4">{snapMsg}</p>}

        {snapshots.length === 0 ? (
          <p className="text-gray-600 text-sm">No snapshots yet.</p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gray-800">
            <table className="w-full text-sm">
              <thead className="bg-gray-800 text-gray-400 text-xs uppercase">
                <tr>
                  {["Date","Hotel","Investors","Status"].map(h => (
                    <th key={h} className="px-4 py-3 text-left">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {snapshots.map(s => (
                  <tr key={s.id} className="hover:bg-gray-800/50">
                    <td className="px-4 py-3 text-gray-300">{new Date(s.takenAt).toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-400">{s.hotelAssetId ? hotels.find(h => h.id === s.hotelAssetId)?.name ?? s.hotelAssetId : "All hotels"}</td>
                    <td className="px-4 py-3 text-white">{s.totalEntries}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${s.status === "ACTIVE" ? "bg-green-900 text-green-300" : "bg-gray-700 text-gray-400"}`}>
                        {s.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* ── PERFORMANCE SECTION ── */}
      <section>
        <h2 className="text-lg font-semibold text-white mb-2">Hotel Performance</h2>
        <p className="text-sm text-gray-500 mb-5">Record monthly occupancy, RevPAR, and investor yield. Investors see this in their Portfolio.</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {hotels.map(h => {
            const p = perfs[h.id];
            return (
              <div key={h.id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="font-semibold text-white">{h.name}</p>
                    <p className="text-xs text-gray-500">{h.location}</p>
                    {p && <p className="text-xs text-gray-600 mt-1">Last recorded: {p.period} • {p.bookingCount} booking{p.bookingCount !== 1 ? "s" : ""} • Revenue: ${Number(p.totalRevenue).toFixed(2)}</p>}
                  </div>
                  <button
                    onClick={() => recordPerf(h.id)}
                    disabled={recording === h.id}
                    className="px-3 py-1.5 bg-sky-700 hover:bg-sky-600 disabled:opacity-50 text-white text-xs rounded-lg transition-colors whitespace-nowrap"
                  >
                    {recording === h.id ? "Recording…" : "Record Performance"}
                  </button>
                </div>

                {perfMsg[h.id] && <p className="text-xs text-emerald-400 mb-3">{perfMsg[h.id]}</p>}

                {p ? (
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-gray-800 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-blue-400">{Number(p.occupancyRate).toFixed(1)}%</p>
                      <p className="text-xs text-gray-500">Occupancy</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-yellow-400">${Number(p.revpar).toFixed(2)}</p>
                      <p className="text-xs text-gray-500">RevPAR</p>
                    </div>
                    <div className="bg-gray-800 rounded-xl p-3 text-center">
                      <p className="text-lg font-bold text-emerald-400">{Number(p.investorYield).toFixed(2)}%</p>
                      <p className="text-xs text-gray-500">Investor Yield</p>
                    </div>
                  </div>
                ) : (
                  <p className="text-xs text-gray-600">No performance data yet — click Record Performance.</p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
