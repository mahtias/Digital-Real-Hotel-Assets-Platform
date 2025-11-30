import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Building2, SlidersHorizontal } from "lucide-react";
import HotelAssetCard from "@/components/dashboard/HotelAssetCard";

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { data: hotels = [], isLoading } = useQuery({
    queryKey: ['hotels', sortBy],
    queryFn: () => {
      const sortOrder = sortBy === 'newest' ? '-created_date' : 
                        sortBy === 'apy' ? '-apy' : 
                        sortBy === 'price_low' ? 'token_price' : '-token_price';
      return base44.entities.HotelAsset.list(sortOrder, 50);
    },
  });

  const filteredHotels = hotels.filter(hotel => {
    const matchesSearch = hotel.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hotel.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          hotel.country?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || hotel.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: hotels.length,
    active: hotels.filter(h => h.status === 'active').length,
    upcoming: hotels.filter(h => h.status === 'upcoming').length,
    sold_out: hotels.filter(h => h.status === 'sold_out').length,
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <Building2 className="w-8 h-8 text-amber-400" />
            酒店资产市场
          </h1>
          <p className="text-slate-400">探索全球优质代币化酒店资产，开始您的投资之旅</p>
        </div>

        {/* Filters */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="搜索酒店名称、地区..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
              />
            </div>
            
            <div className="flex gap-3">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-36 bg-slate-800 border-slate-700 text-white">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="all">全部状态 ({statusCounts.all})</SelectItem>
                  <SelectItem value="active">募集中 ({statusCounts.active})</SelectItem>
                  <SelectItem value="upcoming">即将上线 ({statusCounts.upcoming})</SelectItem>
                  <SelectItem value="sold_out">已售罄 ({statusCounts.sold_out})</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-36 bg-slate-800 border-slate-700 text-white">
                  <SlidersHorizontal className="w-4 h-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-700">
                  <SelectItem value="newest">最新上架</SelectItem>
                  <SelectItem value="apy">收益最高</SelectItem>
                  <SelectItem value="price_low">价格从低到高</SelectItem>
                  <SelectItem value="price_high">价格从高到低</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Badges */}
          <div className="flex flex-wrap gap-2 mt-4">
            {['all', 'active', 'upcoming', 'sold_out'].map((status) => (
              <Badge
                key={status}
                variant={statusFilter === status ? "default" : "outline"}
                className={`cursor-pointer transition-all ${
                  statusFilter === status 
                    ? 'bg-amber-500 text-slate-900 hover:bg-amber-600' 
                    : 'border-slate-700 text-slate-400 hover:border-amber-500/50 hover:text-amber-400'
                }`}
                onClick={() => setStatusFilter(status)}
              >
                {status === 'all' ? '全部' : 
                 status === 'active' ? '募集中' : 
                 status === 'upcoming' ? '即将上线' : '已售罄'}
                <span className="ml-1 opacity-70">({statusCounts[status]})</span>
              </Badge>
            ))}
          </div>
        </div>

        {/* Results */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-slate-900/50 border border-slate-800 rounded-xl h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredHotels.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredHotels.map((hotel) => (
              <HotelAssetCard key={hotel.id} hotel={hotel} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-slate-700 mx-auto mb-4" />
            <h3 className="text-xl text-white mb-2">未找到匹配的酒店资产</h3>
            <p className="text-slate-400">请尝试调整筛选条件</p>
          </div>
        )}
      </div>
    </div>
  );
}