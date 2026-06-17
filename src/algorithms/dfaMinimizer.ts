import type { DFA } from '../types/automata';

export interface PartitionStep {
  step: number;
  partitions: string[][];
  splitOn?: { partition: string[]; symbol: string };
}

export interface MinimizeResult {
  minimizedDFA: DFA;
  steps: PartitionStep[];
  mergeMap: Map<string, string>; // original state -> representative state
}

/**
 * Minimizes a DFA using Hopcroft's Algorithm (partition refinement).
 * Returns the minimized DFA, partition refinement steps, and a merge map.
 */
export function minimizeDFA(dfa: DFA): MinimizeResult {
  // Step 1: Remove unreachable states
  const reachable = new Set<string>();
  const queue = [dfa.startState];
  while (queue.length > 0) {
    const s = queue.shift()!;
    if (reachable.has(s)) continue;
    reachable.add(s);
    for (const sym of dfa.alphabet) {
      const next = dfa.transitions.get(s)?.get(sym);
      if (next && !reachable.has(next)) queue.push(next);
    }
  }

  const states = dfa.states.filter((s) => reachable.has(s));
  const accept = new Set(dfa.acceptStates.filter((s) => reachable.has(s)));
  const nonAccept = states.filter((s) => !accept.has(s));

  // Step 2: Initial partition
  let partitions: Set<string>[] = [];
  if (accept.size > 0) partitions.push(accept);
  if (nonAccept.length > 0) partitions.push(new Set(nonAccept));

  const steps: PartitionStep[] = [
    { step: 0, partitions: partitions.map((p) => [...p].sort()) },
  ];

  // Step 3: Refine partitions
  let changed = true;
  let stepNum = 1;
  while (changed) {
    changed = false;
    const newPartitions: Set<string>[] = [];

    for (const partition of partitions) {
      const groups = splitPartition(partition, partitions, dfa);
      if (groups.length > 1) {
        changed = true;
        newPartitions.push(...groups);
        steps.push({
          step: stepNum++,
          partitions: groups.map((g) => [...g].sort()),
          splitOn: undefined,
        });
      } else {
        newPartitions.push(partition);
      }
    }
    partitions = newPartitions;
  }

  steps.push({ step: stepNum, partitions: partitions.map((p) => [...p].sort()) });

  // Step 4: Build representative map
  const mergeMap = new Map<string, string>();
  for (const partition of partitions) {
    const rep = [...partition].sort()[0];
    for (const s of partition) mergeMap.set(s, rep);
  }

  // Step 5: Build minimized DFA
  const newStates = [...new Set([...mergeMap.values()])];
  const newTransitions = new Map<string, Map<string, string>>();

  for (const s of newStates) {
    const original = [...mergeMap.entries()].find(([, v]) => v === s)?.[0] ?? s;
    const row = new Map<string, string>();
    for (const sym of dfa.alphabet) {
      const next = dfa.transitions.get(original)?.get(sym);
      if (next) row.set(sym, mergeMap.get(next) ?? next);
    }
    newTransitions.set(s, row);
  }

  const newStart = mergeMap.get(dfa.startState) ?? dfa.startState;
  const newAccept = [...new Set(dfa.acceptStates.map((s) => mergeMap.get(s) ?? s))].filter((s) =>
    newStates.includes(s),
  );

  return {
    minimizedDFA: {
      states: newStates,
      alphabet: dfa.alphabet,
      transitions: newTransitions,
      startState: newStart,
      acceptStates: newAccept,
    },
    steps,
    mergeMap,
  };
}

function splitPartition(
  partition: Set<string>,
  allPartitions: Set<string>[],
  dfa: DFA,
): Set<string>[] {
  const arr = [...partition];
  if (arr.length <= 1) return [partition];

  const findPartition = (state: string): number => {
    for (let i = 0; i < allPartitions.length; i++) {
      if (allPartitions[i].has(state)) return i;
    }
    return -1;
  };

  for (const sym of dfa.alphabet) {
    const groupMap = new Map<number, Set<string>>();
    for (const s of arr) {
      const next = dfa.transitions.get(s)?.get(sym);
      const partIdx = next !== undefined ? findPartition(next) : -999;
      if (!groupMap.has(partIdx)) groupMap.set(partIdx, new Set());
      groupMap.get(partIdx)!.add(s);
    }
    if (groupMap.size > 1) {
      return [...groupMap.values()];
    }
  }
  return [partition];
}
