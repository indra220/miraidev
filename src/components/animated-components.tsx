'use client';

import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}

export function AnimatedCard({ 
  children, 
  delay = 0, 
  className = '' 
}: AnimatedCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface AnimatedStatsCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
  delay?: number;
}

export function AnimatedStatsCard({ 
  title, 
  value, 
  change, 
  icon, 
  color, 
  delay = 0 
}: AnimatedStatsCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay }}
    >
      <div className="p-6 bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-400">{title}</p>
            <motion.p 
              className="text-2xl font-bold text-white mt-1"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 300, damping: 15, delay: delay + 0.1 }}
            >
              {value}
            </motion.p>
            <p className="text-xs text-gray-500 mt-1">{change}</p>
          </div>
          <div className={`${color} p-3 rounded-full`}>
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface AnimatedListProps {
  children: React.ReactNode;
  className?: string;
}

export function AnimatedList({ children, className = '' }: AnimatedListProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}