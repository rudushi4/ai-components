import React, { useState, useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { Send, Paperclip, Mic, X, ChevronDown, Image, FileText, Link2, Loader2, StopCircle, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Model, Attachment } from '@/types';

interface PromptInputProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  maxLength?: number;
  models?: Model[];
  selectedModel?: Model;
  attachments?: Attachment[];
  showModelSelector?: boolean;
  showAttachments?: boolean;
  showVoice?: boolean;
  autoFocus?: boolean;
  onSubmit?: (value: string, attachments?: Attachment[]) => void;
  onChange?: (value: string) => void;
  onModelChange?: (model: Model) => void;
  onAttach?: (files: File[]) => void;
  onRemoveAttachment?: (id: string) => void;
  onStop?: () => void;
  className?: string;
}

export function PromptInput({
  value: controlledValue,
  placeholder = 'Type a message...',
  disabled = false,
  isLoading = false,
  maxLength,
  models = [],
  selectedModel,
  attachments = [],
  showModelSelector = true,
  showAttachments = true,
  showVoice = false,
  autoFocus = false,
  onSubmit,
  onChange,
  onModelChange,
  onAttach,
  onRemoveAttachment,
  onStop,
  className,
}: PromptInputProps) {
  const [internalValue, setInternalValue] = useState('');
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const value = controlledValue ?? internalValue;
  const setValue = (newValue: string) => {
    setInternalValue(newValue);
    onChange?.(newValue);
  };

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 200) + 'px';
    }
  }, [value]);

  const handleSubmit = () => {
    if (!value.trim() || disabled || isLoading) return;
    onSubmit?.(value.trim(), attachments);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      onAttach?.(Array.from(e.target.files));
    }
    e.target.value = '';
  };

  return (
    <div className={clsx('relative', className)}>
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-2 px-2">
          {attachments.map((attachment) => (
            <AttachmentPreview
              key={attachment.id}
              attachment={attachment}
              onRemove={() => onRemoveAttachment?.(attachment.id)}
            />
          ))}
        </div>
      )}

      <div
        className={clsx(
          'relative flex items-end gap-2 p-3 rounded-2xl border transition-colors',
          'bg-white dark:bg-gray-900',
          disabled
            ? 'border-gray-200 dark:border-gray-700 opacity-60'
            : 'border-gray-200 dark:border-gray-700 focus-within:border-blue-500 dark:focus-within:border-blue-400'
        )}
      >
        {showModelSelector && models.length > 0 && (
          <div className="relative">
            <button
              onClick={() => setShowModelDropdown(!showModelDropdown)}
              disabled={disabled}
              className={clsx(
                'flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-xs font-medium',
                'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300',
                'hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors'
              )}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{selectedModel?.name || 'Select model'}</span>
              <ChevronDown className="w-3 h-3" />
            </button>

            <AnimatePresence>
              {showModelDropdown && (
                <ModelDropdown
                  models={models}
                  selected={selectedModel}
                  onSelect={(model) => {
                    onModelChange?.(model);
                    setShowModelDropdown(false);
                  }}
                  onClose={() => setShowModelDropdown(false)}
                />
              )}
            </AnimatePresence>
          </div>
        )}

        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoFocus={autoFocus}
          maxLength={maxLength}
          rows={1}
          className={clsx(
            'flex-1 resize-none bg-transparent border-none outline-none',
            'text-gray-900 dark:text-gray-100 placeholder-gray-400',
            'text-sm leading-relaxed min-h-[24px] max-h-[200px]'
          )}
        />

        <div className="flex items-center gap-1">
          {showAttachments && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                className="hidden"
                onChange={handleFileChange}
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={disabled}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </>
          )}

          {showVoice && (
            <button
              onClick={() => setIsRecording(!isRecording)}
              disabled={disabled}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                isRecording
                  ? 'bg-red-100 dark:bg-red-900/30 text-red-600'
                  : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
              )}
            >
              <Mic className={clsx('w-5 h-5', isRecording && 'animate-pulse')} />
            </button>
          )}

          {isLoading ? (
            <button
              onClick={onStop}
              className="p-2 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-800/30 transition-colors"
            >
              <StopCircle className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!value.trim() || disabled}
              className={clsx(
                'p-2 rounded-lg transition-colors',
                value.trim() && !disabled
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
              )}
            >
              <Send className="w-5 h-5" />
            </button>
          )}
        </div>
      </div>

      {maxLength && (
        <div className="absolute right-3 -bottom-5 text-xs text-gray-400">
          {value.length}/{maxLength}
        </div>
      )}
    </div>
  );
}

interface ModelDropdownProps {
  models: Model[];
  selected?: Model;
  onSelect: (model: Model) => void;
  onClose: () => void;
}

function ModelDropdown({ models, selected, onSelect, onClose }: ModelDropdownProps) {
  return (
    <>
      <div className="fixed inset-0 z-10" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        className="absolute left-0 bottom-full mb-2 z-20 min-w-[200px] py-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700"
      >
        {models.map((model) => (
          <button
            key={model.id}
            onClick={() => onSelect(model)}
            className={clsx(
              'w-full flex items-start gap-2 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700',
              selected?.id === model.id && 'bg-blue-50 dark:bg-blue-900/20'
            )}
          >
            <Sparkles className={clsx(
              'w-4 h-4 mt-0.5',
              selected?.id === model.id ? 'text-blue-600' : 'text-gray-400'
            )} />
            <div>
              <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {model.name}
              </div>
              {model.description && (
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {model.description}
                </div>
              )}
            </div>
          </button>
        ))}
      </motion.div>
    </>
  );
}

interface AttachmentPreviewProps {
  attachment: Attachment;
  onRemove: () => void;
}

function AttachmentPreview({ attachment, onRemove }: AttachmentPreviewProps) {
  const getIcon = () => {
    switch (attachment.type) {
      case 'image': return <Image className="w-4 h-4" />;
      case 'code': return <FileText className="w-4 h-4" />;
      case 'url': return <Link2 className="w-4 h-4" />;
      default: return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className="flex items-center gap-2 px-2 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <div className="text-gray-500">{getIcon()}</div>
      <span className="text-sm text-gray-700 dark:text-gray-300 truncate max-w-[150px]">
        {attachment.name}
      </span>
      <button
        onClick={onRemove}
        className="p-0.5 text-gray-400 hover:text-red-500 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

export default PromptInput;
