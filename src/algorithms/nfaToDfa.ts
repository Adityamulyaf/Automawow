import type { NFA, DFA } from '../types/automata';
import { EPSILON } from '../types/automata';
import { epsilonClosure, move } from './nfaSimulator';

function setKey(s: Set<string>): string {
  return '{' + [...s].sort().join(',') + '}';
}

export interface SubsetTableRow {
  dfaState: string;
  nfaStates: string[];
  isAccept: boolean;
  transitions: Record<string, string>;
}

export interface NFAToDFAResult {
  dfa: DFA;
  table: SubsetTableRow[];
}

/**
 * Converts an NFA to an equivalent DFA using the Subset Construction algorithm.
 * Each DFA state represents a set of NFA states.
 * Returns both the resulting DFA and the construction table for display.
 */
export function nfaToDFA(nfa: NFA): NFAToDFAResult {
  const alphabet = nfa.alphabet.filter((a) => a !== EPSILON);
  const startSet = epsilonClosure(nfa, new Set([nfa.startState]));
  const startKey = setKey(startSet);

  const dfaStateMap = new Map<string, Set<string>>(); // dfaStateName -> nfaStateSet
  dfaStateMap.set(startKey, startSet);

  const dfaTransitions = new Map<string, Map<string, string>>();
  const queue = [startKey];
  const visited = new Set<string>();
  const table: SubsetTableRow[] = [];

  while (queue.length > 0) {
    const currentKey = queue.shift()!;
    if (visited.has(currentKey)) continue;
    visited.add(currentKey);

    const currentSet = dfaStateMap.get(currentKey)!;
    const row: SubsetTableRow = {
      dfaState: currentKey,
      nfaStates: [...currentSet].sort(),
      isAccept: [...currentSet].some((s) => nfa.acceptStates.includes(s)),
      transitions: {},
    };

    const transRow = new Map<string, string>();
    for (const sym of alphabet) {
      const moved = move(nfa, currentSet, sym);
      const nextSet = epsilonClosure(nfa, moved);
      const nextKey = setKey(nextSet);

      transRow.set(sym, nextKey);
      row.transitions[sym] = nextKey;

      if (!dfaStateMap.has(nextKey)) {
        dfaStateMap.set(nextKey, nextSet);
        queue.push(nextKey);
      }
    }
    dfaTransitions.set(currentKey, transRow);
    table.push(row);
  }

  const dfaStates = [...dfaStateMap.keys()];
  const acceptStates = dfaStates.filter((s) => {
    const nfaSet = dfaStateMap.get(s)!;
    return [...nfaSet].some((ns) => nfa.acceptStates.includes(ns));
  });

  const dfa: DFA = {
    states: dfaStates,
    alphabet,
    transitions: dfaTransitions,
    startState: startKey,
    acceptStates,
  };

  return { dfa, table };
}
