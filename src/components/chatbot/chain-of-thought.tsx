import React, { useState } from 'react';
import { clsx } from 'clsx';
import { ChevronDown, ChevronRight, Brain, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ReasoningStep } from '@/types';

interface ChainOfThoughtProps {
  steps: ReasoningStep[];
  title?: string;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  className?: string;
}

export function ChainOfThought({
  steps,
  title = 'Thinking...',
  collapsible = true,
  defaultExpanded = true,
  className,
}: ChainOfThoughtProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const isComplete = steps.every((step) => step.status === 'complete');
  const hasError = steps.some((step) => step.status === 'error');

  return (
    <div
      className={clsx(
        'border rounded-lg overflow-hidden',
        'border-gray-200 dark:border-gray-700',
        'bg-gray-50 dark:bg-gray-900/50',
        className
      )}
    >
      <button
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
        className={clsx(
          'w-full flex items-center gap-2 px-4 py-3 text-left',
          'hover:bg-gray-100 dark:hover:bg-gray-800/50 transition-colors',
          !collapsible && 'cursor-default'
        )}
      >
        {collapsible && (
          isExpanded ? <ChevronDown className="w-4 h-4 text-gray-500" /> : <ChevronRight className="w-4 h-4 text-gray-500" />
        )}
        <Brain className={clsx('w-4 h-4', isComplete ? 'text-green-600' : hasError ? 'text-red-600' : 'text-blue-600')} />
        <span className="font-medium text-sm text-gray-700 dark:text-gray-200">
          {isComplete ? 'Thought Process' : title}
        </span>
        <span className="text-xs text-gray-500 ml-auto">
          {steps.filter(s => s.status === 'complete').length}/{steps.length} steps
        </span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="px-4 pb-4 space-y-3">
              {steps.map((step, index) => (
                <ThoughtStep key={step.id} step={step} index={index} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ThoughtStep({ step, index }: { step: ReasoningStep; index: number }) {
  const statusIcon = {
    thinking: <Loader2 className="w-4 h-4 text-blue-600 animate-spin" />,
    complete: <CheckCircle2 className="w-4 h-4 text-green-600" />,
    error: <AlertCircle className="w-4 h-4 text-red-600" />,
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
      className={clsx('flex gap-3 p-3 rounded-lg bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700')}
    >
      <div className="flex-shrink-0 mt-0.5">{statusIcon[step.status]}</div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h4 className="font-medium text-sm text-gray-900 dark:text-gray-100">{step.title}</h4>
          {step.duration && <span className="text-xs text-gray-400">{step.duration}ms</span>}
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 whitespace-pre-wrap">{step.content}</p>
      </div>
    </motion.div>
  );
}

export default ChainOfThought;
