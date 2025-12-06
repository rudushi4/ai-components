import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Sparkles, ChevronDown, ChevronUp, Clock, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ReasoningProps {
  content: string;
  title?: string;
  duration?: number;
  isStreaming?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

export function Reasoning({
  content,
  title = 'Reasoning',
  duration,
  isStreaming = false,
  collapsible = true,
  defaultExpanded = false,
  className,
}: ReasoningProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || isStreaming);

  return (
    <div
      className={clsx(
        'rounded-lg overflow-hidden',
        'bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20',
        'border border-purple-200 dark:border-purple-800',
        className
      )}
    >
      <button
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
        className={clsx(
          'w-full flex items-center gap-2 px-4 py-2.5',
          'hover:bg-purple-100/50 dark:hover:bg-purple-800/20 transition-colors',
          !collapsible && 'cursor-default'
        )}
      >
        <Sparkles className="w-4 h-4 text-purple-600 dark:text-purple-400" />
        <span className="font-medium text-sm text-purple-700 dark:text-purple-300">{title}</span>

        {isStreaming && (
          <span className="flex items-center gap-1 text-xs text-purple-500">
            <Zap className="w-3 h-3 animate-pulse" />Thinking...
          </span>
        )}

        {duration && !isStreaming && (
          <span className="flex items-center gap-1 text-xs text-purple-500 ml-auto">
            <Clock className="w-3 h-3" />{(duration / 1000).toFixed(1)}s
          </span>
        )}

        {collapsible && (
          <span className="ml-auto">
            {isExpanded ? <ChevronUp className="w-4 h-4 text-purple-500" /> : <ChevronDown className="w-4 h-4 text-purple-500" />}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4">
              <div
                className={clsx(
                  'text-sm text-purple-800 dark:text-purple-200',
                  'bg-white/60 dark:bg-gray-900/40 rounded-lg p-3',
                  'font-mono whitespace-pre-wrap leading-relaxed',
                  'max-h-64 overflow-y-auto'
                )}
              >
                {content}
                {isStreaming && <span className="inline-block w-2 h-4 ml-0.5 bg-purple-600 animate-pulse" />}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ReasoningBlock({ label, content, icon, className }: { label: string; content: string; icon?: React.ReactNode; className?: string }) {
  return (
    <div className={clsx('space-y-1', className)}>
      <div className="flex items-center gap-1.5 text-xs font-medium text-purple-600 dark:text-purple-400">
        {icon}<span>{label}</span>
      </div>
      <p className="text-sm text-gray-700 dark:text-gray-300 pl-5">{content}</p>
    </div>
  );
}

export default Reasoning;
