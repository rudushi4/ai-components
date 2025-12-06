import React, { useRef, useEffect } from 'react';
import { clsx } from 'clsx';
import { Message } from './message';
import { Loader } from './loader';
import type { Conversation as ConversationType, Message as MessageType } from '@/types';

interface ConversationProps {
  conversation?: ConversationType;
  messages?: MessageType[];
  isLoading?: boolean;
  autoScroll?: boolean;
  className?: string;
  emptyState?: React.ReactNode;
  renderMessage?: (message: MessageType) => React.ReactNode;
}

export function Conversation({
  conversation,
  messages: messagesProp,
  isLoading = false,
  autoScroll = true,
  className,
  emptyState,
  renderMessage,
}: ConversationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const messages = messagesProp || conversation?.messages || [];

  useEffect(() => {
    if (autoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, autoScroll]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className={clsx('flex-1 flex items-center justify-center', className)}>
        {emptyState || (
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p className="text-lg font-medium">No messages yet</p>
            <p className="text-sm mt-1">Start a conversation to see messages here</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className={clsx(
        'flex-1 overflow-y-auto scroll-smooth',
        className
      )}
    >
      <div className="max-w-4xl mx-auto">
        {messages.map((message) =>
          renderMessage ? (
            <React.Fragment key={message.id}>
              {renderMessage(message)}
            </React.Fragment>
          ) : (
            <Message key={message.id} message={message} />
          )
        )}
        {isLoading && (
          <div className="flex gap-3 py-4 px-4">
            <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
              <Loader size="sm" />
            </div>
            <div className="flex-1">
              <Loader variant="dots" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Conversation;
