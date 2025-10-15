import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, Image, FileSpreadsheet, BarChart3 } from 'lucide-react';

interface ExportAnalyticsDataProps {
  data: Record<string, unknown>[];
  fileName?: string;
  columns?: { key: string; header: string }[];
  chartRef?: React.RefObject<HTMLDivElement>; // Untuk export gambar chart
}

export function ExportAnalyticsData({ 
  data, 
  fileName = 'analytics-data', 
  columns = [],
  chartRef
}: ExportAnalyticsDataProps) {
  // Fungsi untuk mengonversi data ke format CSV
  const exportToCSV = () => {
    if (!data || data.length === 0) return;

    // Jika tidak ada kolom yang ditentukan, gunakan semua kunci dari item pertama
    const keys = columns.length > 0 
      ? columns.map(col => col.key) 
      : Object.keys(data[0] || {});

    // Header CSV
    const headers = columns.length > 0
      ? columns.map(col => col.header).join(',')
      : keys.join(',');

    // Baris data
    const rows = data.map(item => 
      keys.map(key => {
        const value = item[key];
        // Escape commas and wrap in quotes if needed
        return typeof value === 'string' && value.includes(',') 
          ? `"${value.replace(/"/g, '""')}"` 
          : value;
      }).join(',')
    ).join('\n');

    // Gabungkan header dan baris
    const csvContent = `${headers}\n${rows}`;
    
    // Buat dan unduh file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fungsi untuk mengonversi data ke format JSON
  const exportToJSON = () => {
    const jsonData = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonData], { type: 'application/json' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `${fileName}.json`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fungsi untuk mengonversi data ke format Excel
  const exportToExcel = () => {
    // Dalam implementasi sebenarnya, kita akan menggunakan library seperti xlsx
    // Untuk saat ini, kita hanya menyediakan CSV yang kompatibel dengan Excel
    exportToCSV();
  };

  // Fungsi untuk mengonversi data ke format PDF
  const exportToPDF = () => {
    // Dalam implementasi sebenarnya, kita akan menggunakan jsPDF atau library serupa
    alert('Fungsi export ke PDF akan diimplementasikan dengan library jsPDF');
  };

  // Fungsi untuk mengonversi chart ke gambar
  const exportChartToImage = () => {
    if (chartRef && chartRef.current) {
      // Dalam implementasi sebenarnya, kita akan menggunakan html2canvas
      alert('Fungsi export chart ke gambar akan diimplementasikan dengan html2canvas');
    } else {
      console.error('Referensi chart tidak ditemukan');
    }
  };

  // Fungsi untuk mengonversi data ke format gambar (tabel)
  const exportToImage = () => {
    // Dalam implementasi sebenarnya, kita akan menggunakan html2canvas
    alert('Fungsi export data ke gambar akan diimplementasikan dengan html2canvas');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Ekspor Analitik
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
        <DropdownMenuItem onClick={exportToCSV} className="text-gray-200 focus:bg-gray-700">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Ekspor ke CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToExcel} className="text-gray-200 focus:bg-gray-700">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Ekspor ke Excel
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON} className="text-gray-200 focus:bg-gray-700">
          <FileText className="h-4 w-4 mr-2" />
          Ekspor ke JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToPDF} className="text-gray-200 focus:bg-gray-700">
          <FileText className="h-4 w-4 mr-2" />
          Ekspor ke PDF
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToImage} className="text-gray-200 focus:bg-gray-700">
          <Image className="h-4 w-4 mr-2" />
          Ekspor Tabel ke Gambar
        </DropdownMenuItem>
        {chartRef && (
          <DropdownMenuItem onClick={exportChartToImage} className="text-gray-200 focus:bg-gray-700">
            <BarChart3 className="h-4 w-4 mr-2" />
            Ekspor Chart ke Gambar
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}