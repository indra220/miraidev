"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { 
  Star, 
  ThumbsUp, 
  MessageSquare, 
  Filter,
  Search,
  Calendar,
  User
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

interface Review {
  id: number;
  projectId: number;
  projectName: string;
  clientName: string;
  rating: number;
  comment: string;
  date: string;
  helpful: number;
  verified: boolean;
  responses?: Response[];
}

interface Response {
  id: number;
  author: string;
  comment: string;
  date: string;
}

export default function UserReviews() {
  const [reviews, setReviews] = useState<Review[]>([
    {
      id: 1,
      projectId: 1,
      projectName: "Website Kedai Kopi",
      clientName: "Budi Santoso",
      rating: 5,
      comment: "Proses pengerjaan sangat cepat dan hasilnya memuaskan. Website terlihat profesional dan mudah digunakan. Tim support juga responsif saat ada permintaan revisi.",
      date: "2024-03-15",
      helpful: 12,
      verified: true
    },
    {
      id: 2,
      projectId: 2,
      projectName: "Portofolio Fotografer",
      clientName: "Siti Rahmawati",
      rating: 4,
      comment: "Hasil akhir bagus, tapi ada sedikit kendala komunikasi di awal proyek. Setelah beberapa kali klarifikasi, akhirnya proyek berjalan lancar dan hasilnya memuaskan.",
      date: "2024-02-28",
      helpful: 8,
      verified: true,
      responses: [
        {
          id: 1,
          author: "MiraiDev Team",
          comment: "Terima kasih atas feedback-nya. Kami akan memperbaiki sistem komunikasi di proyek-proyek mendatang untuk memastikan pengalaman yang lebih baik.",
          date: "2024-03-01"
        }
      ]
    },
    {
      id: 3,
      projectId: 3,
      projectName: "Website PPDB Sekolah",
      clientName: "Andi Prasetyo",
      rating: 5,
      comment: "Website PPDB sangat membantu sekolah kami dalam proses penerimaan siswa baru. Fitur lengkap dan mudah digunakan oleh orang tua murid. Proses maintenance juga cepat ketika ada issue.",
      date: "2024-01-20",
      helpful: 15,
      verified: true
    }
  ]);

  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false);
  const [newReview, setNewReview] = useState({
    projectId: 0,
    projectName: "",
    rating: 5,
    comment: ""
  });

  const filteredReviews = reviews.filter(review => {
    const matchesFilter = filter === "all" || 
      (filter === "verified" && review.verified) ||
      (filter === "5star" && review.rating === 5) ||
      (filter === "4star" && review.rating === 4);
    
    const matchesSearch = review.projectName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.comment.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  }).sort((a, b) => {
    if (sortBy === "newest") {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === "oldest") {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (sortBy === "highest") {
      return b.rating - a.rating;
    } else if (sortBy === "lowest") {
      return a.rating - b.rating;
    }
    return 0;
  });

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length).toFixed(1)
    : "0.0";

  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => ({
    stars,
    count: reviews.filter(r => r.rating === stars).length,
    percentage: reviews.length > 0 
      ? Math.round((reviews.filter(r => r.rating === stars).length / reviews.length) * 100)
      : 0
  }));

  const handleHelpful = (id: number) => {
    setReviews(reviews.map(review => 
      review.id === id ? { ...review, helpful: review.helpful + 1 } : review
    ));
  };

  const handleRespond = (reviewId: number, response: string) => {
    // In a real app, this would submit the response to the server
    console.log(`Responding to review ${reviewId} with: ${response}`);
    alert("Balasan telah dikirim. Terima kasih atas respon Anda.");
  };

  const handleSubmitReview = () => {
    if (newReview.projectName && newReview.comment) {
      const review: Review = {
        id: Date.now(),
        projectId: newReview.projectId,
        projectName: newReview.projectName,
        clientName: "John Doe", // Would come from user context in real app
        rating: newReview.rating,
        comment: newReview.comment,
        date: new Date().toISOString().split('T')[0],
        helpful: 0,
        verified: true
      };
      
      setReviews([...reviews, review]);
      setIsReviewDialogOpen(false);
      setNewReview({
        projectId: 0,
        projectName: "",
        rating: 5,
        comment: ""
      });
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[...Array(5)].map((_, i) => (
          <Star 
            key={i} 
            className={`h-5 w-5 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Ulasan & Rating</h1>
          <p className="text-gray-600 mt-2">Lihat dan kelola ulasan proyek Anda</p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Dialog open={isReviewDialogOpen} onOpenChange={setIsReviewDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Star className="h-4 w-4 mr-2" />
                Tulis Ulasan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Tulis Ulasan Proyek</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Proyek
                  </label>
                  <select
                    className="w-full rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                    value={newReview.projectName}
                    onChange={(e) => setNewReview({...newReview, projectName: e.target.value})}
                  >
                    <option value="">Pilih proyek...</option>
                    <option value="Website Kedai Kopi">Website Kedai Kopi</option>
                    <option value="Portofolio Fotografer">Portofolio Fotografer</option>
                    <option value="Website PPDB Sekolah">Website PPDB Sekolah</option>
                    <option value="Website Salon Kecantikan">Website Salon Kecantikan</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Rating
                  </label>
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setNewReview({...newReview, rating: star})}
                      >
                        <Star 
                          className={`h-8 w-8 ${star <= newReview.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                
                <div>
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                    Ulasan Anda
                  </label>
                  <Textarea
                    id="comment"
                    rows={4}
                    value={newReview.comment}
                    onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                    placeholder="Bagikan pengalaman Anda bekerja dengan kami..."
                  />
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsReviewDialogOpen(false)}>
                    Batal
                  </Button>
                  <Button 
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={handleSubmitReview}
                  >
                    Kirim Ulasan
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Rating Summary */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <div className="text-center">
              <div className="text-5xl font-bold text-gray-900">{averageRating}</div>
              <div className="text-gray-500">dari 5</div>
            </div>
            <div className="ml-6">
              {renderStars(Math.round(parseFloat(averageRating)))}
              <p className="mt-2 text-gray-600">
                Berdasarkan {reviews.length} ulasan
              </p>
            </div>
          </div>
          
          <div className="mt-6 md:mt-0 w-full md:w-1/2">
            {ratingDistribution.map(({ stars, count, percentage }) => (
              <div key={stars} className="flex items-center mb-2">
                <div className="w-10 text-sm text-gray-600">{stars}★</div>
                <div className="flex-1 mx-2">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full" 
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-10 text-sm text-gray-600 text-right">{count}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Filters and Search */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Cari ulasan..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
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
              variant={filter === "verified" ? "default" : "outline"}
              onClick={() => setFilter("verified")}
              className={filter === "verified" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              <ThumbsUp className="h-4 w-4 mr-1" />
              Terverifikasi
            </Button>
            <Button 
              variant={filter === "5star" ? "default" : "outline"}
              onClick={() => setFilter("5star")}
              className={filter === "5star" ? "bg-blue-600 hover:bg-blue-700" : ""}
            >
              <Star className="h-4 w-4 mr-1" />
              5 Bintang
            </Button>
          </div>
          
          <div>
            <select
              className="rounded-md border border-gray-300 bg-white py-2 px-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">Terbaru</option>
              <option value="oldest">Terlama</option>
              <option value="highest">Rating Tertinggi</option>
              <option value="lowest">Rating Terendah</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Reviews List */}
      <div className="space-y-6">
        {filteredReviews.length === 0 ? (
          <Card className="p-12 text-center">
            <Star className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">Tidak ada ulasan</h3>
            <p className="mt-1 text-gray-500">
              Tidak ada ulasan yang sesuai dengan kriteria pencarian Anda.
            </p>
            <div className="mt-6">
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setIsReviewDialogOpen(true)}
              >
                <Star className="h-4 w-4 mr-2" />
                Tulis Ulasan Pertama
              </Button>
            </div>
          </Card>
        ) : (
          filteredReviews.map((review) => (
            <Card key={review.id} className="p-6">
              <div className="flex flex-col sm:flex-row">
                <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-6">
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center">
                        <h3 className="text-lg font-bold text-gray-900">{review.clientName}</h3>
                        {review.verified && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Terverifikasi
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600">{review.projectName}</p>
                      <div className="flex items-center mt-1">
                        {renderStars(review.rating)}
                        <span className="ml-2 text-sm text-gray-500">{review.date}</span>
                      </div>
                    </div>
                    
                    <div className="mt-2 sm:mt-0 flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleHelpful(review.id)}
                      >
                        <ThumbsUp className="h-4 w-4 mr-1" />
                        {review.helpful}
                      </Button>
                    </div>
                  </div>
                  
                  <div className="mt-4">
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                  
                  {review.responses && review.responses.length > 0 && (
                    <div className="mt-4 space-y-4">
                      {review.responses.map((response) => (
                        <div key={response.id} className="bg-gray-50 p-4 rounded-lg">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                              <User className="h-4 w-4 text-blue-600" />
                            </div>
                            <div className="ml-2">
                              <p className="text-sm font-medium text-gray-900">{response.author}</p>
                              <p className="text-xs text-gray-500">{response.date}</p>
                            </div>
                          </div>
                          <p className="mt-2 text-gray-700">{response.comment}</p>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  <div className="mt-4">
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="link" size="sm" className="p-0 text-blue-600 hover:text-blue-800">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Balas
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Balas Ulasan</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <p className="text-gray-700">{review.comment}</p>
                            <div className="flex items-center mt-2">
                              {renderStars(review.rating)}
                              <span className="ml-2 text-sm text-gray-500">oleh {review.clientName}</span>
                            </div>
                          </div>
                          
                          <div>
                            <label htmlFor="response" className="block text-sm font-medium text-gray-700 mb-1">
                              Tanggapan Anda
                            </label>
                            <Textarea
                              id="response"
                              rows={3}
                              placeholder="Tulis tanggapan Anda..."
                            />
                          </div>
                          
                          <div className="flex justify-end space-x-2">
                            <Button variant="outline">Batal</Button>
                            <Button 
                              className="bg-blue-600 hover:bg-blue-700"
                              onClick={() => handleRespond(review.id, "Response text")}
                            >
                              Kirim Tanggapan
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}