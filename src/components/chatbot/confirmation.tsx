import React, { useState } from 'react';
import { clsx } from 'clsx';
import { Shield, CheckCircle2, XCircle, AlertTriangle, Code, ChevronDown, ChevronUp, Info, Wrench } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { ConfirmationRequest } from '@/types';

interface ConfirmationProps {
  request: ConfirmationRequest;
  onApprove?: () => void;
  onDeny?: () => void;
  showDetails?: boolean;
  variant?: 'default' | 'compact' | 'inline';
  className?: string;
}

export function Confirmation({
  request,
  onApprove,
  onDeny,
  showDetails = true,
  variant = 'default',
  className,
}: ConfirmationProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusConfig = {
    pending: {
      icon: <Shield className="w-5 h-5" />,
      color: 'text-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      borderColor: 'border-amber-200 dark:border-amber-800',
    },
    approved: {
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-800',
    },
    denied: {
      icon: <XCircle className="w-5 h-5" />,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      borderColor: 'border-red-200 dark:border-red-800',
    },
  };

  const config = statusConfig[request.status];

  if (variant === 'compact') {
    return (
      <div
        className={clsx(
          'flex items-center gap-3 px-4 py-3 rounded-lg border',
          config.borderColor,
          config.bgColor,
          className
        )}
      >
        <div className={config.color}>{config.icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-800 dark:text-gray-200 truncate">
            {request.title}
          </p>
          <p className="text-xs text-gray-500">{request.tool}</p>
        </div>
        {request.status === 'pending' && (
          <div className="flex items-center gap-2">
            <button
              onClick={onDeny}
              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              Deny
            </button>
            <button
              onClick={onApprove}
              className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Approve
            </button>
          </div>
        )}
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={clsx('inline-flex items-center gap-2', className)}>
        <span className={clsx('flex items-center gap-1 text-sm', config.color)}>
          {config.icon}
          <span className="font-medium">{request.tool}</span>
        </span>
        {request.status === 'pending' && (
          <>
            <button
              onClick={onApprove}
              className="p-1 text-green-600 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
              title="Approve"
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
            <button
              onClick={onDeny}
              className="p-1 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
              title="Deny"
            >
              <XCircle className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    );
  }

  // Default variant
  return (
    <div
      className={clsx(
        'rounded-xl border overflow-hidden',
        config.borderColor,
        className
      )}
    >
      {/* Header */}
      <div className={clsx('px-4 py-4', config.bgColor)}>
        <div className="flex items-start gap-3">
          <div className={clsx('flex-shrink-0 mt-0.5', config.color)}>
            {config.icon}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-gray-900 dark:text-gray-100">
              {request.title}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              {request.description}
            </p>
          </div>
        </div>

        {/* Tool info */}
        <div className="flex items-center gap-2 mt-3 p-2 bg-white/50 dark:bg-gray-900/30 rounded-lg">
          <Wrench className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-mono text-gray-700 dark:text-gray-300">
            {request.tool}
          </span>
        </div>
      </div>

      {/* Details toggle */}
      {showDetails && Object.keys(request.input).length > 0 && (
        <>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full flex items-center justify-between px-4 py-2 bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <Code className="w-4 h-4" />
              <span>Parameters</span>
            </div>
            {isExpanded ? (
              <ChevronUp className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            )}
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <div className="p-4 bg-white dark:bg-gray-900">
                  <pre className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-xs font-mono text-gray-800 dark:text-gray-200 overflow-x-auto">
                    {JSON.stringify(request.input, null, 2)}
                  </pre>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}

      {/* Actions */}
      {request.status === 'pending' && (
        <div className="flex border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onDeny}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <XCircle className="w-4 h-4" />
            <span className="font-medium">Deny</span>
          </button>
          <div className="w-px bg-gray-200 dark:bg-gray-700" />
          <button
            onClick={onApprove}
            className="flex-1 flex items-center justify-center gap-2 py-3 text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-medium">Approve</span>
          </button>
        </div>
      )}

      {/* Status indicator for resolved requests */}
      {request.status !== 'pending' && (
        <div className={clsx('flex items-center justify-center gap-2 py-3', config.bgColor)}>
          {config.icon}
          <span className={clsx('font-medium capitalize', config.color)}>
            {request.status}
          </span>
        </div>
      )}
    </div>
  );
}

// Confirmation queue for multiple requests
interface ConfirmationQueueProps {
  requests: ConfirmationRequest[];
  onApprove?: (id: string) => void;
  onDeny?: (id: string) => void;
  onApproveAll?: () => void;
  onDenyAll?: () => void;
  className?: string;
}

export function ConfirmationQueue({
  requests,
  onApprove,
  onDeny,
  onApproveAll,
  onDenyAll,
  className,
}: ConfirmationQueueProps) {
  const pendingRequests = requests.filter((r) => r.status === 'pending');

  if (pendingRequests.length === 0) return null;

  return (
    <div className={clsx('space-y-3', className)}>
      {/* Batch actions */}
      {pendingRequests.length > 1 && (
        <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500" />
            <span className="text-sm font-medium text-amber-800 dark:text-amber-200">
              {pendingRequests.length} actions pending approval
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDenyAll}
              className="px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
            >
              Deny All
            </button>
            <button
              onClick={onApproveAll}
              className="px-3 py-1.5 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg transition-colors"
            >
              Approve All
            </button>
          </div>
        </div>
      )}

      {/* Individual requests */}
      {pendingRequests.map((request) => (
        <motion.div
          key={request.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Confirmation
            request={request}
            onApprove={() => onApprove?.(request.id)}
            onDeny={() => onDeny?.(request.id)}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default Confirmation;
