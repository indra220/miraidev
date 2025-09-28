"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { checkEnvironmentVariables } from "@/lib/env-check";
import SetupGuide from "@/components/setup-guide";
import { AlertCircle, Bot, User } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [envStatus] = useState(() => checkEnvironmentVariables());
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fungsi untuk menangani pengiriman pesan
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim()) return;
    
    // Tambahkan pesan pengguna ke daftar
    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input
    };
    
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    
    try {
      // Simulasikan koneksi ke API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage]
        }),
      });
      
      if (!response.ok) {
        throw new Error('Gagal menghubungi API');
      }
      
      const data = await response.json();
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: data.text || "Maaf, saya tidak dapat memproses permintaan Anda saat ini."
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "Terjadi kesalahan saat menghubungi asisten AI. Silakan coba lagi nanti."
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!envStatus.ai) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card className="p-6 border-amber-200 bg-amber-50 dark:bg-amber-900/20 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-semibold text-amber-800 dark:text-amber-400">
              AI Chat Tidak Tersedia
            </h3>
          </div>
          <p className="text-amber-700 dark:text-amber-300 text-sm">
            Fitur chat AI memerlukan kunci API OpenAI untuk dikonfigurasi.
            Silakan atur variabel lingkungan Anda untuk mengaktifkan
            fungsionalitas ini.
          </p>
        </Card>
        <SetupGuide envStatus={envStatus} />
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-2xl mx-auto">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold mb-2">🤖 AI Chat</h2>
        <p className="text-gray-600 dark:text-gray-400 text-sm">
          Didukung oleh OpenAI GPT-4o
        </p>
      </div>

      <div className="space-y-4 mb-4 min-h-[400px] max-h-[600px] overflow-y-auto">
        {messages.length === 0 ? (
          <Card className="p-6 text-center border-dashed">
            <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mulai percakapan
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tanyakan apa saja! Saya di sini untuk membantu dengan coding, pertanyaan, atau
              sekadar ngobrol.
            </p>
          </Card>
        ) : (
          messages.map((m) => (
            <Card key={m.id} className="p-4">
              <div className="flex items-center gap-2 mb-2">
                {m.role === "user" ? (
                  <User className="w-4 h-4 text-blue-600" />
                ) : (
                  <Bot className="w-4 h-4 text-green-600" />
                )}
                <span className="font-semibold text-sm">
                  {m.role === "user" ? "Anda" : "Asisten AI"}
                </span>
              </div>
              <div className="whitespace-pre-wrap text-sm leading-relaxed pl-6">
                {m.content}
              </div>
            </Card>
          ))
        )}

        {isLoading && (
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bot className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-sm">Asisten AI</span>
            </div>
            <div className="pl-6">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.1s" }}
                ></div>
                <div
                  className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                  style={{ animationDelay: "0.2s" }}
                ></div>
              </div>
            </div>
          </Card>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex space-x-2">
        <Input
          value={input}
          placeholder="Ketik pesan Anda..."
          onChange={(e) => setInput(e.target.value)}
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" disabled={isLoading || !input.trim()}>
          {isLoading ? "Mengirim..." : "Kirim"}
        </Button>
      </form>
    </div>
  );
}
