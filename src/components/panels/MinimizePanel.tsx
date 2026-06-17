import { useState } from 'react';
import { useAutomaton } from '../../context/AutomatonContext';
import { minimizeDFA } from '../../algorithms/dfaMinimizer';
import type { MinimizeResult } from '../../algorithms/dfaMinimizer';
import { circularLayout } from '../../algorithms/autoLayout';

export default function MinimizePanel() {
  const { dfa, loadDFA } = useAutomaton();
  const [result, setResult] = useState<MinimizeResult | null>(null);

  const handleMinimize = () => {
    try {
      setResult(minimizeDFA(dfa));
    } catch (e) {
      alert(`Error: ${(e as Error).message}`);
    }
  };

  const handleLoadMinimized = () => {
    if (!result) return;
    loadDFA(result.minimizedDFA, circularLayout(result.minimizedDFA.states, result.minimizedDFA.startState));
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
      <div>
        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">DFA Minimization</p>
        <p className="text-xs text-[var(--color-text-muted)]">Uses Hopcroft's algorithm to produce the minimal equivalent DFA.</p>
      </div>

      <button
        onClick={handleMinimize}
        disabled={dfa.states.length === 0}
        className="px-3 py-1.5 text-sm bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] disabled:opacity-40 transition-colors duration-100 self-start"
      >
        Minimize DFA
      </button>

      {result && (
        <>
          <div className="flex items-center gap-3 text-sm">
            <span className="text-[var(--color-text-muted)]">Original:</span>
            <span className="font-mono font-semibold">{dfa.states.length} states</span>
            <span className="text-[var(--color-text-muted)]">→</span>
            <span className="text-[var(--color-text-muted)]">Minimized:</span>
            <span className="font-mono font-semibold text-[var(--color-accept)]">{result.minimizedDFA.states.length} states</span>
          </div>

          {result.minimizedDFA.states.length < dfa.states.length && (
            <div>
              <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Merged States</p>
              <div className="flex flex-col gap-1 text-xs font-mono">
                {[...new Set([...result.mergeMap.values()])].map((rep) => {
                  const merged = [...result.mergeMap.entries()].filter(([, v]) => v === rep).map(([k]) => k);
                  if (merged.length <= 1) return null;
                  return (
                    <div key={rep} className="flex items-center gap-2">
                      <span className="text-[var(--color-text-muted)]">{'{' + merged.join(', ') + '}'}</span>
                      <span className="text-[var(--color-text-muted)]">→</span>
                      <span className="font-semibold text-[var(--color-primary)]">{rep}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Partition Refinement</p>
            <div className="flex flex-col gap-2 text-xs font-mono overflow-y-auto max-h-48">
              {result.steps.map((step) => (
                <div key={step.step} className="flex gap-2">
                  <span className="text-[var(--color-text-muted)] w-4">{step.step}:</span>
                  <div className="flex flex-wrap gap-1">
                    {step.partitions.map((p, i) => (
                      <span key={i} className="bg-[var(--color-surface)] px-1.5 py-0.5 rounded text-[var(--color-text-secondary)]">
                        {'{' + p.join(', ') + '}'}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={handleLoadMinimized}
            className="px-3 py-1.5 text-sm bg-[var(--color-surface)] text-[var(--color-text-secondary)] rounded-md hover:bg-[var(--color-surface-hover)] transition-colors duration-100 self-start"
          >
            Load Minimized DFA into Canvas
          </button>
        </>
      )}
    </div>
  );
}
