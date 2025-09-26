import { Transition, Variant } from "framer-motion";

export const getAnimationProps = (prefersReducedMotion: boolean) => {
  // Jika pengguna memilih gerakan tereduksi, gunakan durasi 0 untuk semua animasi
  if (prefersReducedMotion) {
    return {
      transition: { duration: 0 } as Transition,
      initial: {},
      animate: {},
      exit: {}
    };
  }
  
  // Untuk animasi normal, gunakan konfigurasi default
  return {
    transition: undefined,
    initial: undefined,
    animate: undefined,
    exit: undefined
  };
};

export const getReducedMotionVariants = (): {
  hidden: Variant;
  visible: Variant;
} => ({
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
});