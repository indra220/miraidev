import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps extends Omit<ImageProps, 'src'> {
  src: string;
  alt: string;
  placeholderSrc?: string;
}

const OptimizedImage = ({ 
  src, 
  alt, 
  placeholderSrc = '/placeholder-image.jpg', 
  ...props 
}: OptimizedImageProps) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [isLoading, setIsLoading] = useState(true);

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    // Ganti dengan placeholder jika gambar asli gagal dimuat
    if (imageSrc !== placeholderSrc) {
      setImageSrc(placeholderSrc);
    }
  };

  return (
    <div className="relative overflow-hidden">
      {isLoading && (
        <div className="bg-gray-200 dark:bg-gray-700 animate-pulse rounded-md w-full h-full" />
      )}
      <Image
        src={imageSrc}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        {...props}
        className={`${props.className || ''} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
      />
    </div>
  );
};

export default OptimizedImage;