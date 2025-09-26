import { motion, MotionProps } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { ElementType } from "react";

interface OptimizedMotionProps extends MotionProps {
  children: React.ReactNode;
  as?: ElementType;
  className?: string;
}

const OptimizedMotion = ({ 
  children, 
  as: Component = "div",
  initial,
  animate,
  transition,
  className,
  ...props
}: OptimizedMotionProps) => {
  const prefersReducedMotion = useReducedMotion();
  
  // Jika pengguna memilih gerakan tereduksi, gunakan komponen biasa tanpa animasi
  if (prefersReducedMotion) {
    const Comp = Component;
    return <Comp className={className} {...props}>{children}</Comp>;
  }
  
  // Untuk animasi normal, gunakan motion component
  const MotionComponent = motion(Component);
  return (
    <MotionComponent
      initial={initial}
      animate={animate}
      transition={transition}
      className={className}
      {...props}
    >
      {children}
    </MotionComponent>
  );
};

export default OptimizedMotion;