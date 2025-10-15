'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, X, MessageCircle } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'admin';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

interface ConversationSearchProps {
  messages: Message[];
  onSearchResult?: (results: Message[]) => void;
}

export default function ConversationSearch({ 
  messages, 
  onSearchResult
}: ConversationSearchProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<Message[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchPanel, setShowSearchPanel] = useState(false);

  // Fungsi untuk mencari pesan
  const performSearch = (term: string) => {
    if (!term.trim()) {
      setSearchResults([]);
      if (onSearchResult) onSearchResult([]);
      return;
    }

    setIsSearching(true);
    
    // Simulasi pencarian (dalam implementasi sebenarnya ini akan dilakukan di backend)
    setTimeout(() => {
      const results = messages.filter(message => 
        message.text.toLowerCase().includes(term.toLowerCase())
      );
      
      setSearchResults(results);
      setIsSearching(false);
      
      if (onSearchResult) {
        onSearchResult(results);
      }
    }, 300); // Simulasi delay jaringan
  };

  // Fungsi untuk menangani perubahan input pencarian
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    performSearch(value);
  };

  // Fungsi untuk membersihkan pencarian
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    if (onSearchResult) onSearchResult([]);
  };

  // Fungsi untuk menangani klik pada hasil pencarian
  const handleResultClick = () => {
    // Dalam implementasi sebenarnya, ini akan menggulir ke pesan tertentu
  };

  return (
    <div className="relative">
      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowSearchPanel(!showSearchPanel)}
        className="flex items-center text-gray-300 hover:text-white border-gray-600"
      >
        <Search className="h-4 w-4 mr-2" />
        Cari dalam percakapan
      </Button>

      {showSearchPanel && (
        <div className="absolute right-0 mt-2 w-96 max-h-96 overflow-hidden rounded-md bg-gray-800 border border-gray-700 shadow-lg z-50">
          <Card className="bg-gray-800 border-0 shadow-none m-0">
            <CardHeader className="p-3 border-b border-gray-700">
              <div className="flex items-center">
                <Search className="h-4 w-4 mr-2 text-gray-400" />
                <CardTitle className="text-white text-sm">Cari dalam percakapan</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSearchPanel(false)}
                  className="h-6 w-6 p-0 text-gray-400 hover:text-white ml-auto"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="relative mt-2">
                <Input
                  type="text"
                  placeholder="Cari pesan..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="bg-gray-750 border-gray-700 text-white pl-9"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-0">
              {isSearching ? (
                <div className="p-6 text-center">
                  <div className="flex justify-center">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                  <p className="text-gray-400 mt-2">Mencari pesan...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="divide-y divide-gray-700 max-h-80 overflow-y-auto">
                  {searchResults.map((message) => (
                    <div
                      key={message.id}
                      className="p-3 hover:bg-gray-750 cursor-pointer"
                      onClick={handleResultClick}
                    >
                      <div className="flex items-start">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center">
                            <span className={`inline-block h-2 w-2 rounded-full mr-2 ${
                              message.sender === 'admin' ? 'bg-blue-500' : 'bg-green-500'
                            }`}></span>
                            <p className="text-xs text-gray-400 truncate">
                              {message.sender === 'admin' ? 'Anda' : 'Pengguna'} • {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                          <p className="text-sm text-gray-200 mt-1 truncate">
                            {message.text}
                          </p>
                        </div>
                        <MessageCircle className="h-4 w-4 text-gray-500 ml-2 flex-shrink-0" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : searchTerm ? (
                <div className="p-6 text-center">
                  <Search className="h-10 w-10 mx-auto text-gray-500" />
                  <p className="text-gray-400 mt-2">Tidak ditemukan pesan yang cocok</p>
                  <p className="text-xs text-gray-500 mt-1">"{searchTerm}"</p>
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Search className="h-10 w-10 mx-auto text-gray-500" />
                  <p className="text-gray-400 mt-2">Masukkan kata kunci untuk mencari</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Overlay untuk menutup panel saat klik di luar */}
      {showSearchPanel && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowSearchPanel(false)}
        ></div>
      )}
    </div>
  );
}