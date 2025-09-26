import { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { MotionProps } from 'framer-motion';

// Dinamisasi komponen-komponen berat untuk lazy loading
export const DynamicOptimizedMotion = dynamic(() => import('@/components/OptimizedMotion'), {
  loading: () => <div className="opacity-0">Loading...</div>,
  ssr: false
});

export const DynamicCard = dynamic(() => import('@/components/ui/card').then(mod => ({ default: mod.Card })), {
  loading: () => <div className="bg-gray-800/50 border-gray-700 p-6 animate-pulse">Loading...</div>,
});

// Wrapper untuk komponen-komponen lainnya
const LazyOptimizedMotion = ({ children, ...props }: React.PropsWithChildren<MotionProps>) => {
  return (
    <Suspense fallback={<div className="opacity-0">Loading...</div>}>
      <DynamicOptimizedMotion {...props}>
        {children}
      </DynamicOptimizedMotion>
    </Suspense>
  );
};

export default LazyOptimizedMotion;