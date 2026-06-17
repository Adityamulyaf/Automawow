import { useState } from 'react';
import type { Selection } from '../../types/editor';
import { useAutomaton } from '../../context/AutomatonContext';

interface PropertiesPanelProps {
  selection: Selection;
  onClearSelection: () => void;
}

export default function PropertiesPanel({ selection, onClearSelection }: PropertiesPanelProps) {
  const { dfa, dispatch } = useAutomaton();
  const [editName, setEditName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);

  if (selection.type === 'state' && selection.id) {
    const state = selection.id;
    const isStart = dfa.startState === state;
    const isAccept = dfa.acceptStates.includes(state);
    const outgoing = [...(dfa.transitions.get(state)?.entries() ?? [])];

    return (
      <aside className="flex flex-col overflow-y-auto" style={{ padding: '16px' }}>
        <div className="flex items-center justify-between mb-4">
          <span className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">State</span>
          <button onClick={onClearSelection} className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] text-lg leading-none">×</button>
        </div>

        <div className="mb-3">
          {isEditingName ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editName && editName !== state) {
                  dispatch({ type: 'RENAME_STATE', oldName: state, newName: editName });
                }
                setIsEditingName(false);
              }}
            >
              <input
                autoFocus
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                onBlur={() => setIsEditingName(false)}
                className="font-mono text-lg font-semibold w-full border-b border-[var(--color-border-strong)] outline-none pb-1"
              />
            </form>
          ) : (
            <button
              onClick={() => { setEditName(state); setIsEditingName(true); }}
              className="font-mono text-lg font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] text-left w-full"
              title="Click to rename"
            >
              {state}
            </button>
          )}
        </div>

        <div className="flex gap-2 mb-4">
          <button
            onClick={() => dispatch({ type: 'SET_START', state })}
            className={`px-2 py-1 text-xs rounded-md transition-colors duration-100 ${
              isStart
                ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)] font-medium'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
            }`}
          >
            Start
          </button>
          <button
            onClick={() => dispatch({ type: 'TOGGLE_ACCEPT', state })}
            className={`px-2 py-1 text-xs rounded-md transition-colors duration-100 ${
              isAccept
                ? 'bg-[var(--color-accept-light)] text-[var(--color-accept)] font-medium'
                : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
            }`}
          >
            Accept
          </button>
          <button
            onClick={() => { dispatch({ type: 'DELETE_STATE', name: state }); onClearSelection(); }}
            className="px-2 py-1 text-xs rounded-md bg-[var(--color-surface)] text-[var(--color-reject)] hover:bg-[var(--color-reject-light)] transition-colors duration-100 ml-auto"
          >
            Delete
          </button>
        </div>

        <div>
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Outgoing Transitions</p>
          {outgoing.length === 0 ? (
            <p className="text-xs text-[var(--color-text-muted)]">None</p>
          ) : (
            <div className="flex flex-col gap-1">
              {outgoing.map(([sym, to]) => (
                <div key={sym} className="flex items-center gap-2 text-sm">
                  <span className="font-mono text-[var(--color-text-secondary)]">{sym}</span>
                  <span className="text-[var(--color-text-muted)]">→</span>
                  <span className="font-mono text-[var(--color-text-primary)]">{to}</span>
                  <button
                    onClick={() => dispatch({ type: 'DELETE_TRANSITION', from: state, to, symbol: sym })}
                    className="ml-auto text-xs text-[var(--color-text-muted)] hover:text-[var(--color-reject)]"
                  >×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-4">
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Add Transition</p>
          <form
            className="flex gap-1 items-center"
            onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const sym = (fd.get('sym') as string).trim();
              const to = (fd.get('to') as string).trim();
              if (sym && to && dfa.states.includes(to)) {
                dispatch({ type: 'ADD_TRANSITION', from: state, to, symbol: sym });
                (e.target as HTMLFormElement).reset();
              }
            }}
          >
            <input name="sym" placeholder="sym" maxLength={3} className="font-mono w-12 border-b border-[var(--color-border-strong)] outline-none text-sm px-1" />
            <span className="text-[var(--color-text-muted)]">→</span>
            <input name="to" placeholder="state" list="state-list" className="font-mono flex-1 border-b border-[var(--color-border-strong)] outline-none text-sm px-1" />
            <datalist id="state-list">{dfa.states.map((s) => <option key={s} value={s} />)}</datalist>
            <button type="submit" className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium">Add</button>
          </form>
        </div>
      </aside>
    );
  }

  return (
    <aside className="flex flex-col overflow-y-auto" style={{ padding: '16px' }}>
      <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-4">Automaton</p>
      <div className="flex flex-col gap-3 text-sm">
        <Row label="States" value={dfa.states.length.toString()} />
        <Row label="Alphabet" value={dfa.alphabet.join(', ') || '—'} />
        <Row label="Start" value={dfa.startState || '—'} mono />
        <Row label="Accept" value={dfa.acceptStates.join(', ') || '—'} mono />
        <Row label="Transitions" value={[...dfa.transitions.values()].reduce((sum, r) => sum + r.size, 0).toString()} />
      </div>

      {dfa.states.length > 0 && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">States</p>
          <div className="flex flex-wrap gap-1">
            {dfa.states.map((s) => (
              <span
                key={s}
                className={`font-mono text-xs px-2 py-0.5 rounded ${
                  dfa.acceptStates.includes(s)
                    ? 'bg-[var(--color-accept-light)] text-[var(--color-accept)]'
                    : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)]'
                } ${dfa.startState === s ? 'ring-1 ring-[var(--color-primary)]' : ''}`}
              >
                {s}
              </span>
            ))}
          </div>
        </div>
      )}
    </aside>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[var(--color-text-muted)]">{label}</span>
      <span className={`text-[var(--color-text-primary)] ${mono ? 'font-mono' : ''}`}>{value}</span>
    </div>
  );
}
