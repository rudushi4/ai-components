/**
 * Component Documentation
 * Complete API reference and examples for all AI components
 */

export interface ComponentDoc {
  name: string;
  description: string;
  category: string;
  props: PropDoc[];
  examples: ExampleDoc[];
  relatedComponents?: string[];
}

export interface PropDoc {
  name: string;
  type: string;
  required: boolean;
  default?: string;
  description: string;
}

export interface ExampleDoc {
  title: string;
  description?: string;
  code: string;
}

// ============================================================================
// CHATBOT CORE COMPONENTS
// ============================================================================

export const messageDoc: ComponentDoc = {
  name: 'Message',
  description: 'Displays a single chat message with avatar, content, and timestamp. Supports user, assistant, and system roles with different styling.',
  category: 'Chatbot > Core',
  props: [
    { name: 'message', type: 'MessageType', required: true, description: 'The message object containing id, role, content, timestamp, and status' },
    { name: 'showAvatar', type: 'boolean', required: false, default: 'true', description: 'Whether to show the user/assistant avatar' },
    { name: 'className', type: 'string', required: false, description: 'Additional CSS classes' },
    { name: 'children', type: 'ReactNode', required: false, description: 'Custom content to render inside the message bubble' },
  ],
  examples: [
    {
      title: 'Basic Usage',
      code: `<Message message={{
  id: '1',
  role: 'user',
  content: 'Hello, how are you?',
  timestamp: new Date(),
}} />`,
    },
    {
      title: 'Assistant Message',
      code: `<Message message={{
  id: '2',
  role: 'assistant',
  content: 'I\\'m doing great! How can I help you today?',
  status: 'complete',
}} />`,
    },
  ],
  relatedComponents: ['Conversation', 'MessageGroup', 'Response'],
};

export const conversationDoc: ComponentDoc = {
  name: 'Conversation',
  description: 'Container for chat messages with auto-scrolling, loading states, and custom message rendering.',
  category: 'Chatbot > Core',
  props: [
    { name: 'messages', type: 'MessageType[]', required: false, description: 'Array of messages to display' },
    { name: 'conversation', type: 'ConversationType', required: false, description: 'Conversation object containing messages' },
    { name: 'isLoading', type: 'boolean', required: false, default: 'false', description: 'Shows loading indicator' },
    { name: 'autoScroll', type: 'boolean', required: false, default: 'true', description: 'Auto-scroll to new messages' },
    { name: 'emptyState', type: 'ReactNode', required: false, description: 'Content to show when no messages' },
    { name: 'renderMessage', type: '(message: MessageType) => ReactNode', required: false, description: 'Custom message renderer' },
  ],
  examples: [
    {
      title: 'Basic Conversation',
      code: `<Conversation
  messages={messages}
  isLoading={isGenerating}
/>`,
    },
    {
      title: 'With Custom Empty State',
      code: `<Conversation
  messages={[]}
  emptyState={<WelcomeScreen onSelectPrompt={handlePrompt} />}
/>`,
    },
  ],
  relatedComponents: ['Message', 'PromptInput'],
};

export const loaderDoc: ComponentDoc = {
  name: 'Loader',
  description: 'Loading indicators for AI operations. Multiple variants for different contexts.',
  category: 'Chatbot > Core',
  props: [
    { name: 'variant', type: "'spinner' | 'dots' | 'pulse' | 'typing'", required: false, default: "'spinner'", description: 'Visual style of the loader' },
    { name: 'size', type: "'sm' | 'md' | 'lg'", required: false, default: "'md'", description: 'Size of the loader' },
    { name: 'text', type: 'string', required: false, description: 'Optional text to display alongside loader' },
  ],
  examples: [
    {
      title: 'Spinner with Text',
      code: `<Loader variant="spinner" text="Generating response..." />`,
    },
    {
      title: 'Typing Indicator',
      code: `<Loader variant="typing" />`,
    },
  ],
  relatedComponents: ['Shimmer'],
};

// ============================================================================
// AI DISPLAY COMPONENTS
// ============================================================================

