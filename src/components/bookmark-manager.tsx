'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, X, ExternalLink } from 'lucide-react';

interface Bookmark {
  id: string;
  title: string;
  url: string;
  createdAt: Date;
  tags?: string[];
}

interface BookmarkManagerProps {
  initialBookmarks?: Bookmark[];
}

export default function BookmarkManager({ initialBookmarks = [] }: BookmarkManagerProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('admin-bookmarks');
      return saved ? JSON.parse(saved, (key, value) => {
        if (key === 'createdAt') return new Date(value);
        return value;
      }) : initialBookmarks;
    }
    return initialBookmarks;
  });
  const [showManager, setShowManager] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  // Simpan bookmarks ke localStorage saat berubah
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('admin-bookmarks', JSON.stringify(bookmarks));
    }
  }, [bookmarks]);

  // Ambil URL halaman saat ini
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const addBookmark = () => {
    if (!currentUrl) return;

    // Ambil judul halaman dari title tag
    const title = document.title || new URL(currentUrl).pathname.split('/').pop() || 'Halaman Baru';

    const newBookmark: Bookmark = {
      id: Date.now().toString(),
      title,
      url: currentUrl,
      createdAt: new Date(),
      tags: ['Halaman Admin'] // Tag default
    };

    setBookmarks(prev => [newBookmark, ...prev]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks(prev => prev.filter(bookmark => bookmark.id !== id));
  };

  const isBookmarked = bookmarks.some(bookmark => bookmark.url === currentUrl);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={isBookmarked ? () => {} : addBookmark}
        className={`h-8 w-8 p-0 ${isBookmarked ? 'text-yellow-400' : 'text-gray-400'}`}
      >
        <Star className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
      </Button>

      {showManager && (
        <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-hidden rounded-md bg-gray-800 border border-gray-700 shadow-lg z-50">
          <Card className="bg-gray-800 border-0 shadow-none m-0">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-white text-lg">Bookmark Halaman</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowManager(false)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-y-auto max-h-80">
              {bookmarks.length === 0 ? (
                <p className="text-center text-gray-400 py-4">Tidak ada bookmark</p>
              ) : (
                <div className="space-y-3">
                  {bookmarks.map((bookmark) => (
                    <div
                      key={bookmark.id}
                      className="p-3 rounded-lg border border-gray-700 flex items-start justify-between"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center">
                          <h4 className="font-medium text-white truncate">{bookmark.title}</h4>
                          <a 
                            href={bookmark.url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="ml-2 text-gray-400 hover:text-white"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>
                        <p className="text-xs text-gray-400 mt-1 truncate">{bookmark.url}</p>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {bookmark.tags?.map((tag, index) => (
                            <Badge key={index} variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeBookmark(bookmark.id)}
                        className="h-6 w-6 p-0 text-gray-400 hover:text-red-400 ml-2"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Tombol untuk membuka manajer bookmark */}
      <div className="mt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowManager(!showManager)}
          className="text-xs text-gray-300 hover:text-white border-gray-600"
        >
          {showManager ? 'Sembunyikan' : 'Lihat Bookmark'} ({bookmarks.length})
        </Button>
      </div>
    </div>
  );
}