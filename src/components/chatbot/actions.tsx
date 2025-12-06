import React from 'react';
import { clsx } from 'clsx';
import { Copy, ThumbsUp, ThumbsDown, Share2, Flag, RefreshCw, Bookmark, MoreHorizontal, Check } from 'lucide-react';
import type { Action } from '@/types';

interface ActionsProps {
  actions?: Action[];
  variant?: 'default' | 'compact' | 'expanded';
  className?: string;
}

export function Actions({ actions, variant = 'default', className }: ActionsProps) {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  if (!actions || actions.length === 0) return null;

  const handleActionClick = (action: Action) => {
    if (action.id === 'copy') {
      setCopiedId(action.id);
      setTimeout(() => setCopiedId(null), 2000);
    }
    action.onClick();
  };

  return (
    <div className={clsx('flex items-center', variant === 'compact' ? 'gap-0.5' : 'gap-1', className)}>
      {actions.map((action) => (
        <button
          key={action.id}
          onClick={() => handleActionClick(action)}
          disabled={action.disabled}
          className={clsx(
            'flex items-center justify-center rounded-md transition-colors',
            variant === 'compact' && 'p-1.5',
            variant === 'default' && 'px-2 py-1.5 gap-1.5',
            variant === 'expanded' && 'px-3 py-2 gap-2',
            action.variant === 'destructive'
              ? 'text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
              : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800',
            action.disabled && 'opacity-50 cursor-not-allowed'
          )}
          title={action.label}
        >
          {action.id === 'copy' && copiedId === 'copy' ? <Check className="w-4 h-4 text-green-500" /> : action.icon}
          {variant !== 'compact' && <span className="text-xs font-medium">{action.label}</span>}
        </button>
      ))}
    </div>
  );
}

export function useDefaultActions(handlers: {
  onCopy?: () => void;
  onLike?: () => void;
  onDislike?: () => void;
  onShare?: () => void;
  onRegenerate?: () => void;
  onBookmark?: () => void;
  onReport?: () => void;
}): Action[] {
  const actions: Action[] = [];
  if (handlers.onCopy) actions.push({ id: 'copy', icon: <Copy className="w-4 h-4" />, label: 'Copy', onClick: handlers.onCopy });
  if (handlers.onLike) actions.push({ id: 'like', icon: <ThumbsUp className="w-4 h-4" />, label: 'Like', onClick: handlers.onLike });
  if (handlers.onDislike) actions.push({ id: 'dislike', icon: <ThumbsDown className="w-4 h-4" />, label: 'Dislike', onClick: handlers.onDislike });
  if (handlers.onRegenerate) actions.push({ id: 'regenerate', icon: <RefreshCw className="w-4 h-4" />, label: 'Regenerate', onClick: handlers.onRegenerate });
  if (handlers.onShare) actions.push({ id: 'share', icon: <Share2 className="w-4 h-4" />, label: 'Share', onClick: handlers.onShare });
  if (handlers.onBookmark) actions.push({ id: 'bookmark', icon: <Bookmark className="w-4 h-4" />, label: 'Bookmark', onClick: handlers.onBookmark });
  if (handlers.onReport) actions.push({ id: 'report', icon: <Flag className="w-4 h-4" />, label: 'Report', onClick: handlers.onReport, variant: 'destructive' });
  return actions;
}

export function ActionMenu({ actions, className }: { actions: Action[]; className?: string }) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={clsx('relative', className)}>
      <button onClick={() => setIsOpen(!isOpen)} className="p-1.5 rounded-md text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <MoreHorizontal className="w-4 h-4" />
      </button>
      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-full mt-1 z-20 min-w-[140px] py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            {actions.map((action) => (
              <button key={action.id} onClick={() => { action.onClick(); setIsOpen(false); }} disabled={action.disabled}
                className={clsx('w-full flex items-center gap-2 px-3 py-2 text-sm text-left',
                  action.variant === 'destructive' ? 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700',
                  action.disabled && 'opacity-50 cursor-not-allowed'
                )}>
                {action.icon}<span>{action.label}</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Actions;
