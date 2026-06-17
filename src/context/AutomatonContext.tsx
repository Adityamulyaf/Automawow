import React, { createContext, useContext, useReducer, useCallback, useState } from 'react';
import type { DFA, NFA, Position } from '../types/automata';
import { EPSILON } from '../types/automata';
import { layoutStates } from '../utils/graphLayout';
import CustomModal from '../components/shared/CustomModal';
import type { ModalConfig } from '../components/shared/CustomModal';

interface AutomatonState {
  dfa: DFA;
  positions: Map<string, Position>;
  dfa2: DFA;
  positions2: Map<string, Position>;
  activeCanvas: 'dfa' | 'dfa2';
}

type Action =
  | { type: 'SET_DFA'; dfa: DFA; positions?: Map<string, Position> }
  | { type: 'ADD_STATE'; name: string; position: Position }
  | { type: 'DELETE_STATE'; name: string }
  | { type: 'RENAME_STATE'; oldName: string; newName: string }
  | { type: 'SET_START'; state: string }
  | { type: 'TOGGLE_ACCEPT'; state: string }
  | { type: 'ADD_TRANSITION'; from: string; to: string; symbol: string }
  | { type: 'DELETE_TRANSITION'; from: string; to: string; symbol: string }
  | { type: 'EDIT_TRANSITION'; from: string; to: string; oldSymbol: string; newSymbol: string }
  | { type: 'UPDATE_POSITION'; state: string; position: Position }
  | { type: 'AUTO_LAYOUT' }
  | { type: 'RESET' }
  | { type: 'SET_ACTIVE_CANVAS'; canvas: 'dfa' | 'dfa2' }
  | { type: 'SWAP_CANVASSES' }
  | { type: 'COPY_CANVAS'; from: 'dfa' | 'dfa2'; to: 'dfa' | 'dfa2' };

function emptyDFA(): DFA {
  return { states: [], alphabet: [], transitions: new Map(), startState: '', acceptStates: [] };
}

function computeAlphabet(transitions: Map<string, Map<string, string>>): string[] {
  const syms = new Set<string>();
  for (const row of transitions.values()) {
    for (const sym of row.keys()) {
      if (sym !== EPSILON) syms.add(sym);
    }
  }
  return [...syms].sort();
}

function subReducer(
  state: { dfa: DFA; positions: Map<string, Position> },
  action: Action,
): { dfa: DFA; positions: Map<string, Position> } {
  const { dfa, positions } = state;

  switch (action.type) {
    case 'SET_DFA': {
      const pos = action.positions ?? layoutStates(action.dfa.states, action.dfa.startState);
      return { dfa: action.dfa, positions: pos };
    }

    case 'RESET':
      return { dfa: emptyDFA(), positions: new Map() };

    case 'ADD_STATE': {
      if (dfa.states.includes(action.name)) return state;
      const transitions = new Map(dfa.transitions);
      transitions.set(action.name, new Map());
      const newPositions = new Map(positions);
      newPositions.set(action.name, action.position);
      return {
        dfa: {
          ...dfa,
          states: [...dfa.states, action.name],
          startState: dfa.startState || action.name,
          transitions,
        },
        positions: newPositions,
      };
    }

    case 'DELETE_STATE': {
      const newStates = dfa.states.filter((s) => s !== action.name);
      const transitions = new Map(dfa.transitions);
      transitions.delete(action.name);
      for (const [from, row] of transitions) {
        const newRow = new Map(row);
        for (const [sym, to] of newRow) {
          if (to === action.name) newRow.delete(sym);
        }
        transitions.set(from, newRow);
      }
      const newPositions = new Map(positions);
      newPositions.delete(action.name);
      return {
        dfa: {
          ...dfa,
          states: newStates,
          startState: dfa.startState === action.name ? (newStates[0] ?? '') : dfa.startState,
          acceptStates: dfa.acceptStates.filter((s) => s !== action.name),
          transitions,
          alphabet: computeAlphabet(transitions),
        },
        positions: newPositions,
      };
    }

    case 'RENAME_STATE': {
      const rename = (s: string) => (s === action.oldName ? action.newName : s);
      const transitions = new Map<string, Map<string, string>>();
      for (const [from, row] of dfa.transitions) {
        const newRow = new Map<string, string>();
        for (const [sym, to] of row) newRow.set(sym, rename(to));
        transitions.set(rename(from), newRow);
      }
      const newPositions = new Map(positions);
      const pos = newPositions.get(action.oldName);
      if (pos) { newPositions.delete(action.oldName); newPositions.set(action.newName, pos); }
      return {
        dfa: {
          ...dfa,
          states: dfa.states.map(rename),
          startState: rename(dfa.startState),
          acceptStates: dfa.acceptStates.map(rename),
          transitions,
        },
        positions: newPositions,
      };
    }

    case 'SET_START':
      return { ...state, dfa: { ...dfa, startState: action.state } };

    case 'TOGGLE_ACCEPT': {
      const isAccept = dfa.acceptStates.includes(action.state);
      return {
        ...state,
        dfa: {
          ...dfa,
          acceptStates: isAccept
            ? dfa.acceptStates.filter((s) => s !== action.state)
            : [...dfa.acceptStates, action.state],
        },
      };
    }

    case 'ADD_TRANSITION': {
      const transitions = new Map(dfa.transitions);
      if (!transitions.has(action.from)) transitions.set(action.from, new Map());
      transitions.set(action.from, new Map(transitions.get(action.from)!).set(action.symbol, action.to));
      return { ...state, dfa: { ...dfa, transitions, alphabet: computeAlphabet(transitions) } };
    }

    case 'DELETE_TRANSITION': {
      const transitions = new Map(dfa.transitions);
      const row = new Map(transitions.get(action.from));
      row.delete(action.symbol);
      transitions.set(action.from, row);
      return { ...state, dfa: { ...dfa, transitions, alphabet: computeAlphabet(transitions) } };
    }

    case 'EDIT_TRANSITION': {
      const transitions = new Map(dfa.transitions);
      const row = new Map(transitions.get(action.from));
      row.delete(action.oldSymbol);
      row.set(action.newSymbol, action.to);
      transitions.set(action.from, row);
      return { ...state, dfa: { ...dfa, transitions, alphabet: computeAlphabet(transitions) } };
    }

    case 'UPDATE_POSITION': {
      const newPositions = new Map(positions);
      newPositions.set(action.state, action.position);
      return { ...state, positions: newPositions };
    }

    case 'AUTO_LAYOUT':
      return { ...state, positions: layoutStates(dfa.states, dfa.startState) };

    default:
      return state;
  }
}

