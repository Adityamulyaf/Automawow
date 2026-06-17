export type Tool =
  | 'select'
  | 'pan'
  | 'addState'
  | 'addTransition'
  | 'setStart'
  | 'toggleAccept'
  | 'delete';

export interface Selection {
  type: 'state' | 'transition' | 'none';
  id: string | null;
}

export interface TransitionDraft {
  fromState: string;
  toState: string | null;
}

export type AppTab = 'editor' | 'dfa-sim' | 'regex' | 'nfa-test' | 'minimize' | 'equivalence';

export interface CanvasTransform {
  x: number;
  y: number;
  scale: number;
}
