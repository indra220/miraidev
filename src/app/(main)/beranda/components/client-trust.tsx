"use client";

import OptimizedMotion from "@/components/OptimizedMotion";

export function ClientTrustSection() {
  return (
    <OptimizedMotion 
      className="py-12 bg-gray-800/50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <h2 className="text-center text-gray-400 mb-8">Dipercaya oleh klien-klien kami</h2>
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-12 w-32 bg-gray-700 rounded flex items-center justify-center opacity-70">
              <span className="text-gray-400 font-medium">Klien {i+1}</span>
            </div>
          ))}
        </div>
      </div>
    </OptimizedMotion>
  );
}