import { useState } from 'react';
import { useAutomaton } from '../../context/AutomatonContext';
import { checkEquivalence } from '../../algorithms/dfaEquivalence';
import type { EquivalenceResult } from '../../algorithms/dfaEquivalence';
import { IconWarning } from '../shared/Icons';

export default function EquivalencePanel() {
  const { dfa, dfa2, dispatch } = useAutomaton();
  const [result, setResult] = useState<EquivalenceResult | null>(null);

  const handleCheck = () => {
    setResult(checkEquivalence(dfa, dfa2));
  };

  const hasDFA1 = dfa.states.length > 0 && !!dfa.startState;
  const hasDFA2 = dfa2.states.length > 0 && !!dfa2.startState;
  const canCheck = hasDFA1 && hasDFA2;

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
      <div>
        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-1">
          DFA Equivalence
        </p>
        <p className="text-xs text-[var(--color-text-muted)]">
          Bandingkan dua DFA pada layar kiri dan kanan secara langsung untuk memeriksa apakah keduanya menerima bahasa yang sama.
        </p>
      </div>

      {/* DFA 1 Info Card */}
      <div className="border border-[var(--color-border)] rounded-lg p-3 bg-[var(--color-surface)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-[var(--color-text-primary)]">DFA 1 (Kiri)</span>
          <button
            onClick={() => dispatch({ type: 'COPY_CANVAS', from: 'dfa', to: 'dfa2' })}
            disabled={dfa.states.length === 0}
            className="text-[10px] text-[var(--color-primary)] hover:underline disabled:opacity-40"
            title="Salin isi kanvas kiri ke kanvas kanan"
          >
            Salin ke DFA 2 →
          </button>
        </div>
        <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
          <p>State ({dfa.states.length}): <code className="bg-white px-1 py-0.5 rounded border border-[var(--color-border)]">{dfa.states.join(', ') || '—'}</code></p>
          <p>Alphabet: <code className="bg-white px-1 py-0.5 rounded border border-[var(--color-border)]">{dfa.alphabet.join(', ') || '—'}</code></p>
          <p>Start State: <code className="bg-white px-1 py-0.5 rounded border border-[var(--color-border)]">{dfa.startState || 'Belum diatur'}</code></p>
          <p>Accept States: <code className="bg-white px-1 py-0.5 rounded border border-[var(--color-border)]">{dfa.acceptStates.join(', ') || 'Tidak ada'}</code></p>
        </div>
      </div>

      {/* DFA 2 Info Card */}
      <div className="border border-[var(--color-border)] rounded-lg p-3 bg-[var(--color-surface)]">
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs font-bold text-[var(--color-text-primary)]">DFA 2 (Kanan)</span>
          <button
            onClick={() => dispatch({ type: 'COPY_CANVAS', from: 'dfa2', to: 'dfa' })}
            disabled={dfa2.states.length === 0}
            className="text-[10px] text-[var(--color-primary)] hover:underline disabled:opacity-40"
            title="Salin isi kanvas kanan ke kanvas kiri"
          >
            ← Salin ke DFA 1
          </button>
        </div>
        <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
          <p>State ({dfa2.states.length}): <code className="bg-white px-1 py-0.5 rounded border border-[var(--color-border)]">{dfa2.states.join(', ') || '—'}</code></p>
          <p>Alphabet: <code className="bg-white px-1 py-0.5 rounded border border-[var(--color-border)]">{dfa2.alphabet.join(', ') || '—'}</code></p>
          <p>Start State: <code className="bg-white px-1 py-0.5 rounded border border-[var(--color-border)]">{dfa2.startState || 'Belum diatur'}</code></p>
          <p>Accept States: <code className="bg-white px-1 py-0.5 rounded border border-[var(--color-border)]">{dfa2.acceptStates.join(', ') || 'Tidak ada'}</code></p>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleCheck}
          disabled={!canCheck}
          className="flex-1 px-3 py-2 text-sm font-semibold bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] disabled:opacity-40 transition-colors duration-100"
        >
          Check Equivalence
        </button>
        <button
          onClick={() => {
            dispatch({ type: 'SWAP_CANVASSES' });
            setResult(null);
          }}
          className="px-3 py-2 text-xs border border-[var(--color-border)] hover:bg-[var(--color-surface-hover)] rounded-md text-[var(--color-text-secondary)] transition-colors duration-100"
          title="Tukar isi kanvas kiri dan kanan"
        >
          Swap
        </button>
      </div>

      {!canCheck && (
        <div className="flex gap-1.5 items-start text-[10px] text-amber-600 bg-amber-50 border border-amber-200 rounded p-2">
          <IconWarning size={14} className="flex-shrink-0 mt-0.5 text-amber-500" />
          <span>
            Pastikan kedua DFA memiliki minimal 1 state dan telah menetapkan start state (titik mulai) sebelum membandingkan.
          </span>
        </div>
      )}

      {/* Result Display */}
      {result && (
        <div
          className={`px-3 py-3 rounded-lg border text-sm ${
            result.equivalent
              ? 'bg-[var(--color-accept-light)] text-[var(--color-accept)] border-[var(--color-accept)]/30'
              : 'bg-[var(--color-reject-light)] text-[var(--color-reject)] border-[var(--color-reject)]/30'
          }`}
        >
          <p className="font-bold">{result.equivalent ? '✓ Equivalent (Ekuivalen)' : '✗ Not Equivalent (Tidak Ekuivalen)'}</p>
          <p className="text-xs mt-1 font-normal opacity-90">{result.message}</p>
          {result.distinguishingString && (
            <div className="mt-2 text-xs">
              <span className="opacity-80">String pembeda:</span>{' '}
              <code className="bg-white px-1.5 py-0.5 rounded font-mono border border-black/10 font-bold">
                {result.distinguishingString}
              </code>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
