"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  CreditCard, 
  Calendar, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Download,
  Filter,
  Search
} from "lucide-react";
import { Input } from "@/components/ui/input";

interface Payment {
  id: number;
  project: string;
  amount: string;
  status: string;
  date: string;
  dueDate: string;
  invoiceNumber: string;
  method: string;
}

export default function UserPayments() {
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: 1,
      project: "Website Kedai Kopi",
      amount: "Rp 3.000.000",
      status: "Lunas",
      date: "2024-03-15",
      dueDate: "2024-03-15",
      invoiceNumber: "INV-001",
      method: "Transfer Bank"
    },
    {
      id: 2,
      project: "Portofolio Fotografer",
      amount: "Rp 2.500.000",
      status: "Lunas",
      date: "2024-02-28",
      dueDate: "2024-02-28",
      invoiceNumber: "INV-002",
      method: "Transfer Bank"
    },
    {
      id: 3,
      project: "Website PPDB Sekolah",
      amount: "Rp 5.000.000",
      status: "Belum Dibayar",
      date: "2024-03-20",
      dueDate: "2024-04-20",
      invoiceNumber: "INV-003",
      method: "Transfer Bank"
    },
    {
      id: 4,
      project: "Website Salon Kecantikan",
      amount: "Rp 4.500.000",
      status: "Dibayar Sebagian",
      date: "2024-03-10",
      dueDate: "2024-04-10",
      invoiceNumber: "INV-004",
      method: "Transfer Bank"
    }
  ]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPayments = payments.filter(payment => {
    const matchesFilter = filter === "all" || 
      (filter === "paid" && payment.status === "Lunas") ||
      (filter === "unpaid" && payment.status === "Belum Dibayar") ||
      (filter === "partial" && payment.status === "Dibayar Sebagian");
    
    const matchesSearch = payment.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Lunas": return "bg-green-100 text-green-800";
      case "Belum Dibayar": return "bg-red-100 text-red-800";
      case "Dibayar Sebagian": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const handlePayNow = (id: number) => {
    // Implement payment logic here
    console.log("Pay now clicked for payment ID:", id);
    alert("Redirecting to payment gateway...");
  };

  const handleDownloadInvoice = (id: number) => {
    // Implement download invoice logic here
    console.log("Download invoice clicked for payment ID:", id);
    alert("Downloading invoice...");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pembayaran</h1>
          <p className="text-gray-600 mt-2">Kelola pembayaran proyek Anda</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari pembayaran..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Lunas</p>
              <p className="text-2xl font-bold text-gray-900">Rp 5.500.000</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-red-100 rounded-full">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Belum Dibayar</p>
              <p className="text-2xl font-bold text-gray-900">Rp 5.000.000</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <CreditCard className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tagihan</p>
              <p className="text-2xl font-bold text-gray-900">Rp 10.500.000</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={filter === "all" ? "default" : "outline"}
            onClick={() => setFilter("all")}
            className={filter === "all" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <Filter className="h-4 w-4 mr-1" />
            Semua
          </Button>
          <Button 
            variant={filter === "paid" ? "default" : "outline"}
            onClick={() => setFilter("paid")}
            className={filter === "paid" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Lunas
          </Button>
          <Button 
            variant={filter === "unpaid" ? "default" : "outline"}
            onClick={() => setFilter("unpaid")}
            className={filter === "unpaid" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <AlertCircle className="h-4 w-4 mr-1" />
            Belum Dibayar
          </Button>
          <Button 
            variant={filter === "partial" ? "default" : "outline"}
            onClick={() => setFilter("partial")}
            className={filter === "partial" ? "bg-blue-600 hover:bg-blue-700" : ""}
          >
            <Clock className="h-4 w-4 mr-1" />
            Dibayar Sebagian
          </Button>
        </div>
      </Card>

      {/* Payments List */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Proyek
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jumlah
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tanggal
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Jatuh Tempo
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Invoice
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{payment.project}</div>
                    <div className="text-sm text-gray-500">{payment.method}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.dueDate}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {payment.invoiceNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      {payment.status !== "Lunas" && (
                        <Button 
                          size="sm" 
                          className="bg-blue-600 hover:bg-blue-700"
                          onClick={() => handlePayNow(payment.id)}
                        >
                          Bayar Sekarang
                        </Button>
                      )}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDownloadInvoice(payment.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Empty State */}
      {filteredPayments.length === 0 && (
        <Card className="p-12 text-center">
          <CreditCard className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada pembayaran</h3>
          <p className="mt-1 text-gray-500">
            Tidak ada pembayaran yang sesuai dengan kriteria pencarian Anda.
          </p>
        </Card>
      )}
    </div>
  );
}