import { useState } from 'react';
import { useAutomaton } from '../../context/AutomatonContext';
import type { NFA } from '../../types/automata';
import { simulateNFA } from '../../algorithms/nfaSimulator';
import type { NFASimResult } from '../../algorithms/nfaSimulator';
import { nfaToDFA } from '../../algorithms/nfaToDfa';
import { circularLayout } from '../../algorithms/autoLayout';
import StepLog from '../shared/StepLog';

interface NFATestPanelProps {
  onActiveStatesChange: (states: string[]) => void;
}

export default function NFATestPanel({ onActiveStatesChange }: NFATestPanelProps) {
  const { dfa, loadDFA } = useAutomaton();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<NFASimResult | null>(null);
  const [stepIndex, setStepIndex] = useState(-1);
  const [isStepMode, setIsStepMode] = useState(false);
  const [converted, setConverted] = useState(false);

  const nfa: NFA = {
    states: dfa.states,
    alphabet: dfa.alphabet,
    transitions: new Map(
      [...dfa.transitions.entries()].map(([from, row]) => [
        from,
        new Map([...row.entries()].map(([sym, to]) => [sym, to.split(',')])),
      ]),
    ),
    startState: dfa.startState,
    acceptStates: dfa.acceptStates,
  };

  const handleRun = () => {
    const r = simulateNFA(nfa, input);
    setResult(r);
    setIsStepMode(false);
    setStepIndex(-1);
    onActiveStatesChange(r.finalStates);
  };

  const handleStep = () => {
    if (!result || !isStepMode) {
      const r = simulateNFA(nfa, input);
      setResult(r);
      setIsStepMode(true);
      setStepIndex(0);
      onActiveStatesChange([nfa.startState]);
      return;
    }
    if (stepIndex < result.steps.length) {
      const next = stepIndex + 1;
      setStepIndex(next);
      onActiveStatesChange(next > 0 ? result.steps[next - 1].nextStates : [nfa.startState]);
    }
  };

  const handleReset = () => {
    setResult(null);
    setStepIndex(-1);
    setIsStepMode(false);
    onActiveStatesChange([]);
  };

  const handleToDFA = () => {
    const { dfa: converted2 } = nfaToDFA(nfa);
    loadDFA(converted2, circularLayout(converted2.states, converted2.startState));
    setConverted(true);
  };

  const steps = result?.steps ?? [];
  const done = isStepMode && stepIndex >= steps.length;

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
      <div>
        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Test NFA</p>
        <input
          value={input}
          onChange={(e) => { setInput(e.target.value); setResult(null); setIsStepMode(false); setStepIndex(-1); onActiveStatesChange([]); }}
          placeholder="Enter input string…"
          className="w-full font-mono text-sm border-b border-[var(--color-border-strong)] outline-none px-1 py-1 bg-transparent"
          onKeyDown={(e) => { if (e.key === 'Enter') handleRun(); }}
        />
      </div>

      <div className="flex gap-2 flex-wrap">
        <button onClick={handleRun} disabled={!dfa.startState} className="px-3 py-1.5 text-sm bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] disabled:opacity-40 transition-colors duration-100">Run</button>
        <button onClick={handleStep} disabled={!dfa.startState || done} className="px-3 py-1.5 text-sm bg-[var(--color-surface)] text-[var(--color-text-secondary)] rounded-md hover:bg-[var(--color-surface-hover)] disabled:opacity-40 transition-colors duration-100">
          {isStepMode ? 'Step →' : 'Step Mode'}
        </button>
        <button onClick={handleReset} className="px-3 py-1.5 text-sm text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors duration-100">Reset</button>
      </div>

      {result && (!isStepMode || done) && (
        <div className={`px-3 py-2 rounded-md text-sm font-medium ${result.accepted ? 'bg-[var(--color-accept-light)] text-[var(--color-accept)]' : 'bg-[var(--color-reject-light)] text-[var(--color-reject)]'}`}>
          {result.accepted ? '✓ Accepted' : '✗ Rejected'}
          <p className="text-xs mt-1 font-normal opacity-80">Final states: {'{' + result.finalStates.join(', ') + '}'}</p>
        </div>
      )}

      {isStepMode && steps.length > 0 && (
        <div>
          <p className="text-xs text-[var(--color-text-muted)] mb-1">Steps</p>
          <StepLog
            steps={steps.map((s) => ({ state: s.states, symbol: s.symbol, nextState: s.nextStates, index: s.index }))}
            currentIndex={stepIndex}
          />
        </div>
      )}

      <div className="border-t border-[var(--color-border)] pt-4">
        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">NFA → DFA Conversion</p>
        <button onClick={handleToDFA} className="px-3 py-1.5 text-sm bg-[var(--color-surface)] text-[var(--color-text-secondary)] rounded-md hover:bg-[var(--color-surface-hover)] transition-colors duration-100">
          Convert NFA → DFA (Subset Construction)
        </button>
        {converted && <p className="text-xs text-[var(--color-accept)] mt-2">✓ Equivalent DFA loaded into canvas.</p>}
      </div>
    </div>
  );
}
