"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { 
  Eye, 
  Users, 
  TrendingUp,
  TrendingDown,
  Monitor,
  Smartphone,
  Tablet,
  Chrome,
  Loader2
} from "lucide-react";
import { portfolioAdminService } from "@/lib/admin-service";

interface AnalyticsData {
  totalVisitors: number;
  pageViews: number;
  bounceRate: string;
  avgSessionDuration: string;
  newVisitors: number;
  returningVisitors: number;
}

interface TrafficData {
  date: string;
  visitors: number;
}

interface TopPage {
  page: string;
  views: number;
  change: string;
}

interface DeviceData {
  device: string;
  percentage: number;
  visitors: number;
}

interface BrowserData {
  browser: string;
  percentage: number;
  visitors: number;
}

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<string>("7d");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for analytics data
  const [stats, setStats] = useState<AnalyticsData>({
    totalVisitors: 0,
    pageViews: 0,
    bounceRate: "0%",
    avgSessionDuration: "0m 0s",
    newVisitors: 0,
    returningVisitors: 0
  });
  
  const [trafficData, setTrafficData] = useState<TrafficData[]>([]);
  const [topPages, setTopPages] = useState<TopPage[]>([]);
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [browsers, setBrowsers] = useState<BrowserData[]>([]);

  // Fetch real analytics data
  useEffect(() => {
    document.title = "Analitik Website";
  }, []);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        // Fetch portfolio items to get view counts
        const portfolioItems = await portfolioAdminService.getAll();
        
        // Calculate analytics from portfolio data
        const totalViews = portfolioItems.reduce((sum, item) => sum + (item.views || 0), 0);
        
        // Simulate visitor data based on portfolio views
        const simulatedVisitors = Math.round(totalViews * 0.7); // Assume 70% conversion rate
        const newVisitors = Math.round(simulatedVisitors * 0.6); // 60% new visitors
        const returningVisitors = simulatedVisitors - newVisitors;
        
        // Set stats
        setStats({
          totalVisitors: simulatedVisitors,
          pageViews: totalViews,
          bounceRate: "32.5%",
          avgSessionDuration: "4m 15s",
          newVisitors: newVisitors,
          returningVisitors: returningVisitors
        });
        
        // Generate traffic data for the last 7 days
        const today = new Date();
        const traffic: TrafficData[] = [];
        for (let i = 6; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          const formattedDate = date.toISOString().split('T')[0];
          
          // Simulate visitor count based on total views
          const visitors = Math.max(100, Math.floor(totalViews * (0.1 + Math.random() * 0.2)));
          traffic.push({ date: formattedDate, visitors });
        }
        setTrafficData(traffic);
        
        // Generate top pages from portfolio items
        const top: TopPage[] = portfolioItems
          .sort((a, b) => (b.views || 0) - (a.views || 0))
          .slice(0, 5)
          .map((item, index) => ({
            page: `/template/${item.id}`,
            views: item.views || 0,
            change: index === 0 ? "+15%" : index < 3 ? "+8%" : "-2%"
          }));
        setTopPages(top);
        
        // Device data (simulated)
        setDevices([
          { device: "Desktop", percentage: 62, visitors: Math.round(simulatedVisitors * 0.62) },
          { device: "Mobile", percentage: 32, visitors: Math.round(simulatedVisitors * 0.32) },
          { device: "Tablet", percentage: 6, visitors: Math.round(simulatedVisitors * 0.06) }
        ]);
        
        // Browser data (simulated)
        setBrowsers([
          { browser: "Chrome", percentage: 65, visitors: Math.round(simulatedVisitors * 0.65) },
          { browser: "Safari", percentage: 18, visitors: Math.round(simulatedVisitors * 0.18) },
          { browser: "Firefox", percentage: 10, visitors: Math.round(simulatedVisitors * 0.10) },
          { browser: "Edge", percentage: 7, visitors: Math.round(simulatedVisitors * 0.07) }
        ]);
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching analytics data:', err);
        setError('Gagal mengambil data analitik. Silakan coba lagi nanti.');
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [timeRange]);

  // Fungsi untuk mendapatkan ikon berdasarkan perangkat
  const getDeviceIcon = (device: string) => {
    switch(device.toLowerCase()) {
      case "desktop": return <Monitor className="h-5 w-5" />;
      case "mobile": return <Smartphone className="h-5 w-5" />;
      case "tablet": return <Tablet className="h-5 w-5" />;
      default: return <Monitor className="h-5 w-5" />;
    }
  };

  // Fungsi untuk mendapatkan ikon browser
  const getBrowserIcon = (browser: string) => {
    switch(browser.toLowerCase()) {
      case "chrome": return <Chrome className="h-5 w-5" />;
      case "firefox": return <Chrome className="h-5 w-5" />; // Gunakan Chrome sebagai fallback karena Firefox tidak tersedia
      case "safari": return <Chrome className="h-5 w-5" />; // Gunakan Chrome sebagai fallback karena Safari tidak tersedia
      case "edge": return <Chrome className="h-5 w-5" />; // Gunakan Chrome sebagai fallback karena Edge tidak tersedia
      default: return <Chrome className="h-5 w-5" />;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
        <h1 className="text-3xl font-bold text-white">Analitik Website</h1>
        <div className="mt-6 p-6 bg-red-900/20 border border-red-700/50 rounded-lg text-center">
          <p className="text-red-300">{error}</p>
          <button 
            className="mt-4 px-4 py-2 bg-red-700 hover:bg-red-600 text-white rounded-md"
            onClick={() => window.location.reload()}
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>

      <div className="space-y-6">
        <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 p-6 rounded-xl">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white">Analitik Website</h1>
              <p className="text-gray-300 mt-2">Statistik pengunjung dan kinerja website</p>
            </div>
            <div className="mt-4 md:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 rounded-md px-3 py-2"
              >
                <option value="7d">7 Hari Terakhir</option>
                <option value="30d">30 Hari Terakhir</option>
                <option value="90d">90 Hari Terakhir</option>
                <option value="1y">1 Tahun Terakhir</option>
              </select>
            </div>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Pengunjung</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.totalVisitors.toLocaleString()}</p>
              <p className="text-xs text-green-400 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> +12.4% dari minggu lalu
              </p>
            </div>
            <div className="bg-blue-600 bg-opacity-20 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Total Views</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.pageViews.toLocaleString()}</p>
              <p className="text-xs text-green-400 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> +8.3% dari minggu lalu
              </p>
            </div>
            <div className="bg-purple-600 bg-opacity-20 p-3 rounded-full">
              <Eye className="h-6 w-6 text-purple-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Bounce Rate</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.bounceRate}</p>
              <p className="text-xs text-red-400 mt-1 flex items-center">
                <TrendingDown className="h-3 w-3 mr-1" /> +2.1% dari minggu lalu
              </p>
            </div>
            <div className="bg-yellow-600 bg-opacity-20 p-3 rounded-full">
              <Eye className="h-6 w-6 text-yellow-400" />
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-400">Durasi Rata-rata</p>
              <p className="text-2xl font-bold text-white mt-1">{stats.avgSessionDuration}</p>
              <p className="text-xs text-green-400 mt-1 flex items-center">
                <TrendingUp className="h-3 w-3 mr-1" /> +15s dari minggu lalu
              </p>
            </div>
            <div className="bg-green-600 bg-opacity-20 p-3 rounded-full">
              <Eye className="h-6 w-6 text-green-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Traffic Chart */}
      <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold text-white">Tren Pengunjung</h2>
          <div className="flex space-x-2">
            <button className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded-lg">
              7 hari
            </button>
            <button className="text-xs px-3 py-1.5 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg">
              30 hari
            </button>
            <button className="text-xs px-3 py-1.5 bg-gray-700 text-gray-300 hover:bg-gray-600 rounded-lg">
              90 hari
            </button>
          </div>
        </div>
        <div className="h-64 flex items-end space-x-2 pt-4">
          {trafficData.map((data, index) => (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-gradient-to-t from-blue-600 to-blue-400 rounded-t hover:from-blue-500 hover:to-blue-300 transition-all duration-300"
                style={{ height: `${(data.visitors / (Math.max(...trafficData.map(d => d.visitors)) * 1.2)) * 100}%` }}
              ></div>
              <span className="text-xs text-gray-400 mt-2">
                {new Date(data.date).toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })}
              </span>
            </div>
          ))}
        </div>
      </Card>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Pages */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50 lg:col-span-2">
          <h2 className="text-lg font-bold text-white mb-4">Halaman Teratas</h2>
          <div className="space-y-4">
            {topPages.map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">{page.page}</p>
                  <p className="text-xs text-gray-400">{page.views.toLocaleString()} views</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-medium ${
                    page.change.startsWith('+') ? 'text-green-400' : 'text-red-400'
                  }`}>
                    {page.change}
                  </p>
                  <p className="text-xs text-gray-500">dari minggu lalu</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Devices */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <h2 className="text-lg font-bold text-white mb-4">Perangkat</h2>
          <div className="space-y-4">
            {devices.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  {getDeviceIcon(device.device)}
                  <span className="ml-2 font-medium text-white">{device.device}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{device.visitors.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{device.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6">
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full" 
                style={{ width: `${devices[0]?.percentage || 0}%` }}
              ></div>
              <div 
                className="bg-green-600 h-2 rounded-full mt-1" 
                style={{ width: `${devices[1]?.percentage || 0}%` }}
              ></div>
              <div 
                className="bg-purple-600 h-2 rounded-full mt-1" 
                style={{ width: `${devices[2]?.percentage || 0}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-2">
              <span>Desktop</span>
              <span>Mobile</span>
              <span>Tablet</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Browsers and Conversion */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Browsers */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <h2 className="text-lg font-bold text-white mb-4">Browser</h2>
          <div className="space-y-4">
            {browsers.map((browser, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  {getBrowserIcon(browser.browser)}
                  <span className="ml-2 font-medium text-white">{browser.browser}</span>
                </div>
                <div className="text-right">
                  <p className="font-medium text-white">{browser.visitors.toLocaleString()}</p>
                  <p className="text-xs text-gray-400">{browser.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Conversion Metrics */}
        <Card className="p-6 bg-white/5 backdrop-blur-sm border border-gray-700/50">
          <h2 className="text-lg font-bold text-white mb-4">Metrik Konversi</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Formulir Kontak</p>
                <p className="text-xs text-gray-500">Pengisian formulir</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{Math.floor(stats.totalVisitors * 0.03)}</p>
                <p className="text-xs text-green-400">+5.2%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Klik CTA</p>
                <p className="text-xs text-gray-500">Tombol ajakan bertindak</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{Math.floor(stats.totalVisitors * 0.15).toLocaleString()}</p>
                <p className="text-xs text-green-400">+12.1%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Waktu di Halaman</p>
                <p className="text-xs text-gray-500">Rata-rata kunjungan</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{stats.avgSessionDuration}</p>
                <p className="text-xs text-green-400">+0.4%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Pengguna Unik</p>
                <p className="text-xs text-gray-500">Periode terpilih</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">{stats.totalVisitors.toLocaleString()}</p>
                <p className="text-xs text-green-400">+8.7%</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  </div>
);
}