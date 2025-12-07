import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Wrench, ChevronDown, ChevronUp, CheckCircle2, Loader2, AlertCircle, Clock, Code, Copy, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ToolCall } from '@/types';

interface ToolProps {
  tool: ToolCall;
  showInput?: boolean;
  showOutput?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

export function Tool({
  tool,
  showInput = true,
  showOutput = true,
  collapsible = true,
  defaultExpanded = false,
  className,
}: ToolProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded || tool.status === 'running');

  const statusConfig = {
    pending: {
      icon: <Clock className="w-4 h-4" />,
      color: 'text-gray-500',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      borderColor: 'border-gray-200 dark:border-gray-700',
    },
    running: {
      icon: <Loader2 className="w-4 h-4 animate-spin" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-200 dark:border-blue-800',
    },
    complete: {
      icon: <CheckCircle2 className="w-4 h-4" />,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    error: {
      icon: <AlertCircle className="w-4 h-4" />,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
    },
  };

  const config = statusConfig[tool.status];

  return (
    <div
      className={clsx(
        'rounded-lg border overflow-hidden',
        config.borderColor,
        className
      )}
    >
      {/* Header */}
      <button
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
        className={clsx(
          'w-full flex items-center gap-3 px-4 py-3',
          config.bgColor,
          collapsible && 'hover:opacity-80 transition-opacity'
        )}
      >
        <div className={clsx('flex-shrink-0', config.color)}>
          {config.icon}
        </div>
        <div className="flex items-center gap-2 flex-1 min-w-0 text-left">
          <Wrench className="w-4 h-4 text-gray-400" />
          <span className="font-mono text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {tool.name}
          </span>
        </div>
        {tool.duration && (
          <span className="text-xs text-gray-500">
            {tool.duration}ms
          </span>
        )}
        {collapsible && (
          isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-400" />
          )
        )}
      </button>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="p-4 space-y-4 bg-white dark:bg-gray-900">
              {/* Input */}
              {showInput && tool.input && (
                <ToolDataBlock
                  label="Input"
                  data={tool.input}
                />
              )}

              {/* Output */}
              {showOutput && tool.output && (
                <ToolDataBlock
                  label="Output"
                  data={tool.output}
                />
              )}

              {/* Error message for failed tools */}
              {tool.status === 'error' && typeof tool.output === 'string' && (
                <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg text-red-700 dark:text-red-300">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <p className="text-sm">{tool.output}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ToolDataBlockProps {
  label: string;
  data: unknown;
}

function ToolDataBlock({ label, data }: ToolDataBlockProps) {
  const [copied, setCopied] = useState(false);
  const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-500">
          <Code className="w-3 h-3" />
          <span>{label}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1 px-2 py-0.5 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 text-green-500" />
              <span>Copied</span>
            </>
          ) : (
            <>
              <Copy className="w-3 h-3" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto max-h-48">
        {jsonString}
      </pre>
    </div>
  );
}

// Tool list component
interface ToolListProps {
  tools: ToolCall[];
  collapsible?: boolean;
  className?: string;
}

export function ToolList({ tools, collapsible = true, className }: ToolListProps) {
  return (
    <div className={clsx('space-y-2', className)}>
      {tools.map((tool, index) => (
        <motion.div
          key={tool.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Tool tool={tool} collapsible={collapsible} />
        </motion.div>
      ))}
    </div>
  );
}

// Compact tool badge
interface ToolBadgeProps {
  tool: ToolCall;
  onClick?: () => void;
  className?: string;
}

export function ToolBadge({ tool, onClick, className }: ToolBadgeProps) {
  const statusColors = {
    pending: 'bg-gray-100 dark:bg-gray-800 text-gray-600',
    running: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600',
    complete: 'bg-green-100 dark:bg-green-900/30 text-green-600',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-600',
  };

  return (
    <button
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-mono',
        statusColors[tool.status],
        'hover:opacity-80 transition-opacity',
        className
      )}
    >
      <Wrench className="w-3 h-3" />
      <span>{tool.name}</span>
      {tool.status === 'running' && <Loader2 className="w-3 h-3 animate-spin" />}
    </button>
  );
}

export default Tool;
