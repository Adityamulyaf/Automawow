import type { Position } from '../../types/automata';
import { EPSILON } from '../../types/automata';
import { calcEdgePath } from '../../utils/svgHelpers';

interface TransitionEdgeProps {
  from: Position;
  to: Position;
  labels: string[];
  offset?: number;
  isSelected: boolean;
  onClick: () => void;
}

export default function TransitionEdge({
  from,
  to,
  labels,
  offset = 0,
  isSelected,
  onClick,
}: TransitionEdgeProps) {
  const { d, labelX, labelY } = calcEdgePath(from, to, offset);
  const hasEpsilon = labels.some((l) => l === EPSILON);
  const strokeColor = hasEpsilon
    ? 'var(--color-epsilon)'
    : isSelected
    ? 'var(--color-primary)'
    : 'var(--color-text-secondary)';

  if (!d) return null;

  const labelText = labels.join(', ');
  const labelW = Math.max(labelText.length * 7, 20);

  return (
    <g onClick={(e) => { e.stopPropagation(); onClick(); }} style={{ cursor: 'pointer' }}>
      <path d={d} fill="none" stroke={strokeColor} strokeWidth={isSelected ? 2 : 1.5} markerEnd="url(#arrowhead)" />
      <path d={d} fill="none" stroke="transparent" strokeWidth={10} />
      <rect x={labelX - labelW / 2} y={labelY - 9} width={labelW} height={18} fill="white" rx={3} />
      <text
        x={labelX}
        y={labelY}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="IBM Plex Mono, Fira Code, monospace"
        fontSize={11}
        fill={strokeColor}
        style={{ userSelect: 'none' }}
      >
        {labelText}
      </text>
    </g>
  );
}
