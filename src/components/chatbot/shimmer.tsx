import React from 'react';
import { clsx } from 'clsx';

interface ShimmerProps {
  lines?: number;
  className?: string;
  animate?: boolean;
}

export function Shimmer({ lines = 3, className, animate = true }: ShimmerProps) {
  const lineWidths = ['100%', '85%', '70%', '90%', '60%'];

  return (
    <div className={clsx('space-y-2', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={clsx(
            'h-4 rounded bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700',
            animate && 'animate-shimmer bg-[length:200%_100%]'
          )}
          style={{ width: lineWidths[i % lineWidths.length] }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite linear;
        }
      `}</style>
    </div>
  );
}

interface ShimmerTextProps {
  text: string;
  className?: string;
  speed?: 'slow' | 'normal' | 'fast';
}

export function ShimmerText({ text, className, speed = 'normal' }: ShimmerTextProps) {
  const speedDuration = {
    slow: '3s',
    normal: '2s',
    fast: '1s',
  };

  return (
    <span
      className={clsx(
        'bg-clip-text text-transparent bg-gradient-to-r from-gray-900 via-blue-600 to-gray-900 dark:from-gray-100 dark:via-blue-400 dark:to-gray-100 bg-[length:200%_100%] animate-shimmer-text',
        className
      )}
      style={{
        animationDuration: speedDuration[speed],
      }}
    >
      {text}
      <style>{`
        @keyframes shimmer-text {
          0% { background-position: 200% center; }
          100% { background-position: -200% center; }
        }
        .animate-shimmer-text {
          animation: shimmer-text 2s infinite linear;
        }
      `}</style>
    </span>
  );
}

interface ShimmerBlockProps {
  width?: string;
  height?: string;
  rounded?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
}

export function ShimmerBlock({ width = '100%', height = '1rem', rounded = 'md', className }: ShimmerBlockProps) {
  const roundedClasses = {
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    full: 'rounded-full',
  };

  return (
    <div
      className={clsx(
        'bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-shimmer bg-[length:200%_100%]',
        roundedClasses[rounded],
        className
      )}
      style={{ width, height }}
    />
  );
}

export default Shimmer;
