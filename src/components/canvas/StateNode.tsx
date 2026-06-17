import { useCallback, useState } from 'react';
import type { Position } from '../../types/automata';

const R = 28;
const R_INNER = 22;

interface StateNodeProps {
  id: string;
  position: Position;
  isStart: boolean;
  isAccept: boolean;
  isSelected: boolean;
  isActive: boolean;
  onMouseDown: (id: string, e: React.MouseEvent) => void;
  onClick: (id: string, e: React.MouseEvent) => void;
  onDoubleClick: (id: string) => void;
}

export default function StateNode({
  id,
  position,
  isAccept,
  isSelected,
  isActive,
  onMouseDown,
  onClick,
  onDoubleClick,
}: StateNodeProps) {
  const { x, y } = position;
  const [hovered, setHovered] = useState(false);

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => { e.stopPropagation(); onMouseDown(id, e); },
    [id, onMouseDown],
  );
  const handleClick = useCallback(
    (e: React.MouseEvent) => { e.stopPropagation(); onClick(id, e); },
    [id, onClick],
  );
  const handleDoubleClick = useCallback(() => onDoubleClick(id), [id, onDoubleClick]);

  let strokeColor = 'var(--color-border-strong)';
  let fillColor = '#fff';
  let strokeWidth = 1.5;

  if (isActive) {
    strokeColor = 'var(--color-primary)';
    strokeWidth = 2.5;
    fillColor = 'var(--color-primary-50)';
  } else if (isSelected) {
    strokeColor = 'var(--color-primary)';
    strokeWidth = 2;
    fillColor = 'var(--color-primary-light)';
  } else if (hovered) {
    strokeColor = 'var(--color-border-strong)';
    fillColor = 'var(--color-surface-hover)';
  }

  return (
    <g
      className={isActive ? 'state-active' : ''}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ cursor: 'pointer' }}
    >
      <circle cx={x} cy={y} r={R} fill={fillColor} stroke={strokeColor} strokeWidth={strokeWidth} />
      {isAccept && (
        <circle cx={x} cy={y} r={R_INNER} fill="none" stroke={strokeColor} strokeWidth={strokeWidth * 0.8} />
      )}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="IBM Plex Mono, Fira Code, monospace"
        fontSize={id.length > 3 ? 10 : 13}
        fontWeight="500"
        fill={isActive ? 'var(--color-primary)' : 'var(--color-text-primary)'}
        style={{ userSelect: 'none' }}
      >
        {id}
      </text>
    </g>
  );
}
