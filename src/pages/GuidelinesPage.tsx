import React, { useState } from 'react';

// Icons
const CheckCircleIcon = () => (
  <svg className="w-5 h-5 text-green-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const XCircleIcon = () => (
  <svg className="w-5 h-5 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const AlertIcon = () => (
  <svg className="w-5 h-5 text-amber-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
  </svg>
);

interface GuidelineProps {
  type: 'must' | 'should' | 'never';
  children: React.ReactNode;
}

function Guideline({ type, children }: GuidelineProps) {
  const styles = {
    must: 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800',
    should: 'bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
    never: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800',
  };

  const labels = {
    must: 'MUST',
    should: 'SHOULD',
    never: 'NEVER',
  };

  const icons = {
    must: <CheckCircleIcon />,
    should: <AlertIcon />,
    never: <XCircleIcon />,
  };

  return (
    <div className={`flex gap-3 p-4 rounded-lg border ${styles[type]}`}>
      {icons[type]}
      <div>
        <span className={`text-xs font-bold uppercase tracking-wider ${
          type === 'must' ? 'text-green-700 dark:text-green-400' :
          type === 'should' ? 'text-amber-700 dark:text-amber-400' :
          'text-red-700 dark:text-red-400'
        }`}>
          {labels[type]}
        </span>
        <p className="text-gray-700 dark:text-gray-300 mt-1">{children}</p>
      </div>
    </div>
  );
}

function CodeExample({ code }: { code: string }) {
  return (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
      <code>{code}</code>
    </pre>
  );
}

interface SectionProps {
  id: string;
  title: string;
  children: React.ReactNode;
}

