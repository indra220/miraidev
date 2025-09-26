import { useState, useEffect } from 'react';
import Image, { ImageProps } from 'next/image';

const LazyImage = (props: ImageProps) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    // Jika browser tidak mendukung Intersection Observer, tampilkan gambar langsung
    if (!('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById(`lazy-image-${props.alt?.replace(/\s+/g, '-') || 'default'}`);
    if (element) {
      observer.observe(element);
    }

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [props.alt]);

  return (
    <div id={`lazy-image-${props.alt?.replace(/\s+/g, '-') || 'default'}`}>
      {isInView ? (
        <Image
          {...props}
          onLoad={() => setIsLoaded(true)}
          className={`${props.className} ${!isLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        />
      ) : (
        <div className="bg-gray-200 dark:bg-gray-700 animate-pulse" style={{ width: props.width, height: props.height }} />
      )}
    </div>
  );
};

export default LazyImage;