import type { DFA } from '../types/automata';

export interface ValidationResult {
  valid: boolean;
  warnings: string[];
  errors: string[];
}

export function validateDFA(dfa: DFA): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!dfa.startState) errors.push('No start state defined.');
  if (dfa.states.length === 0) errors.push('DFA has no states.');
  if (dfa.alphabet.length === 0) warnings.push('Alphabet is empty.');

  for (const state of dfa.states) {
    for (const sym of dfa.alphabet) {
      const next = dfa.transitions.get(state)?.get(sym);
      if (!next) {
        warnings.push(`Missing transition: δ(${state}, ${sym}) is undefined.`);
      } else if (!dfa.states.includes(next)) {
        errors.push(`Transition δ(${state}, ${sym}) → "${next}" references unknown state.`);
      }
    }
  }

  return { valid: errors.length === 0, errors, warnings };
}
