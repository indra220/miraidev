'use client';

import * as React from 'react';
import { ChevronDown, MoreHorizontal } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Pagination } from './pagination';
import { ExportData } from './export-data';

interface DataTableProps<TData extends Record<string, unknown>> {
  columns: {
    id: string;
    title: string;
    render: (row: TData) => React.ReactNode;
    sortable?: boolean;
  }[];
  data: TData[];
  onSort?: (columnId: string, direction: 'asc' | 'desc') => void;
  onFilter?: (columnId: string, value: string) => void;
  totalItems?: number;
  currentPage?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  exportFileName?: string;
  exportColumns?: { key: string; header: string }[];
}

export function DataTable<TData extends Record<string, unknown>>({ 
  columns, 
  data, 
  onSort,
  onFilter,
  totalItems = 0,
  currentPage = 1,
  pageSize = 10,
  onPageChange,
  onPageSizeChange,
  exportFileName,
  exportColumns
}: DataTableProps<TData>) {
  const [openFilter, setOpenFilter] = React.useState<string | null>(null);
  const [sortConfig, setSortConfig] = React.useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);

  const handleSort = (columnId: string) => {
    if (!onSort) return;
    
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === columnId && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key: columnId, direction });
    onSort(columnId, direction);
  };

  const handleFilter = (columnId: string, value: string) => {
    if (onFilter) {
      onFilter(columnId, value);
    }
    setOpenFilter(null);
  };

  const getUniqueColumnValues = (columnId: string) => {
    const values = Array.from(new Set(data.map(item => {
      // Dengan asumsi bahwa item adalah objek, kita bisa mengakses propertinya
      const itemObj = item as Record<string, unknown>;
      return String(columnId in itemObj ? itemObj[columnId] : '');
    })));
    return values;
  };

  // Hitung total halaman
  const totalPages = Math.ceil(totalItems / pageSize);

  return (
    <div className="rounded-md border border-gray-700 bg-gray-800 overflow-hidden">
      {/* Export button */}
      {exportFileName && (
        <div className="p-4 border-b border-gray-700 bg-gray-800 flex justify-end">
          <ExportData 
            data={data} 
            fileName={exportFileName} 
            columns={exportColumns} 
          />
        </div>
      )}
      
      <div className="relative w-full overflow-auto">
        <table className="w-full">
          <thead className="bg-gray-750 sticky top-0 z-10">
            <tr>
              {columns.map((column) => (
                <th 
                  key={column.id}
                  className={cn(
                    'h-12 px-4 text-left align-middle font-medium text-gray-300 text-sm',
                    column.sortable ? 'cursor-pointer hover:bg-gray-700' : ''
                  )}
                  onClick={() => column.sortable && handleSort(column.id)}
                >
                  <div className="flex items-center">
                    {column.title}
                    {column.sortable && (
                      <ChevronDown className="ml-1 h-4 w-4" />
                    )}
                  </div>
                </th>
              ))}
              <th className="h-12 px-4 text-right align-middle font-medium text-gray-300 text-sm">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700">
            {data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="border-b border-gray-700 transition-colors hover:bg-gray-750"
              >
                {columns.map((column) => (
                  <td 
                    key={column.id} 
                    className="p-4 align-middle text-sm text-gray-200"
                  >
                    {column.render(row)}
                  </td>
                ))}
                <td className="p-4 align-middle text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {onPageChange && onPageSizeChange && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          totalItems={totalItems}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      )}
      
      {/* Filter dropdown */}
      {openFilter && (
        <div className="absolute z-10 mt-1 w-48 rounded-md bg-gray-800 border border-gray-700 shadow-lg">
          <Command>
            <CommandInput placeholder="Cari..." />
            <CommandList>
              <CommandEmpty>Tidak ditemukan</CommandEmpty>
              <CommandGroup>
                {getUniqueColumnValues(openFilter).map((value) => (
                  <CommandItem
                    key={value}
                    value={value}
                    onSelect={() => handleFilter(openFilter, value)}
                  >
                    {value}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      )}
    </div>
  );
}