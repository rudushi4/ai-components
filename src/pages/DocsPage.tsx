import React, { useState } from 'react';
import { componentDocs, ComponentDoc } from '../docs/component-docs';

// Icons as SVG components
const ChevronRightIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const CopyIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
  </svg>
);

const CheckIcon = () => (
  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

interface NavItem {
  category: string;
  components: string[];
}

const navigation: NavItem[] = [
  {
    category: 'Getting Started',
    components: ['Installation', 'Quick Start', 'Theming'],
  },
  {
    category: 'Chatbot > Core',
    components: ['Message', 'Conversation', 'Loader'],
  },
  {
    category: 'Chatbot > AI Display',
    components: ['ChainOfThought', 'Reasoning', 'Response'],
  },
  {
    category: 'Chatbot > Code',
    components: ['CodeBlock', 'Sources'],
  },
  {
    category: 'Chatbot > Input',
    components: ['PromptInput', 'Suggestion'],
  },
  {
    category: 'Chatbot > Advanced',
    components: ['Plan', 'Tool', 'Confirmation'],
  },
  {
    category: 'Vibe-Coding',
    components: ['Artifact', 'WebPreview'],
  },
  {
    category: 'Workflow',
    components: ['WorkflowCanvas'],
  },
];

function CodeBlock({ code, language = 'tsx' }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative group">
      <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
        <code>{code}</code>
      </pre>
      <button
        onClick={handleCopy}
        className="absolute top-2 right-2 p-2 bg-gray-800 hover:bg-gray-700 rounded opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <CheckIcon /> : <CopyIcon />}
      </button>
    </div>
  );
}

