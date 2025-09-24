"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  Target, 
  Eye,
  Zap,
  Globe,
  ArrowRight,
  Code,
  Sparkles
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";

export default function TentangPage() {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-blue-400" />,
      title: "Kualitas Terbaik",
      description: "Fokus pada pengiriman kode berkualitas tinggi dengan praktik terbaik dalam pengembangan web."
    },
    {
      icon: <Users className="w-8 h-8 text-green-400" />,
      title: "Berorientasi pada Klien",
      description: "Mendengarkan kebutuhan klien dengan seksama untuk memberikan solusi yang tepat sasaran."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Inovasi Berkelanjutan",
      description: "Terus belajar dan mengadopsi teknologi terbaru untuk solusi yang modern dan efisien."
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-400" />,
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        <div className="container mx-auto px-4 py-24 sm:py-32 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.h1 
              className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Tentang <span className="text-blue-400">MiraiDev</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-300 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Mewujudkan visi digital masa depan untuk bisnis Anda
            </motion.p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
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
              </motion.div>
              <motion.div 
                className="bg-gray-800 rounded-xl h-80 flex items-center justify-center"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-400">Masa Depan Digital</p>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      

      {/* Mission & Vision */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-800/50 border-gray-700 p-8 h-full">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                    <Eye className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Visi Kami</h3>
                  <p className="text-gray-300">
                    Menjadi mitra pengembangan digital terpercaya yang membantu bisnis kecil dan menengah menghadapi tantangan digital dengan solusi yang efisien dan terjangkau.
                  </p>
                </Card>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gray-800/50 border-gray-700 p-8 h-full">
                  <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                    <Target className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Misi Kami</h3>
                  <p className="text-gray-300">
                    Memberdayakan bisnis dengan website modern yang dirancang untuk memberikan pengalaman terbaik kepada pengguna dan mendukung pertumbuhan bisnis jangka panjang.
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <motion.div 
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
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                className="transition-all duration-300"
              >
                <Card className="bg-gray-800/50 border-gray-700 p-6 text-center h-full">
                  <div className="flex justify-center mb-4">
                    {value.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-gray-400">{value.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
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
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <motion.div
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
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <motion.div 
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl font-bold text-blue-400 mb-2">20+</div>
                <div className="text-gray-400">Proyek Selesai</div>
              </motion.div>
              <motion.div 
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl font-bold text-green-400 mb-2">15+</div>
                <div className="text-gray-400">Klien Puas</div>
              </motion.div>
              <motion.div 
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl font-bold text-yellow-400 mb-2">2+</div>
                <div className="text-gray-400">Tahun Pengalaman</div>
              </motion.div>
              <motion.div 
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="text-4xl font-bold text-purple-400 mb-2">1</div>
                <div className="text-gray-400">Developer Fokus</div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-gray-700"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.02 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Membangun Website Impian Anda?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Mari kita wujudkan website modern yang akan membantu bisnis Anda berkembang di era digital.
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
          </motion.div>
        </div>
      </div>
    </div>
  );
}