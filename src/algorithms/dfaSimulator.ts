import type { DFA } from '../types/automata';

export interface DFAStep {
  state: string;
  symbol: string;
  nextState: string | null;
  index: number;
}

export interface DFASimResult {
  accepted: boolean;
  steps: DFAStep[];
  finalState: string | null;
  error?: string;
}

/**
 * Simulates a DFA on an input string, returning all steps and final result.
 * Missing transitions are treated as going to an implicit dead state.
 */
export function simulateDFA(dfa: DFA, input: string): DFASimResult {
  if (!dfa.startState) {
    return { accepted: false, steps: [], finalState: null, error: 'No start state defined.' };
  }

  let currentState = dfa.startState;
  const steps: DFAStep[] = [];

  for (let i = 0; i < input.length; i++) {
    const symbol = input[i];
    const nextState = dfa.transitions.get(currentState)?.get(symbol) ?? null;
    steps.push({ state: currentState, symbol, nextState, index: i });
    if (nextState === null) {
      return {
        accepted: false,
        steps,
        finalState: null,
        error: `No transition from state "${currentState}" on symbol "${symbol}" (dead state).`,
      };
    }
    currentState = nextState;
  }

  const accepted = dfa.acceptStates.includes(currentState);
  return { accepted, steps, finalState: currentState };
}
