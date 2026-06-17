import type { DFA } from '../types/automata';

export interface EquivalenceResult {
  equivalent: boolean;
  distinguishingString?: string;
  message: string;
}

/**
 * Checks if two DFAs are equivalent using Product Construction.
 * A distinguishing string is found if the DFAs are not equivalent.
 * The "difference" accept states in the product are states where exactly one DFA accepts.
 */
export function checkEquivalence(dfa1: DFA, dfa2: DFA): EquivalenceResult {
  const getNext1 = (s: string, sym: string) => dfa1.transitions.get(s)?.get(sym) ?? '__dead1__';
  const getNext2 = (s: string, sym: string) => dfa2.transitions.get(s)?.get(sym) ?? '__dead2__';

  const isAccept1 = (s: string) => dfa1.acceptStates.includes(s);
  const isAccept2 = (s: string) => dfa2.acceptStates.includes(s);

  const productKey = (s1: string, s2: string) => `(${s1},${s2})`;
  const startPair = productKey(dfa1.startState, dfa2.startState);

  const alphabet = [...new Set([...dfa1.alphabet, ...dfa2.alphabet])];
  const visited = new Map<string, string>(); // product state -> path string
  const queue: { s1: string; s2: string; path: string }[] = [
    { s1: dfa1.startState, s2: dfa2.startState, path: '' },
  ];
  visited.set(startPair, '');

  while (queue.length > 0) {
    const { s1, s2, path } = queue.shift()!;
    const acc1 = isAccept1(s1);
    const acc2 = isAccept2(s2);

    if (acc1 !== acc2) {
      return {
        equivalent: false,
        distinguishingString: path || 'ε (empty string)',
        message: `Not equivalent. Distinguishing string: "${path || 'ε'}"`,
      };
    }

    for (const sym of alphabet) {
      const n1 = getNext1(s1, sym);
      const n2 = getNext2(s2, sym);
      const key = productKey(n1, n2);
      if (!visited.has(key)) {
        const newPath = path + sym;
        visited.set(key, newPath);
        queue.push({ s1: n1, s2: n2, path: newPath });
      }
    }
  }

  return {
    equivalent: true,
    message: 'The two DFAs are equivalent — they accept the same language.',
  };
}
