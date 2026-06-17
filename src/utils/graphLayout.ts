import type { Position } from '../types/automata';
import { circularLayout } from '../algorithms/autoLayout';

export function layoutStates(
  states: string[],
  startState: string,
  existing?: Map<string, Position>,
): Map<string, Position> {
  const positions = circularLayout(states, startState);
  if (existing) {
    for (const [id, pos] of existing) {
      if (positions.has(id)) positions.set(id, pos);
    }
  }
  return positions;
}
