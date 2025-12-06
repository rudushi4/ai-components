import React from 'react';
import { clsx } from 'clsx';
import { Controls, ControlButton, useReactFlow } from '@xyflow/react';
import { ZoomIn, ZoomOut, Maximize, Lock, Unlock, RotateCcw, Download, Upload, Grid } from 'lucide-react';

interface WorkflowControlsProps {
  showZoom?: boolean;
  showFitView?: boolean;
  showInteractive?: boolean;
  showReset?: boolean;
  showExport?: boolean;
  showGrid?: boolean;
  onExport?: () => void;
  onImport?: () => void;
  onToggleGrid?: () => void;
  className?: string;
}

export function WorkflowControls({ showZoom = true, showFitView = true, showInteractive = true, showReset = true, showExport = false, showGrid = false, onExport, onImport, onToggleGrid, className }: WorkflowControlsProps) {
  const { zoomIn, zoomOut, fitView } = useReactFlow();
  const [isLocked, setIsLocked] = React.useState(false);
  const [isGridVisible, setIsGridVisible] = React.useState(true);

  const handleToggleLock = () => setIsLocked(!isLocked);
  const handleToggleGrid = () => { setIsGridVisible(!isGridVisible); onToggleGrid?.(); };

  return (
    <Controls showZoom={false} showFitView={false} showInteractive={false}
      className={clsx('!bg-white dark:!bg-gray-800 !border-gray-200 dark:!border-gray-700 !rounded-lg !shadow-lg overflow-hidden', className)}
    >
      {showZoom && (
        <>
          <ControlButton onClick={() => zoomIn()} title="Zoom In" className="!bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700">
            <ZoomIn className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </ControlButton>
          <ControlButton onClick={() => zoomOut()} title="Zoom Out" className="!bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700">
            <ZoomOut className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </ControlButton>
        </>
      )}
      {showFitView && (
        <ControlButton onClick={() => fitView({ padding: 0.2 })} title="Fit View" className="!bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700">
          <Maximize className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </ControlButton>
      )}
      {showInteractive && (
        <ControlButton onClick={handleToggleLock} title={isLocked ? 'Unlock' : 'Lock'} className="!bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700">
          {isLocked ? <Lock className="w-4 h-4 text-gray-600 dark:text-gray-300" /> : <Unlock className="w-4 h-4 text-gray-600 dark:text-gray-300" />}
        </ControlButton>
      )}
      {showReset && (
        <ControlButton onClick={() => fitView({ padding: 0.2 })} title="Reset View" className="!bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700">
          <RotateCcw className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        </ControlButton>
      )}
      {showGrid && (
        <ControlButton onClick={handleToggleGrid} title="Toggle Grid"
          className={clsx('!bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700', isGridVisible && '!bg-blue-50 dark:!bg-blue-900/30')}>
          <Grid className={clsx('w-4 h-4', isGridVisible ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-300')} />
        </ControlButton>
      )}
      {showExport && (
        <>
          <ControlButton onClick={onExport} title="Export" className="!bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700">
            <Download className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </ControlButton>
          <ControlButton onClick={onImport} title="Import" className="!bg-transparent hover:!bg-gray-100 dark:hover:!bg-gray-700">
            <Upload className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          </ControlButton>
        </>
      )}
    </Controls>
  );
}

export function CanvasActions({ onZoomIn, onZoomOut, onFitView, onReset, position = 'bottom-right', className }: { onZoomIn?: () => void; onZoomOut?: () => void; onFitView?: () => void; onReset?: () => void; position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'; className?: string }) {
  const positionClasses = { 'top-left': 'top-4 left-4', 'top-right': 'top-4 right-4', 'bottom-left': 'bottom-4 left-4', 'bottom-right': 'bottom-4 right-4' };
  return (
    <div className={clsx('absolute flex flex-col gap-1 p-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700', positionClasses[position], className)}>
      {onZoomIn && <button onClick={onZoomIn} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Zoom In"><ZoomIn className="w-4 h-4" /></button>}
      {onZoomOut && <button onClick={onZoomOut} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Zoom Out"><ZoomOut className="w-4 h-4" /></button>}
      {onFitView && <button onClick={onFitView} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Fit View"><Maximize className="w-4 h-4" /></button>}
      {onReset && <button onClick={onReset} className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors" title="Reset"><RotateCcw className="w-4 h-4" /></button>}
    </div>
  );
}

export default WorkflowControls;
