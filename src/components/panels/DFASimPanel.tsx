import { useState } from 'react';
import { useAutomaton } from '../../context/AutomatonContext';
import { simulateDFA } from '../../algorithms/dfaSimulator';
import type { DFASimResult, DFAStep } from '../../algorithms/dfaSimulator';
import Tape from '../shared/Tape';
import StepLog from '../shared/StepLog';
import TransitionTable from '../shared/TransitionTable';

interface DFASimPanelProps {
  onActiveStateChange: (states: string[]) => void;
}

export default function DFASimPanel({ onActiveStateChange }: DFASimPanelProps) {
  const { dfa } = useAutomaton();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<DFASimResult | null>(null);
  const [stepIndex, setStepIndex] = useState(-1);
  const [isStepMode, setIsStepMode] = useState(false);

  const steps: DFAStep[] = result?.steps ?? [];

  const currentState = isStepMode
    ? stepIndex === 0
      ? dfa.startState
      : steps[stepIndex - 1]?.nextState ?? dfa.startState
    : result?.finalState ?? null;

  const handleRun = () => {
    const r = simulateDFA(dfa, input);
    setResult(r);
    setIsStepMode(false);
    setStepIndex(-1);
    onActiveStateChange(r.finalState ? [r.finalState] : []);
  };

  const handleStep = () => {
    if (!result || !isStepMode) {
      const r = simulateDFA(dfa, input);
      setResult(r);
      setIsStepMode(true);
      setStepIndex(0);
      onActiveStateChange([dfa.startState]);
      return;
    }
    if (stepIndex < steps.length) {
      const next = stepIndex + 1;
      setStepIndex(next);
      const state = steps[next - 1]?.nextState ?? null;
      onActiveStateChange(state ? [state] : []);
    }
  };

  const handleReset = () => {
    setResult(null);
    setStepIndex(-1);
    setIsStepMode(false);
    onActiveStateChange([]);
  };

  const done = isStepMode && stepIndex >= steps.length;

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
      <div>
        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Test String</p>
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setResult(null); setIsStepMode(false); setStepIndex(-1); onActiveStateChange([]); }}
          placeholder="Enter input string…"
          className="w-full font-mono text-sm border-b border-[var(--color-border-strong)] outline-none px-1 py-1 bg-transparent"
          onKeyDown={(e) => { if (e.key === 'Enter') handleRun(); }}
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={handleRun} disabled={!dfa.startState} className="px-3 py-1.5 text-sm bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] disabled:opacity-40 transition-colors duration-100">
          Run
        </button>
        <button onClick={handleStep} disabled={!dfa.startState || done} className="px-3 py-1.5 text-sm bg-[var(--color-surface)] text-[var(--color-text-secondary)] rounded-md hover:bg-[var(--color-surface-hover)] disabled:opacity-40 transition-colors duration-100">
          {isStepMode ? 'Step →' : 'Step Mode'}
        </button>
        <button onClick={handleReset} className="px-3 py-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors duration-100">
          Reset
        </button>
      </div>

      {input && isStepMode && (
        <div>
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Tape</p>
          <Tape input={input} headPosition={stepIndex - 1} />
        </div>
      )}

      {result && (!isStepMode || done) && (
        <div className={`px-3 py-2 rounded-md text-sm font-medium ${result.accepted ? 'bg-[var(--color-accept-light)] text-[var(--color-accept)]' : 'bg-[var(--color-reject-light)] text-[var(--color-reject)]'}`}>
          {result.accepted ? '✓ Accepted' : '✗ Rejected'}
          {result.error && <p className="text-xs mt-1 font-normal opacity-80">{result.error}</p>}
        </div>
      )}

      {isStepMode && steps.length > 0 && (
        <div>
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Steps</p>
          <StepLog
            steps={steps.map((s) => ({ state: s.state, symbol: s.symbol, nextState: s.nextState, index: s.index }))}
            currentIndex={stepIndex}
          />
        </div>
      )}

      {dfa.states.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Transition Table</p>
          <TransitionTable dfa={dfa} activeState={currentState ?? undefined} />
        </div>
      )}
    </div>
  );
}
