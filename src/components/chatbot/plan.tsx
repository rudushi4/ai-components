import React, { useState } from 'react';
import { clsx } from 'clsx';
import { ListTodo, ChevronDown, ChevronUp, CheckCircle2, Circle, Loader2, AlertCircle, Clock, BarChart3 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Plan as PlanType, Task } from '@/types';

interface PlanProps {
  plan: PlanType;
  collapsible?: boolean;
  defaultExpanded?: boolean;
  showProgress?: boolean;
  onTaskClick?: (taskId: string) => void;
  className?: string;
}

export function Plan({
  plan,
  collapsible = true,
  defaultExpanded = true,
  showProgress = true,
  onTaskClick,
  className,
}: PlanProps) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);

  const completedTasks = plan.tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = plan.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const statusColors = {
    planning: 'text-blue-600 bg-blue-50 dark:bg-blue-900/20',
    in_progress: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20',
    completed: 'text-green-600 bg-green-50 dark:bg-green-900/20',
    failed: 'text-red-600 bg-red-50 dark:bg-red-900/20',
  };

  return (
    <div className={clsx('rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden', className)}>
      {/* Header */}
      <button
        onClick={() => collapsible && setIsExpanded(!isExpanded)}
        className={clsx(
          'w-full flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-800/50',
          collapsible && 'hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
        )}
      >
        <ListTodo className="w-5 h-5 text-gray-500" />
        <div className="flex-1 text-left">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{plan.title}</h3>
          {plan.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">{plan.description}</p>
          )}
        </div>
        <span className={clsx('px-2 py-0.5 rounded-full text-xs font-medium', statusColors[plan.status])}>
          {plan.status.replace('_', ' ')}
        </span>
        {collapsible && (
          isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />
        )}
      </button>

      {/* Progress bar */}
      {showProgress && (
        <div className="h-1 bg-gray-200 dark:bg-gray-700">
          <motion.div
            className="h-full bg-green-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5 }}
          />
        </div>
      )}

      {/* Tasks */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            <div className="p-4 space-y-2">
              {plan.tasks.map((task, index) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  onClick={() => onTaskClick?.(task.id)}
                />
              ))}
            </div>

            {/* Summary */}
            <div className="px-4 pb-4">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{completedTasks} of {totalTasks} tasks completed</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface TaskItemProps {
  task: Task;
  index: number;
  depth?: number;
  onClick?: () => void;
}

function TaskItem({ task, index, depth = 0, onClick }: TaskItemProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  const statusIcons = {
    pending: <Circle className="w-4 h-4 text-gray-400" />,
    in_progress: <Loader2 className="w-4 h-4 text-blue-500 animate-spin" />,
    completed: <CheckCircle2 className="w-4 h-4 text-green-500" />,
    failed: <AlertCircle className="w-4 h-4 text-red-500" />,
    skipped: <Circle className="w-4 h-4 text-gray-300 line-through" />,
  };

  const hasSubtasks = task.subtasks && task.subtasks.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <div
        className={clsx(
          'flex items-start gap-3 p-3 rounded-lg transition-colors',
          'hover:bg-gray-50 dark:hover:bg-gray-800/50',
          task.status === 'in_progress' && 'bg-blue-50/50 dark:bg-blue-900/10',
          task.status === 'completed' && 'opacity-60'
        )}
        style={{ marginLeft: depth * 24 }}
        onClick={onClick}
      >
        <div className="flex-shrink-0 mt-0.5">
          {statusIcons[task.status]}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className={clsx(
              'text-sm font-medium',
              task.status === 'completed' ? 'text-gray-500 line-through' : 'text-gray-800 dark:text-gray-200'
            )}>
              {task.title}
            </p>
            {hasSubtasks && (
              <button
                onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
                className="p-0.5 text-gray-400 hover:text-gray-600"
              >
                {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>
          {task.description && (
            <p className="text-xs text-gray-500 mt-0.5">{task.description}</p>
          )}
          {task.progress !== undefined && task.status === 'in_progress' && (
            <div className="mt-2">
              <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
              <div className="h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all"
                  style={{ width: `${task.progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Subtasks */}
      <AnimatePresence>
        {hasSubtasks && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
          >
            {task.subtasks!.map((subtask, subIndex) => (
              <TaskItem
                key={subtask.id}
                task={subtask}
                index={subIndex}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// Compact plan summary
interface PlanSummaryProps {
  plan: PlanType;
  onClick?: () => void;
  className?: string;
}

export function PlanSummary({ plan, onClick, className }: PlanSummaryProps) {
  const completedTasks = plan.tasks.filter((t) => t.status === 'completed').length;
  const totalTasks = plan.tasks.length;
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <button
      onClick={onClick}
      className={clsx(
        'flex items-center gap-3 px-4 py-3 rounded-lg w-full text-left',
        'bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800',
        'border border-gray-200 dark:border-gray-700 transition-colors',
        className
      )}
    >
      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
        <BarChart3 className="w-5 h-5 text-blue-600" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-gray-900 dark:text-gray-100 truncate">{plan.title}</h4>
        <p className="text-sm text-gray-500">{completedTasks}/{totalTasks} tasks \u2022 {Math.round(progress)}%</p>
      </div>
      <div className="w-12 h-12 relative">
        <svg className="w-full h-full -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-gray-200 dark:text-gray-700"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${progress * 1.256} 125.6`}
            className="text-green-500"
          />
        </svg>
      </div>
    </button>
  );
}

export default Plan;
