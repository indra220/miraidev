"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

interface AnimatedCounterProps {
  end: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
}

export default function AnimatedCounter({ 
  end, 
  duration = 2000,
  suffix = "",
  prefix = ""
}: AnimatedCounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const startTime = useRef<number | null>(null);
  
  useEffect(() => {
    if (!ref.current) return;
    
    const animate = (timestamp: number) => {
      if (!startTime.current) startTime.current = timestamp;
      const elapsed = timestamp - startTime.current;
      const progress = Math.min(elapsed / duration, 1);
      
      const current = Math.floor(progress * end);
      if (ref.current) {
        ref.current.textContent = `${prefix}${current.toLocaleString()}${suffix}`;
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          startTime.current = null;
          requestAnimationFrame(animate);
          observer.disconnect();
        }
      });
    });
    
    observer.observe(ref.current.parentElement || ref.current);
    
    return () => observer.disconnect();
  }, [end, duration, prefix, suffix]);
  
  return (
    <motion.span
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="inline-block"
    >
      {prefix}0{suffix}
    </motion.span>
  );
}