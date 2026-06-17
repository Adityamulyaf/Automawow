import { useAutomaton } from '../../context/AutomatonContext';

export default function StatusBar() {
  const { dfa } = useAutomaton();
  const transCount = [...dfa.transitions.values()].reduce((sum, r) => sum + r.size, 0);

  return (
    <footer
      className="flex items-center gap-4 border-t border-[var(--color-border)] bg-[var(--color-surface)] px-4 text-xs text-[var(--color-text-muted)]"
      style={{ height: 28 }}
    >
      <span>{dfa.states.length} states</span>
      <span>·</span>
      <span>{transCount} transitions</span>
      <span>·</span>
      <span>Σ = {'{' + (dfa.alphabet.join(', ') || '—') + '}'}</span>
      {dfa.startState && (
        <>
          <span>·</span>
          <span className="font-mono">q₀ = {dfa.startState}</span>
        </>
      )}
      {dfa.acceptStates.length > 0 && (
        <>
          <span>·</span>
          <span>F = {'{' + dfa.acceptStates.join(', ') + '}'}</span>
        </>
      )}
    </footer>
  );
}
