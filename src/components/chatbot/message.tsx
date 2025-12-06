import React from 'react';
import { clsx } from 'clsx';
import { User, Bot, AlertCircle } from 'lucide-react';
import type { Message as MessageType } from '@/types';

interface MessageProps {
  message: MessageType;
  showAvatar?: boolean;
  className?: string;
  children?: React.ReactNode;
}

export function Message({ message, showAvatar = true, className, children }: MessageProps) {
  const isUser = message.role === 'user';
  const isError = message.status === 'error';

  return (
    <div
      className={clsx(
        'group flex gap-3 py-4 px-4',
        isUser ? 'flex-row-reverse' : 'flex-row',
        className
      )}
    >
      {showAvatar && (
        <div
          className={clsx(
            'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center',
            isUser ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300',
            isError && 'bg-red-100 text-red-600'
          )}
        >
          {isError ? (
            <AlertCircle className="w-4 h-4" />
          ) : isUser ? (
            <User className="w-4 h-4" />
          ) : (
            <Bot className="w-4 h-4" />
          )}
        </div>
      )}
      <div
        className={clsx(
          'flex-1 min-w-0 max-w-[80%]',
          isUser && 'flex flex-col items-end'
        )}
      >
        <div
          className={clsx(
            'rounded-2xl px-4 py-2.5',
            isUser
              ? 'bg-blue-600 text-white rounded-tr-sm'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-sm',
            isError && 'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800'
          )}
        >
          {children || (
            <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
              {message.content}
            </p>
          )}
        </div>
        {message.timestamp && (
          <span className="text-xs text-gray-400 mt-1 px-1">
            {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        )}
      </div>
    </div>
  );
}

interface MessageGroupProps {
  messages: MessageType[];
  className?: string;
}

export function MessageGroup({ messages, className }: MessageGroupProps) {
  return (
    <div className={clsx('space-y-1', className)}>
      {messages.map((message, index) => (
        <Message
          key={message.id}
          message={message}
          showAvatar={index === 0}
        />
      ))}
    </div>
  );
}

export default Message;
