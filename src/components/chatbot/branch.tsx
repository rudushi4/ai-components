import React, { useState } from 'react';
import { clsx } from 'clsx';
import { GitBranch, ChevronRight, Plus, MoreHorizontal, Trash2, Edit2, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Branch as BranchType, Message } from '@/types';

interface BranchProps {
  branches: BranchType[];
  activeBranchId?: string;
  onSelectBranch?: (branchId: string) => void;
  onCreateBranch?: (parentId: string) => void;
  onDeleteBranch?: (branchId: string) => void;
  onRenameBranch?: (branchId: string, newLabel: string) => void;
  className?: string;
}

export function Branch({
  branches,
  activeBranchId,
  onSelectBranch,
  onCreateBranch,
  onDeleteBranch,
  onRenameBranch,
  className,
}: BranchProps) {
  const [expandedBranches, setExpandedBranches] = useState<Set<string>>(new Set([activeBranchId || '']));

  const toggleExpand = (branchId: string) => {
    setExpandedBranches((prev) => {
      const next = new Set(prev);
      if (next.has(branchId)) {
        next.delete(branchId);
      } else {
        next.add(branchId);
      }
      return next;
    });
  };

  // Build tree structure
  const rootBranches = branches.filter((b) => !b.parentId);
  const getChildren = (parentId: string) => branches.filter((b) => b.parentId === parentId);

  const renderBranch = (branch: BranchType, depth: number = 0) => {
    const children = getChildren(branch.id);
    const isExpanded = expandedBranches.has(branch.id);
    const isActive = branch.id === activeBranchId;

    return (
      <div key={branch.id}>
        <BranchItem
          branch={branch}
          depth={depth}
          isActive={isActive}
          isExpanded={isExpanded}
          hasChildren={children.length > 0}
          onSelect={() => onSelectBranch?.(branch.id)}
          onToggle={() => toggleExpand(branch.id)}
          onCreateChild={() => onCreateBranch?.(branch.id)}
          onDelete={() => onDeleteBranch?.(branch.id)}
          onRename={(newLabel) => onRenameBranch?.(branch.id, newLabel)}
        />
        <AnimatePresence>
          {isExpanded && children.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
            >
              {children.map((child) => renderBranch(child, depth + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div className={clsx('rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden', className)}>
      <div className="flex items-center gap-2 px-4 py-3 bg-gray-50 dark:bg-gray-800/50">
        <GitBranch className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Branches</span>
        <span className="text-xs text-gray-500 bg-gray-200 dark:bg-gray-700 px-1.5 py-0.5 rounded-full">
          {branches.length}
        </span>
      </div>
      <div className="p-2">
        {rootBranches.map((branch) => renderBranch(branch))}
      </div>
    </div>
  );
}

interface BranchItemProps {
  branch: BranchType;
  depth: number;
  isActive: boolean;
  isExpanded: boolean;
  hasChildren: boolean;
  onSelect: () => void;
  onToggle: () => void;
  onCreateChild: () => void;
  onDelete: () => void;
  onRename: (newLabel: string) => void;
}

function BranchItem({
  branch,
  depth,
  isActive,
  isExpanded,
  hasChildren,
  onSelect,
  onToggle,
  onCreateChild,
  onDelete,
  onRename,
}: BranchItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(branch.label || '');
  const [showMenu, setShowMenu] = useState(false);

  const handleRename = () => {
    if (editValue.trim()) {
      onRename(editValue.trim());
    }
    setIsEditing(false);
  };

  return (
    <div
      className={clsx(
        'group flex items-center gap-1 px-2 py-1.5 rounded-lg transition-colors',
        isActive ? 'bg-blue-50 dark:bg-blue-900/20' : 'hover:bg-gray-50 dark:hover:bg-gray-800'
      )}
      style={{ paddingLeft: `${depth * 16 + 8}px` }}
    >
      {/* Expand toggle */}
      <button
        onClick={onToggle}
        className={clsx(
          'p-0.5 rounded transition-colors',
          hasChildren ? 'text-gray-400 hover:text-gray-600' : 'text-transparent'
        )}
      >
        <ChevronRight className={clsx('w-4 h-4 transition-transform', isExpanded && 'rotate-90')} />
      </button>

      {/* Branch icon */}
      <GitBranch className={clsx(
        'w-4 h-4 flex-shrink-0',
        isActive ? 'text-blue-600' : 'text-gray-400'
      )} />

      {/* Label */}
      {isEditing ? (
        <div className="flex items-center gap-1 flex-1">
          <input
            type="text"
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleRename();
              if (e.key === 'Escape') setIsEditing(false);
            }}
            className="flex-1 px-2 py-0.5 text-sm bg-white dark:bg-gray-700 border border-blue-500 rounded outline-none"
            autoFocus
          />
          <button onClick={handleRename} className="p-0.5 text-green-600 hover:bg-green-50 rounded">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={() => setIsEditing(false)} className="p-0.5 text-red-600 hover:bg-red-50 rounded">
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <button
          onClick={onSelect}
          className={clsx(
            'flex-1 text-left text-sm truncate',
            isActive ? 'text-blue-700 dark:text-blue-300 font-medium' : 'text-gray-700 dark:text-gray-300'
          )}
        >
          {branch.label || `Branch ${branch.id.slice(0, 6)}`}
        </button>
      )}

      {/* Message count */}
      <span className="text-xs text-gray-400 px-1">
        {branch.messages.length}
      </span>

      {/* Menu */}
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>

        {showMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
            <div className="absolute right-0 top-full mt-1 z-20 py-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 min-w-[120px]">
              <button
                onClick={() => { onCreateChild(); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Plus className="w-4 h-4" />
                New branch
              </button>
              <button
                onClick={() => { setIsEditing(true); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <Edit2 className="w-4 h-4" />
                Rename
              </button>
              <button
                onClick={() => { onDelete(); setShowMenu(false); }}
                className="w-full flex items-center gap-2 px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// Branch indicator for inline use
interface BranchIndicatorProps {
  currentBranch: number;
  totalBranches: number;
  onPrevious?: () => void;
  onNext?: () => void;
  className?: string;
}

export function BranchIndicator({
  currentBranch,
  totalBranches,
  onPrevious,
  onNext,
  className,
}: BranchIndicatorProps) {
  if (totalBranches <= 1) return null;

  return (
    <div className={clsx('flex items-center gap-1 text-xs text-gray-500', className)}>
      <button
        onClick={onPrevious}
        disabled={currentBranch <= 1}
        className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30"
      >
        <ChevronRight className="w-3 h-3 rotate-180" />
      </button>
      <span>{currentBranch}/{totalBranches}</span>
      <button
        onClick={onNext}
        disabled={currentBranch >= totalBranches}
        className="p-0.5 hover:bg-gray-100 dark:hover:bg-gray-800 rounded disabled:opacity-30"
      >
        <ChevronRight className="w-3 h-3" />
      </button>
    </div>
  );
}

export default Branch;
