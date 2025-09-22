"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { getSetupInstructions } from "@/lib/env-check";
import { CheckCircle, Circle, ExternalLink, Copy } from "lucide-react";
import { useState } from "react";

interface SetupGuideProps {
  envStatus: {
    supabase: boolean;
    ai: boolean;
    allConfigured: boolean;
  };
}

export default function SetupGuide({ envStatus }: SetupGuideProps) {
  const [copiedVar, setCopiedVar] = useState<string | null>(null);
  // Filter out Clerk instructions since we're not using it
  const setupInstructions = getSetupInstructions().filter(
    (instruction) => instruction.service !== "Clerk"
  );

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedVar(text);
      setTimeout(() => setCopiedVar(null), 2000);
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);
    }
  };

  const getServiceStatus = (service: string) => {
    switch (service.toLowerCase()) {
      case "supabase":
        return envStatus.supabase;
      case "openai":
        return envStatus.ai;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">🚀 Setup Lingkungan Anda</h2>
        <p className="text-gray-600 dark:text-gray-400">
          Konfigurasikan layanan ini untuk membuka potensi penuh dari starter kit Anda
        </p>
      </div>

      <div className="grid gap-6">
        {setupInstructions.map((instruction, index) => {
          const isConfigured = getServiceStatus(instruction.service);

          return (
            <Card
              key={index}
              className="p-6 border-2 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start gap-4">
                <div className="mt-1">
                  {isConfigured ? (
                    <CheckCircle className="w-6 h-6 text-green-500" />
                  ) : (
                    <Circle className="w-6 h-6 text-gray-400" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold">
                      {instruction.service}
                    </h3>
                    {isConfigured && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Dikonfigurasi
                      </span>
                    )}
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    {instruction.description}
                  </p>

                  {!isConfigured && (
                    <>
                      <div className="mb-4">
                        <h4 className="font-medium mb-2">Langkah Setup:</h4>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">
                          {instruction.steps.map((step, stepIndex) => (
                            <li key={stepIndex}>{step}</li>
                          ))}
                        </ol>
                      </div>

                      <div className="mb-4">
                        <h4 className="font-medium mb-2">
                          Variabel Lingkungan:
                        </h4>
                        <div className="space-y-2">
                          {instruction.envVars.map((envVar) => (
                            <div
                              key={envVar}
                              className="flex items-center gap-2"
                            >
                              <code className="bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded text-sm font-mono flex-1">
                                {envVar}=nilai_anda_disini
                              </code>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => copyToClipboard(envVar)}
                                className="shrink-0"
                              >
                                {copiedVar === envVar ? (
                                  <CheckCircle className="w-4 h-4" />
                                ) : (
                                  <Copy className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                          const urls = {
                            Supabase: "https://supabase.com/dashboard",
                            OpenAI: "https://platform.openai.com/",
                          };
                          window.open(
                            urls[instruction.service as keyof typeof urls],
                            "_blank",
                          );
                        }}
                      >
                        Buka Dashboard {instruction.service}
                        <ExternalLink className="w-4 h-4 ml-2" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {envStatus.allConfigured && (
        <Card className="p-6 border-2 border-green-200 bg-green-50 dark:bg-green-900/20">
          <div className="text-center">
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-green-800 dark:text-green-400 mb-2">
              🎉 Semua Siap!
            </h3>
            <p className="text-green-700 dark:text-green-300">
              Lingkungan Anda telah sepenuhnya dikonfigurasi. Fitur chat AI sekarang tersedia!
            </p>
          </div>
        </Card>
      )}

      <Card className="p-6 bg-blue-50 dark:bg-blue-900/20 border-blue-200">
        <h3 className="font-semibold mb-2 text-blue-800 dark:text-blue-400">
          💡 Tips Profesional
        </h3>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          Setelah menambahkan variabel lingkungan Anda ke{" "}
          <code className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded">
            .env.local
          </code>
          , restart server development Anda dengan{" "}
          <code className="bg-blue-100 dark:bg-blue-800 px-1 py-0.5 rounded">
            npm run dev
          </code>
          agar perubahan diterapkan.
        </p>
      </Card>
    </div>
  );
}
