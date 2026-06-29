// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import StatsOverview from '@/components/dashboard/StatsOverview';
import PortfolioSummary from '@/components/dashboard/PortfolioSummary';
import HotelAssetCard from '@/components/dashboard/HotelAssetCard';

const MainPage = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvestments = async () => {
      try {
        // TODO: Replace with your actual API endpoint
        // const response = await fetch('/api/user/investments');
        // const data = await response.json();
        
        // Mock data for now
        const mockInvestments = [
          {
            id: 1,
            hotelName: 'Grand Plaza Hotel',
            location: 'New York',
            tokensOwned: 100,
            tokenValue: 50,
            totalValue: 5000,
            monthlyRewards: 250,
            image: '/hotel-placeholder.jpg'
          },
          {
            id: 2,
            hotelName: 'Beachside Resort',
            location: 'Miami',
            tokensOwned: 50,
            tokenValue: 75,
            totalValue: 3750,
            monthlyRewards: 180,
            image: '/hotel-placeholder.jpg'
          }
        ];
        
        setInvestments(mockInvestments);
      } catch (error) {
        console.error('Error fetching investments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInvestments();
  }, []);

  // Calculate totals
  const totalValue = investments.reduce((sum, inv) => sum + inv.totalValue, 0);
  const totalRewards = investments.reduce((sum, inv) => sum + inv.monthlyRewards, 0);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-xl text-gray-600">Loading your investments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {user?.name || 'Investor'}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your hospitality investments
        </p>
      </div>

      {/* Stats Overview */}
      <div className="mb-8">
        <StatsOverview />
      </div>

      {/* Portfolio Summary */}
      <div className="mb-8">
        <PortfolioSummary 
          investments={investments}
          totalValue={totalValue}
          totalRewards={totalRewards}
        />
      </div>

      {/* Hotel Assets Grid */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Your Hotel Assets</h2>
        {investments.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investments.map((investment) => (
              <HotelAssetCard 
                key={investment.id}
                hotel={investment}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 mb-4">You don't have any hotel investments yet.</p>
            <a 
              href="/marketplace" 
              className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Explore Marketplace
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default MainPage;
