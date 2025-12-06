import React, { useState } from 'react';
import {
  Message, Conversation, Loader, Shimmer, ChainOfThought, Reasoning, Response, Actions, useDefaultActions,
  CodeBlock, Context, InlineCitation, Sources, PromptInput, Suggestion, Plan, Task, Tool, Confirmation,
  OpenInChat, Artifact, WebPreview, WorkflowCanvas,
} from './components';
import { DocsPage, GuidelinesPage } from './pages';
import type { Message as MessageType, Source, ReasoningStep, ToolCall, Plan as PlanType, ConfirmationRequest, Suggestion as SuggestionType } from './types';

const demoMessages: MessageType[] = [
  { id: '1', role: 'user', content: 'Can you help me understand how React hooks work?', timestamp: new Date() },
  { id: '2', role: 'assistant', content: 'React Hooks are functions that let you "hook into" React state and lifecycle features from function components.', timestamp: new Date(), status: 'complete' },
];

const demoSources: Source[] = [
  { id: '1', title: 'React Documentation - Hooks', url: 'https://react.dev/reference/react', snippet: 'Official React documentation for Hooks API' },
  { id: '2', title: 'Understanding React Hooks', url: 'https://example.com/hooks', snippet: 'A comprehensive guide to React Hooks' },
];

const demoReasoningSteps: ReasoningStep[] = [
  { id: '1', title: 'Analyzing query', content: 'Understanding the user question about React hooks', status: 'complete', duration: 120 },
  { id: '2', title: 'Searching knowledge', content: 'Looking up React hooks documentation', status: 'complete', duration: 340 },
  { id: '3', title: 'Formulating response', content: 'Preparing a comprehensive explanation', status: 'thinking' },
];

const demoToolCalls: ToolCall[] = [{ id: '1', name: 'search_documentation', status: 'complete', input: { query: 'React hooks' }, output: { results: 15 }, duration: 245 }];

const demoPlan: PlanType = {
  id: '1', title: 'Build React Application', description: 'Create a new React app', status: 'in_progress',
  tasks: [
    { id: '1', title: 'Set up project structure', status: 'completed' },
    { id: '2', title: 'Install dependencies', status: 'completed' },
    { id: '3', title: 'Create components', status: 'in_progress', progress: 60 },
    { id: '4', title: 'Add styling', status: 'pending' },
  ],
};

const demoConfirmation: ConfirmationRequest = { id: '1', title: 'Execute Database Migration', description: 'This will modify your database schema.', tool: 'run_migration', input: { version: '2.0' }, status: 'pending' };
const demoSuggestions: SuggestionType[] = [{ id: '1', text: 'Explain useEffect hook', category: 'code' }, { id: '2', text: 'Show useState examples', category: 'code' }];

const demoCode = `import { useState } from 'react';

function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  return { count, increment: () => setCount(c => c + 1) };
}`;

const demoWorkflowNodes = [
  { id: '1', type: 'workflow', position: { x: 100, y: 100 }, data: { label: 'Start', type: 'trigger', status: 'complete' } },
  { id: '2', type: 'workflow', position: { x: 350, y: 100 }, data: { label: 'Process', type: 'process', status: 'running', progress: 65 } },
  { id: '3', type: 'workflow', position: { x: 600, y: 100 }, data: { label: 'AI Analysis', type: 'ai', status: 'pending' } },
];

const demoWorkflowEdges = [
  { id: 'e1-2', source: '1', target: '2', type: 'workflow', data: { status: 'complete' } },
  { id: 'e2-3', source: '2', target: '3', type: 'workflow', data: { status: 'active', animated: true } },
];

function App() {
  const [view, setView] = useState<'demo' | 'docs' | 'guidelines'>('docs');
  const [activeTab, setActiveTab] = useState<'chatbot' | 'vibe' | 'workflow'>('chatbot');
  const [inputValue, setInputValue] = useState('');
  const actions = useDefaultActions({ onCopy: () => {}, onLike: () => {}, onDislike: () => {}, onRegenerate: () => {} });

  const FloatingNav = () => (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      {view !== 'docs' && <button onClick={() => setView('docs')} className="px-4 py-2 min-h-[44px] bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 flex items-center gap-2 border focus-visible:ring-2 focus-visible:ring-blue-500">Docs</button>}
      {view !== 'guidelines' && <button onClick={() => setView('guidelines')} className="px-4 py-2 min-h-[44px] bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-50 flex items-center gap-2 border focus-visible:ring-2 focus-visible:ring-blue-500">Guidelines</button>}
      {view !== 'demo' && <button onClick={() => setView('demo')} className="px-4 py-2 min-h-[44px] bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 flex items-center gap-2 focus-visible:ring-2 focus-visible:ring-blue-500">Demo</button>}
    </div>
  );

  if (view === 'docs') return <div><FloatingNav /><DocsPage /></div>;
  if (view === 'guidelines') return <div><FloatingNav /><GuidelinesPage /></div>;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950">
      <header className="bg-white dark:bg-gray-900 border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold">AI Components Library</h1>
          <div className="flex gap-4 mt-4">
            {(['chatbot', 'vibe', 'workflow'] as const).map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-3 border-b-2 ${activeTab === tab ? 'border-blue-500 text-blue-600' : 'border-transparent'}`}>
                {tab === 'chatbot' ? 'Chatbot' : tab === 'vibe' ? 'Vibe-Coding' : 'Workflow'}
              </button>
            ))}
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 py-8 space-y-12">
        {activeTab === 'chatbot' && (
          <>
            <Section title="Conversation"><Conversation messages={demoMessages} /><PromptInput value={inputValue} onChange={setInputValue} /></Section>
            <Section title="Loading"><div className="flex gap-6"><Loader variant="spinner" /><Loader variant="dots" /><Loader variant="typing" /></div><Shimmer lines={3} /></Section>
            <Section title="Reasoning"><ChainOfThought steps={demoReasoningSteps} /><Reasoning content="Analyzing React hooks..." duration={1250} /></Section>
            <Section title="Code"><CodeBlock code={demoCode} language="typescript" filename="useCounter.ts" /></Section>
            <Section title="Sources"><Sources sources={demoSources} /></Section>
            <Section title="Plan"><Plan plan={demoPlan} /></Section>
            <Section title="Tool"><Tool tool={demoToolCalls[0]} /></Section>
            <Section title="Confirmation"><Confirmation request={demoConfirmation} /></Section>
          </>
        )}
        {activeTab === 'vibe' && (
          <>
            <Section title="Artifact"><Artifact type="code" title="useCounter.ts" content={demoCode} /></Section>
            <Section title="Web Preview"><WebPreview html="<html><body><h1>Hello!</h1></body></html>" height={300} /></Section>
          </>
        )}
        {activeTab === 'workflow' && (
          <Section title="Workflow Canvas"><div className="h-[500px]"><WorkflowCanvas nodes={demoWorkflowNodes} edges={demoWorkflowEdges} /></div></Section>
        )}
      </main>
      <FloatingNav />
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section><h2 className="text-lg font-semibold mb-4">{title}</h2>{children}</section>;
}

export default App;
