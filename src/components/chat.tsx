"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { checkEnvironmentVariables } from "@/lib/env-check";
import SetupGuide from "@/components/setup-guide";
import { AlertCircle, Bot, User } from "lucide-react";
import { useState, useEffect, FormEvent } from "react";

// Mendefinisikan tipe untuk pesan
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

export default function Chat() {
  const [envStatus, setEnvStatus] = useState({
    supabase: false,
    ai: false,
    allConfigured: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  // State untuk menyimpan pesan dan input
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [error, setError] = useState<Error | null>(null);
  const [chatLoading, setChatLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!input.trim() || chatLoading) return;

    try {
      setChatLoading(true);
      setError(null);

      // Tambahkan pesan pengguna ke daftar pesan
      const userMessage: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: input
      };
      setMessages(prev => [...prev, userMessage]);
      setInput(""); // Kosongkan input setelah submit

      // Kirim permintaan ke API endpoint kita
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Gagal mengirim pesan');
      }

      // Sementara menambahkan pesan dummy karena fungsi chat dinonaktifkan
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Fungsi chat sedang dalam maintenance. Silakan coba lagi nanti.'
      };
      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      console.error("Chat error:", err);
      setError(err as Error);
    } finally {
      setChatLoading(false);
    }
  };

  useEffect(() => {
    const status = checkEnvironmentVariables();
    setEnvStatus({
      supabase: status.supabase,
      ai: status.ai,
      allConfigured: status.allConfigured
    });
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-24">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

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

      {error && (
        <Card className="p-4 border-red-200 bg-red-50 dark:bg-red-900/20 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600" />
            <span className="text-red-700 dark:text-red-300 text-sm">
              {error.message ||
                "Terjadi kesalahan saat memproses permintaan Anda."}
            </span>
          </div>
        </Card>
      )}

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

        {chatLoading && (
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
          onChange={handleInputChange}
          className="flex-1"
          disabled={chatLoading}
        />
        <Button type="submit" disabled={chatLoading || !input.trim()}>
          {chatLoading ? "Mengirim..." : "Kirim"}
        </Button>
      </form>
    </div>
  );
}
