import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, MoreHorizontal } from 'lucide-react';

interface VirtualDataTableProps<TData> {
  columns: {
    id: string;
    title: string;
    render: (row: TData) => React.ReactNode;
    sortable?: boolean;
  }[];
  data: TData[];
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  onFilter?: (columnId: string, value: string) => void;
  itemHeight?: number;
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  exportFileName?: string;
  exportColumns?: { key: string; header: string }[];
}

export function VirtualDataTable<TData>({ 
  columns, 
  data, 
  onSort,
  exportFileName
}: VirtualDataTableProps<TData>) {
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (columnId: string) => {
    if (!onSort) return;
    
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === columnId && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key: columnId, direction });
    onSort(columnId, direction);
  };





  return (
    <div className="rounded-md border border-gray-700 bg-gray-800 overflow-hidden">
      {/* Export button */}
      {exportFileName && (
        <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-end">
          <Button variant="outline" className="flex items-center">
            <span>Ekspor</span>
          </Button>
        </div>
      )}
      
      <div className="w-full overflow-auto max-h-[600px]">
        <div className="min-w-full">
          {/* Header */}
          <div className="flex border-b border-gray-700 bg-gray-750 sticky top-0 z-10">
            {columns.map((column) => (
              <div 
                key={column.id}
                className={`p-4 text-left align-middle font-medium text-gray-300 text-sm border-r border-gray-700 last:border-r-0 flex-1 ${
                  column.sortable ? 'cursor-pointer hover:bg-gray-700' : ''
                }`}
                onClick={() => column.sortable && handleSort(column.id)}
              >
                <div className="flex items-center">
                  {column.title}
                  {column.sortable && (
                    <ChevronDown className="ml-1 h-4 w-4" />
                  )}
                </div>
              </div>
            ))}
            <div className="p-4 text-right align-middle font-medium text-gray-300 text-sm border-r border-gray-700 w-[60px]">
              Aksi
            </div>
          </div>
          
          {/* Virtualized List */}
          <div className="h-[600px] overflow-auto">
            <div className="min-w-full">
              {data.map((row, index) => (
                <div 
                  key={index} 
                  className="flex border-b border-gray-700 hover:bg-gray-750 transition-colors"
                >
                  {columns.map((column) => (
                    <div 
                      key={column.id} 
                      className="p-4 align-middle text-sm text-gray-200 border-r border-gray-700 last:border-r-0 flex-1 truncate"
                    >
                      {column.render(row)}
                    </div>
                  ))}
                  <div className="p-4 align-middle text-right border-r border-gray-700 flex items-center justify-center">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}