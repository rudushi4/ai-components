import React from 'react';
import { clsx } from 'clsx';
import { Plus, Trash2, Copy, Clipboard, Undo, Redo, Play, Pause, Square, Save, FolderOpen, Settings, Code, Database, Globe, MessageSquare, Zap, GitBranch, Filter } from 'lucide-react';

interface ToolbarAction {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  active?: boolean;
  variant?: 'default' | 'primary' | 'danger';
}

interface WorkflowToolbarProps {
  actions?: ToolbarAction[];
  showDefaultActions?: boolean;
  onUndo?: () => void;
  onRedo?: () => void;
  onDelete?: () => void;
  onDuplicate?: () => void;
  onCopy?: () => void;
  onPaste?: () => void;
  onRun?: () => void;
  onPause?: () => void;
  onStop?: () => void;
  onSave?: () => void;
  onLoad?: () => void;
  isRunning?: boolean;
  canUndo?: boolean;
  canRedo?: boolean;
  hasSelection?: boolean;
  position?: 'top' | 'bottom';
  className?: string;
}

export function WorkflowToolbar({ actions = [], showDefaultActions = true, onUndo, onRedo, onDelete, onDuplicate, onCopy, onPaste, onRun, onPause, onStop, onSave, onLoad, isRunning = false, canUndo = false, canRedo = false, hasSelection = false, position = 'top', className }: WorkflowToolbarProps) {
  const defaultActions: ToolbarAction[] = [];

  if (showDefaultActions) {
    if (onUndo) defaultActions.push({ id: 'undo', icon: <Undo className="w-4 h-4" />, label: 'Undo', onClick: onUndo, disabled: !canUndo });
    if (onRedo) defaultActions.push({ id: 'redo', icon: <Redo className="w-4 h-4" />, label: 'Redo', onClick: onRedo, disabled: !canRedo });
    if (onCopy) defaultActions.push({ id: 'copy', icon: <Copy className="w-4 h-4" />, label: 'Copy', onClick: onCopy, disabled: !hasSelection });
    if (onPaste) defaultActions.push({ id: 'paste', icon: <Clipboard className="w-4 h-4" />, label: 'Paste', onClick: onPaste });
    if (onDuplicate) defaultActions.push({ id: 'duplicate', icon: <Copy className="w-4 h-4" />, label: 'Duplicate', onClick: onDuplicate, disabled: !hasSelection });
    if (onDelete) defaultActions.push({ id: 'delete', icon: <Trash2 className="w-4 h-4" />, label: 'Delete', onClick: onDelete, disabled: !hasSelection, variant: 'danger' });
    if (onRun && !isRunning) defaultActions.push({ id: 'run', icon: <Play className="w-4 h-4" />, label: 'Run', onClick: onRun, variant: 'primary' });
    if (onPause && isRunning) defaultActions.push({ id: 'pause', icon: <Pause className="w-4 h-4" />, label: 'Pause', onClick: onPause });
    if (onStop && isRunning) defaultActions.push({ id: 'stop', icon: <Square className="w-4 h-4" />, label: 'Stop', onClick: onStop, variant: 'danger' });
    if (onSave) defaultActions.push({ id: 'save', icon: <Save className="w-4 h-4" />, label: 'Save', onClick: onSave });
    if (onLoad) defaultActions.push({ id: 'load', icon: <FolderOpen className="w-4 h-4" />, label: 'Load', onClick: onLoad });
  }

  const allActions = [...defaultActions, ...actions];

  return (
    <div className={clsx('flex items-center gap-1 px-2 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm', position === 'top' ? 'mb-2' : 'mt-2', className)}>
      {allActions.map((action, index) => (
        <React.Fragment key={action.id}>
          {index > 0 && index % 3 === 0 && <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-1" />}
          <button
            onClick={action.onClick}
            disabled={action.disabled}
            title={action.label}
            className={clsx('p-2 rounded-lg transition-colors', action.disabled && 'opacity-50 cursor-not-allowed',
              !action.disabled && action.variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
              !action.disabled && action.variant === 'danger' && 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20',
              !action.disabled && action.variant !== 'primary' && action.variant !== 'danger' && 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700',
              action.active && 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
            )}
          >
            {action.icon}
          </button>
        </React.Fragment>
      ))}
    </div>
  );
}

export function NodeTypePalette({ onAddNode, className }: { onAddNode: (type: string) => void; className?: string }) {
  const nodeTypes = [
    { type: 'trigger', icon: <Zap className="w-4 h-4" />, label: 'Trigger' },
    { type: 'process', icon: <Settings className="w-4 h-4" />, label: 'Process' },
    { type: 'decision', icon: <GitBranch className="w-4 h-4" />, label: 'Decision' },
    { type: 'api', icon: <Globe className="w-4 h-4" />, label: 'API Call' },
    { type: 'database', icon: <Database className="w-4 h-4" />, label: 'Database' },
    { type: 'ai', icon: <MessageSquare className="w-4 h-4" />, label: 'AI' },
    { type: 'transform', icon: <Filter className="w-4 h-4" />, label: 'Transform' },
    { type: 'code', icon: <Code className="w-4 h-4" />, label: 'Code' },
  ];

  return (
    <div className={clsx('flex flex-wrap gap-2 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg', className)}>
      {nodeTypes.map((node) => (
        <button
          key={node.type}
          onClick={() => onAddNode(node.type)}
          className={clsx('flex items-center gap-2 px-3 py-2 rounded-lg text-sm bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-gray-600 hover:border-blue-300 dark:hover:border-blue-700 transition-colors')}
        >
          {node.icon}<span>{node.label}</span>
        </button>
      ))}
    </div>
  );
}

export function NodeToolbar({ onEdit, onDuplicate, onDelete, position, className }: { onEdit?: () => void; onDuplicate?: () => void; onDelete?: () => void; position?: { x: number; y: number }; className?: string }) {
  return (
    <div className={clsx('absolute flex items-center gap-1 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700', className)} style={position ? { left: position.x, top: position.y } : undefined}>
      {onEdit && <button onClick={onEdit} className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Edit"><Settings className="w-4 h-4" /></button>}
      {onDuplicate && <button onClick={onDuplicate} className="p-1.5 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Duplicate"><Copy className="w-4 h-4" /></button>}
      {onDelete && <button onClick={onDelete} className="p-1.5 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors" title="Delete"><Trash2 className="w-4 h-4" /></button>}
    </div>
  );
}

export default WorkflowToolbar;
