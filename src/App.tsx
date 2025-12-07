import React, { useState } from 'react';
import {
  Message,
  Conversation,
  Loader,
  Shimmer,
  ChainOfThought,
  Reasoning,
  Response,
  Actions,
  useDefaultActions,
  CodeBlock,
  PromptInput,
} from './components/chatbot';
import { Artifact, WebPreview } from './components/vibe-coding';
import { WorkflowCanvas } from './components/workflow';
import { DocsPage, GuidelinesPage } from './pages';

// Demo data types
interface MessageType {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date;
  status?: 'sending' | 'sent' | 'error' | 'complete';
}

interface ReasoningStep {
  id: string;
  title: string;
  content?: string;
  status: 'pending' | 'thinking' | 'complete' | 'error';
  duration?: number;
}

// Demo data
const demoMessages: MessageType[] = [
  {
    id: '1',
    role: 'user',
    content: 'Can you help me understand how React hooks work?',
    timestamp: new Date(),
  },
  {
    id: '2',
    role: 'assistant',
    content: 'React Hooks are functions that let you "hook into" React state and lifecycle features from function components. They were introduced in React 16.8 and allow you to use state and other React features without writing a class.',
    timestamp: new Date(),
    status: 'complete',
  },
];

const demoReasoningSteps: ReasoningStep[] = [
  { id: '1', title: 'Analyzing query', content: 'Understanding the user question about React hooks', status: 'complete', duration: 120 },
  { id: '2', title: 'Searching knowledge', content: 'Looking up React hooks documentation and examples', status: 'complete', duration: 340 },
  { id: '3', title: 'Formulating response', content: 'Preparing a comprehensive explanation', status: 'thinking' },
];

const demoCode = `import { useState, useEffect } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);

  const increment = () => setCount(c => c + 1);
  const decrement = () => setCount(c => c - 1);
  const reset = () => setCount(initialValue);

  return { count, increment, decrement, reset };
}

export default useCounter;`;

const demoWorkflowNodes = [
  {
    id: '1',
    type: 'workflow',
    position: { x: 100, y: 100 },
    data: { label: 'Start', description: 'Trigger workflow', type: 'trigger', status: 'complete' },
  },
  {
    id: '2',
    type: 'workflow',
    position: { x: 350, y: 100 },
    data: { label: 'Process Data', description: 'Transform input', type: 'process', status: 'running', progress: 65 },
  },
  {
    id: '3',
    type: 'workflow',
    position: { x: 600, y: 100 },
    data: { label: 'AI Analysis', description: 'Generate insights', type: 'ai', status: 'pending' },
  },
];

const demoWorkflowEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'workflow', data: { status: 'complete' } },
  { id: 'e2-3', source: '2', target: '3', type: 'workflow', data: { status: 'active', animated: true } },
];

