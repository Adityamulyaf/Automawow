import { useState, useCallback, useRef } from 'react';
import type { DFA, NFA } from '../types/automata';
import { simulateDFA } from '../algorithms/dfaSimulator';
import type { DFASimResult, DFAStep } from '../algorithms/dfaSimulator';
import { simulateNFA } from '../algorithms/nfaSimulator';
import type { NFASimResult, NFAStep } from '../algorithms/nfaSimulator';

export function useDFASimulation(dfa: DFA) {
  const [sim, setSim] = useState<{
    input: string;
    currentStepIndex: number;
    steps: DFAStep[];
    result: DFASimResult | null;
    running: boolean;
  }>({ input: '', currentStepIndex: -1, steps: [], result: null, running: false });
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const run = useCallback((input: string) => {
    const result = simulateDFA(dfa, input);
    setSim({ input, currentStepIndex: result.steps.length, steps: result.steps, result, running: false });
  }, [dfa]);

  const startStep = useCallback((input: string) => {
    const result = simulateDFA(dfa, input);
    setSim({ input, currentStepIndex: 0, steps: result.steps, result, running: false });
  }, [dfa]);

  const step = useCallback(() => {
    setSim((prev) => prev.currentStepIndex >= prev.steps.length ? prev : { ...prev, currentStepIndex: prev.currentStepIndex + 1 });
  }, []);

  const reset = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setSim((prev) => ({ ...prev, currentStepIndex: 0, running: false }));
  }, []);

  const autoRun = useCallback(() => {
    setSim((prev) => {
      const advance = (idx: number, total: number) => {
        if (idx > total) { setSim((p) => ({ ...p, running: false })); return; }
        setSim((p) => ({ ...p, currentStepIndex: idx }));
        timerRef.current = setTimeout(() => advance(idx + 1, total), 500);
      };
      advance(1, prev.steps.length);
      return { ...prev, running: true, currentStepIndex: 0 };
    });
  }, []);

  const setInput = useCallback((input: string) => {
    setSim({ input, currentStepIndex: -1, steps: [], result: null, running: false });
  }, []);

  return { sim, run, startStep, step, reset, autoRun, setInput };
}

export function useNFASimulation(nfa: NFA) {
  const [sim, setSim] = useState<{
    input: string;
    result: NFASimResult | null;
    currentStepIndex: number;
    steps: NFAStep[];
  }>({ input: '', result: null, currentStepIndex: -1, steps: [] });

  const run = useCallback((input: string) => {
    const result = simulateNFA(nfa, input);
    setSim({ input, result, currentStepIndex: result.steps.length, steps: result.steps });
  }, [nfa]);

  const startStep = useCallback((input: string) => {
    const result = simulateNFA(nfa, input);
    setSim({ input, result, currentStepIndex: 0, steps: result.steps });
  }, [nfa]);

  const step = useCallback(() => {
    setSim((prev) => {
      if (!prev.result || prev.currentStepIndex >= prev.result.steps.length) return prev;
      return { ...prev, currentStepIndex: prev.currentStepIndex + 1 };
    });
  }, []);

  const reset = useCallback(() => setSim((prev) => ({ ...prev, currentStepIndex: 0 })), []);

  return { sim, run, startStep, step, reset };
}
