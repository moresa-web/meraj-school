import React from 'react';

interface ImageOptimizerProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;
  priority?: boolean;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  quality?: number;
  format?: 'webp' | 'avif' | 'auto';
  onLoad?: () => void;
  onError?: () => void;
}

const ImageOptimizer: React.FC<ImageOptimizerProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes,
  priority = false,
  placeholder = 'empty',
  blurDataURL,
  quality = 75,
  format = 'auto',
  onLoad,
  onError
}) => {
  // Generate optimized image URL
  const generateOptimizedUrl = (imageSrc: string): string => {
    if (!imageSrc || imageSrc.startsWith('data:') || imageSrc.startsWith('blob:')) {
      return imageSrc;
    }

    // If using a CDN or image optimization service, you can add parameters here
    const url = new URL(imageSrc, window.location.origin);
    
    if (width) url.searchParams.set('w', width.toString());
    if (height) url.searchParams.set('h', height.toString());
    if (quality) url.searchParams.set('q', quality.toString());
    if (format && format !== 'auto') url.searchParams.set('f', format);
    
    return url.toString();
  };

  // Generate srcset for responsive images
  const generateSrcSet = (imageSrc: string): string => {
    if (!imageSrc || imageSrc.startsWith('data:') || imageSrc.startsWith('blob:')) {
      return '';
    }

    const baseUrl = new URL(imageSrc, window.location.origin);
    const widths = [320, 640, 768, 1024, 1280, 1920];
    
    return widths
      .map(w => {
        const url = new URL(baseUrl);
        url.searchParams.set('w', w.toString());
        url.searchParams.set('q', quality.toString());
        if (format && format !== 'auto') url.searchParams.set('f', format);
        return `${url.toString()} ${w}w`;
      })
      .join(', ');
  };

  // Generate default sizes attribute
  const generateDefaultSizes = (): string => {
    if (sizes) return sizes;
    
    if (width && width <= 640) return '100vw';
    if (width && width <= 1024) return '50vw';
    return '33vw';
  };

  const optimizedSrc = generateOptimizedUrl(src);
  const srcSet = generateSrcSet(src);
  const defaultSizes = generateDefaultSizes();

  return (
    <img
      src={optimizedSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : loading}
      sizes={defaultSizes}
      srcSet={srcSet}
      decoding="async"
      onLoad={onLoad}
      onError={onError}
      style={{
        ...(placeholder === 'blur' && blurDataURL && {
          backgroundImage: `url(${blurDataURL})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        })
      }}
    />
  );
};

export default ImageOptimizer; 