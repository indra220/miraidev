"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Phone, 
  Mail, 
  MapPin,
  Clock,
  ArrowRight
} from "lucide-react";
import { Navbar } from "@/components/navbar";

export default function KontakPage() {
  const contactInfo = [
    {
      icon: <Phone className="w-6 h-6 text-blue-400" />,
      title: "Telepon",
      detail: "+62 812 3456 7890",
      description: "Senin - Jumat, 09:00 - 18:00 WIB"
    },
    {
      icon: <Mail className="w-6 h-6 text-green-400" />,
      title: "Email",
      detail: "hello@miraidev.id",
      description: "Dapatkan respons dalam 24 jam"
    },
    {
      icon: <MapPin className="w-6 h-6 text-yellow-400" />,
      title: "Alamat",
      detail: "Jl. Teknologi No. 123, Jakarta",
      description: "Jakarta Selatan, 12345"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative overflow-hidden pt-16">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>
        <div className="container mx-auto px-4 py-24 sm:py-32 relative">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Hubungi <span className="text-blue-400">Kami</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Punya pertanyaan atau ingin membicarakan proyek Anda? Kami siap membantu Anda.
            </p>
          </div>
        </div>
      </div>

      {/* Contact Info & Form */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Informasi Kontak</h2>
              
              <div className="space-y-8">
                {contactInfo.map((info, index) => (
                  <Card key={index} className="bg-gray-800/50 border-gray-700 p-6">
                    <div className="flex items-start">
                      <div className="mr-4 mt-1">
                        {info.icon}
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-1">{info.title}</h3>
                        <p className="text-lg text-blue-400 mb-1">{info.detail}</p>
                        <p className="text-gray-400">{info.description}</p>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              
              {/* Office Hours */}
              <Card className="bg-gray-800/50 border-gray-700 p-6 mt-8">
                <div className="flex items-center mb-4">
                  <Clock className="w-6 h-6 text-purple-400 mr-3" />
                  <h3 className="text-xl font-semibold">Jam Kerja</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-400">Senin - Kamis</p>
                    <p className="font-medium">09:00 - 18:00 WIB</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Jumat</p>
                    <p className="font-medium">09:00 - 17:00 WIB</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Sabtu</p>
                    <p className="font-medium">10:00 - 14:00 WIB</p>
                  </div>
                  <div>
                    <p className="text-gray-400">Minggu</p>
                    <p className="font-medium">Tutup</p>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl font-bold mb-8">Kirim Pesan</h2>
              
              <Card className="bg-gray-800/50 border-gray-700 p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Nama Lengkap
                      </label>
                      <Input 
                        id="name" 
                        placeholder="Nama Anda" 
                        className="bg-gray-700 border-gray-600 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Alamat Email
                      </label>
                      <Input 
                        id="email" 
                        type="email" 
                        placeholder="email@contoh.com" 
                        className="bg-gray-700 border-gray-600 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-2">
                      Nomor Telepon
                    </label>
                    <Input 
                      id="phone" 
                      type="tel" 
                      placeholder="+62 812 3456 7890" 
                      className="bg-gray-700 border-gray-600 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium mb-2">
                      Subjek
                    </label>
                    <Input 
                      id="subject" 
                      placeholder="Subjek pesan" 
                      className="bg-gray-700 border-gray-600 focus:border-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium mb-2">
                      Pesan
                    </label>
                    <Textarea 
                      id="message" 
                      placeholder="Tulis pesan Anda di sini..." 
                      rows={5}
                      className="bg-gray-700 border-gray-600 focus:border-blue-500"
                    />
                  </div>
                  
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg">
                    Kirim Pesan
                  </Button>
                </form>
              </Card>
              
              <p className="text-gray-400 text-sm mt-6 text-center">
                Kami akan merespons pesan Anda dalam waktu 24 jam kerja.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Map Section */}
      <div className="py-20 bg-gray-800/30">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-8">Lokasi Kami</h2>
            <Card className="bg-gray-800/50 border-gray-700 h-96 flex items-center justify-center">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">Peta Lokasi</h3>
                <p className="text-gray-400">Jl. Teknologi No. 123, Jakarta Selatan, 12345</p>
                <Button variant="outline" className="mt-4 border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white">
                  Buka di Google Maps
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Get Started CTA Section */}
      <div className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center bg-gradient-to-r from-blue-900/50 to-purple-900/50 rounded-2xl p-12 border border-gray-700">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Siap Memulai Proyek Anda?</h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Hubungi kami hari ini untuk konsultasi gratis dan penawaran khusus untuk proyek Anda.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg py-6 px-8">
                Konsultasi Gratis
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