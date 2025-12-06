import React, { useState, useRef } from 'react';
import { clsx } from 'clsx';
import {
  Globe,
  RefreshCw,
  ExternalLink,
  Maximize2,
  Minimize2,
  X,
  Smartphone,
  Tablet,
  Monitor,
  Loader2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  Copy,
  Check,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'responsive';

interface WebPreviewProps {
  url?: string;
  html?: string;
  title?: string;
  defaultDevice?: DeviceType;
  showDeviceToggle?: boolean;
  showToolbar?: boolean;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  height?: number | string;
  sandbox?: string;
  onLoad?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

export function WebPreview({
  url,
  html,
  title = 'Web Preview',
  defaultDevice = 'responsive',
  showDeviceToggle = true,
  showToolbar = true,
  collapsible = false,
  defaultExpanded = true,
  height = 500,
  sandbox = 'allow-scripts allow-same-origin',
  onLoad,
  onError,
  className,
}: WebPreviewProps) {
  const [device, setDevice] = useState<DeviceType>(defaultDevice);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [copied, setCopied] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const deviceSizes = {
    mobile: { width: 375, label: 'Mobile' },
    tablet: { width: 768, label: 'Tablet' },
    desktop: { width: 1280, label: 'Desktop' },
    responsive: { width: '100%', label: 'Responsive' },
  };

  const handleRefresh = () => {
    if (iframeRef.current) {
      setIsLoading(true);
      setHasError(false);
      if (url) {
        iframeRef.current.src = url;
      } else if (html) {
        iframeRef.current.srcdoc = html;
      }
    }
  };

  const handleOpenExternal = () => {
    if (url) {
      window.open(url, '_blank');
    } else if (html) {
      const blob = new Blob([html], { type: 'text/html' });
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, '_blank');
    }
  };

  const handleCopyUrl = async () => {
    if (url) {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleIframeLoad = () => {
    setIsLoading(false);
    onLoad?.();
  };

  const handleIframeError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.(new Error('Failed to load content'));
  };

  const previewContent = (
    <div
      className={clsx(
        'rounded-xl border overflow-hidden',
        'border-gray-200 dark:border-gray-700',
        'bg-white dark:bg-gray-900',
        isFullscreen && 'fixed inset-4 z-50',
        className
      )}
    >
      {/* Toolbar */}
      {showToolbar && (
        <div className="flex items-center justify-between px-4 py-2.5 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <Globe className="w-4 h-4 text-gray-500 flex-shrink-0" />
            {url ? (
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                  {url}
                </span>
                <button
                  onClick={handleCopyUrl}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                  title="Copy URL"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            ) : (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {title}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1">
            {/* Device toggle */}
            {showDeviceToggle && (
              <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-lg p-0.5 mr-2">
                <button
                  onClick={() => setDevice('mobile')}
                  className={clsx(
                    'p-1.5 rounded transition-colors',
                    device === 'mobile'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                  title="Mobile"
                >
                  <Smartphone className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDevice('tablet')}
                  className={clsx(
                    'p-1.5 rounded transition-colors',
                    device === 'tablet'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                  title="Tablet"
                >
                  <Tablet className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setDevice('desktop')}
                  className={clsx(
                    'p-1.5 rounded transition-colors',
                    device === 'desktop'
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  )}
                  title="Desktop"
                >
                  <Monitor className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={handleRefresh}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Refresh"
            >
              <RefreshCw className={clsx('w-4 h-4', isLoading && 'animate-spin')} />
            </button>

            <button
              onClick={handleOpenExternal}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
            >
              {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>

            {collapsible && !isFullscreen && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>
            )}

            {isFullscreen && (
              <button
                onClick={() => setIsFullscreen(false)}
                className="p-1.5 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Preview area */}
      <AnimatePresence>
        {(isExpanded || isFullscreen) && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="relative bg-gray-100 dark:bg-gray-800 overflow-hidden"
            style={{ height: isFullscreen ? 'calc(100vh - 120px)' : height }}
          >
            {/* Device frame */}
            <div
              className={clsx(
                'h-full mx-auto transition-all duration-300 bg-white',
                device !== 'responsive' && 'shadow-lg'
              )}
              style={{
                width: typeof deviceSizes[device].width === 'number'
                  ? `min(${deviceSizes[device].width}px, 100%)`
                  : '100%',
              }}
            >
              {/* Loading overlay */}
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
                  <div className="flex flex-col items-center gap-3">
                    <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
                    <p className="text-sm text-gray-500">Loading preview...</p>
                  </div>
                </div>
              )}

              {/* Error state */}
              {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-white dark:bg-gray-900 z-10">
                  <div className="flex flex-col items-center gap-3 p-4">
                    <AlertCircle className="w-12 h-12 text-red-500" />
                    <p className="text-sm text-gray-700 dark:text-gray-300">Failed to load content</p>
                    <button
                      onClick={handleRefresh}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Retry
                    </button>
                  </div>
                </div>
              )}

              {/* Iframe */}
              <iframe
                ref={iframeRef}
                src={url}
                srcDoc={html}
                className="w-full h-full border-0"
                sandbox={sandbox}
                onLoad={handleIframeLoad}
                onError={handleIframeError}
                title={title}
              />
            </div>

            {/* Device indicator */}
            {device !== 'responsive' && showDeviceToggle && (
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                {deviceSizes[device].label} ({typeof deviceSizes[device].width === 'number' ? `${deviceSizes[device].width}px` : 'auto'})
              </div>
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
        {previewContent}
      </>
    );
  }

  return previewContent;
}

// Compact web preview card
interface WebPreviewCardProps {
  url: string;
  title?: string;
  thumbnail?: string;
  onClick?: () => void;
  className?: string;
}

export function WebPreviewCard({ url, title, thumbnail, onClick, className }: WebPreviewCardProps) {
  const domain = new URL(url).hostname.replace('www.', '');

  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-3 p-3 rounded-lg text-left w-full',
        'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700',
        'border border-gray-200 dark:border-gray-700 transition-colors',
        className
      )}
    >
      {thumbnail ? (
        <img
          src={thumbnail}
          alt={title || domain}
          className="w-12 h-12 rounded-lg object-cover"
        />
      ) : (
        <div className="w-12 h-12 rounded-lg bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
          <Globe className="w-6 h-6 text-gray-400" />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
          {title || domain}
        </h4>
        <p className="text-xs text-gray-500 truncate">{url}</p>
      </div>
      <ExternalLink className="w-4 h-4 text-gray-400 flex-shrink-0" />
    </button>
  );
}

export default WebPreview;
