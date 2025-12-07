import React from 'react';
import { clsx } from 'clsx';
import { Gauge, AlertTriangle, Info, TrendingUp } from 'lucide-react';

interface ContextProps {
  used: number;
  total: number;
  unit?: 'tokens' | 'characters' | 'words';
  showPercentage?: boolean;
  showWarning?: boolean;
  warningThreshold?: number;
  className?: string;
}

export function Context({
  used,
  total,
  unit = 'tokens',
  showPercentage = true,
  showWarning = true,
  warningThreshold = 80,
  className,
}: ContextProps) {
  const percentage = Math.round((used / total) * 100);
  const isWarning = percentage >= warningThreshold;
  const isCritical = percentage >= 95;

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  return (
    <div className={clsx('space-y-2', className)}>
      {/* Header */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
          <Gauge className="w-4 h-4" />
          <span>Context {unit}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={clsx(
            'font-medium',
            isCritical ? 'text-red-600' : isWarning ? 'text-amber-600' : 'text-gray-700 dark:text-gray-300'
          )}>
            {formatNumber(used)} / {formatNumber(total)}
          </span>
          {showPercentage && (
            <span className={clsx(
              'text-xs px-1.5 py-0.5 rounded',
              isCritical
                ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                : isWarning
                ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
            )}>
              {percentage}%
            </span>
          )}
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className={clsx(
            'h-full rounded-full transition-all duration-300',
            isCritical
              ? 'bg-red-500'
              : isWarning
              ? 'bg-amber-500'
              : 'bg-blue-500'
          )}
          style={{ width: `${Math.min(percentage, 100)}%` }}
        />
      </div>

      {/* Warning message */}
      {showWarning && isWarning && (
        <div className={clsx(
          'flex items-start gap-2 text-xs p-2 rounded-lg',
          isCritical
            ? 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400'
            : 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400'
        )}>
          <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
          <span>
            {isCritical
              ? 'Context limit nearly reached. Consider starting a new conversation.'
              : 'Approaching context limit. Older messages may be truncated.'}
          </span>
        </div>
      )}
    </div>
  );
}

interface ContextStatsProps {
  stats: {
    label: string;
    value: number;
    change?: number;
    icon?: React.ReactNode;
  }[];
  className?: string;
}

export function ContextStats({ stats, className }: ContextStatsProps) {
  return (
    <div className={clsx('grid grid-cols-2 gap-3', className)}>
      {stats.map((stat, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50"
        >
          {stat.icon && (
            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              {stat.icon}
            </div>
          )}
          <div>
            <p className="text-xs text-gray-500 dark:text-gray-400">{stat.label}</p>
            <div className="flex items-center gap-1.5">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                {stat.value.toLocaleString()}
              </span>
              {stat.change !== undefined && (
                <span className={clsx(
                  'flex items-center text-xs',
                  stat.change >= 0 ? 'text-green-600' : 'text-red-600'
                )}>
                  <TrendingUp className={clsx(
                    'w-3 h-3',
                    stat.change < 0 && 'rotate-180'
                  )} />
                  {Math.abs(stat.change)}%
                </span>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

interface ContextTooltipProps {
  children: React.ReactNode;
  used: number;
  total: number;
}

export function ContextTooltip({ children, used, total }: ContextTooltipProps) {
  const percentage = Math.round((used / total) * 100);

  return (
    <div className="relative group inline-flex">
      {children}
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
        <div className="bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
          <div className="flex items-center gap-2">
            <Info className="w-3 h-3" />
            <span>Context: {used.toLocaleString()} / {total.toLocaleString()} ({percentage}%)</span>
          </div>
          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900 dark:border-t-gray-700" />
        </div>
      </div>
    </div>
  );
}

export default Context;
