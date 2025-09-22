"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Users, 
  Target, 
  Eye,
  Zap,
  Globe,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function TentangPage() {
  const values = [
    {
      icon: <Target className="w-8 h-8 text-blue-400" />,
      title: "Kualitas Terbaik",
      description: "Kami berkomitmen untuk memberikan hasil terbaik dengan standar kualitas tinggi dalam setiap proyek."
    },
    {
      icon: <Users className="w-8 h-8 text-green-400" />,
      title: "Berorientasi pada Klien",
      description: "Kepuasan klien adalah prioritas utama kami. Kami mendengarkan dan memahami kebutuhan Anda."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Inovasi Berkelanjutan",
      description: "Kami selalu mengikuti perkembangan teknologi terkini untuk memberikan solusi inovatif."
    },
    {
      icon: <Globe className="w-8 h-8 text-purple-400" />,
      title: "Berpikir Jangka Panjang",
      description: "Setiap solusi yang kami bangun dirancang untuk mendukung pertumbuhan bisnis jangka panjang."
    }
  ];

  const team = [
    {
      name: "Ahmad Rifai",
      role: "CEO & Founder",
      bio: "Pengembang berpengalaman dengan passion di bidang teknologi dan inovasi digital.",
      image: "/placeholder-team-1.jpg"
    },
    {
      name: "Dewi Kartika",
      role: "Lead Designer",
      bio: "Desainer UI/UX yang kreatif dengan fokus pada pengalaman pengguna yang optimal.",
      image: "/placeholder-team-2.jpg"
    },
    {
      name: "Budi Santoso",
      role: "Lead Developer",
      bio: "Ahli pengembangan full-stack dengan keahlian di berbagai teknologi modern.",
      image: "/placeholder-team-3.jpg"
    },
    {
      name: "Siti Nurhaliza",
      role: "Project Manager",
      bio: "Manajer proyek yang teliti dengan kemampuan komunikasi yang kuat dan organisasi yang baik.",
      image: "/placeholder-team-4.jpg"
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
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Tentang <span className="text-blue-400">MiraiDev</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Mewujudkan visi digital masa depan untuk bisnis Anda
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-6">Cerita Kami</h2>
                <p className="text-gray-300 mb-4">
                  MiraiDev didirikan pada tahun 2020 dengan visi untuk membantu bisnis lokal bersaing di era digital. Kami memulai perjalanan kami dari sebuah garasi kecil dengan hanya 3 orang yang bersemangat tentang teknologi.
                </p>
                <p className="text-gray-300 mb-4">
                  Seiring waktu, kami berkembang menjadi tim profesional yang terdiri dari desainer, pengembang, dan strategis digital yang berdedikasi untuk memberikan solusi terbaik bagi klien kami.
                </p>
                <p className="text-gray-300">
                  Hari ini, kami telah membantu lebih dari 100+ bisnis untuk membangun kehadiran digital mereka yang kuat dan berkelanjutan.
                </p>
              </div>
              <div className="bg-gray-800 rounded-xl h-80 flex items-center justify-center">
                <div className="text-center">
                  <Globe className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                  <p className="text-gray-400">Ilustrasi Tim MiraiDev</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mission & Vision */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <Card className="bg-gray-800/50 border-gray-700 p-8">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center mb-6">
                  <Eye className="w-6 h-6 text-blue-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Visi Kami</h3>
                <p className="text-gray-300">
                  Menjadi mitra pengembangan digital terdepan yang membantu bisnis lokal mengubah tantangan digital menjadi peluang pertumbuhan yang berkelanjutan.
                </p>
              </Card>
              
              <Card className="bg-gray-800/50 border-gray-700 p-8">
                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                  <Target className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Misi Kami</h3>
                <p className="text-gray-300">
                  Memberdayakan bisnis dengan solusi teknologi inovatif yang dirancang khusus untuk memenuhi kebutuhan unik mereka dan mendorong kesuksesan jangka panjang.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nilai Kami</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Prinsip-prinsip yang membimbing setiap aspek pekerjaan kami
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 p-6 text-center">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                <p className="text-gray-400">{value.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Tim Kami</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Profesional berbakat yang berdedikasi untuk kesuksesan proyek Anda
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="bg-gray-800/50 border-gray-700 overflow-hidden">
                <div className="h-48 bg-gray-700 flex items-center justify-center">
                  <div className="text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">{member.name}</p>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                  <p className="text-blue-400 mb-3">{member.role}</p>
                  <p className="text-gray-400 text-sm">{member.bio}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-blue-400 mb-2">100+</div>
                <div className="text-gray-400">Proyek Selesai</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-green-400 mb-2">85+</div>
                <div className="text-gray-400">Klien Puas</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-yellow-400 mb-2">5+</div>
                <div className="text-gray-400">Tahun Pengalaman</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-purple-400 mb-2">15+</div>
                <div className="text-gray-400">Anggota Tim</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-gray-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Berkolaborasi dengan Kami?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Bergabunglah dengan klien kami yang puas dan wujudkan visi digital masa depan untuk bisnis Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8">
                Konsultasi Gratis Sekarang
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button size="lg" variant="outline" className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white text-lg py-6 px-8">
                Hubungi Kami
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}