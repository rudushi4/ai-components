import React, { memo } from 'react';
import { clsx } from 'clsx';
import { Handle, Position } from '@xyflow/react';
import { Play, CheckCircle2, AlertCircle, Loader2, Circle, Code, Database, Globe, MessageSquare, Zap, GitBranch, Filter, Clock, Settings } from 'lucide-react';

type NodeStatus = 'idle' | 'running' | 'complete' | 'error' | 'pending';
type NodeType = 'default' | 'input' | 'output' | 'process' | 'decision' | 'api' | 'database' | 'ai' | 'trigger' | 'transform';

interface WorkflowNodeData {
  label: string;
  description?: string;
  status?: NodeStatus;
  type?: NodeType;
  icon?: React.ReactNode;
  inputs?: number;
  outputs?: number;
  progress?: number;
  metadata?: Record<string, unknown>;
}

export const WorkflowNode = memo(({ data, selected }: { data: WorkflowNodeData; selected?: boolean }) => {
  const { label, description, status = 'idle', type = 'default', icon, inputs = 1, outputs = 1, progress } = data;

  const statusConfig = {
    idle: { icon: <Circle className="w-3.5 h-3.5" />, color: 'text-gray-400', borderColor: 'border-gray-200 dark:border-gray-700', bgColor: 'bg-white dark:bg-gray-800' },
    pending: { icon: <Clock className="w-3.5 h-3.5" />, color: 'text-gray-500', borderColor: 'border-gray-300 dark:border-gray-600', bgColor: 'bg-gray-50 dark:bg-gray-800' },
    running: { icon: <Loader2 className="w-3.5 h-3.5 animate-spin" />, color: 'text-blue-500', borderColor: 'border-blue-300 dark:border-blue-700', bgColor: 'bg-blue-50 dark:bg-blue-900/20' },
    complete: { icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: 'text-green-500', borderColor: 'border-green-300 dark:border-green-700', bgColor: 'bg-green-50 dark:bg-green-900/20' },
    error: { icon: <AlertCircle className="w-3.5 h-3.5" />, color: 'text-red-500', borderColor: 'border-red-300 dark:border-red-700', bgColor: 'bg-red-50 dark:bg-red-900/20' },
  };

  const getTypeIcon = () => {
    if (icon) return icon;
    const iconMap: Record<NodeType, React.ReactNode> = {
      input: <Play className="w-4 h-4" />, output: <CheckCircle2 className="w-4 h-4" />, process: <Settings className="w-4 h-4" />,
      decision: <GitBranch className="w-4 h-4" />, api: <Globe className="w-4 h-4" />, database: <Database className="w-4 h-4" />,
      ai: <MessageSquare className="w-4 h-4" />, trigger: <Zap className="w-4 h-4" />, transform: <Filter className="w-4 h-4" />, default: <Code className="w-4 h-4" />
    };
    return iconMap[type];
  };

  const config = statusConfig[status];

  return (
    <div className={clsx('min-w-[180px] rounded-xl border-2 shadow-sm transition-all', config.borderColor, config.bgColor, selected && 'ring-2 ring-blue-500 ring-offset-2 dark:ring-offset-gray-900')}>
      {Array.from({ length: inputs }).map((_, i) => (
        <Handle key={`input-${i}`} type="target" position={Position.Left} id={`input-${i}`}
          className={clsx('!w-3 !h-3 !border-2 !border-gray-300 dark:!border-gray-600 !bg-white dark:!bg-gray-700 hover:!bg-blue-500 hover:!border-blue-500 transition-colors')}
          style={{ top: `${((i + 1) / (inputs + 1)) * 100}%` }}
        />
      ))}
      <div className="p-3">
        <div className="flex items-center gap-2">
          <div className={clsx('p-1.5 rounded-lg', config.bgColor, config.color)}>{getTypeIcon()}</div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{label}</h4>
            {description && <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{description}</p>}
          </div>
          <div className={config.color}>{config.icon}</div>
        </div>
        {status === 'running' && progress !== undefined && (
          <div className="mt-2">
            <div className="h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
      {Array.from({ length: outputs }).map((_, i) => (
        <Handle key={`output-${i}`} type="source" position={Position.Right} id={`output-${i}`}
          className={clsx('!w-3 !h-3 !border-2 !border-gray-300 dark:!border-gray-600 !bg-white dark:!bg-gray-700 hover:!bg-blue-500 hover:!border-blue-500 transition-colors')}
          style={{ top: `${((i + 1) / (outputs + 1)) * 100}%` }}
        />
      ))}
    </div>
  );
});

WorkflowNode.displayName = 'WorkflowNode';

export function SimpleNode({ label, status = 'idle', className }: { label: string; status?: NodeStatus; className?: string }) {
  const statusColors = {
    idle: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
    pending: 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600',
    running: 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700',
    complete: 'bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-700',
    error: 'bg-red-50 dark:bg-red-900/20 border-red-300 dark:border-red-700',
  };
  return <div className={clsx('px-4 py-2 rounded-lg border-2 text-sm font-medium', statusColors[status], className)}>{label}</div>;
}

export default WorkflowNode;
