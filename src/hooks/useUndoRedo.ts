import { useState, useCallback } from 'react';

export function useUndoRedo<T>(initial: T) {
  const [history, setHistory] = useState<T[]>([initial]);
  const [index, setIndex] = useState(0);

  const current = history[index];

  const push = useCallback((next: T) => {
    setHistory((prev) => [...prev.slice(0, index + 1), next]);
    setIndex((i) => i + 1);
  }, [index]);

  const undo = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const redo = useCallback(() => {
    setHistory((prev) => {
      setIndex((i) => Math.min(prev.length - 1, i + 1));
      return prev;
    });
  }, []);

  const canUndo = index > 0;
  const canRedo = index < history.length - 1;

  return { current, push, undo, redo, canUndo, canRedo };
}
