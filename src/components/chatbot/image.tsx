import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Download, Maximize2, X, ZoomIn, ZoomOut, RotateCw, Loader2, AlertCircle, ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIImageProps {
  src: string;
  alt?: string;
  prompt?: string;
  status?: 'generating' | 'complete' | 'error';
  progress?: number;
  width?: number;
  height?: number;
  showActions?: boolean;
  onDownload?: () => void;
  onRegenerate?: () => void;
  className?: string;
}

export function AIImage({
  src,
  alt = 'AI Generated Image',
  prompt,
  status = 'complete',
  progress,
  width,
  height,
  showActions = true,
  onDownload,
  onRegenerate,
  className,
}: AIImageProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleDownload = async () => {
    if (onDownload) {
      onDownload();
      return;
    }

    try {
      const response = await fetch(src);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `ai-image-${Date.now()}.png`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  if (status === 'generating') {
    return (
      <div
        className={clsx(
          'relative rounded-xl overflow-hidden bg-gray-100 dark:bg-gray-800',
          className
        )}
        style={{ width: width || '100%', aspectRatio: width && height ? `${width}/${height}` : '1/1' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-gray-200 dark:border-gray-700" />
            <svg className="absolute inset-0 w-16 h-16 -rotate-90">
              <circle
                cx="32"
                cy="32"
                r="28"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeDasharray={`${(progress || 0) * 1.76} 176`}
                className="text-blue-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <ImageIcon className="w-6 h-6 text-gray-400" />
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-4">Generating image...</p>
          {progress !== undefined && (
            <p className="text-xs text-gray-400 mt-1">{Math.round(progress)}%</p>
          )}
        </div>
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>
    );
  }

  if (status === 'error' || hasError) {
    return (
      <div
        className={clsx(
          'relative rounded-xl overflow-hidden bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800',
          className
        )}
        style={{ width: width || '100%', aspectRatio: '1/1' }}
      >
        <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
          <AlertCircle className="w-12 h-12 text-red-500 mb-3" />
          <p className="text-sm text-red-700 dark:text-red-300 text-center">
            Failed to generate image
          </p>
          {onRegenerate && (
            <button
              onClick={onRegenerate}
              className="mt-3 flex items-center gap-2 px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
            >
              <RotateCw className="w-4 h-4" />
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={clsx('group relative rounded-xl overflow-hidden', className)}>
        {/* Loading state */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 dark:bg-gray-800">
            <Loader2 className="w-8 h-8 text-gray-400 animate-spin" />
          </div>
        )}

        {/* Image */}
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={() => setHasError(true)}
          className={clsx(
            'w-full h-auto transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
        />

        {/* Prompt overlay */}
        {prompt && (
          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <p className="text-xs text-white line-clamp-2">{prompt}</p>
          </div>
        )}

        {/* Action buttons */}
        {showActions && !isLoading && (
          <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setIsFullscreen(true)}
              className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
              title="Fullscreen"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
              title="Download"
            >
              <Download className="w-4 h-4" />
            </button>
            {onRegenerate && (
              <button
                onClick={onRegenerate}
                className="p-2 bg-black/50 text-white rounded-lg hover:bg-black/70 transition-colors"
                title="Regenerate"
              >
                <RotateCw className="w-4 h-4" />
              </button>
            )}
          </div>
        )}
      </div>

      {/* Fullscreen modal */}
      <AnimatePresence>
        {isFullscreen && (
          <ImageModal
            src={src}
            alt={alt}
            onClose={() => setIsFullscreen(false)}
            onDownload={handleDownload}
          />
        )}
      </AnimatePresence>
    </>
  );
}

interface ImageModalProps {
  src: string;
  alt: string;
  onClose: () => void;
  onDownload: () => void;
}

function ImageModal({ src, alt, onClose, onDownload }: ImageModalProps) {
  const [scale, setScale] = useState(1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
      onClick={onClose}
    >
      {/* Controls */}
      <div className="absolute top-4 right-4 flex gap-2 z-10">
        <button
          onClick={(e) => { e.stopPropagation(); setScale((s) => Math.max(0.5, s - 0.25)); }}
          className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); setScale((s) => Math.min(3, s + 0.25)); }}
          className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDownload(); }}
          className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          <Download className="w-5 h-5" />
        </button>
        <button
          onClick={onClose}
          className="p-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Image */}
      <motion.img
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[90vh] object-contain"
        style={{ transform: `scale(${scale})` }}
        onClick={(e) => e.stopPropagation()}
        drag
        dragConstraints={{ left: -500, right: 500, top: -500, bottom: 500 }}
      />
    </motion.div>
  );
}

// Image gallery for multiple AI images
interface AIImageGalleryProps {
  images: Array<{
    src: string;
    alt?: string;
    prompt?: string;
  }>;
  columns?: 2 | 3 | 4;
  className?: string;
}

export function AIImageGallery({ images, columns = 2, className }: AIImageGalleryProps) {
  const columnClasses = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={clsx('grid gap-3', columnClasses[columns], className)}>
      {images.map((image, index) => (
        <AIImage
          key={index}
          src={image.src}
          alt={image.alt}
          prompt={image.prompt}
        />
      ))}
    </div>
  );
}

export default AIImage;
