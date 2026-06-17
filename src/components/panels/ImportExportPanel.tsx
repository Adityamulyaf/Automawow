import React, { useState, useRef } from 'react';
import { useAutomaton } from '../../context/AutomatonContext';
import { dfaToJSON, downloadJSON, parseAutomatonJSON, jsonToDFA, jsonToNFA } from '../../utils/serialization';
import { circularLayout } from '../../algorithms/autoLayout';

export default function ImportExportPanel() {
  const { dfa, loadDFA, loadNFA } = useAutomaton();
  const [importText, setImportText] = useState('');
  const [importError, setImportError] = useState('');
  const [importSuccess, setImportSuccess] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const json = dfaToJSON(dfa);
    downloadJSON(json, `automaton-${Date.now()}.json`);
  };

  const handleImport = () => {
    setImportError('');
    setImportSuccess(false);
    const { json, error } = parseAutomatonJSON(importText);
    if (error) { setImportError(error); return; }

    try {
      if (json.type === 'NFA') {
        const nfa = jsonToNFA(json);
        const pos = circularLayout(nfa.states, nfa.startState);
        loadNFA(nfa, pos);
      } else {
        const newDfa = jsonToDFA(json);
        const pos = circularLayout(newDfa.states, newDfa.startState);
        loadDFA(newDfa, pos);
      }
      setImportSuccess(true);
    } catch (e) {
      setImportError(`Import failed: ${(e as Error).message}`);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImportText(ev.target?.result as string);
      setImportError('');
      setImportSuccess(false);
    };
    reader.readAsText(file);
  };

  const exampleDFA = JSON.stringify({
    type: 'DFA',
    states: ['q0', 'q1', 'q2'],
    alphabet: ['0', '1'],
    transitions: [
      { from: 'q0', to: 'q1', symbol: '0' },
      { from: 'q0', to: 'q0', symbol: '1' },
      { from: 'q1', to: 'q1', symbol: '0' },
      { from: 'q1', to: 'q2', symbol: '1' },
      { from: 'q2', to: 'q1', symbol: '0' },
      { from: 'q2', to: 'q0', symbol: '1' },
    ],
    startState: 'q0',
    acceptStates: ['q0'],
  }, null, 2);

  return (
    <div className="flex flex-col gap-4 p-4 h-full overflow-y-auto">
      {/* Export */}
      <div>
        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Export</p>
        <button
          onClick={handleExport}
          disabled={dfa.states.length === 0}
          className="px-3 py-1.5 text-sm bg-[var(--color-surface)] text-[var(--color-text-secondary)] rounded-md hover:bg-[var(--color-surface-hover)] disabled:opacity-40 transition-colors duration-100"
        >
          Download JSON
        </button>
      </div>

      {/* Import */}
      <div>
        <p className="text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2">Import</p>
        <div className="flex gap-2 mb-2">
          <button
            onClick={() => fileRef.current?.click()}
            className="px-3 py-1.5 text-sm bg-[var(--color-surface)] text-[var(--color-text-secondary)] rounded-md hover:bg-[var(--color-surface-hover)] transition-colors duration-100"
          >
            Upload File
          </button>
          <button
            onClick={() => { setImportText(exampleDFA); setImportError(''); setImportSuccess(false); }}
            className="px-3 py-1.5 text-sm text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors duration-100"
          >
            Load Example
          </button>
          <input ref={fileRef} type="file" accept=".json" className="hidden" onChange={handleFileUpload} />
        </div>
        <textarea
          value={importText}
          onChange={(e) => { setImportText(e.target.value); setImportError(''); setImportSuccess(false); }}
          rows={12}
          placeholder={'Paste JSON here…'}
          className="w-full font-mono text-xs border border-[var(--color-border)] rounded-md p-2 outline-none resize-y bg-[var(--color-surface)] focus:border-[var(--color-border-strong)]"
        />
        <button
          onClick={handleImport}
          disabled={!importText.trim()}
          className="mt-2 px-3 py-1.5 text-sm bg-[var(--color-primary)] text-white rounded-md hover:bg-[var(--color-primary-hover)] disabled:opacity-40 transition-colors duration-100"
        >
          Import
        </button>
        {importError && (
          <div className="mt-2 px-3 py-2 rounded-md text-xs bg-[var(--color-reject-light)] text-[var(--color-reject)]">
            {importError}
          </div>
        )}
        {importSuccess && (
          <div className="mt-2 px-3 py-2 rounded-md text-xs bg-[var(--color-accept-light)] text-[var(--color-accept)]">
            ✓ Automaton imported successfully.
          </div>
        )}
      </div>
    </div>
  );
}
