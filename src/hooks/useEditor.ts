import { useState, useCallback } from 'react';
import type { Tool, Selection, TransitionDraft } from '../types/editor';

export function useEditor() {
  const [activeTool, setActiveTool] = useState<Tool>('select');
  const [selection, setSelection] = useState<Selection>({ type: 'none', id: null });
  const [transitionDraft, setTransitionDraft] = useState<TransitionDraft | null>(null);

  const selectTool = useCallback((tool: Tool) => {
    setActiveTool(tool);
    setSelection({ type: 'none', id: null });
    setTransitionDraft(null);
  }, []);

  const selectState = useCallback((id: string) => setSelection({ type: 'state', id }), []);
  const selectTransition = useCallback((id: string) => setSelection({ type: 'transition', id }), []);
  const clearSelection = useCallback(() => { setSelection({ type: 'none', id: null }); setTransitionDraft(null); }, []);
  const startTransitionDraft = useCallback((fromState: string) => setTransitionDraft({ fromState, toState: null }), []);
  const completeTransitionDraft = useCallback((toState: string) => setTransitionDraft((d) => d ? { ...d, toState } : null), []);
  const cancelTransitionDraft = useCallback(() => setTransitionDraft(null), []);

  return { activeTool, selection, transitionDraft, selectTool, selectState, selectTransition, clearSelection, startTransitionDraft, completeTransitionDraft, cancelTransitionDraft };
}