function Section({ id, title, children }: SectionProps) {
  return (
    <section id={id} className="scroll-mt-20">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{title}</h2>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

const sections = [
  { id: 'interactions', title: 'Interactions' },
  { id: 'animation', title: 'Animation' },
  { id: 'layout', title: 'Layout' },
  { id: 'content', title: 'Content & Accessibility' },
  { id: 'performance', title: 'Performance' },
  { id: 'design', title: 'Design' },
];

export default function GuidelinesPage() {
  const [activeSection, setActiveSection] = useState('interactions');

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">
            UI/UX Guidelines
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
            Composable rules for building accessible, fast, delightful UIs
          </p>
        </div>
      </header>

      <div className="max-w-7xl mx-auto flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 min-h-[calc(100vh-65px)] sticky top-[65px]">
          <nav className="p-4">
            <ul className="space-y-1">
              {sections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    onClick={() => setActiveSection(section.id)}
                    className={`block px-3 py-2 text-sm rounded-lg transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 min-w-0 space-y-16">
          {/* Interactions */}
          <Section id="interactions" title="Interactions">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-6 mb-4">
              Keyboard
            </h3>
            <div className="space-y-3">
              <Guideline type="must">
                Full keyboard support per WAI-ARIA APG patterns
              </Guideline>
              <Guideline type="must">
                Visible focus rings using <code>:focus-visible</code>; group with <code>:focus-within</code>
              </Guideline>
              <Guideline type="must">
                Manage focus (trap, move, and return) per APG patterns
              </Guideline>
            </div>
            <CodeExample code={`// Focus ring utility classes
const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2';

// Focus trap hook usage
const modalRef = useFocusTrap(isOpen);
return <dialog ref={modalRef}>...</dialog>;`} />

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">
              Hit Targets & Input
            </h3>
            <div className="space-y-3">
              <Guideline type="must">
                Hit target \u226524px (mobile \u226544px). If visual &lt;24px, expand hit area
              </Guideline>
              <Guideline type="must">
                Mobile <code>&lt;input&gt;</code> font-size \u226516px to prevent zoom
              </Guideline>
              <Guideline type="never">
                Disable browser zoom
              </Guideline>
              <Guideline type="must">
                Use <code>touch-action: manipulation</code> to prevent double-tap zoom
              </Guideline>
            </div>

            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mt-8 mb-4">
              Forms & Inputs
            </h3>
            <div className="space-y-3">
              <Guideline type="never">
                Block paste in <code>&lt;input&gt;/&lt;textarea&gt;</code>
              </Guideline>
              <Guideline type="must">
                Loading buttons show spinner and keep original label
              </Guideline>
              <Guideline type="must">
                Keep submit enabled until request starts; then disable, show spinner, use idempotency key
              </Guideline>
              <Guideline type="must">
                Errors inline next to fields; on submit, focus first error
              </Guideline>
              <Guideline type="must">
                Warn on unsaved changes before navigation
              </Guideline>
            </div>
          </Section>

          {/* Animation */}
          <Section id="animation" title="Animation">
            <div className="space-y-3">
              <Guideline type="must">
                Honor <code>prefers-reduced-motion</code> (provide reduced variant)
              </Guideline>
              <Guideline type="should">
                Prefer CSS &gt; Web Animations API &gt; JS libraries
              </Guideline>
              <Guideline type="must">
                Animate compositor-friendly props (<code>transform</code>, <code>opacity</code>); avoid layout/repaint props
              </Guideline>
              <Guideline type="must">
                Animations are interruptible and input-driven (avoid autoplay)
              </Guideline>
            </div>
            <CodeExample code={`// Reduced motion support
const prefersReducedMotion = useReducedMotion();

<div className={cn(
  "transition-transform",
  prefersReducedMotion
    ? "duration-0"
    : "duration-200"
)}>

// Or use Tailwind's motion-reduce
<div className="animate-slideUp motion-reduce:animate-none motion-reduce:opacity-100">`} />
          </Section>

          {/* Layout */}
          <Section id="layout" title="Layout">
            <div className="space-y-3">
              <Guideline type="must">
                Verify mobile, laptop, ultra-wide (simulate ultra-wide at 50% zoom)
              </Guideline>
              <Guideline type="must">
                Respect safe areas using <code>env(safe-area-inset-*)</code>
              </Guideline>
              <Guideline type="must">
                Avoid unwanted scrollbars; fix overflows
              </Guideline>
              <Guideline type="should">
                Nested radii: child \u2264 parent; concentric
              </Guideline>
            </div>
          </Section>

          {/* Content & Accessibility */}
          <Section id="content" title="Content & Accessibility">
            <div className="space-y-3">
              <Guideline type="must">
                Skeletons mirror final content to avoid layout shift
              </Guideline>
              <Guideline type="must">
                No dead ends; always offer next step/recovery
              </Guideline>
              <Guideline type="must">
                Tabular numbers for comparisons (<code>font-variant-numeric: tabular-nums</code>)
              </Guideline>
              <Guideline type="must">
                Use ellipsis character \u2026 (not ...)
              </Guideline>
              <Guideline type="must">
                Icon-only buttons have descriptive <code>aria-label</code>
              </Guideline>
              <Guideline type="must">
                Use non-breaking spaces to glue terms: <code>10\u00A0MB</code>, <code>\u2318\u00A0+\u00A0K</code>
              </Guideline>
            </div>
          </Section>

          {/* Performance */}
          <Section id="performance" title="Performance">
            <div className="space-y-3">
              <Guideline type="must">
                Track and minimize re-renders (React DevTools/React Scan)
              </Guideline>
              <Guideline type="must">
                Profile with CPU/network throttling
              </Guideline>
              <Guideline type="must">
                Mutations (POST/PATCH/DELETE) target &lt;500ms
              </Guideline>
              <Guideline type="must">
                Virtualize large lists
              </Guideline>
              <Guideline type="must">
                Prevent CLS from images (explicit dimensions or reserved space)
              </Guideline>
            </div>
          </Section>

          {/* Design */}
          <Section id="design" title="Design">
            <div className="space-y-3">
              <Guideline type="should">
                Layered shadows (ambient + direct)
              </Guideline>
              <Guideline type="should">
                Crisp edges via semi-transparent borders + shadows
              </Guideline>
              <Guideline type="must">
                Meet contrast\u2014prefer APCA over WCAG 2
              </Guideline>
              <Guideline type="must">
                Increase contrast on <code>:hover/:active/:focus</code>
              </Guideline>
            </div>
          </Section>
        </main>
      </div>
    </div>
  );
}
