'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, Smile, XCircle, CheckCircle } from 'lucide-react';
import FileUpload from './file-upload';

interface Message {
  id: string;
  text?: string;
  file?: File;
  sender: 'user' | 'admin';
  timestamp: Date;
  status?: 'sent' | 'delivered' | 'read';
}

interface ChatComponentProps {
  initialMessages?: Message[];
  onSendMessage?: (message: string) => void;
  onFileUpload?: (file: File) => void;
  currentUser: 'user' | 'admin';
}

export default function ChatComponent({ 
  initialMessages = [], 
  onSendMessage,
  onFileUpload,
  currentUser = 'admin'
}: ChatComponentProps) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [showFileUpload, setShowFileUpload] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const handleSend = () => {
    if (newMessage.trim() === '') return;

    const message: Message = {
      id: Date.now().toString(),
      text: newMessage,
      sender: currentUser,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    if (onSendMessage) {
      onSendMessage(newMessage);
    }
    setNewMessage('');
  };

  const handleFileUpload = (file: File) => {
    const message: Message = {
      id: Date.now().toString(),
      file: file,
      sender: currentUser,
      timestamp: new Date(),
      status: 'sent'
    };

    setMessages(prev => [...prev, message]);
    if (onFileUpload) {
      onFileUpload(file);
    }
    setShowFileUpload(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Scroll ke pesan terakhir
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full bg-gray-800 rounded-lg border border-gray-700">
      {/* Header Chat */}
      <div className="p-4 border-b border-gray-700 bg-gray-850 rounded-t-lg">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
              <span className="font-bold text-white">U</span>
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-gray-800"></div>
          </div>
          <div className="ml-3">
            <h3 className="font-medium text-white">Pengguna</h3>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>
      </div>

      {/* Area Pesan */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-h-[400px]">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === currentUser ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                message.sender === currentUser
                  ? 'bg-blue-600 text-white rounded-br-none'
                  : 'bg-gray-700 text-gray-100 rounded-bl-none'
              }`}
            >
              {message.text && <p>{message.text}</p>}
              {message.file && (
                <div className="flex items-center">
                  {message.file.type.startsWith('image/') ? (
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                      <span className="text-sm">{message.file.name}</span>
                    </div>
                  ) : (
                    <div className="flex items-center">
                      <XCircle className="h-4 w-4 mr-2 text-blue-400" />
                      <span className="text-sm">{message.file.name}</span>
                    </div>
                  )}
                </div>
              )}
              <div className={`text-xs mt-1 ${message.sender === currentUser ? 'text-blue-200' : 'text-gray-400'}`}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Upload File Area */}
      {showFileUpload && (
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <FileUpload 
            onFileUpload={handleFileUpload} 
            allowedTypes={['image/*', 'application/pdf', '.doc', '.docx', '.txt']}
            maxFileSize={10}
          />
        </div>
      )}

      {/* Input Pesan */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-9 w-9 p-0 mr-2"
            onClick={() => setShowFileUpload(!showFileUpload)}
          >
            <Paperclip className="h-5 w-5 text-gray-400" />
          </Button>
          <div className="flex-1 relative">
            <Input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ketik pesan..."
              className="bg-gray-750 border-gray-700 text-white pr-12"
            />
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-7 w-7 p-0"
            >
              <Smile className="h-4 w-4 text-gray-400" />
            </Button>
          </div>
          <Button 
            onClick={handleSend} 
            className="ml-2 bg-blue-600 hover:bg-blue-700"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}