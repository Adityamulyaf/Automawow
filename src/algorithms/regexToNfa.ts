import type { NFA } from '../types/automata';
import { EPSILON } from '../types/automata';

interface NFAFragment {
  start: string;
  accept: string;
  states: string[];
  transitions: Map<string, Map<string, string[]>>;
}

let stateCounter = 0;
function freshState(): string {
  return `s${stateCounter++}`;
}

function addTransition(
  transitions: Map<string, Map<string, string[]>>,
  from: string,
  symbol: string,
  to: string,
): void {
  if (!transitions.has(from)) transitions.set(from, new Map());
  const inner = transitions.get(from)!;
  if (!inner.has(symbol)) inner.set(symbol, []);
  inner.get(symbol)!.push(to);
}

function mergeTransitions(
  base: Map<string, Map<string, string[]>>,
  other: Map<string, Map<string, string[]>>,
): void {
  for (const [state, symbols] of other) {
    if (!base.has(state)) base.set(state, new Map());
    for (const [sym, targets] of symbols) {
      if (!base.get(state)!.has(sym)) base.get(state)!.set(sym, []);
      for (const t of targets) base.get(state)!.get(sym)!.push(t);
    }
  }
}

function literal(ch: string): NFAFragment {
  const s = freshState();
  const a = freshState();
  const trans = new Map<string, Map<string, string[]>>();
  addTransition(trans, s, ch, a);
  return { start: s, accept: a, states: [s, a], transitions: trans };
}

function concat(f1: NFAFragment, f2: NFAFragment): NFAFragment {
  mergeTransitions(f1.transitions, f2.transitions);
  addTransition(f1.transitions, f1.accept, EPSILON, f2.start);
  return {
    start: f1.start,
    accept: f2.accept,
    states: [...f1.states, ...f2.states],
    transitions: f1.transitions,
  };
}

function union(f1: NFAFragment, f2: NFAFragment): NFAFragment {
  const s = freshState();
  const a = freshState();
  const trans = new Map<string, Map<string, string[]>>();
  mergeTransitions(trans, f1.transitions);
  mergeTransitions(trans, f2.transitions);
  addTransition(trans, s, EPSILON, f1.start);
  addTransition(trans, s, EPSILON, f2.start);
  addTransition(trans, f1.accept, EPSILON, a);
  addTransition(trans, f2.accept, EPSILON, a);
  return { start: s, accept: a, states: [s, a, ...f1.states, ...f2.states], transitions: trans };
}

function kleeneStar(f: NFAFragment): NFAFragment {
  const s = freshState();
  const a = freshState();
  addTransition(f.transitions, s, EPSILON, f.start);
  addTransition(f.transitions, s, EPSILON, a);
  addTransition(f.transitions, f.accept, EPSILON, f.start);
  addTransition(f.transitions, f.accept, EPSILON, a);
  return { start: s, accept: a, states: [s, a, ...f.states], transitions: f.transitions };
}

// Tokenizer
type Token =
  | { type: 'CHAR'; value: string }
  | { type: 'UNION' }
  | { type: 'STAR' }
  | { type: 'PLUS' }
  | { type: 'QMARK' }
  | { type: 'LPAREN' }
  | { type: 'RPAREN' }
  | { type: 'CONCAT' };

function tokenize(regex: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < regex.length) {
    const ch = regex[i];
    if (ch === '\\' && i + 1 < regex.length) {
      tokens.push({ type: 'CHAR', value: regex[i + 1] });
      i += 2;
      continue;
    }
    switch (ch) {
      case '|': tokens.push({ type: 'UNION' }); break;
      case '*': tokens.push({ type: 'STAR' }); break;
      case '+': tokens.push({ type: 'PLUS' }); break;
      case '?': tokens.push({ type: 'QMARK' }); break;
      case '(': tokens.push({ type: 'LPAREN' }); break;
      case ')': tokens.push({ type: 'RPAREN' }); break;
      default: tokens.push({ type: 'CHAR', value: ch });
    }
    i++;
  }
  return insertConcat(tokens);
}

function isAtom(t: Token): boolean {
  return t.type === 'CHAR' || t.type === 'RPAREN';
}
function isPostfix(t: Token): boolean {
  return t.type === 'STAR' || t.type === 'PLUS' || t.type === 'QMARK';
}
function startsAtom(t: Token): boolean {
  return t.type === 'CHAR' || t.type === 'LPAREN';
}

function insertConcat(tokens: Token[]): Token[] {
  const result: Token[] = [];
  for (let i = 0; i < tokens.length; i++) {
    result.push(tokens[i]);
    if (i + 1 < tokens.length) {
      const cur = tokens[i];
      const next = tokens[i + 1];
      if ((isAtom(cur) || isPostfix(cur)) && (startsAtom(next))) {
        result.push({ type: 'CONCAT' });
      }
    }
  }
  return result;
}

