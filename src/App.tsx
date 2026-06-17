import { useState, useCallback, useRef, useEffect } from 'react';
import { AutomatonProvider, useAutomaton } from './context/AutomatonContext';
import { useEditor } from './hooks/useEditor';
import Header from './components/layout/Header';
import Toolbar from './components/layout/Toolbar';
import PropertiesPanel from './components/layout/PropertiesPanel';
import StatusBar from './components/layout/StatusBar';
import GraphCanvas from './components/canvas/GraphCanvas';
import DFASimPanel from './components/panels/DFASimPanel';
import RegexPanel from './components/panels/RegexPanel';
import NFATestPanel from './components/panels/NFATestPanel';
import MinimizePanel from './components/panels/MinimizePanel';
import EquivalencePanel from './components/panels/EquivalencePanel';
import ImportExportPanel from './components/panels/ImportExportPanel';
import type { AppTab } from './types/editor';

const MIN_PANEL = 200;
const MAX_PANEL = 600;
const DEFAULT_PANEL = 300;

function AppInner() {
  const { dfa, positions, dfa2, positions2, activeCanvas, dispatch, showPrompt } = useAutomaton();
  const [activeTab, setActiveTab] = useState<AppTab>('editor');
  const [activeStates, setActiveStates] = useState<string[]>([]);
  const [panelWidth, setPanelWidth] = useState(DEFAULT_PANEL);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartWidth = useRef(DEFAULT_PANEL);

  const editorLeft = useEditor();
  const editorRight = useEditor();
  const editorMain = useEditor();

  const currentEditor = activeTab === 'equivalence'
    ? (activeCanvas === 'dfa' ? editorLeft : editorRight)
    : editorMain;

  const handleTabChange = useCallback(
    (tab: AppTab) => {
      setActiveTab(tab);
      setActiveStates([]);
      editorLeft.clearSelection();
      editorRight.clearSelection();
      editorMain.clearSelection();
      dispatch({ type: 'SET_ACTIVE_CANVAS', canvas: 'dfa' });
    },
    [dispatch, editorLeft, editorRight, editorMain],
  );

  const handleTransitionComplete = useCallback(
    (from: string, to: string, clearSel: () => void) => {
      showPrompt({
        title: 'New Transition',
        message: `Transition symbol from ${from} to ${to}:`,
        placeholder: 'e.g. 0, a, ε',
        defaultValue: '',
        onConfirm: (symbol) => {
          if (symbol.trim()) {
            dispatch({ type: 'ADD_TRANSITION', from, to, symbol: symbol.trim() });
          }
          clearSel();
        },
        onCancel: () => {
          clearSel();
        },
      });
    },
    [dispatch, showPrompt],
  );

  // Resize handle drag logic
  const onDividerMouseDown = useCallback((e: React.MouseEvent) => {
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartWidth.current = panelWidth;
    e.preventDefault();
  }, [panelWidth]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      const delta = dragStartX.current - e.clientX; // dragging left = wider panel
      const next = Math.min(MAX_PANEL, Math.max(MIN_PANEL, dragStartWidth.current + delta));
      setPanelWidth(next);
    };
    const onMouseUp = () => { isDragging.current = false; };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const rightPanel = () => {
    switch (activeTab) {
      case 'dfa-sim':
        return <DFASimPanel onActiveStateChange={setActiveStates} />;
      case 'regex':
        return <RegexPanel />;
      case 'nfa-test':
        return <NFATestPanel onActiveStatesChange={setActiveStates} />;
      case 'minimize':
        return <MinimizePanel />;
      case 'equivalence':
        return <EquivalencePanel />;
      case 'editor':
      default:
        return <PropertiesPanel selection={currentEditor.selection} onClearSelection={currentEditor.clearSelection} />;
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <Header activeTab={activeTab} onTabChange={handleTabChange} />
      <div className="flex flex-1 overflow-hidden">
        <Toolbar activeTool={currentEditor.activeTool} onToolChange={currentEditor.selectTool} />
        <main className="flex flex-1 overflow-hidden">
          {activeTab === 'equivalence' ? (
            <div className="flex flex-1 overflow-hidden divide-x divide-[var(--color-border)]">
              {/* Left Canvas (DFA 1) */}
              <div className="flex flex-1 flex-col relative overflow-hidden h-full">
                <div className="absolute top-2 left-4 z-20 pointer-events-none">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm border border-[var(--color-border)] rounded text-xs font-semibold text-[var(--color-text-secondary)] shadow-sm">
                    DFA 1 (Kiri)
                  </span>
                </div>
                <GraphCanvas
                  dfa={dfa}
                  positions={positions}
                  isActive={activeCanvas === 'dfa'}
                  onFocus={() => dispatch({ type: 'SET_ACTIVE_CANVAS', canvas: 'dfa' })}
                  showFocusRing={true}
                  activeTool={editorLeft.activeTool}
                  selection={editorLeft.selection}
                  onSelectState={editorLeft.selectState}
                  onSelectTransition={editorLeft.selectTransition}
                  onClearSelection={editorLeft.clearSelection}
                  activeStates={activeStates}
                  transitionDraftFrom={editorLeft.transitionDraft?.fromState ?? null}
                  onTransitionDraftStart={editorLeft.startTransitionDraft}
                  onTransitionDraftComplete={(from, to) =>
                    handleTransitionComplete(from, to, editorLeft.clearSelection)
                  }
                />
              </div>

              {/* Right Canvas (DFA 2) */}
              <div className="flex flex-1 flex-col relative overflow-hidden h-full">
                <div className="absolute top-2 left-4 z-20 pointer-events-none">
                  <span className="px-2 py-1 bg-white/90 backdrop-blur-sm border border-[var(--color-border)] rounded text-xs font-semibold text-[var(--color-text-secondary)] shadow-sm">
                    DFA 2 (Kanan)
                  </span>
                </div>
                <GraphCanvas
                  dfa={dfa2}
                  positions={positions2}
                  isActive={activeCanvas === 'dfa2'}
                  onFocus={() => dispatch({ type: 'SET_ACTIVE_CANVAS', canvas: 'dfa2' })}
                  showFocusRing={true}
                  activeTool={editorRight.activeTool}
                  selection={editorRight.selection}
                  onSelectState={editorRight.selectState}
                  onSelectTransition={editorRight.selectTransition}
                  onClearSelection={editorRight.clearSelection}
                  activeStates={activeStates}
                  transitionDraftFrom={editorRight.transitionDraft?.fromState ?? null}
                  onTransitionDraftStart={editorRight.startTransitionDraft}
                  onTransitionDraftComplete={(from, to) =>
                    handleTransitionComplete(from, to, editorRight.clearSelection)
                  }
                />
              </div>
            </div>
          ) : (
            <GraphCanvas
              activeTool={editorMain.activeTool}
              selection={editorMain.selection}
              onSelectState={editorMain.selectState}
              onSelectTransition={editorMain.selectTransition}
              onClearSelection={editorMain.clearSelection}
              activeStates={activeStates}
              transitionDraftFrom={editorMain.transitionDraft?.fromState ?? null}
              onTransitionDraftStart={editorMain.startTransitionDraft}
              onTransitionDraftComplete={(from, to) =>
                handleTransitionComplete(from, to, editorMain.clearSelection)
              }
            />
          )}

          {/* Drag handle */}
          <div
            onMouseDown={onDividerMouseDown}
            className="flex-shrink-0 flex items-center justify-center w-1.5 bg-transparent hover:bg-[var(--color-border)] transition-colors duration-100 group"
            style={{ cursor: 'col-resize', userSelect: 'none' }}
            title="Drag to resize panel"
          >
            <div className="w-0.5 h-8 rounded-full bg-[var(--color-border)] group-hover:bg-[var(--color-border-strong)] transition-colors duration-100" />
          </div>

          <aside
            className="overflow-y-auto bg-white border-l border-[var(--color-border)] flex-shrink-0"
            style={{ width: panelWidth }}
          >
            {rightPanel()}
          </aside>
        </main>
      </div>
      <StatusBar />
      <ImportExportButton />
    </div>
  );
}

function ImportExportButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        title="Import / Export"
        className="fixed w-10 h-10 rounded-full bg-white border border-[var(--color-border)] shadow-sm flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition-colors duration-100 z-50"
        style={{ bottom: 36, right: 24 }}
      >
        ⇅
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
          <div className="bg-white rounded-lg shadow-sm border border-[var(--color-border)] w-[420px] max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)]">
              <span className="text-sm font-semibold text-[var(--color-text-primary)]">Import / Export</span>
              <button
                onClick={() => setOpen(false)}
                className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] text-xl leading-none"
              >
                ×
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <ImportExportPanel />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function App() {
  return (
    <AutomatonProvider>
      <AppInner />
    </AutomatonProvider>
  );
}
