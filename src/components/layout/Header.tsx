import type { AppTab } from '../../types/editor';

interface HeaderProps {
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
}

const tabs: { id: AppTab; label: string }[] = [
  { id: 'editor', label: 'Editor' },
  { id: 'dfa-sim', label: 'DFA Simulator' },
  { id: 'regex', label: 'Regex to NFA' },
  { id: 'nfa-test', label: 'NFA Test' },
  { id: 'minimize', label: 'Minimize' },
  { id: 'equivalence', label: 'Equivalence' },
];

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="flex items-center border-b border-[var(--color-border)] bg-white px-4" style={{ height: 48 }}>
      <div className="flex items-center gap-2 mr-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" className="w-6 h-6 flex-shrink-0" fill="none">
          <defs>
            <linearGradient id="header-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00B9FC" />
              <stop offset="100%" stopColor="#8B5CF6" />
            </linearGradient>
            <filter id="header-glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <path d="M 4 20 L 9 20" stroke="url(#header-logo-grad)" strokeWidth="3.5" strokeLinecap="round" />
          <path d="M 7 17 L 10 20 L 7 23" stroke="url(#header-logo-grad)" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M 14 20 L 23 44 L 32 20 L 41 44 L 50 20" stroke="url(#header-logo-grad)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" filter="url(#header-glow)" />
          <circle cx="14" cy="20" r="5.5" fill="#FFFFFF" stroke="url(#header-logo-grad)" strokeWidth="3" />
          <circle cx="23" cy="44" r="5.5" fill="#FFFFFF" stroke="url(#header-logo-grad)" strokeWidth="3" />
          <circle cx="32" cy="20" r="5.5" fill="#FFFFFF" stroke="url(#header-logo-grad)" strokeWidth="3" />
          <circle cx="41" cy="44" r="5.5" fill="#FFFFFF" stroke="url(#header-logo-grad)" strokeWidth="3" />
          <circle cx="50" cy="20" r="7" fill="none" stroke="url(#header-logo-grad)" strokeWidth="2" />
          <circle cx="50" cy="20" r="3.5" fill="#FFFFFF" stroke="url(#header-logo-grad)" strokeWidth="2.5" />
        </svg>
        <span className="font-semibold text-[var(--color-text-primary)] tracking-tight text-base">
          Automawow!
        </span>
      </div>
      <nav className="flex items-center gap-0.5">
        {tabs.map((tab) => {
          const active = tab.id === activeTab;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-100 ${
                active
                  ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium'
                  : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]'
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
