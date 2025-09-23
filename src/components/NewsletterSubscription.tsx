"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function NewsletterSubscription() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setStatus("error");
      return;
    }
    
    setIsSubmitting(true);
    setStatus("idle");
    
    try {
      // Simulasi pengiriman data ke API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Simulasi keberhasilan 90% waktu
      if (Math.random() > 0.1) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch (error) {
      setStatus("error");
    } finally {
      setIsSubmitting(false);
      
      // Reset status setelah 5 detik
      setTimeout(() => {
        setStatus("idle");
      }, 5000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      className="transition-all duration-300"
    >
      <Card className="bg-gradient-to-r from-blue-900/50 to-purple-900/50 border-gray-700 p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-blue-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Berlangganan Newsletter</h3>
          <p className="text-gray-300">
            Dapatkan tips dan insight terbaru seputar pengembangan website dan digital marketing
          </p>
        </div>
        
        {status === "success" ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-8"
          >
            <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
            <h4 className="text-xl font-semibold mb-2 text-green-400">Berhasil!</h4>
            <p className="text-gray-300">
              Terima kasih telah berlangganan. Kami telah mengirimkan email konfirmasi ke {email}.
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="email@contoh.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-800/50 border-gray-700 pl-10 focus:border-blue-500"
                  disabled={isSubmitting}
                />
              </div>
              {status === "error" && (
                <motion.p 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-sm text-red-400 mt-2 flex items-center"
                >
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Mohon masukkan alamat email yang valid
                </motion.p>
              )}
            </div>
            
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg transition-all duration-300 hover:scale-105"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Mengirim...
                </span>
              ) : (
                "Berlangganan Sekarang"
              )}
            </Button>
            
            <p className="text-gray-400 text-xs text-center mt-4">
              Kami menghargai privasi Anda. Anda dapat berhenti berlangganan kapan saja.
            </p>
          </form>
        )}
      </Card>
    </motion.div>
  );
}