import { useRef, useCallback } from 'react';
import { useAutomaton } from '../../context/AutomatonContext';
import { useCanvasInteraction } from '../../hooks/useCanvasInteraction';
import type { Tool, Selection } from '../../types/editor';
import StateNode from './StateNode';
import TransitionEdge from './TransitionEdge';
import SelfLoop from './SelfLoop';
import StartArrow from './StartArrow';
import ZoomBar from './ZoomBar';
import type { DFA, Position } from '../../types/automata';

interface GraphCanvasProps {
  activeTool: Tool;
  selection: Selection;
  onSelectState: (id: string) => void;
  onSelectTransition: (id: string) => void;
  onClearSelection: () => void;
  activeStates?: string[];
  transitionDraftFrom?: string | null;
  onTransitionDraftStart?: (from: string) => void;
  onTransitionDraftComplete?: (from: string, to: string) => void;
  dfa?: DFA;
  positions?: Map<string, Position>;
  dispatch?: React.Dispatch<any>;
  isActive?: boolean;
  onFocus?: () => void;
  showFocusRing?: boolean;
}

export default function GraphCanvas({
  activeTool,
  selection,
  onSelectState,
  onSelectTransition,
  onClearSelection,
  activeStates = [],
  transitionDraftFrom,
  onTransitionDraftStart,
  onTransitionDraftComplete,
  dfa: propsDfa,
  positions: propsPositions,
  dispatch: propsDispatch,
  isActive = true,
  onFocus,
  showFocusRing = false,
}: GraphCanvasProps) {
  const { dfa: ctxDfa, positions: ctxPositions, dispatch: ctxDispatch, showPrompt } = useAutomaton();
  const dfa = propsDfa ?? ctxDfa;
  const positions = propsPositions ?? ctxPositions;
  const dispatch = propsDispatch ?? ctxDispatch;

  const svgRef = useRef<SVGSVGElement>(null);
  const {
    transform,
    onWheel,
    startPan,
    onCanvasMouseDown,
    onCanvasMouseMove,
    onCanvasMouseUp,
    onCanvasTouchStart,
    onCanvasTouchMove,
    onCanvasTouchEnd,
    resetTransform,
    zoomIn,
    zoomOut,
    setScale,
    svgPoint,
  } = useCanvasInteraction();

  const dragging = useRef<{ id: string; offX: number; offY: number } | null>(null);

  const getSVGPoint = useCallback(
    (e: React.MouseEvent) => {
      const rect = svgRef.current!.getBoundingClientRect();
      return svgPoint(e.clientX, e.clientY, rect);
    },
    [svgPoint],
  );

  const handleCanvasClick = useCallback(
    (e: React.MouseEvent) => {
      if (activeTool === 'addState') {
        const { x, y } = getSVGPoint(e);
        let name = `q${dfa.states.length}`;
        while (dfa.states.includes(name)) name = `q${parseInt(name.slice(1)) + 1}`;
        dispatch({ type: 'ADD_STATE', name, position: { x, y } });
      } else {
        onClearSelection();
      }
    },
    [activeTool, getSVGPoint, dfa.states, dispatch, onClearSelection],
  );

  const handleStateMouseDown = useCallback(
    (id: string, e: React.MouseEvent) => {
      if (activeTool === 'select') {
        const pt = getSVGPoint(e);
        const pos = positions.get(id)!;
        dragging.current = { id, offX: pt.x - pos.x, offY: pt.y - pos.y };
      }
    },
    [activeTool, getSVGPoint, positions],
  );

  const getSVGTouchPoint = useCallback(
    (e: React.TouchEvent) => {
      const rect = svgRef.current!.getBoundingClientRect();
      const touch = e.touches[0];
      return svgPoint(touch.clientX, touch.clientY, rect);
    },
    [svgPoint],
  );

  const handleStateTouchStart = useCallback(
    (id: string, e: React.TouchEvent) => {
      if (activeTool === 'select') {
        const pt = getSVGTouchPoint(e);
        const pos = positions.get(id)!;
        dragging.current = { id, offX: pt.x - pos.x, offY: pt.y - pos.y };
      }
    },
    [activeTool, getSVGTouchPoint, positions],
  );

  const handleStateClick = useCallback(
    (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      switch (activeTool) {
        case 'select':
          onSelectState(id);
          break;
        case 'setStart':
          dispatch({ type: 'SET_START', state: id });
          break;
        case 'toggleAccept':
          dispatch({ type: 'TOGGLE_ACCEPT', state: id });
          break;
        case 'delete':
          dispatch({ type: 'DELETE_STATE', name: id });
          onClearSelection();
          break;
        case 'addTransition':
          if (!transitionDraftFrom) {
            onTransitionDraftStart?.(id);
          } else {
            onTransitionDraftComplete?.(transitionDraftFrom, id);
          }
          break;
      }
    },
    [activeTool, dispatch, onSelectState, onClearSelection, transitionDraftFrom, onTransitionDraftStart, onTransitionDraftComplete],
  );

  const handleStateDoubleClick = useCallback(
    (id: string) => {
      showPrompt({
        title: 'Rename State',
        message: `Rename state ${id} to:`,
        defaultValue: id,
        placeholder: 'e.g. q1, s0',
        onConfirm: (newName) => {
          const trimmed = newName.trim();
          if (trimmed && trimmed !== id) {
            dispatch({ type: 'RENAME_STATE', oldName: id, newName: trimmed });
          }
        },
      });
    },
    [dispatch, showPrompt],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      onCanvasMouseMove(e);
      if (activeTool === 'pan') return;
      if (dragging.current) {
        const pt = getSVGPoint(e);
        dispatch({
          type: 'UPDATE_POSITION',
          state: dragging.current.id,
          position: {
            x: pt.x - dragging.current.offX,
            y: pt.y - dragging.current.offY,
          },
        });
      }
    },
    [onCanvasMouseMove, getSVGPoint, dispatch, activeTool],
  );

  const handleMouseUp = useCallback(() => {
    dragging.current = null;
    onCanvasMouseUp();
  }, [onCanvasMouseUp]);

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      onCanvasTouchMove(e);
      if (activeTool === 'pan') return;
      if (dragging.current && e.touches.length === 1) {
        const pt = getSVGTouchPoint(e);
        dispatch({
          type: 'UPDATE_POSITION',
          state: dragging.current.id,
          position: {
            x: pt.x - dragging.current.offX,
            y: pt.y - dragging.current.offY,
          },
        });
        if (e.cancelable) e.preventDefault();
      }
    },
    [onCanvasTouchMove, getSVGTouchPoint, dispatch, activeTool],
  );

  const handleTouchEnd = useCallback(() => {
    dragging.current = null;
    onCanvasTouchEnd();
  }, [onCanvasTouchEnd]);

  // Group transitions by (from,to) pair for bundling
  type EdgeGroup = { from: string; to: string; symbols: string[] };
  const edgeMap = new Map<string, EdgeGroup>();

  for (const state of dfa.states) {
    const row = dfa.transitions.get(state);
    if (!row) continue;
    for (const [sym, toStr] of row) {
      if (!toStr) continue;
      const targets = toStr.split(',').map((s) => s.trim()).filter(Boolean);
      for (const target of targets) {
        const key = `${state}→${target}`;
        if (!edgeMap.has(key)) {
          edgeMap.set(key, { from: state, to: target, symbols: [] });
        }
        const group = edgeMap.get(key)!;
        if (!group.symbols.includes(sym)) {
          group.symbols.push(sym);
        }
      }
    }
  }

  const edges = [...edgeMap.values()];
  const selfLoops = edges.filter((e) => e.from === e.to);
  const nonSelf = edges.filter((e) => e.from !== e.to);
  const pairSet = new Set(nonSelf.map((e) => `${e.from}→${e.to}`));

  return (
    <div
      className={`flex-1 relative overflow-hidden transition-all duration-200 ${
        showFocusRing
          ? (isActive
              ? 'bg-[var(--color-surface)] ring-2 ring-[var(--color-primary)] ring-inset z-10'
              : 'bg-slate-50/50 opacity-70 hover:opacity-85')
          : 'bg-[var(--color-surface)]'
      }`}
      onMouseDown={onFocus}
    >
      <svg className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }}>
        <defs>
          <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="var(--color-border)" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full"
        style={{
          zIndex: 1,
          cursor: activeTool === 'pan' ? 'grab' : activeTool === 'addState' ? 'crosshair' : 'default',
        }}
        onWheel={onWheel}
        onMouseDown={(e) => {
          onFocus?.();
          if (activeTool === 'pan' && e.button === 0) {
            startPan(e);
          } else {
            onCanvasMouseDown(e);
            if (e.button === 0 && !e.altKey) handleCanvasClick(e);
          }
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={(e) => {
          onFocus?.();
          onCanvasTouchStart(e);
          if (activeTool === 'addState' && e.touches.length === 1) {
            const rect = svgRef.current!.getBoundingClientRect();
            const touch = e.touches[0];
            const { x, y } = svgPoint(touch.clientX, touch.clientY, rect);
            let name = `q${dfa.states.length}`;
            while (dfa.states.includes(name)) name = `q${parseInt(name.slice(1)) + 1}`;
            dispatch({ type: 'ADD_STATE', name, position: { x, y } });
          }
        }}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchEnd}
      >
        <defs>
          <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
            <polygon points="0 0, 8 3, 0 6" fill="var(--color-text-secondary)" />
          </marker>
        </defs>

        <g transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}>
          {dfa.startState && positions.get(dfa.startState) && (
            <StartArrow position={positions.get(dfa.startState)!} />
          )}

          {nonSelf.map((edge) => {
            const fromPos = positions.get(edge.from);
            const toPos = positions.get(edge.to);
            if (!fromPos || !toPos) return null;
            const hasReverse = pairSet.has(`${edge.to}→${edge.from}`);
            const offset = hasReverse ? 30 : 0;
            const edgeId = `${edge.from}→${edge.to}`;
            return (
              <TransitionEdge
                key={edgeId}
                from={fromPos}
                to={toPos}
                labels={edge.symbols}
                offset={offset}
                isSelected={selection.type === 'transition' && selection.id === edgeId}
                onClick={() => onSelectTransition(edgeId)}
              />
            );
          })}

          {selfLoops.map((edge) => {
            const pos = positions.get(edge.from);
            if (!pos) return null;
            const edgeId = `${edge.from}→${edge.to}`;
            return (
              <SelfLoop
                key={edgeId}
                position={pos}
                labels={edge.symbols}
                isSelected={selection.type === 'transition' && selection.id === edgeId}
                onClick={() => onSelectTransition(edgeId)}
              />
            );
          })}

          {dfa.states.map((state) => {
            const pos = positions.get(state);
            if (!pos) return null;
            return (
              <StateNode
                key={state}
                id={state}
                position={pos}
                isStart={dfa.startState === state}
                isAccept={dfa.acceptStates.includes(state)}
                isSelected={selection.type === 'state' && selection.id === state}
                isActive={activeStates.includes(state)}
                onMouseDown={handleStateMouseDown}
                onTouchStart={handleStateTouchStart}
                onClick={handleStateClick}
                onDoubleClick={handleStateDoubleClick}
              />
            );
          })}

          {transitionDraftFrom && positions.get(transitionDraftFrom) && (
            <circle
              cx={positions.get(transitionDraftFrom)!.x}
              cy={positions.get(transitionDraftFrom)!.y}
              r={32}
              fill="none"
              stroke="var(--color-primary)"
              strokeWidth={2}
              strokeDasharray="4 2"
              opacity={0.6}
            />
          )}
        </g>
      </svg>

      <ZoomBar
        scale={transform.scale}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onReset={resetTransform}
        onSetScale={setScale}
      />

      {dfa.states.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ zIndex: 2 }}>
          <p className="text-[var(--color-text-muted)] text-sm">
            Select <strong>Add State</strong> and click the canvas to begin
          </p>
        </div>
      )}
    </div>
  );
}
