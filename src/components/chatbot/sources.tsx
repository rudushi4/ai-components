import React, { useState } from 'react';
import { clsx } from 'clsx';
import { ExternalLink, ChevronDown, ChevronUp, FileText, Globe, Image, Video, File } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Source } from '@/types';

interface SourcesProps {
  sources: Source[];
  title?: string;
  maxVisible?: number;
  collapsible?: boolean;
  variant?: 'list' | 'grid' | 'compact';
  className?: string;
}

export function Sources({
  sources,
  title = 'Sources',
  maxVisible = 3,
  collapsible = true,
  variant = 'list',
  className,
}: SourcesProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const visibleSources = isExpanded ? sources : sources.slice(0, maxVisible);
  const hasMore = sources.length > maxVisible;

  if (sources.length === 0) return null;

  return (
    <div className={clsx('rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {title}
          </span>
          <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
            {sources.length}
          </span>
        </div>
        {collapsible && hasMore && (
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
          >
            {isExpanded ? (
              <>Show less <ChevronUp className="w-3 h-3" /></>
            ) : (
              <>Show all <ChevronDown className="w-3 h-3" /></>
            )}
          </button>
        )}
      </div>

      {/* Sources list */}
      <div className={clsx(
        'p-3',
        variant === 'grid' && 'grid grid-cols-2 gap-2',
        variant === 'list' && 'space-y-2',
        variant === 'compact' && 'flex flex-wrap gap-2'
      )}>
        <AnimatePresence>
          {visibleSources.map((source, index) => (
            <motion.div
              key={source.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
            >
              <SourceCard source={source} variant={variant} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

interface SourceCardProps {
  source: Source;
  variant: 'list' | 'grid' | 'compact';
}

function SourceCard({ source, variant }: SourceCardProps) {
  const getIcon = () => {
    const url = source.url.toLowerCase();
    if (url.includes('youtube') || url.includes('vimeo')) return <Video className="w-4 h-4" />;
    if (url.match(/\.(jpg|jpeg|png|gif|webp)$/)) return <Image className="w-4 h-4" />;
    if (url.match(/\.(pdf|doc|docx)$/)) return <File className="w-4 h-4" />;
    return <Globe className="w-4 h-4" />;
  };

  const getDomain = (url: string) => {
    try {
      return new URL(url).hostname.replace('www.', '');
    } catch {
      return url;
    }
  };

  if (variant === 'compact') {
    return (
      <a
        href={source.url}
        target="_blank"
        rel="noopener noreferrer"
        className={clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full',
          'bg-gray-100 dark:bg-gray-800 text-sm',
          'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700',
          'transition-colors'
        )}
      >
        {getIcon()}
        <span className="truncate max-w-[150px]">{getDomain(source.url)}</span>
        <ExternalLink className="w-3 h-3 text-gray-400" />
      </a>
    );
  }

  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        'block p-3 rounded-lg transition-colors',
        'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700',
        'border border-gray-100 dark:border-gray-700'
      )}
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-gray-500 flex-shrink-0">
          {getIcon()}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-1 group-hover:text-blue-600">
            {source.title}
          </h4>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {getDomain(source.url)}
          </p>
          {variant === 'list' && source.snippet && (
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1.5 line-clamp-2">
              {source.snippet}
            </p>
          )}
        </div>
        <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </div>
      {source.relevance !== undefined && (
        <div className="mt-2 flex items-center gap-1.5">
          <div className="flex-1 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 rounded-full"
              style={{ width: `${source.relevance * 100}%` }}
            />
          </div>
          <span className="text-[10px] text-gray-500">
            {Math.round(source.relevance * 100)}% relevant
          </span>
        </div>
      )}
    </a>
  );
}

// Quick source badge
interface SourceBadgeProps {
  source: Source;
  index: number;
  className?: string;
}

export function SourceBadge({ source, index, className }: SourceBadgeProps) {
  return (
    <a
      href={source.url}
      target="_blank"
      rel="noopener noreferrer"
      className={clsx(
        'inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs',
        'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
        'hover:bg-blue-100 dark:hover:bg-blue-800/30 transition-colors',
        className
      )}
      title={source.title}
    >
      <span className="font-medium">[{index}]</span>
      <span className="truncate max-w-[100px]">{source.title}</span>
    </a>
  );
}

export default Sources;