function PropTable({ props }: { props: ComponentDoc['props'] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Prop</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Type</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Default</th>
            <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop) => (
            <tr key={prop.name} className="border-b border-gray-100 dark:border-gray-800">
              <td className="py-3 px-4">
                <code className="text-pink-600 dark:text-pink-400 bg-pink-50 dark:bg-pink-900/30 px-1.5 py-0.5 rounded">
                  {prop.name}
                </code>
                {prop.required && (
                  <span className="ml-2 text-xs text-red-500">required</span>
                )}
              </td>
              <td className="py-3 px-4">
                <code className="text-blue-600 dark:text-blue-400 text-xs">
                  {prop.type}
                </code>
              </td>
              <td className="py-3 px-4 text-gray-500 dark:text-gray-400">
                {prop.default || '-'}
              </td>
              <td className="py-3 px-4 text-gray-600 dark:text-gray-300">
                {prop.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ComponentDocView({ doc }: { doc: ComponentDoc }) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-2">
          <span>{doc.category}</span>
        </div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          {doc.name}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          {doc.description}
        </p>
      </div>

      {/* Installation */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Import
        </h2>
        <CodeBlock code={`import { ${doc.name} } from '@anthropic/ai-components';`} />
      </section>

      {/* Examples */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Examples
        </h2>
        <div className="space-y-6">
          {doc.examples.map((example, i) => (
            <div key={i}>
              <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-2">
                {example.title}
              </h3>
              {example.description && (
                <p className="text-gray-600 dark:text-gray-400 mb-3">
                  {example.description}
                </p>
              )}
              <CodeBlock code={example.code} />
            </div>
          ))}
        </div>
      </section>

      {/* Props */}
      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Props
        </h2>
        <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
          <PropTable props={doc.props} />
        </div>
      </section>

      {/* Related Components */}
      {doc.relatedComponents && doc.relatedComponents.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Related Components
          </h2>
          <div className="flex flex-wrap gap-2">
            {doc.relatedComponents.map((name) => (
              <span
                key={name}
                className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full text-sm"
              >
                {name}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function InstallationPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Installation
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Get started with AI Components in your React project.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Install via shadcn CLI (Recommended)
        </h2>
        <div className="space-y-3">
          <CodeBlock code="npx shadcn@latest add https://rudushi4.github.io/ai-components/all.json" language="bash" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Or install individual components
        </h2>
        <div className="space-y-3">
          <CodeBlock code={`npx shadcn@latest add https://rudushi4.github.io/ai-components/r/message.json
npx shadcn@latest add https://rudushi4.github.io/ai-components/r/conversation.json
npx shadcn@latest add https://rudushi4.github.io/ai-components/r/prompt-input.json`} language="bash" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Or install the package
        </h2>
        <div className="space-y-3">
          <p className="text-gray-600 dark:text-gray-400">Using npm:</p>
          <CodeBlock code="npm install @anthropic/ai-components" language="bash" />
          <p className="text-gray-600 dark:text-gray-400">Using pnpm:</p>
          <CodeBlock code="pnpm add @anthropic/ai-components" language="bash" />
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Peer Dependencies
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          AI Components requires the following peer dependencies:
        </p>
        <CodeBlock
          code={`npm install react react-dom tailwindcss
# For workflow components:
npm install @xyflow/react
# For animations:
npm install framer-motion`}
          language="bash"
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Configure Tailwind CSS
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          Add AI Components to your Tailwind config:
        </p>
        <CodeBlock
          code={`// tailwind.config.js
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
}`}
        />
      </section>
    </div>
  );
}

function QuickStartPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Quick Start
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Build your first AI chat interface in minutes.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Basic Chat Interface
        </h2>
        <CodeBlock
          code={`import { useState } from 'react';
import {
  Conversation,
  PromptInput,
  Message,
  Loader,
} from '@anthropic/ai-components';

function ChatApp() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (content) => {
    // Add user message
    const userMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Call your AI API here
    const response = await callAI(content);

    // Add assistant message
    const assistantMessage = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: response,
      timestamp: new Date(),
      status: 'complete',
    };
    setMessages((prev) => [...prev, assistantMessage]);
    setIsLoading(false);
  };

  return (
    <div className="flex flex-col h-screen">
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
}`}
        />
      </section>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Adding AI Features
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          Enhance your chat with reasoning displays and tool calls:
        </p>
        <CodeBlock
          code={`import {
  ChainOfThought,
  Tool,
  Response,
  Sources,
} from '@anthropic/ai-components';

function AIResponse({ response }) {
  return (
    <div className="space-y-4">
      {/* Show reasoning process */}
      {response.reasoning && (
        <ChainOfThought
          steps={response.reasoning}
          title="Thinking..."
        />
      )}

      {/* Show tool calls */}
      {response.toolCalls?.map((tool) => (
        <Tool key={tool.id} tool={tool} />
      ))}

      {/* Show response with actions */}
      <Response
        content={response.content}
        showActions
        onRegenerate={() => regenerate()}
        onFeedback={(liked) => submitFeedback(liked)}
      />

      {/* Show sources */}
      {response.sources && (
        <Sources sources={response.sources} />
      )}
    </div>
  );
}`}
        />
      </section>
    </div>
  );
}

function ThemingPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Theming
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          Customize the look and feel of AI Components.
        </p>
      </div>

      <section>
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Dark Mode
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-3">
          AI Components support dark mode out of the box. Toggle dark mode by adding the <code className="text-pink-600">dark</code> class to your HTML element:
        </p>
        <CodeBlock
          code={`// Toggle dark mode
document.documentElement.classList.toggle('dark');

// Or use a theme provider
function ThemeProvider({ children }) {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}`}
        />
      </section>
    </div>
  );
}

export default function DocsPage() {
  const [selectedComponent, setSelectedComponent] = useState<string>('Installation');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    if (selectedComponent === 'Installation') {
      return <InstallationPage />;
    }
    if (selectedComponent === 'Quick Start') {
      return <QuickStartPage />;
    }
    if (selectedComponent === 'Theming') {
      return <ThemingPage />;
    }

    const doc = componentDocs[selectedComponent];
    if (doc) {
      return <ComponentDocView doc={doc} />;
    }

    return (
      <div className="text-center py-12">
        <p className="text-gray-500 dark:text-gray-400">
          Documentation for {selectedComponent} coming soon.
        </p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">
              AI Components
            </h1>
            <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-medium rounded">
              v1.0.0
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/rudushi4/ai-components"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0012 2z" />
              </svg>
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside
          className={`${
            sidebarOpen ? 'block' : 'hidden'
          } lg:block w-64 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 min-h-[calc(100vh-65px)] sticky top-[65px] overflow-y-auto`}
        >
          <nav className="p-4 space-y-6">
            {navigation.map((section) => (
              <div key={section.category}>
                <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                  {section.category}
                </h3>
                <ul className="space-y-1">
                  {section.components.map((component) => (
                    <li key={component}>
                      <button
                        onClick={() => setSelectedComponent(component)}
                        className={`w-full flex items-center justify-between px-3 py-2 text-sm rounded-lg transition-colors ${
                          selectedComponent === component
                            ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                        }`}
                      >
                        <span>{component}</span>
                        {selectedComponent === component && <ChevronRightIcon />}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 min-w-0">
          <div className="max-w-3xl">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
}
