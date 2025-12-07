# AI Components

> Pre-built, accessible, responsive React components for building AI-native applications.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue.svg)](https://tailwindcss.com/)

**[Live Demo & Docs](https://jyy0jpax8d16.space.minimax.io)** · **[GitHub](https://github.com/rudushi4/ai-components)**

---

## ✨ Features

- **30+ Pre-built Components** - Chatbot, Vibe-Coding, and Workflow components
- **Accessible by Default** - WAI-ARIA compliant with full keyboard support
- **Responsive** - Mobile-first with proper hit targets (44px touch, 24px desktop)
- **Reduced Motion Support** - Honors `prefers-reduced-motion`
- **Dark Mode** - Built-in dark mode support
- **TypeScript** - Full type safety with comprehensive types
- **Tailwind CSS** - Easily customizable with Tailwind utilities
- **shadcn/ui Compatible** - Install components via CLI

---

## 🚀 Quick Start

### 1. Install via shadcn CLI (Recommended)

```bash
# Install all components at once
npx shadcn@latest add https://rudushi4.github.io/ai-components/all.json
```

### 2. Create Your First Chat App

```tsx
import { useState } from 'react';
import { Conversation, PromptInput, Message } from '@/components/chatbot';

type MessageType = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
};

export default function ChatApp() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (content: string) => {
    // Add user message
    const userMessage: MessageType = {
      id: crypto.randomUUID(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    // Call your AI API
    const response = await fetch('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message: content }),
    }).then(r => r.json());

    // Add assistant message
    const assistantMessage: MessageType = {
      id: crypto.randomUUID(),
      role: 'assistant',
      content: response.text,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      <header className="p-4 border-b">
        <h1 className="text-xl font-semibold">AI Chat</h1>
      </header>
      
      <Conversation 
        messages={messages} 
        isLoading={isLoading}
        className="flex-1"
      />
      
      <div className="p-4 border-t">
        <PromptInput 
          onSubmit={handleSubmit} 
          isLoading={isLoading}
          placeholder="Ask me anything..."
        />
      </div>
    </div>
  );
}
```

### 3. Add Streaming Response with Reasoning

```tsx
import { Response, Reasoning, ChainOfThought } from '@/components/chatbot';

function StreamingResponse({ stream }) {
  return (
    <div className="space-y-4">
      {/* Show AI thinking process */}
      <Reasoning 
        content={stream.reasoning}
        isStreaming={stream.isThinking}
        title="Thinking..."
      />
      
      {/* Show step-by-step chain of thought */}
      <ChainOfThought 
        steps={stream.steps}
        collapsible
      />
      
      {/* Final response */}
      <Response 
        content={stream.content}
        isStreaming={stream.isStreaming}
        showActions
        onRegenerate={() => regenerate()}
        onFeedback={(liked) => submitFeedback(liked)}
      />
    </div>
  );
}
```

---

## 📦 Installation Options

### Option 1: shadcn CLI (Recommended)

```bash
# Install all components
npx shadcn@latest add https://rudushi4.github.io/ai-components/all.json

# Or install individual components
npx shadcn@latest add https://rudushi4.github.io/ai-components/r/message.json
npx shadcn@latest add https://rudushi4.github.io/ai-components/r/conversation.json
npx shadcn@latest add https://rudushi4.github.io/ai-components/r/prompt-input.json
npx shadcn@latest add https://rudushi4.github.io/ai-components/r/code-block.json
npx shadcn@latest add https://rudushi4.github.io/ai-components/r/artifact.json
npx shadcn@latest add https://rudushi4.github.io/ai-components/r/workflow-canvas.json
```

### Option 2: Package Install

```bash
npm install @anthropic/ai-components
# or
pnpm add @anthropic/ai-components
# or
yarn add @anthropic/ai-components
```

### Peer Dependencies

```bash
npm install react react-dom tailwindcss
# For workflow components:
npm install @xyflow/react
# For animations:
npm install framer-motion
```

---

## 🧩 Chatbot Components

### Core Components

| Component | Description | Source |
|-----------|-------------|--------|
| **`Message`** | Single chat message with avatar, content, timestamp, and status | [`src/components/chatbot/message.tsx`](src/components/chatbot/message.tsx) |
| **`Conversation`** | Scrollable message container with auto-scroll and loading states | [`src/components/chatbot/conversation.tsx`](src/components/chatbot/conversation.tsx) |
| **`Loader`** | Multiple loading variants: spinner, dots, pulse, typing | [`src/components/chatbot/loader.tsx`](src/components/chatbot/loader.tsx) |
| **`Shimmer`** | Skeleton loading animation for content placeholders | [`src/components/chatbot/shimmer.tsx`](src/components/chatbot/shimmer.tsx) |

<details>
<summary><strong>📖 Message API</strong></summary>

```tsx
interface MessageProps {
  message: {
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    timestamp?: Date;
    status?: 'sending' | 'sent' | 'error';
  };
  showAvatar?: boolean;  // default: true
  className?: string;
  children?: ReactNode;  // Custom content
}

// Usage
<Message 
  message={{
    id: '1',
    role: 'assistant',
    content: 'Hello! How can I help you today?',
    timestamp: new Date(),
  }}
  showAvatar
/>
```
</details>

<details>
<summary><strong>📖 Conversation API</strong></summary>

```tsx
interface ConversationProps {
  messages?: MessageType[];
  conversation?: { id: string; messages: MessageType[] };
  isLoading?: boolean;       // Show loading indicator
  autoScroll?: boolean;      // Auto-scroll to new messages (default: true)
  emptyState?: ReactNode;    // Content when no messages
  renderMessage?: (msg: MessageType) => ReactNode;  // Custom renderer
  className?: string;
}

// Usage with custom empty state
<Conversation
  messages={messages}
  isLoading={isGenerating}
  emptyState={
    <div className="text-center p-8">
      <h2>Welcome! Ask me anything.</h2>
      <SuggestionCards onSelect={handleSelect} />
    </div>
  }
/>
```
</details>

---

### AI Display Components

| Component | Description | Source |
|-----------|-------------|--------|
| **`Response`** | Formatted AI response with copy, regenerate, and feedback actions | [`src/components/chatbot/response.tsx`](src/components/chatbot/response.tsx) |
| **`Reasoning`** | Collapsible thinking/reasoning block with streaming support | [`src/components/chatbot/reasoning.tsx`](src/components/chatbot/reasoning.tsx) |
| **`ChainOfThought`** | Step-by-step reasoning visualization with status indicators | [`src/components/chatbot/chain-of-thought.tsx`](src/components/chatbot/chain-of-thought.tsx) |
| **`Actions`** | Action button group: copy, regenerate, like, dislike | [`src/components/chatbot/actions.tsx`](src/components/chatbot/actions.tsx) |

<details>
<summary><strong>📖 Response API</strong></summary>

```tsx
interface ResponseProps {
  content: string;
  isStreaming?: boolean;    // Show streaming cursor
  showActions?: boolean;    // Show action buttons (default: true)
  onCopy?: () => void;
  onRegenerate?: () => void;
  onFeedback?: (positive: boolean) => void;
  className?: string;
}

// Usage
<Response
  content={assistantResponse}
  isStreaming={isGenerating}
  showActions
  onRegenerate={() => regenerateResponse()}
  onFeedback={(liked) => {
    analytics.track('feedback', { liked });
  }}
/>
```
</details>

<details>
<summary><strong>📖 ChainOfThought API</strong></summary>

```tsx
interface ReasoningStep {
  id: string;
  title: string;
  content?: string;
  status: 'pending' | 'thinking' | 'complete' | 'error';
  duration?: number;  // ms
}

interface ChainOfThoughtProps {
  steps: ReasoningStep[];
  title?: string;           // default: 'Thinking...'
  collapsible?: boolean;    // default: true
  defaultExpanded?: boolean; // default: true
  className?: string;
}

// Usage
<ChainOfThought
  steps={[
    { id: '1', title: 'Understanding query', status: 'complete', duration: 120 },
    { id: '2', title: 'Searching knowledge base', status: 'complete', duration: 340 },
    { id: '3', title: 'Formulating response', status: 'thinking' },
  ]}
  collapsible
/>
```
</details>

---

### Code Components

| Component | Description | Source |
|-----------|-------------|--------|
| **`CodeBlock`** | Syntax-highlighted code with line numbers, copy, and run buttons | [`src/components/chatbot/code-block.tsx`](src/components/chatbot/code-block.tsx) |

<details>
<summary><strong>📖 CodeBlock API</strong></summary>

```tsx
interface CodeBlockProps {
  code: string;
  language?: string;        // default: 'text'
  filename?: string;        // Optional filename header
  showLineNumbers?: boolean; // default: true
  showCopyButton?: boolean;  // default: true
  showRunButton?: boolean;   // default: false
  theme?: 'dark' | 'light' | 'auto'; // default: 'dark'
  maxHeight?: number;        // default: 400
  highlightLines?: number[]; // Lines to highlight
  onRun?: () => void;
  onCopy?: () => void;
  className?: string;
}

// Usage
<CodeBlock
  code={`function greet(name: string) {
  return \`Hello, \${name}!\`;
}`}
  language="typescript"
  filename="greeting.ts"
  showRunButton
  onRun={() => executeCode()}
  highlightLines={[2]}
/>
```
</details>

---

### Input Components

| Component | Description | Source |
|-----------|-------------|--------|
| **`PromptInput`** | Advanced textarea with model selector, attachments, voice input | [`src/components/chatbot/prompt-input.tsx`](src/components/chatbot/prompt-input.tsx) |

<details>
<summary><strong>📖 PromptInput API</strong></summary>

```tsx
interface Model {
  id: string;
  name: string;
  description?: string;
}

interface Attachment {
  id: string;
  name: string;
  type: string;
  size: number;
  url?: string;
}

interface PromptInputProps {
  value?: string;
  placeholder?: string;      // default: 'Type a message...'
  disabled?: boolean;
  isLoading?: boolean;       // Shows stop button when true
  models?: Model[];
  selectedModel?: Model;
  showModelSelector?: boolean; // default: true
  showAttachments?: boolean;   // default: true
  showVoiceInput?: boolean;    // default: false
  maxLength?: number;
  onSubmit?: (value: string, attachments?: Attachment[]) => void;
  onStop?: () => void;
  onModelChange?: (model: Model) => void;
  className?: string;
}

// Usage
<PromptInput
  models={[
    { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Most capable' },
    { id: 'claude-3-sonnet', name: 'Claude 3 Sonnet', description: 'Balanced' },
    { id: 'claude-3-haiku', name: 'Claude 3 Haiku', description: 'Fastest' },
  ]}
  selectedModel={selectedModel}
  onModelChange={setSelectedModel}
  onSubmit={handleSubmit}
  onStop={handleStop}
  isLoading={isGenerating}
  showAttachments
  showVoiceInput
/>
```
</details>

---

## 🎨 Vibe-Coding Components

| Component | Description | Source |
|-----------|-------------|--------|
| **`Artifact`** | Code/document display with syntax highlighting, preview, download | [`src/components/vibe-coding/artifact.tsx`](src/components/vibe-coding/artifact.tsx) |
| **`WebPreview`** | Embedded web preview with device simulation (mobile/tablet/desktop) | [`src/components/vibe-coding/web-preview.tsx`](src/components/vibe-coding/web-preview.tsx) |

<details>
<summary><strong>📖 Artifact API</strong></summary>

```tsx
type ArtifactType = 'code' | 'document' | 'html' | 'markdown' | 'json' | 'svg' | 'csv';

interface ArtifactProps {
  type: ArtifactType;
  title: string;
  content: string;
  language?: string;
  showPreview?: boolean;     // Show preview tab for HTML/SVG (default: true)
  collapsible?: boolean;     // default: true
  defaultExpanded?: boolean; // default: true
  maxHeight?: number;        // default: 500
  onRun?: () => void;
  onDownload?: () => void;
  onCopy?: () => void;
  className?: string;
}

// Usage
<Artifact
  type="html"
  title="landing-page.html"
  content={htmlContent}
  showPreview
  onRun={() => openInNewTab()}
/>
```
</details>

<details>
<summary><strong>📖 WebPreview API</strong></summary>

```tsx
type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'responsive';

interface WebPreviewProps {
  url?: string;              // URL to preview
  html?: string;             // Or raw HTML content
  title?: string;            // default: 'Web Preview'
  defaultDevice?: DeviceType; // default: 'responsive'
  showDeviceToggle?: boolean; // default: true
  showToolbar?: boolean;      // default: true
  height?: number | string;   // default: 500
  sandbox?: string;           // iframe sandbox attrs
  onLoad?: () => void;
  onError?: (error: Error) => void;
  className?: string;
}

// Usage
<WebPreview
  html={generatedHtml}
  defaultDevice="mobile"
  showDeviceToggle
  height={600}
/>
```
</details>

---

## 🔀 Workflow Components

| Component | Description | Source |
|-----------|-------------|--------|
| **`WorkflowCanvas`** | ReactFlow-based workflow builder with drag-and-drop | [`src/components/workflow/canvas.tsx`](src/components/workflow/canvas.tsx) |
| **`WorkflowNode`** | Customizable workflow nodes with icons and status | [`src/components/workflow/node.tsx`](src/components/workflow/node.tsx) |
| **`WorkflowEdge`** | Animated edge connections with labels | [`src/components/workflow/edge.tsx`](src/components/workflow/edge.tsx) |
| **`WorkflowControls`** | Zoom, fit, and lock controls | [`src/components/workflow/controls.tsx`](src/components/workflow/controls.tsx) |
| **`WorkflowPanel`** | Overlay panels for workflow info/stats | [`src/components/workflow/panel.tsx`](src/components/workflow/panel.tsx) |
| **`WorkflowToolbar`** | Node type palette and action buttons | [`src/components/workflow/toolbar.tsx`](src/components/workflow/toolbar.tsx) |

<details>
<summary><strong>📖 WorkflowCanvas API</strong></summary>

```tsx
import { Node, Edge, OnConnect, NodeChange, EdgeChange } from '@xyflow/react';

interface WorkflowCanvasProps {
  nodes?: Node[];
  edges?: Edge[];
  onNodesChange?: (changes: NodeChange[]) => void;
  onEdgesChange?: (changes: EdgeChange[]) => void;
  onConnect?: OnConnect;
  showMiniMap?: boolean;     // default: true
  showControls?: boolean;    // default: true
  readOnly?: boolean;        // default: false
  className?: string;
}

// Usage
<WorkflowCanvas
  nodes={[
    { id: '1', type: 'workflow', position: { x: 0, y: 0 }, data: { label: 'Start', icon: 'play' } },
    { id: '2', type: 'workflow', position: { x: 200, y: 0 }, data: { label: 'Process', icon: 'cog' } },
    { id: '3', type: 'workflow', position: { x: 400, y: 0 }, data: { label: 'End', icon: 'check' } },
  ]}
  edges={[
    { id: 'e1-2', source: '1', target: '2', animated: true },
    { id: 'e2-3', source: '2', target: '3' },
  ]}
  onNodesChange={onNodesChange}
  onEdgesChange={onEdgesChange}
  onConnect={onConnect}
/>
```
</details>

---

## 🪝 Hooks

| Hook | Description | Source |
|------|-------------|--------|
| **`useBreakpoint`** | Check if viewport matches a breakpoint | [`src/hooks/useResponsive.ts`](src/hooks/useResponsive.ts) |
| **`useIsMobile`** | Detect touch-primary devices | [`src/hooks/useResponsive.ts`](src/hooks/useResponsive.ts) |
| **`useReducedMotion`** | Honor prefers-reduced-motion | [`src/hooks/useResponsive.ts`](src/hooks/useResponsive.ts) |
| **`useFocusTrap`** | Trap focus within modals/dialogs | [`src/hooks/useResponsive.ts`](src/hooks/useResponsive.ts) |
| **`useArrowNavigation`** | Arrow key navigation for lists | [`src/hooks/useResponsive.ts`](src/hooks/useResponsive.ts) |
| **`useFormSubmit`** | Loading state with idempotency | [`src/hooks/useResponsive.ts`](src/hooks/useResponsive.ts) |
| **`useUnsavedChanges`** | Warn before navigation | [`src/hooks/useResponsive.ts`](src/hooks/useResponsive.ts) |
| **`useTooltipDelay`** | Group tooltip timing | [`src/hooks/useResponsive.ts`](src/hooks/useResponsive.ts) |

```tsx
import {
  useBreakpoint,
  useIsMobile,
  useReducedMotion,
  useFocusTrap,
  useArrowNavigation,
  useFormSubmit,
  useUnsavedChanges,
  useTooltipDelay,
} from '@/hooks/useResponsive';

// Example: Responsive component
function ResponsiveNav() {
  const isMobile = useIsMobile();
  const isLg = useBreakpoint('lg');
  const reducedMotion = useReducedMotion();

  return (
    <nav className={isMobile ? 'mobile-nav' : 'desktop-nav'}>
      {/* Render different UI based on device */}
    </nav>
  );
}
```

---

## 🎨 Design System

| Export | Description | Source |
|--------|-------------|--------|
| **`breakpoints`** | Responsive breakpoint values (xs-3xl) | [`src/lib/design-system.ts`](src/lib/design-system.ts) |
| **`focusRing`** | Accessible focus ring classes | [`src/lib/design-system.ts`](src/lib/design-system.ts) |
| **`hitTargets`** | Minimum hit target sizes | [`src/lib/design-system.ts`](src/lib/design-system.ts) |
| **`animations`** | Duration/easing tokens | [`src/lib/design-system.ts`](src/lib/design-system.ts) |
| **`shadows`** | Layered shadow values | [`src/lib/design-system.ts`](src/lib/design-system.ts) |
| **`zIndex`** | Z-index scale | [`src/lib/design-system.ts`](src/lib/design-system.ts) |
| **`aria`** | ARIA attribute helpers | [`src/lib/design-system.ts`](src/lib/design-system.ts) |
| **`trapFocus`** | Focus trap utility | [`src/lib/design-system.ts`](src/lib/design-system.ts) |

```tsx
import {
  breakpoints,
  focusRing,
  hitTargets,
  animations,
  shadows,
  zIndex,
  aria,
  trapFocus,
} from '@/lib/design-system';

// Example: Custom button with proper focus ring
function Button({ children, ...props }) {
  return (
    <button
      className={`
        min-h-[${hitTargets.mobile}px] min-w-[${hitTargets.mobile}px]
        ${focusRing.default}
        transition-transform duration-[${animations.duration.fast}ms]
      `}
      {...props}
    >
      {children}
    </button>
  );
}
```

---

## ⚙️ Tailwind Configuration

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@anthropic/ai-components/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        fadeIn: { from: { opacity: 0 }, to: { opacity: 1 } },
        slideUp: { from: { transform: 'translateY(10px)', opacity: 0 }, to: { transform: 'translateY(0)', opacity: 1 } },
        scaleIn: { from: { transform: 'scale(0.95)', opacity: 0 }, to: { transform: 'scale(1)', opacity: 1 } },
        'pulse-gentle': { '0%, 100%': { opacity: 1 }, '50%': { opacity: 0.7 } },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
        slideUp: 'slideUp 0.2s ease-out',
        scaleIn: 'scaleIn 0.2s ease-out',
        'pulse-gentle': 'pulse-gentle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
```

---

## 📋 UI/UX Guidelines

This library follows strict MUST/SHOULD/NEVER rules:

### ✅ MUST

| Rule | Implementation |
|------|----------------|
| Hit target ≥24px (mobile ≥44px) | `hitTargets.desktop`, `hitTargets.mobile` |
| Visible focus rings | `focusRing.default`, `:focus-visible` |
| Full keyboard support | WAI-ARIA APG patterns |
| Honor `prefers-reduced-motion` | `useReducedMotion()`, `motion-reduce:` |
| Tabular numbers for comparisons | `[font-variant-numeric:tabular-nums]` |
| Icon-only buttons have `aria-label` | Required prop validation |
| Use ellipsis character (U+2026) | `typography.ellipsis` |
| Non-breaking spaces for units | `formatWithNbsp()` |

### ❌ NEVER

- Block paste in inputs
- Disable browser zoom
- Use three dots instead of ellipsis
- Skip focus management in modals

---

## 🌐 Browser Support

| Browser | Version |
|---------|--------|
| Chrome/Edge | 88+ |
| Firefox | 78+ |
| Safari | 14+ |

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

```bash
git clone https://github.com/rudushi4/ai-components.git
cd ai-components
pnpm install
pnpm dev
```

---

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS.
