"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { 
  HelpCircle, 
  MessageSquare, 
  Mail, 
  Phone, 
  Clock, 
  FileText,
  Search,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
}

export default function UserSupport() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [ticketForm, setTicketForm] = useState({
    subject: "",
    message: "",
    priority: "medium"
  });

  const categories = [
    { id: "all", name: "Semua" },
    { id: "account", name: "Akun" },
    { id: "billing", name: "Pembayaran" },
    { id: "projects", name: "Proyek" },
    { id: "technical", name: "Teknis" }
  ];

  const faqs: FAQItem[] = [
    {
      id: 1,
      question: "Bagaimana cara memulai proyek baru?",
      answer: "Anda dapat memulai proyek baru dengan mengklik tombol 'Buat Proyek Baru' di halaman Proyek Saya. Isi formulir dengan detail proyek Anda dan tim kami akan menghubungi Anda untuk diskusi lebih lanjut.",
      category: "projects"
    },
    {
      id: 2,
      question: "Berapa lama waktu pengerjaan proyek?",
      answer: "Waktu pengerjaan tergantung pada kompleksitas proyek. Untuk proyek UMKM sederhana, waktu pengerjaan biasanya 2-4 minggu. Untuk proyek yang lebih kompleks, waktu pengerjaan bisa mencapai 2-3 bulan.",
      category: "projects"
    },
    {
      id: 3,
      question: "Bagaimana cara melakukan pembayaran?",
      answer: "Anda dapat melakukan pembayaran melalui transfer bank ke rekening yang tertera di invoice. Setelah pembayaran dilakukan, silakan konfirmasi pembayaran di halaman Pembayaran.",
      category: "billing"
    },
    {
      id: 4,
      question: "Apakah saya bisa meminta revisi setelah proyek selesai?",
      answer: "Ya, Anda berhak atas revisi gratis selama 14 hari setelah proyek selesai. Setelah periode tersebut, revisi tambahan akan dikenakan biaya sesuai dengan kompleksitasnya.",
      category: "projects"
    },
    {
      id: 5,
      question: "Bagaimana cara mengganti password akun?",
      answer: "Anda dapat mengganti password di halaman Profil Saya, bagian Keamanan. Masukkan password saat ini dan password baru yang Anda inginkan, lalu klik 'Ubah Password'.",
      category: "account"
    },
    {
      id: 6,
      question: "Apakah website yang dibuat responsive?",
      answer: "Ya, semua website yang kami buat adalah responsive dan dapat diakses dengan baik di berbagai perangkat, termasuk desktop, tablet, dan mobile.",
      category: "technical"
    }
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    const matchesSearch = faq.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleTicketSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement ticket submission logic here
    console.log("Ticket submitted:", ticketForm);
    alert("Tiket bantuan telah dikirim. Tim kami akan menghubungi Anda sesegera mungkin.");
    setTicketForm({ subject: "", message: "", priority: "medium" });
  };

  const handleTicketChange = (field: string, value: string) => {
    setTicketForm({ ...ticketForm, [field]: value });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Bantuan & Support</h1>
        <p className="text-gray-600 mt-2">Dapatkan bantuan dan dukungan untuk proyek Anda</p>
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <MessageSquare className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Chat Langsung</h3>
          <p className="mt-2 text-sm text-gray-500">
            Hubungi kami langsung melalui chat di pojok kanan bawah layar
          </p>
          <Button variant="link" className="mt-3 text-blue-600 hover:text-blue-800">
            Mulai Chat
          </Button>
        </Card>
        <Card className="p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Email</h3>
          <p className="mt-2 text-sm text-gray-500">
            Kirim email ke support@miraidev.id
          </p>
          <Button variant="link" className="mt-3 text-blue-600 hover:text-blue-800">
            Kirim Email
          </Button>
        </Card>
        <Card className="p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
            <Phone className="h-6 w-6 text-purple-600" />
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">Telepon</h3>
          <p className="mt-2 text-sm text-gray-500">
            Hubungi kami di +62 812 3456 7890
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Senin-Jumat, 09:00-18:00 WIB
          </p>
        </Card>
      </div>

      {/* Search and Categories */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari pertanyaan..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "outline"}
                onClick={() => setActiveCategory(category.id)}
                className={activeCategory === category.id ? "bg-blue-600 hover:bg-blue-700" : ""}
              >
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </Card>

      {/* FAQ Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pertanyaan Umum</h2>
          <div className="space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="border border-gray-200 rounded-lg">
                <button
                  className="flex justify-between items-center w-full p-4 text-left hover:bg-gray-50 rounded-lg"
                  onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                >
                  <span className="font-medium text-gray-900">{faq.question}</span>
                  {openFAQ === faq.id ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openFAQ === faq.id && (
                  <div className="p-4 pt-0 border-t border-gray-200">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {filteredFAQs.length === 0 && (
            <div className="text-center py-8">
              <HelpCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada pertanyaan yang cocok</h3>
              <p className="mt-1 text-gray-500">
                Coba ubah kata kunci pencarian atau kategori.
              </p>
            </div>
          )}
        </Card>

        {/* Support Ticket Form */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Kirim Tiket Bantuan</h2>
          <form onSubmit={handleTicketSubmit} className="space-y-4">
            <div>
              <Label htmlFor="subject">Subjek</Label>
              <Input
                id="subject"
                value={ticketForm.subject}
                onChange={(e) => handleTicketChange("subject", e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="priority">Prioritas</Label>
              <select
                id="priority"
                value={ticketForm.priority}
                onChange={(e) => handleTicketChange("priority", e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              >
                <option value="low">Rendah</option>
                <option value="medium">Sedang</option>
                <option value="high">Tinggi</option>
              </select>
            </div>
            <div>
              <Label htmlFor="message">Pesan</Label>
              <Textarea
                id="message"
                rows={5}
                value={ticketForm.message}
                onChange={(e) => handleTicketChange("message", e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
              Kirim Tiket
            </Button>
          </form>
        </Card>
      </div>

      {/* Response Time Info */}
      <Card className="p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">Waktu Respons</h3>
            <p className="mt-1 text-sm text-gray-500">
              Kami biasanya merespons dalam 24 jam kerja. Untuk pertanyaan mendesak, silakan hubungi kami melalui telepon.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}