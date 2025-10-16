"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  Target, 
  Zap,
  Globe,
  ArrowRight,
  Code,
  Sparkles
} from "lucide-react";
import OptimizedMotion from "@/components/OptimizedMotion";

export default function TentangPage() {
  useEffect(() => {
    document.title = "Tentang Kami | MiraiDev";
  }, []);

  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Kualitas Terbaik",
      description: "Fokus pada pengiriman kode berkualitas tinggi dengan praktik terbaik dalam pengembangan web."
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Berorientasi pada Klien",
      description: "Mendengarkan kebutuhan klien dengan seksama untuk memberikan solusi yang tepat sasaran."
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Inovasi Berkelanjutan",
      description: "Terus belajar dan mengadopsi teknologi terbaru untuk solusi yang modern dan efisien."
    },
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Berpikir Jangka Panjang",
      description: "Membangun website yang scalable dan mudah dikelola untuk pertumbuhan bisnis jangka panjang."
    }
  ];

  const team = [
    {
      name: "Developer Independen",
      role: "Full-Stack Developer",
      bio: "Seorang developer yang bersemangat tentang teknologi web modern dan berkomitmen untuk memberikan solusi terbaik bagi setiap proyek.",
      icon: <Code className="w-6 h-6 text-blue-400" />
    }
  ];

  return (
    <div>

      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="container mx-auto px-4 py-24 sm:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <OptimizedMotion 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Tentang <span className="text-blue-400">Kami</span>
            </OptimizedMotion>
            <OptimizedMotion 
              className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Mewujudkan visi digital masa depan untuk bisnis Anda
            </OptimizedMotion>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <OptimizedMotion
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <h2 className="text-3xl font-bold mb-6">Cerita Kami</h2>
                <p className="text-gray-300 mb-4">
                  MiraiDev bermula dari semangat seorang developer independen yang ingin membantu bisnis lokal bersaing di era digital. Dengan latar belakang pendidikan teknik informatika dan passion terhadap teknologi web, kami memulai perjalanan ini pada tahun 2023.
                </p>
                <p className="text-gray-300 mb-4">
                  Nama "Mirai" berasal dari bahasa Jepang yang berarti "masa depan". Kami memilih nama ini karena visi kami untuk membantu bisnis membangun kehadiran digital yang berkelanjutan dan siap menghadapi perkembangan teknologi di masa depan.
                </p>
                <p className="text-gray-300">
                  Kami fokus pada pengembangan website modern dan solusi digital yang efisien, menggunakan teknologi terkini seperti React, Next.js, dan berbagai framework modern lainnya untuk memberikan hasil terbaik bagi klien kami.
                </p>
              </OptimizedMotion>
              <OptimizedMotion 
                className="bg-gray-800 rounded-xl h-80 flex items-center justify-center"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <Sparkles className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-400">Masa Depan Digital</p>
                </div>
              </OptimizedMotion>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <OptimizedMotion 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nilai Kami</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Prinsip-prinsip yang membimbing setiap aspek pekerjaan kami
            </p>
          </OptimizedMotion>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <OptimizedMotion
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="transition-all duration-200"
              >
                <Card className="bg-gray-800/50 border-gray-700 p-6 text-center h-full">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mx-auto mb-6">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </Card>
              </OptimizedMotion>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <OptimizedMotion 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tim Kami</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Seorang developer independen yang berdedikasi untuk kesuksesan proyek Anda
            </p>
          </OptimizedMotion>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <OptimizedMotion
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="transition-all duration-300"
              >
                <Card className="bg-gray-800/50 border-gray-700 overflow-hidden h-full">
                  <div className="h-48 bg-gray-700 flex items-center justify-center">
                    <div className="text-center">
                      <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">{member.name}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="flex items-center mb-2">
                      <h3 className="text-xl font-semibold mr-2">{member.name}</h3>
                      <div className="text-blue-400">
                        {member.icon}
                      </div>
                    </div>
                    <p className="text-blue-400 mb-3">{member.role}</p>
                    <p className="text-gray-400 text-sm">{member.bio}</p>
                  </div>
                </Card>
              </OptimizedMotion>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <OptimizedMotion 
                className="p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl font-bold text-blue-400 mb-1">20+</div>
                <div className="text-gray-400">Proyek Selesai</div>
              </OptimizedMotion>
              <OptimizedMotion 
                className="p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <div className="text-3xl font-bold text-green-400 mb-1">15+</div>
                <div className="text-gray-400">Klien Puas</div>
              </OptimizedMotion>
              <OptimizedMotion 
                className="p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-yellow-400 mb-1">2+</div>
                <div className="text-gray-400">Tahun Pengalaman</div>
              </OptimizedMotion>
              <OptimizedMotion 
                className="p-4"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-3xl font-bold text-purple-400 mb-1">1</div>
                <div className="text-gray-400">Developer Fokus</div>
              </OptimizedMotion>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <OptimizedMotion 
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Punya Website Profesional untuk Bisnis Anda?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Diskusikan kebutuhan Anda dengan developer independen yang fokus pada solusi terjangkau dan berkualitas untuk UMKM.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8 transition-all duration-150 hover:scale-105">
                Konsultasi Gratis Sekarang
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-lg py-6 px-8 transition-all duration-150">
                Hubungi Kami
              </Button>
            </div>
          </OptimizedMotion>
        </div>
      </div>
    </div>
  );
}