function reducer(state: AutomatonState, action: Action): AutomatonState {
  if (action.type === 'SET_ACTIVE_CANVAS') {
    return { ...state, activeCanvas: action.canvas };
  }
  if (action.type === 'SWAP_CANVASSES') {
    return {
      ...state,
      dfa: state.dfa2,
      positions: state.positions2,
      dfa2: state.dfa,
      positions2: state.positions,
    };
  }
  if (action.type === 'COPY_CANVAS') {
    const copyDFA = (d: DFA): DFA => {
      const trans = new Map<string, Map<string, string>>();
      for (const [from, row] of d.transitions) {
        trans.set(from, new Map(row));
      }
      return {
        states: [...d.states],
        alphabet: [...d.alphabet],
        transitions: trans,
        startState: d.startState,
        acceptStates: [...d.acceptStates],
      };
    };
    if (action.from === 'dfa' && action.to === 'dfa2') {
      return {
        ...state,
        dfa2: copyDFA(state.dfa),
        positions2: new Map(state.positions),
      };
    }
    if (action.from === 'dfa2' && action.to === 'dfa') {
      return {
        ...state,
        dfa: copyDFA(state.dfa2),
        positions: new Map(state.positions2),
      };
    }
  }

  const { dfa, positions, dfa2, positions2, activeCanvas } = state;
  const targetDfa = activeCanvas === 'dfa' ? dfa : dfa2;
  const targetPositions = activeCanvas === 'dfa' ? positions : positions2;

  const subState = { dfa: targetDfa, positions: targetPositions };
  const nextSubState = subReducer(subState, action);

  if (nextSubState === subState) return state;

  if (activeCanvas === 'dfa') {
    return {
      ...state,
      dfa: nextSubState.dfa,
      positions: nextSubState.positions,
    };
  } else {
    return {
      ...state,
      dfa2: nextSubState.dfa,
      positions2: nextSubState.positions,
    };
  }
}

interface AutomatonContextValue {
  dfa: DFA;
  positions: Map<string, Position>;
  dfa2: DFA;
  positions2: Map<string, Position>;
  activeCanvas: 'dfa' | 'dfa2';
  dispatch: React.Dispatch<Action>;
  loadNFA: (nfa: NFA, positions?: Map<string, Position>) => void;
  loadDFA: (dfa: DFA, positions?: Map<string, Position>) => void;
  showPrompt: (config: Omit<ModalConfig, 'type'>) => void;
  showConfirm: (config: Omit<ModalConfig, 'type'>) => void;
}

const AutomatonContext = createContext<AutomatonContextValue | null>(null);

export function AutomatonProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(reducer, {
    dfa: emptyDFA(),
    positions: new Map(),
    dfa2: emptyDFA(),
    positions2: new Map(),
    activeCanvas: 'dfa',
  });

  const [modalConfig, setModalConfig] = useState<ModalConfig | null>(null);

  const showPrompt = useCallback((config: Omit<ModalConfig, 'type'>) => {
    setModalConfig({ ...config, type: 'prompt' });
  }, []);

  const showConfirm = useCallback((config: Omit<ModalConfig, 'type'>) => {
    setModalConfig({ ...config, type: 'confirm' });
  }, []);

  const loadDFA = useCallback((newDFA: DFA, pos?: Map<string, Position>) => {
    dispatch({ type: 'SET_DFA', dfa: newDFA, positions: pos });
  }, []);

  const loadNFA = useCallback((nfa: NFA, pos?: Map<string, Position>) => {
    const dfaTrans = new Map<string, Map<string, string>>();
    for (const [from, row] of nfa.transitions) {
      const newRow = new Map<string, string>();
      for (const [sym, targets] of row) newRow.set(sym, targets.join(','));
      dfaTrans.set(from, newRow);
    }
    const fakeDFA: DFA = {
      states: nfa.states,
      alphabet: nfa.alphabet,
      transitions: dfaTrans,
      startState: nfa.startState,
      acceptStates: nfa.acceptStates,
    };
    dispatch({ type: 'SET_DFA', dfa: fakeDFA, positions: pos });
  }, []);

  return (
    <AutomatonContext.Provider
      value={{
        dfa: state.dfa,
        positions: state.positions,
        dfa2: state.dfa2,
        positions2: state.positions2,
        activeCanvas: state.activeCanvas,
        dispatch,
        loadNFA,
        loadDFA,
        showPrompt,
        showConfirm,
      }}
    >
      {children}
      {modalConfig && (
        <CustomModal config={modalConfig} onClose={() => setModalConfig(null)} />
      )}
    </AutomatonContext.Provider>
  );
}

export function useAutomaton() {
  const ctx = useContext(AutomatonContext);
  if (!ctx) throw new Error('useAutomaton must be used within AutomatonProvider');
  return ctx;
}
