import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  RotateCcw, 
  CheckCircle, 
  AlertCircle, 
  FileText,
  Edit3
} from 'lucide-react';

interface SeoPage {
  id: string;
  url: string;
  title: string;
  description: string;
  status: 'published' | 'draft' | 'archived';
  selected?: boolean;
}

interface BulkSeoUpdateProps {
  initialPages: SeoPage[];
  onUpdate: (pages: SeoPage[]) => void;
}

export default function BulkSeoUpdate({ initialPages, onUpdate }: BulkSeoUpdateProps) {
  const [pages, setPages] = useState<SeoPage[]>(initialPages);
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [updateMessage, setUpdateMessage] = useState('');
  
  // State untuk field yang akan diupdate secara bulk
  const [bulkTitle, setBulkTitle] = useState('');
  const [bulkDescription, setBulkDescription] = useState('');
  const [appendTitle, setAppendTitle] = useState(false);
  const [appendDescription, setAppendDescription] = useState(false);

  // Toggle selection semua halaman
  const toggleSelectAll = () => {
    const allSelected = pages.every(page => page.selected);
    setPages(pages.map(page => ({ ...page, selected: !allSelected })));
  };

  // Toggle selection satu halaman
  const toggleSelectPage = (id: string) => {
    setPages(pages.map(page => 
      page.id === id ? { ...page, selected: !page.selected } : page
    ));
  };

  // Update SEO secara bulk
  const handleBulkUpdate = () => {
    setIsUpdating(true);
    setUpdateStatus('idle');
    
    try {
      const updatedPages = pages.map(page => {
        if (!page.selected) return page;
        
        let updatedTitle = page.title;
        let updatedDescription = page.description;
        
        if (bulkTitle) {
          updatedTitle = appendTitle ? `${page.title} ${bulkTitle}` : bulkTitle;
        }
        
        if (bulkDescription) {
          updatedDescription = appendDescription ? `${page.description} ${bulkDescription}` : bulkDescription;
        }
        
        return {
          ...page,
          title: updatedTitle,
          description: updatedDescription
        };
      });
      
      setPages(updatedPages);
      onUpdate(updatedPages);
      
      setUpdateStatus('success');
      setUpdateMessage(`${updatedPages.filter(p => p.selected).length} halaman berhasil diperbarui`);
      
      // Reset field setelah update
      setBulkTitle('');
      setBulkDescription('');
      setAppendTitle(false);
      setAppendDescription(false);
    } catch {
      setUpdateStatus('error');
      setUpdateMessage('Terjadi kesalahan saat memperbarui halaman');
    } finally {
      setIsUpdating(false);
    }
  };

  // Reset semua perubahan
  const handleReset = () => {
    setPages(initialPages);
    setBulkTitle('');
    setBulkDescription('');
    setAppendTitle(false);
    setAppendDescription(false);
    setUpdateStatus('idle');
    setUpdateMessage('');
  };

  // Jumlah halaman yang dipilih
  const selectedCount = pages.filter(page => page.selected).length;

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white flex items-center">
              <Edit3 className="h-5 w-5 mr-2" />
              Bulk Update SEO
            </CardTitle>
            <CardDescription className="text-gray-400">
              Perbarui SEO untuk banyak halaman sekaligus
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isUpdating}
              className="text-gray-300 hover:text-white border-gray-600"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
            <Button
              onClick={handleBulkUpdate}
              disabled={isUpdating || selectedCount === 0}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? (
                <>
                  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-b-2 border-white"></div>
                  Memperbarui...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Update {selectedCount} Halaman
                </>
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Status update */}
        {updateStatus !== 'idle' && (
          <div className={`mb-4 p-3 rounded-lg flex items-center ${
            updateStatus === 'success' 
              ? 'bg-green-900/20 text-green-400 border border-green-700' 
              : 'bg-red-900/20 text-red-400 border border-red-700'
          }`}>
            {updateStatus === 'success' ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <AlertCircle className="h-5 w-5 mr-2" />
            )}
            {updateMessage}
          </div>
        )}

        {/* Form untuk bulk update */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-gray-750/50 rounded-lg">
          <div className="space-y-2">
            <Label htmlFor="bulkTitle" className="text-gray-200">
              Judul (akan menggantikan atau menambahkan ke judul saat ini)
            </Label>
            <Input
              id="bulkTitle"
              value={bulkTitle}
              onChange={(e) => setBulkTitle(e.target.value)}
              placeholder="Masukkan judul baru..."
              className="bg-gray-750 border-gray-700 text-white"
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="appendTitle"
                checked={appendTitle}
                onCheckedChange={(checked) => setAppendTitle(!!checked)}
                className="border-gray-600 data-[state=checked]:bg-blue-600"
              />
              <Label htmlFor="appendTitle" className="text-gray-300 text-sm">
                Tambahkan ke judul saat ini (bukan gantikan)
              </Label>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bulkDescription" className="text-gray-200">
              Deskripsi (akan menggantikan atau menambahkan ke deskripsi saat ini)
            </Label>
            <Textarea
              id="bulkDescription"
              value={bulkDescription}
              onChange={(e) => setBulkDescription(e.target.value)}
              placeholder="Masukkan deskripsi baru..."
              className="bg-gray-750 border-gray-700 text-white min-h-[100px]"
            />
            <div className="flex items-center space-x-2">
              <Checkbox
                id="appendDescription"
                checked={appendDescription}
                onCheckedChange={(checked) => setAppendDescription(!!checked)}
                className="border-gray-600 data-[state=checked]:bg-blue-600"
              />
              <Label htmlFor="appendDescription" className="text-gray-300 text-sm">
                Tambahkan ke deskripsi saat ini (bukan gantikan)
              </Label>
            </div>
          </div>
        </div>

        {/* Daftar halaman */}
        <div className="border border-gray-700 rounded-lg overflow-hidden">
          <div className="bg-gray-750 border-b border-gray-700 p-3 flex items-center">
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={pages.length > 0 && pages.every(page => page.selected)}
                onCheckedChange={toggleSelectAll}
                className="border-gray-600 data-[state=checked]:bg-blue-600"
              />
              <span className="text-gray-300">
                {selectedCount} dari {pages.length} halaman dipilih
              </span>
            </div>
            <div className="ml-auto text-sm text-gray-400">
              {selectedCount > 0 && (
                <span className="text-blue-400">
                  {selectedCount} halaman akan diperbarui
                </span>
              )}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {pages.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <FileText className="h-10 w-10 mx-auto text-gray-600" />
                <p className="mt-2">Tidak ada halaman untuk ditampilkan</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-750 sticky top-0">
                  <tr>
                    <th className="p-3 text-left text-gray-400 font-medium w-12">#</th>
                    <th className="p-3 text-left text-gray-400 font-medium">URL</th>
                    <th className="p-3 text-left text-gray-400 font-medium">Judul</th>
                    <th className="p-3 text-left text-gray-400 font-medium">Deskripsi</th>
                    <th className="p-3 text-left text-gray-400 font-medium w-24">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {pages.map((page) => (
                    <tr 
                      key={page.id} 
                      className={`hover:bg-gray-750/50 ${
                        page.selected ? 'bg-gray-750/30' : ''
                      }`}
                    >
                      <td className="p-3">
                        <Checkbox
                          checked={!!page.selected}
                          onCheckedChange={() => toggleSelectPage(page.id)}
                          className="border-gray-600 data-[state=checked]:bg-blue-600"
                        />
                      </td>
                      <td className="p-3 text-gray-300 max-w-xs truncate">
                        {page.url}
                      </td>
                      <td className="p-3 text-gray-300 max-w-xs truncate">
                        {page.title}
                      </td>
                      <td className="p-3 text-gray-400 max-w-xs truncate">
                        {page.description}
                      </td>
                      <td className="p-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          page.status === 'published' 
                            ? 'bg-green-900/30 text-green-400 border border-green-900/50' 
                            : page.status === 'draft'
                              ? 'bg-yellow-900/30 text-yellow-400 border border-yellow-900/50'
                              : 'bg-gray-700 text-gray-300'
                        }`}>
                          {page.status.charAt(0).toUpperCase() + page.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}