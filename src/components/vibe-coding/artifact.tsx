import React, { useState } from 'react';
import { clsx } from 'clsx';
import {
  Code,
  FileText,
  FileCode,
  File,
  Copy,
  Check,
  Download,
  Maximize2,
  Minimize2,
  ChevronDown,
  ChevronUp,
  Play,
  ExternalLink,
  Eye,
  EyeOff,
  RefreshCw,
  X,
} from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { motion, AnimatePresence } from 'framer-motion';

type ArtifactType = 'code' | 'document' | 'html' | 'markdown' | 'json' | 'svg' | 'csv';

interface ArtifactProps {
  type: ArtifactType;
  title: string;
  content: string;
  language?: string;
  showPreview?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  maxHeight?: number;
  onRun?: () => void;
  onDownload?: () => void;
  onCopy?: () => void;
  className?: string;
}

export function Artifact({
  type,
  title,
  content,
  language,
  showPreview = true,
  collapsible = true,
  defaultExpanded = true,
  maxHeight = 500,
  onRun,
  onDownload,
  onCopy,
  className,
}: ArtifactProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeTab, setActiveTab] = useState<'code' | 'preview'>('code');
  const [copied, setCopied] = useState(false);

  const getIcon = () => {
    switch (type) {
      case 'code': return <Code className="w-4 h-4" />;
      case 'document': return <FileText className="w-4 h-4" />;
      case 'html': return <FileCode className="w-4 h-4" />;
      default: return <File className="w-4 h-4" />;
    }
  };

  const getLanguage = () => {
    if (language) return language;
    switch (type) {
      case 'html': return 'html';
      case 'markdown': return 'markdown';
      case 'json': return 'json';
      case 'csv': return 'csv';
      case 'svg': return 'xml';
      default: return 'typescript';
    }
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    onCopy?.();
  };

  const handleDownload = () => {
    if (onDownload) {
      onDownload();
      return;
    }
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = title;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canPreview = ['html', 'markdown', 'svg'].includes(type);

  const artifactContent = (
    <div className={clsx(
      'rounded-xl border overflow-hidden',
      'border-gray-200 dark:border-gray-700',
      'bg-gray-900',
      isFullscreen && 'fixed inset-4 z-50',
      className
    )}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-2">
          <span className="text-gray-400">{getIcon()}</span>
          <span className="text-sm font-medium text-gray-200">{title}</span>
          <span className="text-xs text-gray-500 px-1.5 py-0.5 bg-gray-700 rounded">
            {type}
          </span>
        </div>

        <div className="flex items-center gap-1">
          {/* Tabs for preview */}
          {canPreview && showPreview && (
            <div className="flex items-center bg-gray-700 rounded-lg p-0.5 mr-2">
              <button
                onClick={() => setActiveTab('code')}
                className={clsx(
                  'px-2 py-1 rounded text-xs transition-colors',
                  activeTab === 'code'
                    ? 'bg-gray-600 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                )}
              >
                <Code className="w-3 h-3" />
              </button>
              <button
                onClick={() => setActiveTab('preview')}
                className={clsx(
                  'px-2 py-1 rounded text-xs transition-colors',
                  activeTab === 'preview'
                    ? 'bg-gray-600 text-white'
                    : 'text-gray-400 hover:text-gray-200'
                )}
              >
                <Eye className="w-3 h-3" />
              </button>
            </div>
          )}

          {onRun && (
            <button
              onClick={onRun}
              className="p-1.5 text-green-400 hover:bg-gray-700 rounded transition-colors"
              title="Run"
            >
              <Play className="w-4 h-4" />
            </button>
          )}

          <button
            onClick={handleCopy}
            className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            title="Copy"
          >
            {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            onClick={handleDownload}
            className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            title="Download"
          >
            <Download className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          {collapsible && !isFullscreen && (
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            >
              {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}

          {isFullscreen && (
            <button
              onClick={() => setIsFullscreen(false)}
              className="p-1.5 text-gray-400 hover:text-gray-200 hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {(isExpanded || isFullscreen) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            style={{ maxHeight: isFullscreen ? 'calc(100vh - 120px)' : maxHeight }}
            className="overflow-auto"
          >
            {activeTab === 'code' || !canPreview ? (
              <SyntaxHighlighter
                language={getLanguage()}
                style={oneDark}
                showLineNumbers
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  background: 'transparent',
                  fontSize: '0.875rem',
                }}
              >
                {content}
              </SyntaxHighlighter>
            ) : (
              <ArtifactPreview type={type} content={content} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  if (isFullscreen) {
    return (
      <>
        <div className="fixed inset-0 bg-black/80 z-40" onClick={() => setIsFullscreen(false)} />
        {artifactContent}
      </>
    );
  }

  return artifactContent;
}

interface ArtifactPreviewProps {
  type: ArtifactType;
  content: string;
}

function ArtifactPreview({ type, content }: ArtifactPreviewProps) {
  if (type === 'html') {
    return (
      <iframe
        srcDoc={content}
        className="w-full h-96 bg-white"
        sandbox="allow-scripts"
        title="HTML Preview"
      />
    );
  }

  if (type === 'svg') {
    return (
      <div
        className="p-4 bg-white flex items-center justify-center"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    );
  }

  if (type === 'markdown') {
    return (
      <div className="p-4 prose prose-invert max-w-none">
        <pre className="whitespace-pre-wrap">{content}</pre>
      </div>
    );
  }

  return null;
}

// Artifact list for multiple artifacts
interface ArtifactListProps {
  artifacts: Array<{
    id: string;
    type: ArtifactType;
    title: string;
    content: string;
    language?: string;
  }>;
  onRun?: (id: string) => void;
  className?: string;
}

export function ArtifactList({ artifacts, onRun, className }: ArtifactListProps) {
  return (
    <div className={clsx('space-y-4', className)}>
      {artifacts.map((artifact) => (
        <Artifact
          key={artifact.id}
          type={artifact.type}
          title={artifact.title}
          content={artifact.content}
          language={artifact.language}
          onRun={onRun ? () => onRun(artifact.id) : undefined}
        />
      ))}
    </div>
  );
}

// Compact artifact badge
interface ArtifactBadgeProps {
  type: ArtifactType;
  title: string;
  onClick?: () => void;
  className?: string;
}

export function ArtifactBadge({ type, title, onClick, className }: ArtifactBadgeProps) {
  const getIcon = () => {
    switch (type) {
      case 'code': return <Code className="w-3.5 h-3.5" />;
      case 'document': return <FileText className="w-3.5 h-3.5" />;
      default: return <File className="w-3.5 h-3.5" />;
    }
  };

  return (
    <button
      onClick={onClick}
      className={clsx(
        'inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs',
        'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
        'hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors',
        className
      )}
    >
      {getIcon()}
      <span className="truncate max-w-[120px]">{title}</span>
      <ExternalLink className="w-3 h-3 text-gray-400" />
    </button>
  );
}

export default Artifact;
