"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  content: string;
  avatar: string;
  rating: number;
}

export default function TestimonialSlider() {
  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Budi Santoso",
      role: "CEO",
      company: "TechStartup Indonesia",
      content: "MiraiDev membantu kami membangun website yang luar biasa dengan desain modern dan performa cepat. Proses kerja yang transparan membuat kami selalu terlibat dalam setiap tahap pengembangan.",
      avatar: "/placeholder-avatar-1.jpg",
      rating: 5
    },
    {
      id: 2,
      name: "Siti Rahmawati",
      role: "Founder",
      company: "Toko Online Fashionista",
      content: "Sebagai pemilik UMKM, saya membutuhkan solusi e-commerce yang terjangkau namun berkualitas tinggi. MiraiDev memberikan solusi yang melebihi ekspektasi saya dengan harga yang kompetitif.",
      avatar: "/placeholder-avatar-2.jpg",
      rating: 5
    },
    {
      id: 3,
      name: "Ahmad Rifai",
      role: "Marketing Director",
      company: "Corporate Solutions",
      content: "Kami bekerja sama dengan MiraiDev untuk redesign website perusahaan kami. Hasilnya sangat memuaskan, traffic website meningkat 150% dalam 3 bulan setelah launching.",
      avatar: "/placeholder-avatar-3.jpg",
      rating: 5
    },
    {
      id: 4,
      name: "Dewi Kartika",
      role: "Owner",
      company: "Kafe Nusantara",
      content: "Website baru kami sangat membantu meningkatkan visibilitas bisnis offline kami. Integrasi dengan media sosial dan sistem reservasi online membuat pelanggan lebih mudah menjangkau kami.",
      avatar: "/placeholder-avatar-4.jpg",
      rating: 5
    }
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % testimonials.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, testimonials.length]);

  const goToPrevious = () => {
    setCurrentIndex(prev => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex(prev => (prev + 1) % testimonials.length);
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto py-12">
      <div 
        className="overflow-hidden"
        onMouseEnter={() => setIsAutoPlaying(false)}
        onMouseLeave={() => setIsAutoPlaying(true)}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="w-full"
          >
            <Card className="bg-gray-800/50 border-gray-700 p-8 md:p-12">
              <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                <div className="flex-shrink-0">
                  <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center overflow-hidden">
                    <div className="text-center">
                      <div className="w-12 h-12 rounded-full bg-gray-600 flex items-center justify-center mx-auto mb-2">
                        <span className="text-xl font-bold text-white">
                          {testimonials[currentIndex].name.charAt(0)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm">{testimonials[currentIndex].name}</p>
                    </div>
                  </div>
                </div>
                
                <div className="flex-grow text-center md:text-left">
                  <div className="flex justify-center md:justify-start mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-5 h-5 ${i < testimonials[currentIndex].rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                      />
                    ))}
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl text-gray-200 mb-6 italic">
                    "{testimonials[currentIndex].content}"
                  </blockquote>
                  
                  <div className="border-t border-gray-700 pt-6">
                    <div className="font-semibold text-lg text-white">
                      {testimonials[currentIndex].name}
                    </div>
                    <div className="text-blue-400">
                      {testimonials[currentIndex].role}, {testimonials[currentIndex].company}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Arrows */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-6 hidden md:flex bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700 hover:text-white transition-all duration-150"
        onClick={goToPrevious}
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>
      
      <Button
        variant="outline"
        size="icon"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-6 hidden md:flex bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700 hover:text-white transition-all duration-150"
        onClick={goToNext}
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-8 space-x-2">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentIndex ? 'bg-blue-500 w-8' : 'bg-gray-600'
            }`}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>

      {/* Mobile Navigation Arrows */}
      <div className="flex justify-between mt-6 md:hidden">
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700 hover:text-white transition-all duration-150"
          onClick={goToPrevious}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="bg-gray-800/50 border-gray-700 text-white hover:bg-gray-700 hover:text-white transition-all duration-150"
          onClick={goToNext}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}