function App() {
  const [view, setView] = useState<'demo' | 'docs' | 'guidelines'>('docs');
  const [activeTab, setActiveTab] = useState<'chatbot' | 'vibe' | 'workflow'>('chatbot');
  const [inputValue, setInputValue] = useState('');

  const actions = useDefaultActions({
    onCopy: () => console.log('Copied!'),
    onLike: () => console.log('Liked!'),
    onDislike: () => console.log('Disliked!'),
    onRegenerate: () => console.log('Regenerating...'),
  });

  // Floating navigation for all views
  const FloatingNav = () => (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      {view !== 'docs' && (
        <button
          onClick={() => setView('docs')}
          className="px-4 py-2 min-h-[44px] bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 border border-gray-200 dark:border-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="View documentation"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span className="hidden sm:inline">Docs</span>
        </button>
      )}
      {view !== 'guidelines' && (
        <button
          onClick={() => setView('guidelines')}
          className="px-4 py-2 min-h-[44px] bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow-lg hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2 border border-gray-200 dark:border-gray-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="View UI/UX guidelines"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <span className="hidden sm:inline">Guidelines</span>
        </button>
      )}
      {view !== 'demo' && (
        <button
          onClick={() => setView('demo')}
          className="px-4 py-2 min-h-[44px] bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 flex items-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
          aria-label="View component demo"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
          <span className="hidden sm:inline">Demo</span>
        </button>
      )}
    </div>
  );

  // Show docs page
  if (view === 'docs') {
    return (
      <div>
        <FloatingNav />
        <DocsPage />
      </div>
    );
  }

  // Show guidelines page
  if (view === 'guidelines') {
    return (
      <div>
        <FloatingNav />
        <GuidelinesPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
              AI Components Library
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Pre-built components for AI-driven applications
            </p>
          </div>
          <button
            onClick={() => setView('docs')}
            className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Documentation
          </button>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-4 border-b border-gray-200 dark:border-gray-800">
            {(['chatbot', 'vibe', 'workflow'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                }`}
              >
                {tab === 'chatbot' && 'Chatbot Components'}
                {tab === 'vibe' && 'Vibe-Coding'}
                {tab === 'workflow' && 'Workflow'}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'chatbot' && (
          <div className="space-y-12">
            {/* Messages */}
            <Section title="Messages & Conversation">
              <div className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden">
                <Conversation messages={demoMessages} />
                <div className="p-4 border-t border-gray-200 dark:border-gray-800">
                  <PromptInput
                    value={inputValue}
                    onChange={setInputValue}
                    placeholder="Type a message..."
                    showModelSelector={false}
                  />
                </div>
              </div>
            </Section>

            {/* Loading States */}
            <Section title="Loading States">
              <div className="flex flex-wrap gap-6">
                <Loader variant="spinner" text="Loading..." />
                <Loader variant="dots" text="Processing..." />
                <Loader variant="pulse" />
                <Loader variant="typing" />
              </div>
              <div className="mt-6">
                <Shimmer lines={4} />
              </div>
            </Section>

            {/* Chain of Thought */}
            <Section title="Chain of Thought & Reasoning">
              <div className="grid md:grid-cols-2 gap-6">
                <ChainOfThought steps={demoReasoningSteps} />
                <Reasoning
                  content="The user is asking about React hooks, which are functions that let you use state and other React features in functional components. I should explain the core concepts including useState, useEffect, and custom hooks."
                  duration={1250}
                />
              </div>
            </Section>

            {/* Response with Actions */}
            <Section title="Response with Actions">
              <Response
                content="React Hooks are powerful features that allow you to use state and lifecycle methods in functional components. The most commonly used hooks are useState and useEffect."
                showActions
                onRegenerate={() => console.log('Regenerate')}
                onFeedback={(positive) => console.log('Feedback:', positive)}
              />
              <div className="mt-4">
                <Actions actions={actions} variant="default" />
              </div>
            </Section>

            {/* Code Block */}
            <Section title="Code Block">
              <CodeBlock
                code={demoCode}
                language="typescript"
                filename="useCounter.ts"
                showLineNumbers
                showCopyButton
              />
            </Section>
          </div>
        )}

        {activeTab === 'vibe' && (
          <div className="space-y-12">
            {/* Artifact */}
            <Section title="Code Artifact">
              <Artifact
                type="code"
                title="useCounter.ts"
                content={demoCode}
                language="typescript"
              />
            </Section>

            {/* Web Preview */}
            <Section title="Web Preview">
              <WebPreview
                html={`
                  <!DOCTYPE html>
                  <html>
                    <head>
                      <style>
                        body { font-family: system-ui; padding: 2rem; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; margin: 0; display: flex; align-items: center; justify-content: center; }
                        .card { background: white; padding: 2rem; border-radius: 1rem; box-shadow: 0 25px 50px -12px rgba(0,0,0,0.25); text-align: center; }
                        h1 { color: #1f2937; margin: 0 0 0.5rem; }
                        p { color: #6b7280; margin: 0; }
                      </style>
                    </head>
                    <body>
                      <div class="card">
                        <h1>Hello, AI Components!</h1>
                        <p>This is a live web preview</p>
                      </div>
                    </body>
                  </html>
                `}
                title="Live Preview"
                height={400}
              />
            </Section>
          </div>
        )}

        {activeTab === 'workflow' && (
          <div className="space-y-12">
            {/* Workflow Canvas */}
            <Section title="Workflow Canvas">
              <div className="h-[500px]">
                <WorkflowCanvas
                  nodes={demoWorkflowNodes}
                  edges={demoWorkflowEdges}
                  showMiniMap
                  showControls
                />
              </div>
            </Section>
          </div>
        )}
      </main>
      <FloatingNav />
    </div>
  );
}

// Section component
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default App;