export const chainOfThoughtDoc: ComponentDoc = {
  name: 'ChainOfThought',
  description: 'Visualizes the step-by-step reasoning process of an AI agent, showing thinking, actions, and tool calls.',
  category: 'Chatbot > AI Display',
  props: [
    { name: 'steps', type: 'ReasoningStep[]', required: true, description: 'Array of reasoning steps to display' },
    { name: 'title', type: 'string', required: false, default: "'Thinking...'", description: 'Header title' },
    { name: 'collapsible', type: 'boolean', required: false, default: 'true', description: 'Allow collapsing/expanding' },
    { name: 'defaultExpanded', type: 'boolean', required: false, default: 'true', description: 'Initial expanded state' },
  ],
  examples: [
    {
      title: 'Basic Usage',
      code: `<ChainOfThought
  steps={[
    { id: '1', title: 'Analyzing query', content: 'Understanding user intent...', status: 'complete' },
    { id: '2', title: 'Searching', content: 'Looking up relevant information...', status: 'thinking' },
  ]}
/>`,
    },
  ],
  relatedComponents: ['Reasoning', 'Tool'],
};

export const reasoningDoc: ComponentDoc = {
  name: 'Reasoning',
  description: 'Displays AI reasoning/thinking process in a collapsible block with streaming support.',
  category: 'Chatbot > AI Display',
  props: [
    { name: 'content', type: 'string', required: true, description: 'The reasoning text content' },
    { name: 'title', type: 'string', required: false, default: "'Reasoning'", description: 'Block title' },
    { name: 'duration', type: 'number', required: false, description: 'Time taken in milliseconds' },
    { name: 'isStreaming', type: 'boolean', required: false, default: 'false', description: 'Show streaming cursor' },
    { name: 'collapsible', type: 'boolean', required: false, default: 'true', description: 'Allow collapse/expand' },
  ],
  examples: [
    {
      title: 'Streaming Reasoning',
      code: `<Reasoning
  content={streamingContent}
  isStreaming={true}
  title="Thinking..."
/>`,
    },
  ],
  relatedComponents: ['ChainOfThought', 'Response'],
};

export const responseDoc: ComponentDoc = {
  name: 'Response',
  description: 'Formatted AI response display with avatar, streaming indicator, and action buttons.',
  category: 'Chatbot > AI Display',
  props: [
    { name: 'content', type: 'string', required: true, description: 'Response text content' },
    { name: 'isStreaming', type: 'boolean', required: false, default: 'false', description: 'Show streaming cursor' },
    { name: 'showActions', type: 'boolean', required: false, default: 'true', description: 'Show action buttons' },
    { name: 'onCopy', type: '() => void', required: false, description: 'Copy button handler' },
    { name: 'onRegenerate', type: '() => void', required: false, description: 'Regenerate button handler' },
    { name: 'onFeedback', type: '(positive: boolean) => void', required: false, description: 'Feedback handler' },
  ],
  examples: [
    {
      title: 'With Actions',
      code: `<Response
  content="Here's the answer to your question..."
  showActions
  onRegenerate={() => regenerate()}
  onFeedback={(liked) => submitFeedback(liked)}
/>`,
    },
  ],
  relatedComponents: ['Message', 'Actions'],
};

// ============================================================================
// CODE COMPONENTS
// ============================================================================

export const codeBlockDoc: ComponentDoc = {
  name: 'CodeBlock',
  description: 'Syntax-highlighted code display with line numbers, copy button, and optional run functionality.',
  category: 'Chatbot > Code',
  props: [
    { name: 'code', type: 'string', required: true, description: 'The code to display' },
    { name: 'language', type: 'string', required: false, default: "'text'", description: 'Programming language for syntax highlighting' },
    { name: 'filename', type: 'string', required: false, description: 'Optional filename to display in header' },
    { name: 'showLineNumbers', type: 'boolean', required: false, default: 'true', description: 'Show line numbers' },
    { name: 'showCopyButton', type: 'boolean', required: false, default: 'true', description: 'Show copy button' },
    { name: 'showRunButton', type: 'boolean', required: false, default: 'false', description: 'Show run button' },
    { name: 'theme', type: "'dark' | 'light' | 'auto'", required: false, default: "'dark'", description: 'Color theme' },
    { name: 'maxHeight', type: 'number', required: false, default: '400', description: 'Max height in pixels' },
    { name: 'onRun', type: '() => void', required: false, description: 'Run button handler' },
  ],
  examples: [
    {
      title: 'TypeScript Code',
      code: `<CodeBlock
  code="const greeting = 'Hello, World!';"
  language="typescript"
  filename="example.ts"
/>`,
    },
  ],
  relatedComponents: ['Artifact', 'InlineCode'],
};

