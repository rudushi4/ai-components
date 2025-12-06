import React from 'react';
import { clsx } from 'clsx';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  variant?: 'spinner' | 'dots' | 'pulse' | 'typing';
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function Loader({ variant = 'spinner', size = 'md', text, className }: LoaderProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const dotSizeClasses = {
    sm: 'w-1.5 h-1.5',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  if (variant === 'spinner') {
    return (
      <div className={clsx('flex items-center gap-2', className)}>
        <Loader2 className={clsx(sizeClasses[size], 'animate-spin text-blue-600')} />
        {text && <span className="text-sm text-gray-600 dark:text-gray-300">{text}</span>}
      </div>
    );
  }

  if (variant === 'dots') {
    return (
      <div className={clsx('flex items-center gap-1', className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={clsx(
              dotSizeClasses[size],
              'bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce'
            )}
            style={{ animationDelay: `${i * 0.15}s` }}
          />
        ))}
        {text && <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">{text}</span>}
      </div>
    );
  }

  if (variant === 'pulse') {
    return (
      <div className={clsx('flex items-center gap-2', className)}>
        <div className={clsx(sizeClasses[size], 'bg-blue-600 rounded-full animate-pulse')} />
        {text && <span className="text-sm text-gray-600 dark:text-gray-300">{text}</span>}
      </div>
    );
  }

  if (variant === 'typing') {
    return (
      <div className={clsx('flex items-center gap-1 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-2xl w-fit', className)}>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className={clsx(
              dotSizeClasses[size],
              'bg-gray-500 dark:bg-gray-400 rounded-full'
            )}
            style={{
              animation: 'typing 1.4s infinite',
              animationDelay: `${i * 0.2}s`,
            }}
          />
        ))}
        <style>{`
          @keyframes typing {
            0%, 60%, 100% { transform: translateY(0); opacity: 0.4; }
            30% { transform: translateY(-4px); opacity: 1; }
          }
        `}</style>
      </div>
    );
  }

  return null;
}

export default Loader;
