import type { DFA, NFA, AutomatonJSON } from '../types/automata';
import { EPSILON } from '../types/automata';

export function dfaToJSON(dfa: DFA): AutomatonJSON {
  const transitions: AutomatonJSON['transitions'] = [];
  let hasMultiTarget = false;
  for (const [from, row] of dfa.transitions) {
    for (const [symbol, toStr] of row) {
      if (toStr.includes(',') || symbol === EPSILON) {
        hasMultiTarget = true;
      }
      const targets = toStr.split(',').map((s) => s.trim()).filter(Boolean);
      for (const to of targets) {
        transitions.push({ from, to, symbol });
      }
    }
  }
  return {
    type: hasMultiTarget ? 'NFA' : 'DFA',
    states: dfa.states,
    alphabet: dfa.alphabet,
    transitions,
    startState: dfa.startState,
    acceptStates: dfa.acceptStates,
  };
}

export function nfaToJSON(nfa: NFA): AutomatonJSON {
  const transitions: AutomatonJSON['transitions'] = [];
  for (const [from, row] of nfa.transitions) {
    for (const [symbol, targets] of row) {
      for (const to of targets) transitions.push({ from, to, symbol });
    }
  }
  return { type: 'NFA', states: nfa.states, alphabet: nfa.alphabet, transitions, startState: nfa.startState, acceptStates: nfa.acceptStates };
}

export function jsonToDFA(json: AutomatonJSON): DFA {
  const transitions = new Map<string, Map<string, string>>();
  for (const { from, to, symbol } of json.transitions) {
    if (!transitions.has(from)) transitions.set(from, new Map());
    transitions.get(from)!.set(symbol, to);
  }
  return { states: json.states, alphabet: json.alphabet, transitions, startState: json.startState, acceptStates: json.acceptStates };
}

export function jsonToNFA(json: AutomatonJSON): NFA {
  const transitions = new Map<string, Map<string, string[]>>();
  for (const { from, to, symbol } of json.transitions) {
    if (!transitions.has(from)) transitions.set(from, new Map());
    const inner = transitions.get(from)!;
    if (!inner.has(symbol)) inner.set(symbol, []);
    inner.get(symbol)!.push(to);
  }
  return { states: json.states, alphabet: json.alphabet.filter((a) => a !== EPSILON), transitions, startState: json.startState, acceptStates: json.acceptStates };
}

export function downloadJSON(data: unknown, filename: string): void {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function parseAutomatonJSON(text: string): { json: AutomatonJSON; error?: string } {
  try {
    const json = JSON.parse(text) as AutomatonJSON;
    if (!json.type || !json.states || !json.transitions || !json.startState) {
      return { json, error: 'Invalid automaton JSON structure.' };
    }
    return { json };
  } catch (e) {
    return { json: {} as AutomatonJSON, error: `JSON parse error: ${(e as Error).message}` };
  }
}
