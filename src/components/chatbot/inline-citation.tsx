import React, { useState } from 'react';
import { clsx } from 'clsx';
import { ExternalLink, FileText, Globe } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Source } from '@/types';

interface InlineCitationProps {
  index: number;
  source: Source;
  variant?: 'number' | 'text' | 'bracket';
  className?: string;
}

export function InlineCitation({
  index,
  source,
  variant = 'number',
  className,
}: InlineCitationProps) {
  const [isHovered, setIsHovered] = useState(false);

  const renderCitation = () => {
    switch (variant) {
      case 'bracket':
        return `[${index}]`;
      case 'text':
        return source.title.slice(0, 20) + (source.title.length > 20 ? '...' : '');
      default:
        return index;
    }
  };

  return (
    <span
      className={clsx('relative inline-flex', className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          'inline-flex items-center justify-center transition-colors',
          variant === 'number' && 'w-4 h-4 text-[10px] font-medium rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 hover:bg-blue-200 dark:hover:bg-blue-800/40',
          variant === 'bracket' && 'text-blue-600 dark:text-blue-400 text-sm hover:underline',
          variant === 'text' && 'text-blue-600 dark:text-blue-400 text-sm underline decoration-dotted hover:decoration-solid'
        )}
      >
        {renderCitation()}
      </a>

      {/* Tooltip */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-50"
          >
            <CitationTooltip source={source} />
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}

interface CitationTooltipProps {
  source: Source;
}

function CitationTooltip({ source }: CitationTooltipProps) {
  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  return (
    <div className="w-72 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="p-3">
        <div className="flex items-start gap-2">
          <div className="w-8 h-8 rounded bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <Globe className="w-4 h-4 text-gray-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
              {source.title}
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
              {getDomain(source.url)}
            </p>
          </div>
        </div>

        {source.snippet && (
          <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 line-clamp-3">
            {source.snippet}
          </p>
        )}
      </div>

      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-1.5 py-2 bg-gray-50 dark:bg-gray-700/50 text-xs text-blue-600 dark:text-blue-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
      >
        <ExternalLink className="w-3 h-3" />
        Open source
      </a>

      {/* Arrow */}
      <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-white dark:bg-gray-800 border-b border-r border-gray-200 dark:border-gray-700 rotate-45" />
    </div>
  );
}

interface CitationListProps {
  sources: Source[];
  inline?: boolean;
  className?: string;
}

export function CitationList({ sources, inline = false, className }: CitationListProps) {
  if (inline) {
    return (
      <span className={clsx('inline-flex items-center gap-0.5', className)}>
        {sources.map((source, index) => (
          <InlineCitation key={source.id} index={index + 1} source={source} variant="number" />
        ))}
      </span>
    );
  }

  return (
    <div className={clsx('space-y-1', className)}>
      {sources.map((source, index) => (
        <div key={source.id} className="flex items-center gap-2">
          <InlineCitation index={index + 1} source={source} variant="number" />
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 truncate"
          >
            {source.title}
          </a>
        </div>
      ))}
    </div>
  );
}

export default InlineCitation;
