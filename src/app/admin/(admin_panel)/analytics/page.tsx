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
  Chrome
} from "lucide-react";

// Mock data untuk statistik
const mockStats = {
  totalVisitors: 12429,
  pageViews: 24580,
  bounceRate: "34.2%",
  avgSessionDuration: "4m 22s",
  newVisitors: 8420,
  returningVisitors: 4009
};

const mockTrafficData = [
  { date: "2024-09-19", visitors: 1240 },
  { date: "2024-09-20", visitors: 1650 },
  { date: "2024-09-21", visitors: 1430 },
  { date: "2024-09-22", visitors: 1870 },
  { date: "2024-09-23", visitors: 1560 },
  { date: "2024-09-24", visitors: 1920 },
  { date: "2024-09-25", visitors: 2100 }
];

const mockTopPages = [
  { page: "/beranda", views: 3240, change: "+12%" },
  { page: "/layanan", views: 2876, change: "+8%" },
  { page: "/portofolio", views: 1987, change: "+15%" },
  { page: "/tentang", views: 1456, change: "-2%" },
  { page: "/kontak", views: 987, change: "+5%" }
];

const mockDevices = [
  { device: "Desktop", percentage: 65, visitors: 8079 },
  { device: "Mobile", percentage: 28, visitors: 3471 },
  { device: "Tablet", percentage: 7, visitors: 863 }
];

const mockBrowsers = [
  { browser: "Chrome", percentage: 62, visitors: 7707 },
  { browser: "Safari", percentage: 20, visitors: 2486 },
  { browser: "Firefox", percentage: 10, visitors: 1243 },
  { browser: "Edge", percentage: 8, visitors: 994 }
];

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = useState<string>("7d");
  const stats = mockStats;
  const trafficData = mockTrafficData;

  // Simulasikan pembaruan data
  useEffect(() => {
    // Dalam implementasi nyata, ini akan mengambil data dari API
    // console.log(`Data diperbarui untuk rentang waktu: ${timeRange}`);
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

  return (
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
                style={{ height: `${(data.visitors / 2500) * 100}%` }}
              ></div>
              <span className="text-xs text-gray-400 mt-2">
                {data.date.split('-')[2]}/{data.date.split('-')[1]}
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
            {mockTopPages.map((page, index) => (
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
            {mockDevices.map((device, index) => (
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
                style={{ width: "65%" }}
              ></div>
              <div 
                className="bg-green-600 h-2 rounded-full mt-1" 
                style={{ width: "28%" }}
              ></div>
              <div 
                className="bg-purple-600 h-2 rounded-full mt-1" 
                style={{ width: "7%" }}
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
            {mockBrowsers.map((browser, index) => (
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
                <p className="text-white font-bold">24</p>
                <p className="text-xs text-green-400">+5.2%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Klik CTA</p>
                <p className="text-xs text-gray-500">Tombol ajakan bertindak</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">1,230</p>
                <p className="text-xs text-green-400">+12.1%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Waktu di Halaman</p>
                <p className="text-xs text-gray-500">Rata-rata kunjungan</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">4m 22s</p>
                <p className="text-xs text-green-400">+0.4%</p>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-300">Pengguna Unik</p>
                <p className="text-xs text-gray-500">Periode terpilih</p>
              </div>
              <div className="text-right">
                <p className="text-white font-bold">8,420</p>
                <p className="text-xs text-green-400">+8.7%</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}