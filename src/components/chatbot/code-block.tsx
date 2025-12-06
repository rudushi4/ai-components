import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check, ChevronDown, ChevronUp, Terminal, Play, FileCode } from 'lucide-react';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  showRunButton?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  maxHeight?: number;
  theme?: 'dark' | 'light' | 'auto';
  onCopy?: () => void;
  onRun?: () => void;
  className?: string;
}

export function CodeBlock({
  code,
  language = 'text',
  filename,
  showLineNumbers = true,
  showCopyButton = true,
  showRunButton = false,
  collapsible = false,
  defaultExpanded = true,
  maxHeight = 400,
  theme = 'dark',
  onCopy,
  onRun,
  className,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  const isDark = theme === 'dark' || (theme === 'auto' && typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches);
  const lineCount = code.split('\n').length;

  return (
    <div
      className={clsx(
        'rounded-lg overflow-hidden border',
        isDark ? 'bg-[#282c34] border-gray-700' : 'bg-gray-50 border-gray-200',
        className
      )}
    >
      <div
        className={clsx(
          'flex items-center justify-between px-4 py-2 border-b',
          isDark ? 'bg-[#21252b] border-gray-700' : 'bg-gray-100 border-gray-200'
        )}
      >
        <div className="flex items-center gap-2">
          {filename ? (
            <>
              <FileCode className={clsx('w-4 h-4', isDark ? 'text-gray-400' : 'text-gray-500')} />
              <span className={clsx('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>
                {filename}
              </span>
            </>
          ) : (
            <>
              <Terminal className={clsx('w-4 h-4', isDark ? 'text-gray-400' : 'text-gray-500')} />
              <span className={clsx('text-sm font-medium', isDark ? 'text-gray-300' : 'text-gray-700')}>
                {language}
              </span>
            </>
          )}
          <span className={clsx('text-xs', isDark ? 'text-gray-500' : 'text-gray-400')}>
            {lineCount} lines
          </span>
        </div>

        <div className="flex items-center gap-1">
          {showRunButton && (
            <button
              onClick={onRun}
              className={clsx(
                'flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors',
                isDark ? 'text-green-400 hover:bg-green-900/30' : 'text-green-600 hover:bg-green-100'
              )}
            >
              <Play className="w-3 h-3" />
              Run
            </button>
          )}

          {showCopyButton && (
            <button
              onClick={handleCopy}
              className={clsx(
                'flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors',
                isDark ? 'text-gray-400 hover:text-gray-200 hover:bg-gray-700' : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              )}
            >
              {copied ? (
                <><Check className="w-3 h-3 text-green-500" /><span>Copied!</span></>
              ) : (
                <><Copy className="w-3 h-3" /><span>Copy</span></>
              )}
            </button>
          )}

          {collapsible && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={clsx(
                'p-1 rounded transition-colors',
                isDark ? 'text-gray-400 hover:bg-gray-700' : 'text-gray-500 hover:bg-gray-200'
              )}
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="overflow-auto" style={{ maxHeight: collapsible ? maxHeight : undefined }}>
          <SyntaxHighlighter
            language={language}
            style={isDark ? oneDark : oneLight}
            showLineNumbers={showLineNumbers}
            customStyle={{ margin: 0, padding: '1rem', background: 'transparent', fontSize: '0.875rem' }}
            lineNumberStyle={{ minWidth: '2.5em', paddingRight: '1em', color: isDark ? '#636d83' : '#999', userSelect: 'none' }}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      )}
    </div>
  );
}

export function InlineCode({ children, className }: { children: string; className?: string }) {
  return (
    <code className={clsx('px-1.5 py-0.5 rounded text-sm font-mono bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400', className)}>
      {children}
    </code>
  );
}

export default CodeBlock;
