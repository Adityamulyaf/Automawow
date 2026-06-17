import type { Position } from '../../types/automata';

const NODE_RADIUS = 28;

interface StartArrowProps {
  position: Position;
}

export default function StartArrow({ position }: StartArrowProps) {
  const { x, y } = position;
  const arrowLen = 36;
  const tipX = x - NODE_RADIUS;
  const tailX = tipX - arrowLen;

  return (
    <line
      x1={tailX}
      y1={y}
      x2={tipX}
      y2={y}
      stroke="var(--color-text-secondary)"
      strokeWidth={2}
      markerEnd="url(#arrowhead)"
    />
  );
}