export const sourcesDoc: ComponentDoc = {
  name: 'Sources',
  description: 'Displays source attributions and references used by the AI response.',
  category: 'Chatbot > Code',
  props: [
    { name: 'sources', type: 'Source[]', required: true, description: 'Array of source objects' },
    { name: 'title', type: 'string', required: false, default: "'Sources'", description: 'Section title' },
    { name: 'maxVisible', type: 'number', required: false, default: '3', description: 'Max sources before "show more"' },
    { name: 'variant', type: "'list' | 'grid' | 'compact'", required: false, default: "'list'", description: 'Display style' },
  ],
  examples: [
    {
      title: 'Basic Sources',
      code: `<Sources
  sources={[
    { id: '1', title: 'React Docs', url: 'https://react.dev' },
    { id: '2', title: 'MDN', url: 'https://developer.mozilla.org' },
  ]}
/>`,
    },
  ],
  relatedComponents: ['InlineCitation', 'SourceBadge'],
};

// ============================================================================
// INPUT COMPONENTS
// ============================================================================

export const promptInputDoc: ComponentDoc = {
  name: 'PromptInput',
  description: 'Advanced input component with model selection, attachments, voice input, and auto-resize.',
  category: 'Chatbot > Input',
  props: [
    { name: 'value', type: 'string', required: false, description: 'Controlled input value' },
    { name: 'placeholder', type: 'string', required: false, default: "'Type a message...'", description: 'Placeholder text' },
    { name: 'disabled', type: 'boolean', required: false, default: 'false', description: 'Disable input' },
    { name: 'isLoading', type: 'boolean', required: false, default: 'false', description: 'Show loading/stop state' },
    { name: 'models', type: 'Model[]', required: false, description: 'Available AI models' },
    { name: 'selectedModel', type: 'Model', required: false, description: 'Currently selected model' },
    { name: 'showModelSelector', type: 'boolean', required: false, default: 'true', description: 'Show model dropdown' },
    { name: 'showAttachments', type: 'boolean', required: false, default: 'true', description: 'Show attachment button' },
    { name: 'onSubmit', type: '(value: string, attachments?: Attachment[]) => void', required: false, description: 'Submit handler' },
    { name: 'onStop', type: '() => void', required: false, description: 'Stop generation handler' },
  ],
  examples: [
    {
      title: 'With Model Selection',
      code: `<PromptInput
  models={[
    { id: 'claude-3', name: 'Claude 3 Opus' },
    { id: 'gpt-4', name: 'GPT-4' },
  ]}
  selectedModel={selectedModel}
  onModelChange={setSelectedModel}
  onSubmit={handleSubmit}
/>`,
    },
  ],
  relatedComponents: ['Suggestion', 'Queue'],
};

export const suggestionDoc: ComponentDoc = {
  name: 'Suggestion',
  description: 'Quick action suggestions displayed as chips, cards, or list items.',
  category: 'Chatbot > Input',
  props: [
    { name: 'suggestions', type: 'SuggestionType[]', required: true, description: 'Array of suggestion objects' },
    { name: 'title', type: 'string', required: false, description: 'Section title' },
    { name: 'variant', type: "'chips' | 'cards' | 'list'", required: false, default: "'chips'", description: 'Display style' },
    { name: 'columns', type: '1 | 2 | 3 | 4', required: false, default: '2', description: 'Grid columns for cards' },
    { name: 'onSelect', type: '(suggestion: SuggestionType) => void', required: false, description: 'Selection handler' },
  ],
  examples: [
    {
      title: 'Card Layout',
      code: `<Suggestion
  suggestions={[
    { id: '1', text: 'Explain React hooks', category: 'code' },
    { id: '2', text: 'Write a poem', category: 'creative' },
  ]}
  variant="cards"
  columns={2}
  onSelect={handleSelect}
/>`,
    },
  ],
  relatedComponents: ['QuickSuggestions', 'PromptInput'],
};

