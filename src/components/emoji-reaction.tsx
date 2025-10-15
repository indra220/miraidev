import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Smile, Plus } from 'lucide-react';

interface EmojiReactionProps {
  messageId: string;
  initialReactions?: { emoji: string; count: number; userReacted: boolean }[];
  onReact?: (messageId: string, emoji: string) => void;
}

export default function EmojiReaction({ 
  messageId, 
  initialReactions = [],
  onReact
}: EmojiReactionProps) {
  const [reactions, setReactions] = useState(initialReactions);
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Fungsi untuk menangani klik reaksi
  const handleReaction = (emoji: string) => {
    if (onReact) {
      onReact(messageId, emoji);
    }

    // Update tampilan reaksi lokal
    setReactions(prev => {
      const existingReaction = prev.find(r => r.emoji === emoji);
      if (existingReaction) {
        return prev.map(r => 
          r.emoji === emoji 
            ? { ...r, count: r.count + 1, userReacted: true } 
            : r
        );
      } else {
        return [...prev, { emoji, count: 1, userReacted: true }];
      }
    });

    setShowPicker(false);
  };

  // Fungsi untuk menutup picker saat klik di luar
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setShowPicker(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Emoji umum untuk picker
  const commonEmojis = ['👍', '❤️', '😂', '😮', '😢', '👏'];

  return (
    <div className="relative" ref={pickerRef}>
      <Button
        variant="ghost"
        size="sm"
        className="h-7 w-7 p-1 text-gray-400 hover:text-white"
        onClick={() => setShowPicker(!showPicker)}
      >
        <Smile className="h-4 w-4" />
      </Button>

      {showPicker && (
        <div className="absolute bottom-8 left-0 z-10 bg-gray-800 border border-gray-700 rounded-lg shadow-lg p-2 w-40">
          <div className="grid grid-cols-6 gap-1">
            {commonEmojis.map((emoji, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-lg"
                onClick={() => handleReaction(emoji)}
              >
                {emoji}
              </Button>
            ))}
          </div>
          <div className="flex justify-center mt-2 pt-2 border-t border-gray-700">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={() => setShowPicker(false)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Tampilkan reaksi yang sudah ada */}
      {reactions.length > 0 && (
        <div className="absolute -top-6 left-0 flex space-x-1 bg-gray-800/80 backdrop-blur-sm rounded-full px-2 py-1 border border-gray-700 shadow-sm">
          {reactions.map((reaction, index) => (
            <button
              key={index}
              className={`flex items-center text-xs px-1.5 py-0.5 rounded-full ${
                reaction.userReacted 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-700 text-gray-200 hover:bg-gray-600'
              }`}
              onClick={() => handleReaction(reaction.emoji)}
            >
              <span className="mr-1">{reaction.emoji}</span>
              <span>{reaction.count}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface MessageWithReactionsProps {
  message: string;
  sender: 'user' | 'admin';
  timestamp: string;
  reactions?: { emoji: string; count: number; userReacted: boolean }[];
  messageId: string;
  onReact?: (messageId: string, emoji: string) => void;
}

export function MessageWithReactions({ 
  message, 
  sender, 
  timestamp, 
  reactions = [], 
  messageId, 
  onReact
}: MessageWithReactionsProps) {
  return (
    <div className={`flex ${sender === 'admin' ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg relative group ${
        sender === 'admin'
          ? 'bg-blue-600 text-white rounded-br-none'
          : 'bg-gray-700 text-gray-100 rounded-bl-none'
      }`}>
        <p>{message}</p>
        <div className={`text-xs mt-1 ${sender === 'admin' ? 'text-blue-200' : 'text-gray-400'}`}>
          {timestamp}
        </div>
        
        {/* Reaksi dan tombol reaksi */}
        <div className="flex items-center mt-1 space-x-1">
          <EmojiReaction 
            messageId={messageId} 
            initialReactions={reactions} 
            onReact={onReact} 
          />
        </div>
      </div>
    </div>
  );
}