import React from 'react';
import { clsx } from 'clsx';
import { Panel as ReactFlowPanel, PanelPosition } from '@xyflow/react';
import { X, GripVertical, Minimize2, Maximize2 } from 'lucide-react';

interface WorkflowPanelProps {
  position?: PanelPosition;
  title?: string;
  collapsible?: boolean;
  closable?: boolean;
  defaultCollapsed?: boolean;
  onClose?: () => void;
  className?: string;
  children: React.ReactNode;
}

export function WorkflowPanel({ position = 'top-right', title, collapsible = false, closable = false, defaultCollapsed = false, onClose, className, children }: WorkflowPanelProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(defaultCollapsed);

  return (
    <ReactFlowPanel position={position} className={clsx('bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 m-2', className)}>
      {(title || collapsible || closable) && (
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2">
            <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
            {title && <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>}
          </div>
          <div className="flex items-center gap-1">
            {collapsible && (
              <button onClick={() => setIsCollapsed(!isCollapsed)} className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                {isCollapsed ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
            )}
            {closable && (
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-red-500 transition-colors">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}
      {!isCollapsed && <div className="p-3">{children}</div>}
    </ReactFlowPanel>
  );
}

export function InfoPanel({ title, data, position = 'top-right', onClose, className }: { title: string; data: Record<string, unknown>; position?: PanelPosition; onClose?: () => void; className?: string }) {
  return (
    <WorkflowPanel position={position} title={title} closable={!!onClose} onClose={onClose} className={clsx('min-w-[200px] max-w-[300px]', className)}>
      <div className="space-y-2">
        {Object.entries(data).map(([key, value]) => (
          <div key={key} className="flex justify-between gap-2 text-sm">
            <span className="text-gray-500 dark:text-gray-400 capitalize">{key.replace(/_/g, ' ')}</span>
            <span className="text-gray-800 dark:text-gray-200 font-medium truncate">{typeof value === 'object' ? JSON.stringify(value) : String(value)}</span>
          </div>
        ))}
      </div>
    </WorkflowPanel>
  );
}

export function LegendPanel({ items, title = 'Legend', position = 'bottom-left', className }: { items: { color: string; label: string }[]; title?: string; position?: PanelPosition; className?: string }) {
  return (
    <WorkflowPanel position={position} title={title} collapsible className={clsx('min-w-[150px]', className)}>
      <div className="space-y-1.5">
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
            <span className="text-gray-700 dark:text-gray-300">{item.label}</span>
          </div>
        ))}
      </div>
    </WorkflowPanel>
  );
}

export function StatsPanel({ stats, title = 'Statistics', position = 'top-left', className }: { stats: { label: string; value: string | number; change?: number }[]; title?: string; position?: PanelPosition; className?: string }) {
  return (
    <WorkflowPanel position={position} title={title} collapsible className={clsx('min-w-[180px]', className)}>
      <div className="space-y-2">
        {stats.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <span className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</span>
            <div className="flex items-center gap-1">
              <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{stat.value}</span>
              {stat.change !== undefined && (
                <span className={clsx('text-xs', stat.change >= 0 ? 'text-green-500' : 'text-red-500')}>
                  {stat.change >= 0 ? '+' : ''}{stat.change}%
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </WorkflowPanel>
  );
}

export default WorkflowPanel;
