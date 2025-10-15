import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download, FileText, Image, FileSpreadsheet } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ExportDashboardDataProps {
  data: Record<string, unknown>[];
  fileName?: string;
  columns?: { key: string; header: string }[];
  title?: string;
  description?: string;
}

export function ExportDashboardData({ 
  data, 
  fileName = 'dashboard-data', 
  columns = [],
  title = 'Laporan Dashboard',
  description = 'Laporan data dari dashboard admin'
}: ExportDashboardDataProps) {
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

  // Fungsi untuk mengonversi data ke format PDF
  const exportToPDF = () => {
    const doc = new jsPDF();
    
    // Tambahkan judul
    doc.setFontSize(18);
    doc.text(title, 14, 20);
    
    // Tambahkan deskripsi
    doc.setFontSize(12);
    doc.text(description, 14, 30);
    
    // Siapkan data untuk tabel
    const tableColumn = columns.length > 0 
      ? columns.map(col => col.header)
      : Object.keys(data[0] || {});
    
    const tableRows = data.map(item => {
      return columns.length > 0
        ? columns.map(col => String(item[col.key]))
        : Object.values(item).map(value => String(value));
    });
    
    // Tambahkan tabel
    autoTable(doc, {
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246] }, // bg-blue-500
      styles: { cellPadding: 3, fontSize: 10 }
    });
    
    // Simpan dokumen
    doc.save(`${fileName}.pdf`);
  };

  // Fungsi untuk mengonversi data ke format gambar (screenshot)
  const exportToImage = () => {
    // Ambil elemen yang akan diubah menjadi gambar
    const dashboardElement = document.querySelector('.dashboard-content');
    
    if (dashboardElement) {
      // Menggunakan html2canvas untuk mengambil screenshot
      import('html2canvas').then(module => {
        const html2canvas = module.default;
        html2canvas(dashboardElement as HTMLElement).then(canvas => {
          // Konversi canvas ke data URL
          const imgData = canvas.toDataURL('image/png');
          
          // Buat link untuk download
          const link = document.createElement('a');
          link.href = imgData;
          link.download = `${fileName}.png`;
          link.click();
        });
      });
    } else {
      console.error('Elemen dashboard tidak ditemukan');
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Ekspor Data
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
        <DropdownMenuItem onClick={exportToCSV} className="text-gray-200 focus:bg-gray-700">
          <FileSpreadsheet className="h-4 w-4 mr-2" />
          Ekspor ke CSV
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
          Ekspor ke Gambar
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}