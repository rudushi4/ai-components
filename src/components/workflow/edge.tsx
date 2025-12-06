import React, { memo } from 'react';
import { clsx } from 'clsx';
import { BaseEdge, getBezierPath, EdgeLabelRenderer, getSmoothStepPath, getStraightPath, Position } from '@xyflow/react';

type EdgeStatus = 'idle' | 'active' | 'complete' | 'error';
type EdgeVariant = 'bezier' | 'smoothstep' | 'straight';

interface WorkflowEdgeData {
  label?: string;
  status?: EdgeStatus;
  variant?: EdgeVariant;
  animated?: boolean;
}

interface WorkflowEdgeProps {
  id: string;
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
  sourcePosition: Position;
  targetPosition: Position;
  data?: WorkflowEdgeData;
  selected?: boolean;
}

export const WorkflowEdge = memo(({ id, sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, data, selected }: WorkflowEdgeProps) => {
  const { label, status = 'idle', variant = 'bezier', animated = false } = data || {};

  const getPath = () => {
    switch (variant) {
      case 'smoothstep': return getSmoothStepPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
      case 'straight': return getStraightPath({ sourceX, sourceY, targetX, targetY });
      default: return getBezierPath({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition });
    }
  };

  const [edgePath, labelX, labelY] = getPath();
  const statusColors = { idle: '#94a3b8', active: '#3b82f6', complete: '#22c55e', error: '#ef4444' };
  const strokeColor = statusColors[status];
  const isAnimated = animated || status === 'active';

  return (
    <>
      <BaseEdge id={id} path={edgePath} style={{ stroke: strokeColor, strokeWidth: selected ? 3 : 2 }} className={clsx(isAnimated && 'animate-pulse')} />
      {isAnimated && (
        <circle r="4" fill={strokeColor}>
          <animateMotion dur="1.5s" repeatCount="indefinite" path={edgePath} />
        </circle>
      )}
      {label && (
        <EdgeLabelRenderer>
          <div
            className={clsx('absolute px-2 py-1 rounded text-xs font-medium bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm pointer-events-all nodrag nopan text-gray-700 dark:text-gray-300')}
            style={{ transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)` }}
          >
            {label}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
});

WorkflowEdge.displayName = 'WorkflowEdge';

export function ConnectionLine({ fromX, fromY, toX, toY }: { fromX: number; fromY: number; toX: number; toY: number }) {
  return (
    <g>
      <path fill="none" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5,5"
        d={`M${fromX},${fromY} C${fromX + 100},${fromY} ${toX - 100},${toY} ${toX},${toY}`} />
      <circle cx={toX} cy={toY} r={6} fill="#3b82f6" />
    </g>
  );
}

export default WorkflowEdge;
