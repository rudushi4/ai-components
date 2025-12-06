// AI Components Types

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  status?: 'pending' | 'streaming' | 'complete' | 'error';
  attachments?: Attachment[];
  sources?: Source[];
  reasoning?: ReasoningStep[];
  toolCalls?: ToolCall[];
}

export interface Attachment {
  id: string;
  name: string;
  type: 'file' | 'image' | 'code' | 'url';
  url?: string;
  content?: string;
  size?: number;
}

export interface Source {
  id: string;
  title: string;
  url: string;
  snippet?: string;
  relevance?: number;
}

export interface ReasoningStep {
  id: string;
  title: string;
  content: string;
  status: 'thinking' | 'complete' | 'error';
  duration?: number;
}

export interface ToolCall {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'complete' | 'error';
  input?: Record<string, unknown>;
  output?: unknown;
  duration?: number;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
  model?: string;
}

export interface Plan {
  id: string;
  title: string;
  description?: string;
  tasks: Task[];
  status: 'planning' | 'in_progress' | 'completed' | 'failed';
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'skipped';
  progress?: number;
  subtasks?: Task[];
}

export interface Branch {
  id: string;
  parentId?: string;
  messages: Message[];
  label?: string;
}

export interface QueueItem {
  id: string;
  type: 'message' | 'attachment' | 'task';
  content: string;
  status: 'queued' | 'processing' | 'done' | 'error';
  attachment?: Attachment;
}

export interface WorkflowNode {
  id: string;
  type: string;
  position: { x: number; y: number };
  data: Record<string, unknown>;
}

export interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
}

export interface Action {
  id: string;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'default' | 'destructive' | 'outline';
}

export interface ConfirmationRequest {
  id: string;
  title: string;
  description: string;
  tool: string;
  input: Record<string, unknown>;
  status: 'pending' | 'approved' | 'denied';
}

export interface Model {
  id: string;
  name: string;
  provider: string;
  description?: string;
  maxTokens?: number;
}

export interface Suggestion {
  id: string;
  text: string;
  icon?: React.ReactNode;
  category?: string;
}
