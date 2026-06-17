import type { NFA } from '../types/automata';
import { EPSILON } from '../types/automata';

export interface NFAStep {
  states: string[];
  symbol: string;
  nextStates: string[];
  index: number;
}

export interface NFASimResult {
  accepted: boolean;
  steps: NFAStep[];
  finalStates: string[];
}

/**
 * Computes the epsilon-closure of a set of NFA states.
 * Returns all states reachable from the given set via epsilon transitions only.
 */
export function epsilonClosure(nfa: NFA, states: Set<string>): Set<string> {
  const closure = new Set(states);
  const stack = [...states];

  while (stack.length > 0) {
    const state = stack.pop()!;
    const epsTargets = nfa.transitions.get(state)?.get(EPSILON) ?? [];
    for (const target of epsTargets) {
      if (!closure.has(target)) {
        closure.add(target);
        stack.push(target);
      }
    }
  }
  return closure;
}

/**
 * Computes move(states, symbol): the set of NFA states reachable from any
 * state in the given set via the given symbol (ignoring epsilon).
 */
export function move(nfa: NFA, states: Set<string>, symbol: string): Set<string> {
  const result = new Set<string>();
  for (const state of states) {
    const targets = nfa.transitions.get(state)?.get(symbol) ?? [];
    for (const t of targets) result.add(t);
  }
  return result;
}

/**
 * Simulates an NFA on an input string using subset construction at runtime.
 * Returns all steps (each showing the active state set) and final acceptance.
 */
export function simulateNFA(nfa: NFA, input: string): NFASimResult {
  let currentStates = epsilonClosure(nfa, new Set([nfa.startState]));
  const steps: NFAStep[] = [];

  for (let i = 0; i < input.length; i++) {
    const symbol = input[i];
    const movedStates = move(nfa, currentStates, symbol);
    const nextStates = epsilonClosure(nfa, movedStates);
    steps.push({
      states: [...currentStates],
      symbol,
      nextStates: [...nextStates],
      index: i,
    });
    currentStates = nextStates;
  }

  const finalStates = [...currentStates];
  const accepted = finalStates.some((s) => nfa.acceptStates.includes(s));
  return { accepted, steps, finalStates };
}