// ============================================================================
// ADVANCED COMPONENTS
// ============================================================================

export const planDoc: ComponentDoc = {
  name: 'Plan',
  description: 'Displays a task plan with progress tracking, collapsible sections, and status indicators.',
  category: 'Chatbot > Advanced',
  props: [
    { name: 'plan', type: 'PlanType', required: true, description: 'Plan object with title, tasks, and status' },
    { name: 'collapsible', type: 'boolean', required: false, default: 'true', description: 'Allow collapse/expand' },
    { name: 'showProgress', type: 'boolean', required: false, default: 'true', description: 'Show progress bar' },
    { name: 'onTaskClick', type: '(taskId: string) => void', required: false, description: 'Task click handler' },
  ],
  examples: [
    {
      title: 'Basic Plan',
      code: `<Plan
  plan={{
    id: '1',
    title: 'Build Website',
    status: 'in_progress',
    tasks: [
      { id: '1', title: 'Setup project', status: 'completed' },
      { id: '2', title: 'Create components', status: 'in_progress' },
    ],
  }}
/>`,
    },
  ],
  relatedComponents: ['Task', 'TaskList'],
};

export const toolDoc: ComponentDoc = {
  name: 'Tool',
  description: 'Visualizes tool/function calls made by AI agents, showing inputs, outputs, and status.',
  category: 'Chatbot > Advanced',
  props: [
    { name: 'tool', type: 'ToolCall', required: true, description: 'Tool call object' },
    { name: 'showInput', type: 'boolean', required: false, default: 'true', description: 'Show input parameters' },
    { name: 'showOutput', type: 'boolean', required: false, default: 'true', description: 'Show output data' },
    { name: 'collapsible', type: 'boolean', required: false, default: 'true', description: 'Allow collapse/expand' },
    { name: 'defaultExpanded', type: 'boolean', required: false, default: 'false', description: 'Initial expanded state' },
  ],
  examples: [
    {
      title: 'Completed Tool Call',
      code: `<Tool
  tool={{
    id: '1',
    name: 'search_web',
    status: 'complete',
    input: { query: 'React hooks' },
    output: { results: 10 },
    duration: 234,
  }}
  defaultExpanded
/>`,
    },
  ],
  relatedComponents: ['ToolList', 'ChainOfThought'],
};

export const confirmationDoc: ComponentDoc = {
  name: 'Confirmation',
  description: 'Tool execution approval workflow with approve/deny actions.',
  category: 'Chatbot > Advanced',
  props: [
    { name: 'request', type: 'ConfirmationRequest', required: true, description: 'Confirmation request object' },
    { name: 'onApprove', type: '() => void', required: false, description: 'Approve handler' },
    { name: 'onDeny', type: '() => void', required: false, description: 'Deny handler' },
    { name: 'showDetails', type: 'boolean', required: false, default: 'true', description: 'Show expandable details' },
    { name: 'variant', type: "'default' | 'compact' | 'inline'", required: false, default: "'default'", description: 'Display style' },
  ],
  examples: [
    {
      title: 'Basic Confirmation',
      code: `<Confirmation
  request={{
    id: '1',
    title: 'Run Database Migration',
    description: 'This will update your schema.',
    tool: 'migrate_db',
    input: { version: '2.0' },
    status: 'pending',
  }}
  onApprove={handleApprove}
  onDeny={handleDeny}
/>`,
    },
  ],
  relatedComponents: ['ConfirmationQueue', 'Tool'],
};

// ============================================================================
// VIBE-CODING COMPONENTS
// ============================================================================

export const artifactDoc: ComponentDoc = {
  name: 'Artifact',
  description: 'Display code or document artifacts with syntax highlighting, preview, and actions.',
  category: 'Vibe-Coding',
  props: [
    { name: 'type', type: "'code' | 'document' | 'html' | 'markdown' | 'json' | 'svg' | 'csv'", required: true, description: 'Type of artifact' },
    { name: 'title', type: 'string', required: true, description: 'Artifact title' },
    { name: 'content', type: 'string', required: true, description: 'Artifact content' },
    { name: 'language', type: 'string', required: false, description: 'Language for syntax highlighting' },
    { name: 'showPreview', type: 'boolean', required: false, default: 'true', description: 'Show preview tab for HTML/SVG' },
    { name: 'collapsible', type: 'boolean', required: false, default: 'true', description: 'Allow collapse/expand' },
    { name: 'onRun', type: '() => void', required: false, description: 'Run button handler' },
    { name: 'onDownload', type: '() => void', required: false, description: 'Download button handler' },
  ],
  examples: [
    {
      title: 'Code Artifact',
      code: `<Artifact
  type="code"
  title="app.tsx"
  content="export default function App() { return <div>Hello</div>; }"
  language="typescript"
/>`,
    },
  ],
  relatedComponents: ['ArtifactList', 'CodeBlock'],
};

