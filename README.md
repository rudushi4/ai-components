# AI Components

> Pre-built, accessible, responsive React components for building AI-native applications.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

**[Live Demo & Docs](https://jyy0jpax8d16.space.minimax.io)**

## Features

- **30+ Pre-built Components** - Chatbot, Vibe-Coding, and Workflow components
- **Accessible by Default** - WAI-ARIA compliant with full keyboard support
- **Responsive** - Mobile-first with proper hit targets (44px touch, 24px desktop)
- **Reduced Motion Support** - Honors `prefers-reduced-motion`
- **Dark Mode** - Built-in dark mode support
- **TypeScript** - Full type safety with comprehensive types
- **Tailwind CSS** - Easily customizable with Tailwind utilities

## Installation

```bash
npm install @anthropic/ai-components
# or
pnpm add @anthropic/ai-components
```

## Quick Start

```tsx
import { Conversation, PromptInput } from '@anthropic/ai-components';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="flex flex-col h-screen">
      <Conversation messages={messages} isLoading={isLoading} />
      <PromptInput onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
```

## Components

### Chatbot Components

| Category | Components |
|----------|------------|
| **Core** | `Message`, `Conversation`, `Loader`, `Shimmer` |
| **AI Display** | `ChainOfThought`, `Reasoning`, `Response`, `Actions` |
| **Code** | `CodeBlock`, `Context`, `InlineCitation`, `Sources` |
| **Input** | `PromptInput`, `Suggestion`, `Queue` |
| **Advanced** | `Branch`, `Plan`, `Task`, `Tool`, `Confirmation` |

### Vibe-Coding Components

- `Artifact` - Code/document display with syntax highlighting
- `WebPreview` - Embedded web preview with device simulation

### Workflow Components

- `WorkflowCanvas` - ReactFlow-based workflow builder
- `WorkflowNode`, `WorkflowEdge`, `WorkflowControls`

## Hooks

```tsx
import {
  useBreakpoint,
  useIsMobile,
  useReducedMotion,
  useFocusTrap,
  useArrowNavigation,
  useFormSubmit,
  useUnsavedChanges,
} from '@anthropic/ai-components';
```

## UI/UX Guidelines

- **MUST**: Hit target >=24px (mobile >=44px)
- **MUST**: Visible focus rings
- **MUST**: Honor `prefers-reduced-motion`
- **NEVER**: Block paste in inputs
- **NEVER**: Disable browser zoom

[View full guidelines](https://jyy0jpax8d16.space.minimax.io)

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with React, TypeScript, and Tailwind CSS.
