import type { Position } from '../types/automata';

export interface PathData {
  d: string;
  labelX: number;
  labelY: number;
}

const NODE_RADIUS = 28;

export function calcEdgePath(from: Position, to: Position, offset = 0): PathData {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  if (dist === 0) return { d: '', labelX: from.x, labelY: from.y };

  const ux = dx / dist;
  const uy = dy / dist;
  const sx = from.x + ux * NODE_RADIUS;
  const sy = from.y + uy * NODE_RADIUS;
  const ex = to.x - ux * NODE_RADIUS;
  const ey = to.y - uy * NODE_RADIUS;

  if (offset === 0) {
    return { d: `M ${sx} ${sy} L ${ex} ${ey}`, labelX: (sx + ex) / 2, labelY: (sy + ey) / 2 };
  }

  const px = -uy;
  const py = ux;
  const mx = (sx + ex) / 2 + px * offset;
  const my = (sy + ey) / 2 + py * offset;
  return { d: `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`, labelX: mx, labelY: my };
}

export function calcSelfLoopPath(center: Position): PathData {
  const { x, y } = center;
  const r = NODE_RADIUS;
  const loopSize = 40;

  const sx = x + r * Math.cos(-Math.PI / 4 - Math.PI / 2);
  const sy = y + r * Math.sin(-Math.PI / 4 - Math.PI / 2);
  const ex = x + r * Math.cos(Math.PI / 4 - Math.PI / 2);
  const ey = y + r * Math.sin(Math.PI / 4 - Math.PI / 2);

  return {
    d: `M ${sx} ${sy} C ${sx - loopSize} ${sy - loopSize} ${ex + loopSize} ${ey - loopSize} ${ex} ${ey}`,
    labelX: x,
    labelY: y - r - loopSize * 0.8,
  };
}
