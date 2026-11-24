import { useState, useEffect, useCallback, ReactNode } from "react";
import { adminApi } from "../context/AdminAuthContext";
import { Loading, PageHeader } from "../components/ui";
import { IconRefresh } from "../components/Icons";

const StatusBadge = ({ ok, label }: { ok: boolean; label: string }) => (
  <span className={`badge ${ok ? "badge-success" : "badge-danger"}`}>{label}</span>
);

const Tile = ({ label, children, wide }: { label: string; children: ReactNode; wide?: boolean }) => (
  <div className={`info-tile ${wide ? "col-span-2" : ""}`}>
    <div className="info-tile-label">{label}</div>
    <div className="text-sm break-all">{children}</div>
  </div>
);

export default function OracleEngine() {
  const [oracle,  setOracle]  = useState<any>(null);
  const [engine,  setEngine]  = useState<any>(null);
  const [hotels,  setHotels]  = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [requesting, setRequesting] = useState(false);
  const [requestMsg, setRequestMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const fetchStatus = useCallback(async () => {
    setLoading(true);
    const api = adminApi();
    const [oracleRes, engineRes, hotelsRes] = await Promise.allSettled([
      api.get("/admin/oracle/status"),
      api.get("/admin/engine/status"),
      api.get("/hotels"),
    ]);
    if (oracleRes.status  === "fulfilled") setOracle(oracleRes.value.data.data);
    if (engineRes.status  === "fulfilled") setEngine(engineRes.value.data.data);
    if (hotelsRes.status  === "fulfilled") setHotels(hotelsRes.value.data || []);
    setLoading(false);
  }, []);

  useEffect(() => { fetchStatus(); }, [fetchStatus]);

  const handleRequestPerformance = async () => {
    if (!selectedHotel) { alert("Select a hotel first"); return; }
    setRequesting(true);
    setRequestMsg(null);
    try {
      await adminApi().post("/admin/oracle/request-performance", { hotelAssetId: selectedHotel });
      setRequestMsg({ ok: true, text: "Performance update requested successfully." });
    } catch (err: any) {
      setRequestMsg({ ok: false, text: err.response?.data?.error || "Request failed." });
    } finally {
      setRequesting(false);
    }
  };

  return (
    <>
      <PageHeader
        title="Oracle & Engine"
        subtitle="Monitor Chainlink oracle and thirdweb Engine status."
        actions={
          <button onClick={fetchStatus} disabled={loading} className="btn btn-outline-secondary">
            <IconRefresh size={16} /> {loading ? "Refreshing…" : "Refresh"}
          </button>
        }
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 items-start">
        {/* Chainlink Oracle */}
        <div className="card">
          <div className="card-header">
            <span>Chainlink Oracle</span>
            {oracle && <StatusBadge ok={oracle.ready} label={oracle.ready ? "Ready" : "Not Ready"} />}
          </div>

          {!oracle ? (
            <Loading />
          ) : (
            <div className="card-body space-y-4 text-sm">
              {!oracle.ready && oracle.reason && <p className="text-xs text-medium-emphasis">{oracle.reason}</p>}

              <div className="grid grid-cols-2 gap-3">
                <Tile label="Contract"><span className="font-mono text-xs">{oracle.contractAddress ?? "—"}</span></Tile>
                <Tile label="DON ID"><span className="text-xs">{oracle.donId ?? "—"}</span></Tile>
                <Tile label="Subscription ID" wide><span className="text-xs">{oracle.subscriptionId || "Not configured"}</span></Tile>
              </div>

              <div className="alert alert-warning text-xs">
                ⚠ Chainlink Functions testnet was sunset June 15, 2026. Get a mainnet subscription at{" "}
                <a href="https://functions.chain.link" target="_blank" rel="noreferrer" className="underline text-warning-emphasis font-medium">
                  functions.chain.link
                </a>{" "}
                to activate.
              </div>

              {/* Request Performance Update */}
              <div className="border border-line rounded-md">
                <div className="px-4 py-2.5 border-b border-line bg-light rounded-t-md">
                  <div className="font-medium">Request Performance Update</div>
                  <div className="text-xs text-medium-emphasis">Triggers Chainlink to fetch latest hotel stats on-chain for a selected hotel.</div>
                </div>
                <div className="p-4 space-y-3">
                  <div className="flex gap-2">
                    <select value={selectedHotel} onChange={(e) => setSelectedHotel(e.target.value)} className="form-select flex-1">
                      <option value="">Select hotel…</option>
                      {hotels.map((h: any) => (
                        <option key={h.id} value={h.id}>{h.name}</option>
                      ))}
                    </select>
                    <button onClick={handleRequestPerformance} disabled={requesting || !selectedHotel} className="btn btn-primary">
                      {requesting ? "Requesting…" : "Request Update"}
                    </button>
                  </div>
                  {requestMsg && (
                    <div className={`alert text-xs ${requestMsg.ok ? "alert-success" : "alert-danger"}`}>{requestMsg.text}</div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* thirdweb Engine */}
        <div className="card">
          <div className="card-header">
            <span>thirdweb Engine</span>
            {engine && (
              <div className="flex gap-2">
                <StatusBadge ok={engine.enabled} label={engine.enabled ? "Enabled" : "Disabled (ethers fallback)"} />
                {engine.enabled && <StatusBadge ok={engine.healthy} label={engine.healthy ? "Healthy" : "Unreachable"} />}
              </div>
            )}
          </div>

          {!engine ? (
            <Loading />
          ) : (
            <div className="card-body space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3">
                <Tile label="Mode"><span className="text-xs">{engine.mode}</span></Tile>
                <Tile label="Wallet Configured">
                  <span className={`text-xs font-semibold ${engine.walletConfigured ? "text-success" : "text-danger"}`}>
                    {engine.walletConfigured ? "Yes" : "No"}
                  </span>
                </Tile>
                <Tile label="Engine URL" wide><span className="font-mono text-xs">{engine.url || "—"}</span></Tile>
              </div>

              <div className="alert alert-info text-xs">
                To enable: set <code className="font-mono">USE_THIRDWEB_ENGINE=true</code> and fill{" "}
                <code className="font-mono">THIRDWEB_ENGINE_ACCESS_TOKEN</code> +{" "}
                <code className="font-mono">THIRDWEB_ENGINE_WALLET_ADDRESS</code> in backend .env
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
