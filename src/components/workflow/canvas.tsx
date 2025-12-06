import React, { useCallback, useRef } from 'react';
import { clsx } from 'clsx';
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  BackgroundVariant,
  MiniMap,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  NodeChange,
  EdgeChange,
  OnConnect,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { WorkflowNode } from './node';
import { WorkflowEdge } from './edge';
import { WorkflowControls } from './controls';
import { WorkflowPanel } from './panel';

const nodeTypes = { workflow: WorkflowNode };
const edgeTypes = { workflow: WorkflowEdge };

interface CanvasProps {
  nodes?: Node[];
  edges?: Edge[];
  onNodesChange?: (changes: NodeChange[]) => void;
  onEdgesChange?: (changes: EdgeChange[]) => void;
  onConnect?: OnConnect;
  onNodeClick?: (node: Node) => void;
  onEdgeClick?: (edge: Edge) => void;
  showMiniMap?: boolean;
  showControls?: boolean;
  showBackground?: boolean;
  backgroundVariant?: BackgroundVariant;
  readOnly?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Canvas({
  nodes: initialNodes = [],
  edges: initialEdges = [],
  onNodesChange: externalOnNodesChange,
  onEdgesChange: externalOnEdgesChange,
  onConnect: externalOnConnect,
  onNodeClick,
  onEdgeClick,
  showMiniMap = true,
  showControls = true,
  showBackground = true,
  backgroundVariant = BackgroundVariant.Dots,
  readOnly = false,
  className,
  children,
}: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  const handleNodesChange = useCallback(
    (changes: NodeChange[]) => {
      onNodesChange(changes);
      externalOnNodesChange?.(changes);
    },
    [onNodesChange, externalOnNodesChange]
  );

  const handleEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      onEdgesChange(changes);
      externalOnEdgesChange?.(changes);
    },
    [onEdgesChange, externalOnEdgesChange]
  );

  const handleConnect: OnConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, type: 'workflow' }, eds));
      externalOnConnect?.(connection);
    },
    [setEdges, externalOnConnect]
  );

  return (
    <div
      ref={reactFlowWrapper}
      className={clsx(
        'w-full h-full min-h-[400px] rounded-xl overflow-hidden',
        'bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700',
        className
      )}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={readOnly ? undefined : handleNodesChange}
        onEdgesChange={readOnly ? undefined : handleEdgesChange}
        onConnect={readOnly ? undefined : handleConnect}
        onNodeClick={(_, node) => onNodeClick?.(node)}
        onEdgeClick={(_, edge) => onEdgeClick?.(edge)}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        fitView
        attributionPosition="bottom-left"
        nodesDraggable={!readOnly}
        nodesConnectable={!readOnly}
        elementsSelectable={!readOnly}
        panOnDrag={true}
        zoomOnScroll={true}
        className="workflow-canvas"
      >
        {showBackground && (
          <Background variant={backgroundVariant} gap={20} size={1} color="#ddd" className="dark:opacity-30" />
        )}
        {showMiniMap && (
          <MiniMap
            nodeColor={(node) => {
              const status = node.data?.status as string;
              if (status === 'running') return '#3b82f6';
              if (status === 'complete') return '#22c55e';
              if (status === 'error') return '#ef4444';
              return '#94a3b8';
            }}
            maskColor="rgba(0, 0, 0, 0.1)"
            className="!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700 !rounded-lg !shadow-lg"
          />
        )}
        {showControls && <WorkflowControls />}
        {children}
      </ReactFlow>
    </div>
  );
}

export function WorkflowCanvas(props: CanvasProps) {
  return (
    <ReactFlowProvider>
      <Canvas {...props} />
    </ReactFlowProvider>
  );
}

export default WorkflowCanvas;
