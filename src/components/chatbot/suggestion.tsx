import React from 'react';
import { clsx } from 'clsx';
import { Lightbulb, ArrowRight, Sparkles, Code, FileText, Search, MessageSquare, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Suggestion as SuggestionType } from '@/types';

interface SuggestionProps {
  suggestions: SuggestionType[];
  title?: string;
  variant?: 'chips' | 'cards' | 'list';
  columns?: 1 | 2 | 3 | 4;
  onSelect?: (suggestion: SuggestionType) => void;
  className?: string;
}

export function Suggestion({
  suggestions,
  title,
  variant = 'chips',
  columns = 2,
  onSelect,
  className,
}: SuggestionProps) {
  if (suggestions.length === 0) return null;

  const columnClasses = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
  };

  return (
    <div className={clsx('space-y-3', className)}>
      {title && (
        <div className="flex items-center gap-2 text-sm font-medium text-gray-600 dark:text-gray-400">
          <Lightbulb className="w-4 h-4" />
          <span>{title}</span>
        </div>
      )}

      <div
        className={clsx(
          variant === 'chips' && 'flex flex-wrap gap-2',
          variant === 'cards' && `grid ${columnClasses[columns]} gap-3`,
          variant === 'list' && 'space-y-2'
        )}
      >
        {suggestions.map((suggestion, index) => (
          <motion.div
            key={suggestion.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            {variant === 'chips' && (
              <SuggestionChip suggestion={suggestion} onClick={() => onSelect?.(suggestion)} />
            )}
            {variant === 'cards' && (
              <SuggestionCard suggestion={suggestion} onClick={() => onSelect?.(suggestion)} />
            )}
            {variant === 'list' && (
              <SuggestionListItem suggestion={suggestion} onClick={() => onSelect?.(suggestion)} />
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Chip variant
interface SuggestionChipProps {
  suggestion: SuggestionType;
  onClick?: () => void;
}

function SuggestionChip({ suggestion, onClick }: SuggestionChipProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm',
        'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
        'hover:bg-blue-50 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300',
        'border border-transparent hover:border-blue-200 dark:hover:border-blue-800',
        'transition-all duration-200'
      )}
    >
      {suggestion.icon || <Sparkles className="w-3.5 h-3.5" />}
      <span>{suggestion.text}</span>
    </button>
  );
}

// Card variant
interface SuggestionCardProps {
  suggestion: SuggestionType;
  onClick?: () => void;
}

function SuggestionCard({ suggestion, onClick }: SuggestionCardProps) {
  const getCategoryIcon = () => {
    switch (suggestion.category) {
      case 'code': return <Code className="w-5 h-5" />;
      case 'write': return <FileText className="w-5 h-5" />;
      case 'search': return <Search className="w-5 h-5" />;
      case 'chat': return <MessageSquare className="w-5 h-5" />;
      default: return <Zap className="w-5 h-5" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={clsx(
        'group flex items-start gap-3 p-4 rounded-xl text-left w-full',
        'bg-white dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700',
        'hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md',
        'transition-all duration-200'
      )}
    >
      <div className={clsx(
        'w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0',
        'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400',
        'group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-600 dark:group-hover:text-blue-400',
        'transition-colors'
      )}>
        {suggestion.icon || getCategoryIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">
          {suggestion.text}
        </p>
        {suggestion.category && (
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1 capitalize">
            {suggestion.category}
          </span>
        )}
      </div>
      <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
    </button>
  );
}

// List variant
interface SuggestionListItemProps {
  suggestion: SuggestionType;
  onClick?: () => void;
}

function SuggestionListItem({ suggestion, onClick }: SuggestionListItemProps) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'group flex items-center gap-3 w-full px-4 py-3 rounded-lg text-left',
        'hover:bg-gray-50 dark:hover:bg-gray-800/50',
        'transition-colors'
      )}
    >
      <div className="text-gray-400 group-hover:text-blue-500">
        {suggestion.icon || <Sparkles className="w-4 h-4" />}
      </div>
      <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-gray-100">
        {suggestion.text}
      </span>
      <ArrowRight className="w-4 h-4 text-gray-300 dark:text-gray-600 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all" />
    </button>
  );
}

// Quick suggestions bar
interface QuickSuggestionsProps {
  suggestions: string[];
  onSelect?: (text: string) => void;
  className?: string;
}

export function QuickSuggestions({ suggestions, onSelect, className }: QuickSuggestionsProps) {
  return (
    <div className={clsx('flex items-center gap-2 overflow-x-auto pb-2', className)}>
      <span className="text-xs text-gray-500 flex-shrink-0">Try:</span>
      {suggestions.map((text, index) => (
        <button
          key={index}
          onClick={() => onSelect?.(text)}
          className={clsx(
            'flex-shrink-0 px-3 py-1 rounded-full text-xs',
            'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400',
            'hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-700 dark:hover:text-blue-300',
            'transition-colors whitespace-nowrap'
          )}
        >
          {text}
        </button>
      ))}
    </div>
  );
}

export default Suggestion;
