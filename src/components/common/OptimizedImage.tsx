import React, { useState } from 'react';
import { optimizeImageUrl } from '../../utils/imageOptimizer.js';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  className?: string;
  widthParam?: number;
  qualityParam?: number;
  priority?: boolean;
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  widthParam = 640,
  qualityParam = 70,
  priority = false,
  fallbackSrc = '/images/hero_automation.jpg',
  ...rest
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const optimizedSrc = hasError
    ? fallbackSrc
    : optimizeImageUrl(src, widthParam, qualityParam);

  return (
    <div className={`relative overflow-hidden bg-slate-900 ${className}`}>
      {/* Skeleton / Shimmer placeholder while image loads */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-slate-800 animate-pulse" />
      )}

      <img
        src={optimizedSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        referrerPolicy="no-referrer"
        onLoad={() => setIsLoaded(true)}
        onError={() => {
          if (!hasError) setHasError(true);
        }}
        className={`w-full h-full object-cover transition-opacity duration-300 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
        {...rest}
      />
    </div>
  );
};
