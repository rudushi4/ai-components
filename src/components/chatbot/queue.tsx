import React from 'react';
import { clsx } from 'clsx';
import { Clock, Check, Loader2, AlertCircle, X, FileText, Image, Link2, GripVertical, Trash2 } from 'lucide-react';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import type { QueueItem, Attachment } from '@/types';

interface QueueProps {
  items: QueueItem[];
  title?: string;
  showProgress?: boolean;
  reorderable?: boolean;
  onReorder?: (items: QueueItem[]) => void;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  className?: string;
}

export function Queue({
  items,
  title = 'Queue',
  showProgress = true,
  reorderable = false,
  onReorder,
  onRemove,
  onRetry,
  className,
}: QueueProps) {
  const completedCount = items.filter(item => item.status === 'done').length;
  const progress = items.length > 0 ? (completedCount / items.length) * 100 : 0;

  if (items.length === 0) return null;

  const renderItems = () => {
    if (reorderable && onReorder) {
      return (
        <Reorder.Group axis="y" values={items} onReorder={onReorder} className="space-y-2">
          {items.map((item) => (
            <Reorder.Item key={item.id} value={item}>
              <QueueItemCard
                item={item}
                reorderable
                onRemove={() => onRemove?.(item.id)}
                onRetry={() => onRetry?.(item.id)}
              />
            </Reorder.Item>
          ))}
        </Reorder.Group>
      );
    }

    return (
      <div className="space-y-2">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
            >
              <QueueItemCard
                item={item}
                onRemove={() => onRemove?.(item.id)}
                onRetry={() => onRetry?.(item.id)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={clsx('rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</span>
          <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
            {completedCount}/{items.length}
          </span>
        </div>
      </div>

      {/* Progress bar */}
      {showProgress && (
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <motion.div
            className="h-full bg-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      )}

      {/* Items */}
      <div className="p-3">
        {renderItems()}
      </div>
    </div>
  );
}

interface QueueItemCardProps {
  item: QueueItem;
  reorderable?: boolean;
  onRemove?: () => void;
  onRetry?: () => void;
}

function QueueItemCard({ item, reorderable, onRemove, onRetry }: QueueItemCardProps) {
  const statusIcons = {
    queued: <Clock className="w-4 h-4 text-gray-400" />,
    processing: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
    done: <Check className="w-4 h-4 text-green-500" />,
    error: <AlertCircle className="w-4 h-4 text-red-500" />,
  };

  const getTypeIcon = () => {
    if (item.attachment) {
      switch (item.attachment.type) {
        case 'image': return <Image className="w-4 h-4" />;
        case 'url': return <Link2 className="w-4 h-4" />;
        default: return <FileText className="w-4 h-4" />;
      }
    }
    return <FileText className="w-4 h-4" />;
  };

  return (
    <div
      className={clsx(
        'flex items-center gap-3 p-3 rounded-lg transition-colors',
        'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700',
        item.status === 'processing' && 'ring-2 ring-blue-500/20',
        item.status === 'error' && 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
      )}
    >
      {/* Drag handle */}
      {reorderable && (
        <div className="cursor-grab text-gray-400 hover:text-gray-600">
          <GripVertical className="w-4 h-4" />
        </div>
      )}

      {/* Status icon */}
      <div className="flex-shrink-0">
        {statusIcons[item.status]}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <div className="text-gray-400">{getTypeIcon()}</div>
          <p className="text-sm text-gray-800 dark:text-gray-200 truncate">
            {item.content}
          </p>
        </div>
        {item.attachment && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">
            {item.attachment.name}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-1">
        {item.status === 'error' && onRetry && (
          <button
            onClick={onRetry}
            className="p-1.5 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
            title="Retry"
          >
            <Loader2 className="w-4 h-4" />
          </button>
        )}
        {onRemove && item.status !== 'processing' && (
          <button
            onClick={onRemove}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
            title="Remove"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

// Attachment queue specifically for file uploads
interface AttachmentQueueProps {
  attachments: (Attachment & { progress?: number; status?: 'uploading' | 'done' | 'error' })[];
  onRemove?: (id: string) => void;
  className?: string;
}

export function AttachmentQueue({ attachments, onRemove, className }: AttachmentQueueProps) {
  if (attachments.length === 0) return null;

  return (
    <div className={clsx('flex flex-wrap gap-2', className)}>
      {attachments.map((attachment) => (
        <div
          key={attachment.id}
          className={clsx(
            'relative flex items-center gap-2 px-3 py-2 rounded-lg',
            'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
          )}
        >
          <div className="text-gray-500">
            {attachment.type === 'image' ? <Image className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          </div>
          <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[120px]">
            {attachment.name}
          </span>

          {attachment.status === 'uploading' && (
            <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />
          )}
          {attachment.status === 'done' && (
            <Check className="w-4 h-4 text-green-500" />
          )}
          {attachment.status === 'error' && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}

          {onRemove && (
            <button
              onClick={() => onRemove(attachment.id)}
              className="p-0.5 text-gray-400 hover:text-red-500 transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Upload progress */}
          {attachment.progress !== undefined && attachment.progress < 100 && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 rounded-b-lg overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all"
                style={{ width: `${attachment.progress}%` }}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default Queue;
