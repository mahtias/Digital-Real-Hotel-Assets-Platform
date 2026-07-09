import { useState, useEffect, useCallback } from "react";
import { adminApi } from "../context/AdminAuthContext";

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

  const StatusBadge = ({ ok, label }: { ok: boolean; label: string }) => (
    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
      ok ? "bg-emerald-900/60 text-emerald-300" : "bg-red-900/60 text-red-300"
    }`}>
      {label}
    </span>
  );

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-3xl font-bold text-white">Oracle & Engine</h1>
          <p className="text-gray-400 mt-1">Monitor Chainlink oracle and thirdweb Engine status.</p>
        </div>
        <button
          onClick={fetchStatus}
          disabled={loading}
          className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg text-sm hover:bg-gray-600 disabled:opacity-50 transition"
        >
          {loading ? "Refreshing…" : "↻ Refresh"}
        </button>
      </div>

      {/* Chainlink Oracle */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">Chainlink Oracle</h2>

        {!oracle ? (
          <p className="text-gray-500 text-sm">Loading…</p>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <StatusBadge ok={oracle.ready} label={oracle.ready ? "Ready" : "Not Ready"} />
              {!oracle.ready && <span className="text-gray-500 text-xs">{oracle.reason}</span>}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-700 rounded-xl p-3">
                <p className="text-gray-400 text-xs mb-1">Contract</p>
                <p className="text-white font-mono text-xs break-all">{oracle.contractAddress ?? "—"}</p>
              </div>
              <div className="bg-gray-700 rounded-xl p-3">
                <p className="text-gray-400 text-xs mb-1">DON ID</p>
                <p className="text-white text-xs">{oracle.donId ?? "—"}</p>
              </div>
              <div className="bg-gray-700 rounded-xl p-3 col-span-2">
                <p className="text-gray-400 text-xs mb-1">Subscription ID</p>
                <p className="text-white text-xs">{oracle.subscriptionId || "Not configured"}</p>
              </div>
            </div>

            <div className="bg-yellow-900/20 border border-yellow-800 rounded-xl p-3 text-yellow-300 text-xs">
              ⚠ Chainlink Functions testnet was sunset June 15, 2026. Get a mainnet subscription at{" "}
              <a href="https://functions.chain.link" target="_blank" rel="noreferrer" className="underline">
                functions.chain.link
              </a>{" "}
              to activate.
            </div>

            {/* Request Performance Update */}
            <div className="bg-gray-700 rounded-xl p-4 space-y-3">
              <p className="text-white text-sm font-semibold">Request Performance Update</p>
              <p className="text-gray-400 text-xs">
                Triggers Chainlink to fetch latest hotel stats on-chain for a selected hotel.
              </p>
              <div className="flex gap-3">
                <select
                  value={selectedHotel}
                  onChange={(e) => setSelectedHotel(e.target.value)}
                  className="flex-1 bg-gray-600 border border-gray-500 text-white rounded-lg px-3 py-2 text-sm"
                >
                  <option value="">Select hotel…</option>
                  {hotels.map((h: any) => (
                    <option key={h.id} value={h.id}>{h.name}</option>
                  ))}
                </select>
                <button
                  onClick={handleRequestPerformance}
                  disabled={requesting || !selectedHotel}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50 transition"
                >
                  {requesting ? "Requesting…" : "Request Update"}
                </button>
              </div>
              {requestMsg && (
                <p className={`text-xs rounded-lg px-3 py-2 ${
                  requestMsg.ok
                    ? "bg-emerald-900/40 text-emerald-300"
                    : "bg-red-900/40 text-red-300"
                }`}>
                  {requestMsg.text}
                </p>
              )}
            </div>
          </div>
        )}
      </div>

      {/* thirdweb Engine */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-white">thirdweb Engine</h2>

        {!engine ? (
          <p className="text-gray-500 text-sm">Loading…</p>
        ) : (
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3">
              <StatusBadge ok={engine.enabled} label={engine.enabled ? "Enabled" : "Disabled (ethers fallback)"} />
              {engine.enabled && (
                <StatusBadge ok={engine.healthy} label={engine.healthy ? "Healthy" : "Unreachable"} />
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-700 rounded-xl p-3">
                <p className="text-gray-400 text-xs mb-1">Mode</p>
                <p className="text-white text-xs">{engine.mode}</p>
              </div>
              <div className="bg-gray-700 rounded-xl p-3">
                <p className="text-gray-400 text-xs mb-1">Wallet Configured</p>
                <p className={`text-xs font-semibold ${engine.walletConfigured ? "text-emerald-400" : "text-red-400"}`}>
                  {engine.walletConfigured ? "Yes" : "No"}
                </p>
              </div>
              <div className="bg-gray-700 rounded-xl p-3 col-span-2">
                <p className="text-gray-400 text-xs mb-1">Engine URL</p>
                <p className="text-white text-xs font-mono">{engine.url || "—"}</p>
              </div>
            </div>

            <div className="bg-blue-900/20 border border-blue-800 rounded-xl p-3 text-blue-300 text-xs">
              To enable: set <span className="font-mono">USE_THIRDWEB_ENGINE=true</span> and fill{" "}
              <span className="font-mono">THIRDWEB_ENGINE_ACCESS_TOKEN</span> +{" "}
              <span className="font-mono">THIRDWEB_ENGINE_WALLET_ADDRESS</span> in backend .env
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
