import { useState, useEffect } from "react";
import { adminApi } from "../context/AdminAuthContext";
import { Callout, Empty, Loading, PageHeader } from "../components/ui";
import { IconRefresh } from "../components/Icons";

export default function Settlements() {
  const [hotelAssets, setHotelAssets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const api = adminApi();
      const [hotelRes, revenueRes] = await Promise.all([
        api.get("/hotels"),
        api.get("/admin/revenue"),
      ]);

      const hotels = hotelRes.data;
      const revenue = Array.isArray(revenueRes.data)
        ? revenueRes.data
        : revenueRes.data.data || [];

      const merged = hotels.map((hotel: any) => {
        const rev = revenue.find((r: any) => r.hotelId === hotel.id);
        return {
          ...hotel,
          pending:      rev?.pending      || 0,
          paid:         rev?.paid         || 0,
          totalRevenue: rev?.totalRevenue || 0,
        };
      });

      setHotelAssets(merged);
    } catch (err) {
      console.error("Error fetching settlements", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleProcessSettlement = async (hotelAssetId: string) => {
    if (!window.confirm("Process payout for this hotel now?")) return;
    setProcessing(hotelAssetId);
    try {
      await adminApi().post(`/settlements/process/${hotelAssetId}`);
      alert("Settlement processed successfully");
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.error || "Settlement failed");
    } finally {
      setProcessing(null);
    }
  };

  return (
    <>
      <PageHeader
        title="Payout Control"
        subtitle="Trigger blockchain USDC payouts from DRA treasury to hotel wallets."
        actions={
          <button onClick={fetchData} disabled={loading} className="btn btn-outline-secondary">
            <IconRefresh size={16} /> {loading ? "Refreshing…" : "Refresh"}
          </button>
        }
      />

      {loading && hotelAssets.length === 0 ? (
        <div className="card"><Loading label="Loading settlement data…" /></div>
      ) : hotelAssets.length === 0 ? (
        <div className="card"><Empty>No hotels found.</Empty></div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {hotelAssets.map((asset: any) => {
            const pending = Number(asset.pending) > 0;
            return (
              <div key={asset.id} className="card flex flex-col">
                <div className="card-header">
                  <div className="min-w-0">
                    <div className="truncate">{asset.name}</div>
                    <div className="text-xs font-normal text-medium-emphasis truncate">{asset.location}</div>
                  </div>
                  {pending
                    ? <span className="badge badge-warning">Pending Settlement</span>
                    : <span className="badge badge-success">Fully Paid</span>}
                </div>

                <div className="card-body space-y-4 flex-1">
                  <div className="grid grid-cols-3 gap-4">
                    <Callout tone="success" label="Total Revenue" value={`$${Number(asset.totalRevenue).toFixed(2)}`} />
                    <Callout tone="warning" label="Pending"       value={`$${Number(asset.pending).toFixed(2)}`} />
                    <Callout tone="info"    label="Paid"          value={`$${Number(asset.paid).toFixed(2)}`} />
                  </div>

                  <div className="info-tile">
                    <div className="info-tile-label">Hotel Wallet</div>
                    <div className="text-sm font-mono break-all">
                      {asset.walletAddress || <span className="text-danger">No wallet assigned</span>}
                    </div>
                  </div>
                </div>

                <div className="card-footer">
                  <button
                    disabled={!pending || processing === asset.id}
                    onClick={() => handleProcessSettlement(asset.id)}
                    className={`btn w-full py-2 ${pending ? "btn-primary" : "btn-outline-secondary"}`}
                  >
                    {processing === asset.id
                      ? "Processing…"
                      : pending
                        ? `Process Payout ($${Number(asset.pending).toFixed(2)})`
                        : "No Pending Payout"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
}
