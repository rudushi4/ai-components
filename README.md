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
- **shadcn/ui Compatible** - Install components via CLI

## Installation

### Option 1: shadcn CLI (Recommended)

Install components directly using the shadcn CLI:

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

## Quick Start

```tsx
import { Conversation, PromptInput, Loader } from '@anthropic/ai-components';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (content) => {
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content }]);
    setIsLoading(true);

    const response = await callAI(content);

    setMessages(prev => [...prev, {
      id: Date.now(),
      role: 'assistant',
      content: response
    }]);
    setIsLoading(false);
  };

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
| **Media** | `AIImage`, `OpenInChat` |

### Vibe-Coding Components

| Component | Description |
|-----------|-------------|
| `Artifact` | Code/document display with syntax highlighting |
| `WebPreview` | Embedded web preview with device simulation |

### Workflow Components

| Component | Description |
|-----------|-------------|
| `WorkflowCanvas` | ReactFlow-based workflow builder |
| `WorkflowNode` | Customizable workflow nodes |
| `WorkflowEdge` | Animated edge connections |
| `WorkflowControls` | Zoom, fit, and lock controls |
| `WorkflowPanel` | Overlay panels for info/stats |
| `WorkflowToolbar` | Node type palette and tools |

## Hooks

```tsx
import {
  useBreakpoint,       // Check viewport breakpoint
  useIsMobile,         // Touch-primary detection
  useReducedMotion,    // Honor prefers-reduced-motion
  useFocusTrap,        // Modal focus management
  useArrowNavigation,  // Keyboard navigation for lists
  useFormSubmit,       // Loading state + idempotency
  useUnsavedChanges,   // Warn before navigation
  useTooltipDelay,     // Group tooltip timing
} from '@anthropic/ai-components';
```

## Design System Utilities

```tsx
import {
  breakpoints,    // Responsive breakpoint values
  focusRing,      // Accessible focus ring classes
  hitTargets,     // Minimum hit target sizes
  animations,     // Animation duration/easing tokens
  shadows,        // Layered shadow values
  zIndex,         // Z-index scale
  aria,           // ARIA attribute helpers
} from '@anthropic/ai-components';
```

## Tailwind Configuration

Add AI Components to your Tailwind config:

```js
// tailwind.config.js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@anthropic/ai-components/**/*.js',
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [require('tailwindcss-animate')],
}
```

## UI/UX Guidelines

This library follows strict UI/UX guidelines using **MUST/SHOULD/NEVER** rules:

### Interactions

- **MUST**: Hit target >=24px (mobile >=44px)
- **MUST**: Visible focus rings (`:focus-visible`)
- **MUST**: Full keyboard support per WAI-ARIA APG
- **NEVER**: Block paste in inputs
- **NEVER**: Disable browser zoom

### Animation

- **MUST**: Honor `prefers-reduced-motion`
- **MUST**: Animate only `transform` and `opacity`
- **SHOULD**: Animations are interruptible

### Accessibility

- **MUST**: Tabular numbers for comparisons
- **MUST**: Icon-only buttons have `aria-label`
- **MUST**: Use ellipsis character (U+2026) not three dots
- **MUST**: Non-breaking spaces for units: `10 MB`

[View full guidelines in the docs](https://jyy0jpax8d16.space.minimax.io)

## Browser Support

- Chrome/Edge 88+
- Firefox 78+
- Safari 14+

## Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) first.

```bash
# Clone the repo
git clone https://github.com/rudushi4/ai-components.git

# Install dependencies
pnpm install

# Start development server
pnpm dev

# Build for production
pnpm build
```

## License

MIT License - see [LICENSE](LICENSE) for details.

---

Built with React, TypeScript, and Tailwind CSS.
