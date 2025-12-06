import React from 'react';
import { clsx } from 'clsx';
import { Bot, Copy, Check, RefreshCw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResponseProps {
  content: string;
  isStreaming?: boolean;
  showActions?: boolean;
  onCopy?: () => void;
  onRegenerate?: () => void;
  onFeedback?: (positive: boolean) => void;
  className?: string;
  children?: React.ReactNode;
}

export function Response({
  content,
  isStreaming = false,
  showActions = true,
  onCopy,
  onRegenerate,
  onFeedback,
  className,
  children,
}: ResponseProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  return (
    <div className={clsx('group', className)}>
      <div className="flex gap-3">
        <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <Bot className="w-4 h-4 text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {children || (
              <p className="whitespace-pre-wrap break-words leading-relaxed text-gray-800 dark:text-gray-200">
                {content}
                {isStreaming && (
                  <motion.span className="inline-block w-2 h-4 ml-0.5 bg-blue-600 rounded-sm" animate={{ opacity: [1, 0] }} transition={{ duration: 0.8, repeat: Infinity }} />
                )}
              </p>
            )}
          </div>
          {showActions && !isStreaming && (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
              <ActionButton icon={copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} label={copied ? 'Copied!' : 'Copy'} onClick={handleCopy} />
              {onRegenerate && <ActionButton icon={<RefreshCw className="w-3.5 h-3.5" />} label="Regenerate" onClick={onRegenerate} />}
              {onFeedback && (
                <>
                  <div className="w-px h-4 bg-gray-200 dark:bg-gray-700 mx-1" />
                  <ActionButton icon={<ThumbsUp className="w-3.5 h-3.5" />} onClick={() => onFeedback(true)} />
                  <ActionButton icon={<ThumbsDown className="w-3.5 h-3.5" />} onClick={() => onFeedback(false)} />
                </>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label?: string; onClick?: () => void }) {
  return (
    <button onClick={onClick} className={clsx('flex items-center gap-1.5 px-2 py-1 rounded-md text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors')}>
      {icon}
      {label && <span>{label}</span>}
    </button>
  );
}

export default Response;