// Shunting-yard to postfix
function toPostfix(tokens: Token[]): Token[] {
  const output: Token[] = [];
  const stack: Token[] = [];
  const precedence: Record<string, number> = { UNION: 1, CONCAT: 2, STAR: 3, PLUS: 3, QMARK: 3 };

  for (const tok of tokens) {
    if (tok.type === 'CHAR') {
      output.push(tok);
    } else if (tok.type === 'LPAREN') {
      stack.push(tok);
    } else if (tok.type === 'RPAREN') {
      while (stack.length && stack[stack.length - 1].type !== 'LPAREN') {
        output.push(stack.pop()!);
      }
      stack.pop();
    } else {
      const prec = precedence[tok.type] ?? 0;
      while (
        stack.length &&
        stack[stack.length - 1].type !== 'LPAREN' &&
        (precedence[stack[stack.length - 1].type] ?? 0) >= prec
      ) {
        output.push(stack.pop()!);
      }
      stack.push(tok);
    }
  }
  while (stack.length) output.push(stack.pop()!);
  return output;
}

/**
 * Converts a regular expression string to an NFA using Thompson's Construction.
 * Supports: literals, concatenation, union (|), Kleene star (*), plus (+), optional (?), grouping.
 */
export function regexToNFA(regex: string): NFA {
  stateCounter = 0;
  if (!regex.trim()) {
    const s = freshState();
    const a = freshState();
    const trans = new Map<string, Map<string, string[]>>();
    addTransition(trans, s, EPSILON, a);
    return {
      states: [s, a],
      alphabet: [],
      transitions: trans,
      startState: s,
      acceptStates: [a],
    };
  }

  const tokens = tokenize(regex);
  const postfix = toPostfix(tokens);
  const fragStack: NFAFragment[] = [];
  const alphabet = new Set<string>();

  for (const tok of postfix) {
    if (tok.type === 'CHAR') {
      fragStack.push(literal(tok.value));
      alphabet.add(tok.value);
    } else if (tok.type === 'CONCAT') {
      const f2 = fragStack.pop()!;
      const f1 = fragStack.pop()!;
      fragStack.push(concat(f1, f2));
    } else if (tok.type === 'UNION') {
      const f2 = fragStack.pop()!;
      const f1 = fragStack.pop()!;
      fragStack.push(union(f1, f2));
    } else if (tok.type === 'STAR') {
      fragStack.push(kleeneStar(fragStack.pop()!));
    } else if (tok.type === 'PLUS') {
      const f = fragStack.pop()!;
      const fCopy = fragStack.pop(); // placeholder
      void fCopy;
      // a+ = aa*  — clone by re-building star of original
      const f2 = { ...f, transitions: deepCloneTransitions(f.transitions), states: [...f.states] };
      const renameMap = new Map<string, string>();
      for (const s of f2.states) {
        const ns = freshState();
        renameMap.set(s, ns);
      }
      const renamedFrag = renameFragment(f2, renameMap);
      fragStack.push(concat(f, kleeneStar(renamedFrag)));
    } else if (tok.type === 'QMARK') {
      const f = fragStack.pop()!;
      const eps = literal('');
      // a? = a|ε
      const emptyFrag: NFAFragment = {
        start: freshState(),
        accept: freshState(),
        states: [freshState(), freshState()],
        transitions: new Map(),
      };
      const s = freshState();
      const a = freshState();
      const trans = new Map<string, Map<string, string[]>>();
      mergeTransitions(trans, f.transitions);
      addTransition(trans, s, EPSILON, f.start);
      addTransition(trans, s, EPSILON, a);
      addTransition(trans, f.accept, EPSILON, a);
      void eps;
      void emptyFrag;
      fragStack.push({ start: s, accept: a, states: [s, a, ...f.states], transitions: trans });
    }
  }

  const frag = fragStack.pop()!;
  const allStates = [...new Set(frag.states)];

  return {
    states: allStates,
    alphabet: [...alphabet],
    transitions: frag.transitions,
    startState: frag.start,
    acceptStates: [frag.accept],
  };
}

function deepCloneTransitions(
  t: Map<string, Map<string, string[]>>,
): Map<string, Map<string, string[]>> {
  const result = new Map<string, Map<string, string[]>>();
  for (const [state, inner] of t) {
    const newInner = new Map<string, string[]>();
    for (const [sym, targets] of inner) {
      newInner.set(sym, [...targets]);
    }
    result.set(state, newInner);
  }
  return result;
}

function renameFragment(f: NFAFragment, map: Map<string, string>): NFAFragment {
  const newTrans = new Map<string, Map<string, string[]>>();
  for (const [state, inner] of f.transitions) {
    const ns = map.get(state) ?? state;
    if (!newTrans.has(ns)) newTrans.set(ns, new Map());
    for (const [sym, targets] of inner) {
      newTrans.get(ns)!.set(sym, targets.map((t) => map.get(t) ?? t));
    }
  }
  return {
    start: map.get(f.start) ?? f.start,
    accept: map.get(f.accept) ?? f.accept,
    states: f.states.map((s) => map.get(s) ?? s),
    transitions: newTrans,
  };
}
