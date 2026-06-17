import type { Position } from '../../types/automata';
import { calcSelfLoopPath } from '../../utils/svgHelpers';
import { EPSILON } from '../../types/automata';

interface SelfLoopProps {
  position: Position;
  labels: string[];
  isSelected: boolean;
  onClick: () => void;
}

export default function SelfLoop({ position, labels, isSelected, onClick }: SelfLoopProps) {
  const { d, labelX, labelY } = calcSelfLoopPath(position);
  const hasEpsilon = labels.some((l) => l === EPSILON);
  const strokeColor = hasEpsilon
    ? 'var(--color-epsilon)'
    : isSelected
    ? 'var(--color-primary)'
    : 'var(--color-text-secondary)';

  return (
    <g onClick={(e) => { e.stopPropagation(); onClick(); }} style={{ cursor: 'pointer' }}>
      <path
        d={d}
        fill="none"
        stroke={strokeColor}
        strokeWidth={isSelected ? 2 : 1.5}
        markerEnd="url(#arrowhead)"
      />
      <rect x={labelX - 14} y={labelY - 9} width={28} height={18} fill="white" rx={3} />
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
        {labels.join(', ')}
      </text>
    </g>
  );
}
