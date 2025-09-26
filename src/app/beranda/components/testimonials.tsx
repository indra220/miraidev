"use client";

import OptimizedMotion from "@/components/OptimizedMotion";
import { TestimonialCard } from "./testimonial-card";

interface Testimonial {
  name: string;
  role: string;
  content: string;
  avatar?: string;
}

interface TestimonialsProps {
  testimonials: Testimonial[];
}

export function Testimonials({ testimonials }: TestimonialsProps) {
  return (
    <div className="py-20 bg-gray-800/30">
      <div className="container mx-auto px-4">
        <OptimizedMotion 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Apa Kata Klien Kami</h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Pengalaman nyata dari klien yang telah bekerja sama dengan kami
          </p>
        </OptimizedMotion>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}