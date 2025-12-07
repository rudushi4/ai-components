import React from 'react';
import { clsx } from 'clsx';
import { MessageSquare, ExternalLink, ArrowUpRight, Sparkles } from 'lucide-react';

interface OpenInChatProps {
  content: string;
  context?: string;
  label?: string;
  variant?: 'button' | 'link' | 'icon' | 'card';
  size?: 'sm' | 'md' | 'lg';
  onOpen?: (content: string, context?: string) => void;
  className?: string;
}

export function OpenInChat({
  content,
  context,
  label = 'Open in Chat',
  variant = 'button',
  size = 'md',
  onOpen,
  className,
}: OpenInChatProps) {
  const handleClick = () => {
    onOpen?.(content, context);
  };

  const sizeClasses = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  const iconSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-5 h-5',
  };

  if (variant === 'icon') {
    return (
      <button
        onClick={handleClick}
        className={clsx(
          'p-1.5 rounded-lg transition-colors',
          'text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20',
          className
        )}
        title={label}
      >
        <MessageSquare className={iconSizes[size]} />
      </button>
    );
  }

  if (variant === 'link') {
    return (
      <button
        onClick={handleClick}
        className={clsx(
          'inline-flex items-center gap-1 text-blue-600 dark:text-blue-400 hover:underline',
          sizeClasses[size],
          className
        )}
      >
        <span>{label}</span>
        <ArrowUpRight className={iconSizes[size]} />
      </button>
    );
  }

  if (variant === 'card') {
    return (
      <button
        onClick={handleClick}
        className={clsx(
          'group flex items-center gap-3 w-full p-4 rounded-xl text-left',
          'bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
          'border border-blue-200 dark:border-blue-800',
          'hover:from-blue-100 hover:to-indigo-100 dark:hover:from-blue-900/30 dark:hover:to-indigo-900/30',
          'transition-all duration-200',
          className
        )}
      >
        <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
          <MessageSquare className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-medium text-gray-900 dark:text-gray-100">{label}</h4>
          <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-0.5">
            {content.slice(0, 50)}{content.length > 50 ? '...' : ''}
          </p>
        </div>
        <ArrowUpRight className="w-5 h-5 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
      </button>
    );
  }

  // Default button variant
  return (
    <button
      onClick={handleClick}
      className={clsx(
        'inline-flex items-center gap-2 rounded-lg transition-colors',
        'bg-blue-600 text-white hover:bg-blue-700',
        size === 'sm' && 'px-3 py-1.5',
        size === 'md' && 'px-4 py-2',
        size === 'lg' && 'px-5 py-2.5',
        sizeClasses[size],
        className
      )}
    >
      <MessageSquare className={iconSizes[size]} />
      <span>{label}</span>
    </button>
  );
}

// Floating open in chat button
interface FloatingOpenInChatProps {
  content: string;
  context?: string;
  position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
  onOpen?: (content: string, context?: string) => void;
  className?: string;
}

export function FloatingOpenInChat({
  content,
  context,
  position = 'bottom-right',
  onOpen,
  className,
}: FloatingOpenInChatProps) {
  const positionClasses = {
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
  };

  return (
    <button
      onClick={() => onOpen?.(content, context)}
      className={clsx(
        'fixed z-50 flex items-center gap-2 px-4 py-3 rounded-full shadow-lg',
        'bg-blue-600 text-white hover:bg-blue-700',
        'transform hover:scale-105 transition-all duration-200',
        positionClasses[position],
        className
      )}
    >
      <Sparkles className="w-5 h-5" />
      <span className="font-medium">Ask AI</span>
    </button>
  );
}

// Contextual open in chat (appears near selected text)
interface ContextualOpenInChatProps {
  content: string;
  position: { x: number; y: number };
  onOpen?: (content: string) => void;
  onClose?: () => void;
  className?: string;
}

export function ContextualOpenInChat({
  content,
  position,
  onOpen,
  onClose,
  className,
}: ContextualOpenInChatProps) {
  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className={clsx(
          'fixed z-50 flex items-center gap-1 p-1 rounded-lg shadow-xl',
          'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
          className
        )}
        style={{
          left: position.x,
          top: position.y,
          transform: 'translate(-50%, -100%) translateY(-8px)',
        }}
      >
        <button
          onClick={() => onOpen?.(content)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
        >
          <MessageSquare className="w-4 h-4" />
          <span>Ask about this</span>
        </button>
        {/* Arrow */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-white dark:border-t-gray-800" />
      </div>
    </>
  );
}

export default OpenInChat;
