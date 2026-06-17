export interface DFA {
  states: string[];
  alphabet: string[];
  transitions: Map<string, Map<string, string>>;
  startState: string;
  acceptStates: string[];
}

export interface NFA {
  states: string[];
  alphabet: string[];
  transitions: Map<string, Map<string, string[]>>;
  startState: string;
  acceptStates: string[];
}

export interface TransitionEntry {
  from: string;
  to: string;
  symbol: string;
}

export interface AutomatonJSON {
  type: 'DFA' | 'NFA';
  states: string[];
  alphabet: string[];
  transitions: TransitionEntry[];
  startState: string;
  acceptStates: string[];
}

export interface Position {
  x: number;
  y: number;
}

export type AutomatonType = 'DFA' | 'NFA';

export const EPSILON = 'ε';
