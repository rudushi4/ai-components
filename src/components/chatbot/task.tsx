import React from 'react';
import { clsx } from 'clsx';
import { CheckCircle2, Circle, Loader2, AlertCircle, Clock, SkipForward, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';
import type { Task as TaskType } from '@/types';

interface TaskProps {
  task: TaskType;
  variant?: 'default' | 'compact' | 'detailed';
  showProgress?: boolean;
  interactive?: boolean;
  onStatusChange?: (status: TaskType['status']) => void;
  onClick?: () => void;
  className?: string;
}

export function Task({
  task,
  variant = 'default',
  showProgress = true,
  interactive = false,
  onStatusChange,
  onClick,
  className,
}: TaskProps) {
  const statusConfig = {
    pending: {
      icon: <Circle className="w-5 h-5" />,
      color: 'text-gray-400',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      label: 'Pending',
    },
    in_progress: {
      icon: <Loader2 className="w-5 h-5 animate-spin" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      label: 'In Progress',
    },
    completed: {
      icon: <CheckCircle2 className="w-5 h-5" />,
      color: 'text-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      label: 'Completed',
    },
    failed: {
      icon: <AlertCircle className="w-5 h-5" />,
      color: 'text-red-500',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
      label: 'Failed',
    },
    skipped: {
      icon: <SkipForward className="w-5 h-5" />,
      color: 'text-gray-400',
      bgColor: 'bg-gray-50 dark:bg-gray-800/50',
      label: 'Skipped',
    },
  };

  const config = statusConfig[task.status];

  if (variant === 'compact') {
    return (
      <div
        className={clsx(
          'flex items-center gap-2 px-3 py-2 rounded-lg',
          config.bgColor,
          interactive && 'cursor-pointer hover:opacity-80',
          className
        )}
        onClick={onClick}
      >
        <span className={config.color}>{config.icon}</span>
        <span className={clsx(
          'text-sm truncate',
          task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'
        )}>
          {task.title}
        </span>
      </div>
    );
  }

  if (variant === 'detailed') {
    return (
      <motion.div
        layout
        className={clsx(
          'rounded-xl border overflow-hidden',
          task.status === 'in_progress' ? 'border-blue-300 dark:border-blue-700' : 'border-gray-200 dark:border-gray-700',
          className
        )}
      >
        <div className={clsx('p-4', config.bgColor)}>
          <div className="flex items-start gap-3">
            <div className={clsx('flex-shrink-0 mt-0.5', config.color)}>
              {config.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h4 className={clsx(
                  'font-medium',
                  task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'
                )}>
                  {task.title}
                </h4>
                <span className={clsx('text-xs px-2 py-0.5 rounded-full font-medium', config.color, config.bgColor)}>
                  {config.label}
                </span>
              </div>
              {task.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {task.description}
                </p>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {showProgress && task.progress !== undefined && (
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
              <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${task.progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}

          {/* Subtasks preview */}
          {task.subtasks && task.subtasks.length > 0 && (
            <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">
                  {task.subtasks.filter(s => s.status === 'completed').length}/{task.subtasks.length} subtasks
                </span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </div>
            </div>
          )}
        </div>

        {/* Interactive controls */}
        {interactive && onStatusChange && task.status !== 'completed' && (
          <div className="flex border-t border-gray-200 dark:border-gray-700 divide-x divide-gray-200 dark:divide-gray-700">
            {task.status === 'pending' && (
              <button
                onClick={() => onStatusChange('in_progress')}
                className="flex-1 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
              >
                Start
              </button>
            )}
            {task.status === 'in_progress' && (
              <>
                <button
                  onClick={() => onStatusChange('completed')}
                  className="flex-1 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                >
                  Complete
                </button>
                <button
                  onClick={() => onStatusChange('failed')}
                  className="flex-1 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                >
                  Failed
                </button>
              </>
            )}
            <button
              onClick={() => onStatusChange('skipped')}
              className="flex-1 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
            >
              Skip
            </button>
          </div>
        )}
      </motion.div>
    );
  }

  // Default variant
  return (
    <div
      className={clsx(
        'flex items-center gap-3 p-3 rounded-lg transition-colors',
        config.bgColor,
        interactive && 'cursor-pointer hover:opacity-80',
        className
      )}
      onClick={onClick}
    >
      <div className={clsx('flex-shrink-0', config.color)}>
        {config.icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className={clsx(
          'text-sm font-medium',
          task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'
        )}>
          {task.title}
        </p>
        {task.description && (
          <p className="text-xs text-gray-500 mt-0.5 truncate">{task.description}</p>
        )}
      </div>
      {showProgress && task.progress !== undefined && (
        <span className="text-xs text-gray-500">{task.progress}%</span>
      )}
    </div>
  );
}

// Task list component
interface TaskListProps {
  tasks: TaskType[];
  variant?: 'default' | 'compact' | 'detailed';
  onTaskClick?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskType['status']) => void;
  className?: string;
}

export function TaskList({ tasks, variant = 'default', onTaskClick, onStatusChange, className }: TaskListProps) {
  return (
    <div className={clsx('space-y-2', className)}>
      {tasks.map((task, index) => (
        <motion.div
          key={task.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
        >
          <Task
            task={task}
            variant={variant}
            interactive={!!onStatusChange}
            onClick={() => onTaskClick?.(task.id)}
            onStatusChange={(status) => onStatusChange?.(task.id, status)}
          />
        </motion.div>
      ))}
    </div>
  );
}

export default Task;
