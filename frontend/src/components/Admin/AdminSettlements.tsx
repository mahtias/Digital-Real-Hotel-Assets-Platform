import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from 'react-router-dom';
//import { Button } from "@/components/ui/button";

export default function AdminSettlements() {
     
const { id } = useParams<{ id: string }>();
const navigate = useNavigate();

  const [hotelAssets, setHotelAssets] = useState([]);
  const [loading, setLoading] = useState(false);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
  useEffect(() => {
    // Fetch the list of hotel assets (you can modify this based on your actual data source)
    async function fetchHotelAssets() {
      setLoading(true);
      try {
        const response = await axios.get(`${API_URL}/api/v1/hotels`);  // Modify with your correct API 
        setHotelAssets(response.data);
      } catch (err) {
        console.error("Error fetching hotel assets", err);
      } finally {
        setLoading(false);
      }
    }

    fetchHotelAssets();
  }, []);

  const handleProcessSettlement = async (hotelAssetId: string) => {
    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/api/v1/settlements/process/${hotelAssetId}`);
      alert(`Settlement processed for asset ID: ${hotelAssetId}`);
    } catch (err) {
      console.error("Error processing settlement", err);
      alert("Error processing settlement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
         <div className="container mx-auto px-4 py-6">
        <button
        onClick={() => navigate(-1)}>Back
                </button>
              </div>
      <h1 className="text-3xl font-bold mb-4">Manual Payouts</h1>

      {loading && <p>Loading...</p>}

      <div className="grid grid-cols-1 gap-6">
        {hotelAssets.map((asset: any) => (
          <div key={asset.id} className="p-6 border rounded-lg shadow hover:shadow-lg transition bg-white">
            <h2 className="text-xl font-bold mb-2">{asset.name}</h2>
            <p className="text-gray-500">{asset.location}</p>
            <button
              onClick={() => handleProcessSettlement(asset.id)}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              Process Payout
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}