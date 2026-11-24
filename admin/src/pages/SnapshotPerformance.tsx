import { useState, useEffect } from "react";
import { adminApi } from "../context/AdminAuthContext";
import { Callout, Empty, PageHeader } from "../components/ui";
import { IconCamera } from "../components/Icons";

interface Hotel { id: string; name: string; location: string; }
interface Snapshot { id: string; status: string; takenAt: string; totalEntries: number; hotelAssetId: string | null; }
interface Perf { period: string; bookingCount: number; totalRevenue: number; occupancyRate: number; revpar: number; investorYield: number; }

const isError = (m?: string) => !!m && m.startsWith("Error");

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
    <>
      <PageHeader title="Snapshot & Performance" subtitle="Investor snapshots for fair yield distribution, and monthly hotel KPIs." />

      {/* ── SNAPSHOT SECTION ── */}
      <div className="card mb-6">
        <div className="card-header">
          <div>
            <div>Investor snapshot</div>
            <div className="text-xs font-normal text-medium-emphasis">Locks who the current investors are for fair yield distribution.</div>
          </div>
          <button onClick={() => takeSnapshot()} disabled={loadSnap} className="btn btn-primary">
            <IconCamera size={16} /> {loadSnap ? "Taking…" : "Take Snapshot (All Hotels)"}
          </button>
        </div>

        {snapMsg && (
          <div className="card-body pb-0">
            <div className={`alert ${isError(snapMsg) ? "alert-danger" : "alert-success"}`}>{snapMsg}</div>
          </div>
        )}

        {snapshots.length === 0 ? (
          <Empty>No snapshots yet.</Empty>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-hover">
              <thead>
                <tr>
                  {["Date", "Hotel", "Investors", "Status"].map(h => <th key={h}>{h}</th>)}
                </tr>
              </thead>
              <tbody>
                {snapshots.map(s => (
                  <tr key={s.id}>
                    <td className="whitespace-nowrap">{new Date(s.takenAt).toLocaleString()}</td>
                    <td className="text-medium-emphasis">
                      {s.hotelAssetId ? hotels.find(h => h.id === s.hotelAssetId)?.name ?? s.hotelAssetId : "All hotels"}
                    </td>
                    <td className="font-semibold">{s.totalEntries}</td>
                    <td>
                      <span className={`badge ${s.status === "ACTIVE" ? "badge-success" : "badge-secondary"}`}>{s.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── PERFORMANCE SECTION ── */}
      <div className="mb-3">
        <h2 className="text-lg font-medium">Hotel performance</h2>
        <p className="text-sm text-medium-emphasis">Record monthly occupancy, RevPAR, and investor yield. Investors see this in their Portfolio.</p>
      </div>

      {hotels.length === 0 ? (
        <div className="card"><Empty>No hotels found.</Empty></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {hotels.map(h => {
            const p = perfs[h.id];
            return (
              <div key={h.id} className="card">
                <div className="card-header">
                  <div className="min-w-0">
                    <div className="truncate">{h.name}</div>
                    <div className="text-xs font-normal text-medium-emphasis truncate">{h.location}</div>
                  </div>
                  <button onClick={() => recordPerf(h.id)} disabled={recording === h.id} className="btn btn-sm btn-info">
                    {recording === h.id ? "Recording…" : "Record Performance"}
                  </button>
                </div>
                <div className="card-body">
                  {perfMsg[h.id] && (
                    <div className={`alert ${isError(perfMsg[h.id]) ? "alert-danger" : "alert-success"} mb-3 text-xs`}>{perfMsg[h.id]}</div>
                  )}

                  {p ? (
                    <>
                      <div className="grid grid-cols-3 gap-4">
                        <Callout tone="info"    label="Occupancy"      value={`${Number(p.occupancyRate).toFixed(1)}%`} />
                        <Callout tone="warning" label="RevPAR"         value={`$${Number(p.revpar).toFixed(2)}`} />
                        <Callout tone="success" label="Investor Yield" value={`${Number(p.investorYield).toFixed(2)}%`} />
                      </div>
                      <div className="mt-4 text-xs text-medium-emphasis">
                        Last recorded: {p.period} • {p.bookingCount} booking{p.bookingCount !== 1 ? "s" : ""} • Revenue: ${Number(p.totalRevenue).toFixed(2)}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-medium-emphasis">No performance data yet — click Record Performance.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
