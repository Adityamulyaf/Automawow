import { useState, useCallback, useRef } from 'react';
import type { CanvasTransform } from '../types/editor';

const ZOOM_STEP = 1.2;
const ZOOM_MIN = 0.2;
const ZOOM_MAX = 4;

export function useCanvasInteraction() {
  const [transform, setTransform] = useState<CanvasTransform>({ x: 0, y: 0, scale: 1 });
  const isPanning = useRef(false);
  const lastPan = useRef({ x: 0, y: 0 });

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 1 / ZOOM_STEP : ZOOM_STEP;
    setTransform((t) => ({ ...t, scale: Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, t.scale * delta)) }));
  }, []);

  const startPan = useCallback((e: React.MouseEvent) => {
    isPanning.current = true;
    lastPan.current = { x: e.clientX, y: e.clientY };
    e.preventDefault();
  }, []);

  const onCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button === 1 || e.altKey) startPan(e);
  }, [startPan]);

  const onCanvasMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - lastPan.current.x;
    const dy = e.clientY - lastPan.current.y;
    lastPan.current = { x: e.clientX, y: e.clientY };
    setTransform((t) => ({ ...t, x: t.x + dx, y: t.y + dy }));
  }, []);

  const onCanvasMouseUp = useCallback(() => {
    isPanning.current = false;
  }, []);

  const resetTransform = useCallback(() => {
    setTransform({ x: 0, y: 0, scale: 1 });
  }, []);

  const setScale = useCallback((scale: number) => {
    setTransform((t) => ({ ...t, scale: Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, scale)) }));
  }, []);

  const zoomIn = useCallback(() => {
    setTransform((t) => ({ ...t, scale: Math.min(ZOOM_MAX, t.scale * ZOOM_STEP) }));
  }, []);

  const zoomOut = useCallback(() => {
    setTransform((t) => ({ ...t, scale: Math.max(ZOOM_MIN, t.scale / ZOOM_STEP) }));
  }, []);

  const svgPoint = useCallback(
    (clientX: number, clientY: number, svgRect: DOMRect): { x: number; y: number } => ({
      x: (clientX - svgRect.left - transform.x) / transform.scale,
      y: (clientY - svgRect.top - transform.y) / transform.scale,
    }),
    [transform],
  );

  return {
    transform,
    onWheel,
    startPan,
    onCanvasMouseDown,
    onCanvasMouseMove,
    onCanvasMouseUp,
    resetTransform,
    zoomIn,
    zoomOut,
    setScale,
    svgPoint,
  };
}
