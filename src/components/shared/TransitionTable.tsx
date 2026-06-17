import type { DFA } from '../../types/automata';

interface TransitionTableProps {
  dfa: DFA;
  activeState?: string;
}

export default function TransitionTable({ dfa, activeState }: TransitionTableProps) {
  if (dfa.states.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="text-xs font-mono border-collapse w-full">
        <thead>
          <tr>
            <th className="text-left px-2 py-1 text-[var(--color-text-muted)] font-medium">δ</th>
            {dfa.alphabet.map((sym) => (
              <th key={sym} className="px-2 py-1 text-[var(--color-text-secondary)] font-medium border-b border-[var(--color-border)]">{sym}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {dfa.states.map((state) => {
            const isActive = state === activeState;
            const isStart = state === dfa.startState;
            const isAccept = dfa.acceptStates.includes(state);
            return (
              <tr key={state} className={isActive ? 'bg-[var(--color-primary-light)]' : 'hover:bg-[var(--color-surface)]'}>
                <td className="px-2 py-1 text-left whitespace-nowrap">
                  {isStart && <span className="text-[var(--color-primary)] mr-1">→</span>}
                  {isAccept && <span className="text-[var(--color-accept)] mr-1">*</span>}
                  <span className={isActive ? 'text-[var(--color-primary)] font-semibold' : 'text-[var(--color-text-primary)]'}>{state}</span>
                </td>
                {dfa.alphabet.map((sym) => (
                  <td key={sym} className="px-2 py-1 text-center text-[var(--color-text-secondary)]">
                    {dfa.transitions.get(state)?.get(sym) ?? '—'}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
