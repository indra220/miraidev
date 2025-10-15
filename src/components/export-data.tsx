import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Download } from 'lucide-react';

interface ExportDataProps<T> {
  data: T[];
  fileName?: string;
  columns?: { key: string; header: string }[];
}

export function ExportData<T extends Record<string, unknown>>({ data, fileName = 'data', columns = [] }: ExportDataProps<T>) {
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

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center">
          <Download className="h-4 w-4 mr-2" />
          Ekspor
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="bg-gray-800 border-gray-700 text-white">
        <DropdownMenuItem onClick={exportToCSV} className="text-gray-200 focus:bg-gray-700">
          Ekspor ke CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportToJSON} className="text-gray-200 focus:bg-gray-700">
          Ekspor ke JSON
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}