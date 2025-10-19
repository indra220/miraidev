"use client";

import { motion } from "framer-motion";

export default function SocialProof() {
  const clients = [
    { id: 1, name: "TechCorp Indonesia", logo: "/client-1.svg" },
    { id: 2, name: "Fashionista Store", logo: "/client-2.svg" },
    { id: 3, name: "Nusantara Cafe", logo: "/client-3.svg" },
    { id: 4, name: "FinTech Solutions", logo: "/client-4.svg" },
    { id: 5, name: "HealthPlus Clinic", logo: "/client-5.svg" },
    { id: 6, name: "EduSmart Academy", logo: "/client-6.svg" },
  ];

  return (
    <div className="py-12 bg-slate-800/30">
      <div className="container mx-auto px-4">
        <motion.h2 
          className="text-center text-slate-400 mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          Dipercaya oleh klien-klien kami
        </motion.h2>
        
        <div className="flex flex-wrap justify-center gap-8 md:gap-12">
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              className="h-12 w-32 bg-slate-700 rounded flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 0.7, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              whileHover={{ 
                scale: 1.05,
                opacity: 1,
                y: -5
              }}
            >
              <span className="text-slate-400 font-medium text-sm">
                {client.name}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}