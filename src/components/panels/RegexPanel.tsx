import { useState } from 'react';
import { regexToNFA } from '../../algorithms/regexToNfa';
import { useAutomaton } from '../../context/AutomatonContext';
import { circularLayout } from '../../algorithms/autoLayout';

export default function RegexPanel() {
  const { loadNFA } = useAutomaton();
  const [regex, setRegex] = useState('');
  const [error, setError] = useState('');
  const [converted, setConverted] = useState(false);

  const handleConvert = () => {
    setError('');
    setConverted(false);
    if (!regex.trim()) { setError('Please enter a regular expression.'); return; }
    try {
      const nfa = regexToNFA(regex);
      loadNFA(nfa, circularLayout(nfa.states, nfa.startState));
      setConverted(true);
    } catch (e) {
      setError(`Error: ${(e as Error).message}`);
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
      <div>
        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Regular Expression</p>
        <input
          value={regex}
          onChange={(e) => { setRegex(e.target.value); setConverted(false); setError(''); }}
          placeholder="e.g. (a|b)*abb"
          className="w-full font-mono text-sm border-b border-[var(--color-border-strong)] outline-none px-1 py-1 bg-transparent"
          onKeyDown={(e) => { if (e.key === 'Enter') handleConvert(); }}
        />
        <p className="text-xs text-[var(--color-text-muted)] mt-1">
          Supports: literals, | (union), * (star), + (plus), ? (optional), () (grouping), \\ (escape)
        </p>
      </div>

      <button onClick={handleConvert} className="px-3 py-1.5 text-sm bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] transition-colors duration-100 self-start">
        Convert → NFA
      </button>

      {error && <div className="px-3 py-2 rounded-md text-sm bg-[var(--color-reject-light)] text-[var(--color-reject)]">{error}</div>}

      {converted && <div className="px-3 py-2 rounded-md text-sm bg-[var(--color-accept-light)] text-[var(--color-accept)]">✓ NFA generated and loaded into the canvas.</div>}

      <div className="text-xs text-[var(--color-text-muted)] space-y-1">
        <p className="font-semibold text-[var(--color-text-secondary)]">Syntax Reference</p>
        <p><code className="mono bg-[var(--color-surface)] px-1 rounded">a</code> — literal</p>
        <p><code className="mono bg-[var(--color-surface)] px-1 rounded">ab</code> — concatenation</p>
        <p><code className="mono bg-[var(--color-surface)] px-1 rounded">a|b</code> — union</p>
        <p><code className="mono bg-[var(--color-surface)] px-1 rounded">a*</code> — Kleene star</p>
        <p><code className="mono bg-[var(--color-surface)] px-1 rounded">a+</code> — one or more</p>
        <p><code className="mono bg-[var(--color-surface)] px-1 rounded">a?</code> — zero or one</p>
        <p><code className="mono bg-[var(--color-surface)] px-1 rounded">(a|b)*abb</code> — ends with abb</p>
      </div>
    </div>
  );
}