export const webPreviewDoc: ComponentDoc = {
  name: 'WebPreview',
  description: 'Embedded web page preview with device simulation and responsive controls.',
  category: 'Vibe-Coding',
  props: [
    { name: 'url', type: 'string', required: false, description: 'URL to preview' },
    { name: 'html', type: 'string', required: false, description: 'HTML content to preview' },
    { name: 'title', type: 'string', required: false, default: "'Web Preview'", description: 'Preview title' },
    { name: 'defaultDevice', type: "'mobile' | 'tablet' | 'desktop' | 'responsive'", required: false, default: "'responsive'", description: 'Initial device size' },
    { name: 'showDeviceToggle', type: 'boolean', required: false, default: 'true', description: 'Show device buttons' },
    { name: 'height', type: 'number | string', required: false, default: '500', description: 'Preview height' },
  ],
  examples: [
    {
      title: 'HTML Preview',
      code: `<WebPreview
  html="<html><body><h1>Hello World</h1></body></html>"
  title="My Page"
  defaultDevice="mobile"
/>`,
    },
  ],
  relatedComponents: ['Artifact', 'WebPreviewCard'],
};

// ============================================================================
// WORKFLOW COMPONENTS
// ============================================================================

export const workflowCanvasDoc: ComponentDoc = {
  name: 'WorkflowCanvas',
  description: 'ReactFlow-based canvas for building and visualizing workflow graphs.',
  category: 'Workflow',
  props: [
    { name: 'nodes', type: 'Node[]', required: false, description: 'Array of workflow nodes' },
    { name: 'edges', type: 'Edge[]', required: false, description: 'Array of workflow edges' },
    { name: 'onNodesChange', type: '(changes: NodeChange[]) => void', required: false, description: 'Node change handler' },
    { name: 'onEdgesChange', type: '(changes: EdgeChange[]) => void', required: false, description: 'Edge change handler' },
    { name: 'onConnect', type: 'OnConnect', required: false, description: 'Connection handler' },
    { name: 'showMiniMap', type: 'boolean', required: false, default: 'true', description: 'Show mini map' },
    { name: 'showControls', type: 'boolean', required: false, default: 'true', description: 'Show zoom controls' },
    { name: 'readOnly', type: 'boolean', required: false, default: 'false', description: 'Disable editing' },
  ],
  examples: [
    {
      title: 'Basic Workflow',
      code: `<WorkflowCanvas
  nodes={[
    { id: '1', type: 'workflow', position: { x: 0, y: 0 }, data: { label: 'Start' } },
    { id: '2', type: 'workflow', position: { x: 200, y: 0 }, data: { label: 'Process' } },
  ]}
  edges={[
    { id: 'e1-2', source: '1', target: '2' },
  ]}
/>`,
    },
  ],
  relatedComponents: ['WorkflowNode', 'WorkflowEdge', 'WorkflowControls'],
};

// ============================================================================
// EXPORT ALL DOCS
// ============================================================================

export const componentDocs: Record<string, ComponentDoc> = {
  Message: messageDoc,
  Conversation: conversationDoc,
  Loader: loaderDoc,
  ChainOfThought: chainOfThoughtDoc,
  Reasoning: reasoningDoc,
  Response: responseDoc,
  CodeBlock: codeBlockDoc,
  Sources: sourcesDoc,
  PromptInput: promptInputDoc,
  Suggestion: suggestionDoc,
  Plan: planDoc,
  Tool: toolDoc,
  Confirmation: confirmationDoc,
  Artifact: artifactDoc,
  WebPreview: webPreviewDoc,
  WorkflowCanvas: workflowCanvasDoc,
};
