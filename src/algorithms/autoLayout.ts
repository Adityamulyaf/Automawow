import type { Position } from '../types/automata';

interface Node {
  id: string;
  x: number;
  y: number;
}

export function circularLayout(
  states: string[],
  startState: string,
  centerX = 500,
  centerY = 300,
  radius = 180,
): Map<string, Position> {
  const positions = new Map<string, Position>();
  if (states.length === 0) return positions;
  if (states.length === 1) {
    positions.set(states[0], { x: centerX, y: centerY });
    return positions;
  }

  // Dynamically scale radius if there are many states to prevent crowding
  const actualRadius = states.length > 6 
    ? Math.max(radius, Math.min(360, Math.round(22 * states.length))) 
    : radius;

  const ordered = [startState, ...states.filter((s) => s !== startState)];
  const startAngle = Math.PI;

  ordered.forEach((state, i) => {
    const angle = startAngle + (2 * Math.PI * i) / ordered.length;
    positions.set(state, {
      x: Math.round(centerX + actualRadius * Math.cos(angle)),
      y: Math.round(centerY + actualRadius * Math.sin(angle)),
    });
  });

  return positions;
}

export function forceLayout(
  states: string[],
  existing: Map<string, Position>,
  iterations = 50,
): Map<string, Position> {
  if (states.length <= 1) return existing;

  const nodes: Node[] = states.map((id) => ({
    id,
    x: existing.get(id)?.x ?? Math.random() * 800 + 100,
    y: existing.get(id)?.y ?? Math.random() * 500 + 100,
  }));

  const repulsion = 8000;
  const spring = 0.01;
  const idealDist = 150;

  for (let iter = 0; iter < iterations; iter++) {
    const forces: { fx: number; fy: number }[] = nodes.map(() => ({ fx: 0, fy: 0 }));

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.max(Math.sqrt(dx * dx + dy * dy), 1);
        const force = repulsion / (dist * dist);
        forces[i].fx += (dx / dist) * force;
        forces[i].fy += (dy / dist) * force;
        forces[j].fx -= (dx / dist) * force;
        forces[j].fy -= (dy / dist) * force;
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      const dx = 500 - nodes[i].x;
      const dy = 300 - nodes[i].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist > idealDist) {
        forces[i].fx += spring * dx;
        forces[i].fy += spring * dy;
      }
    }

    for (let i = 0; i < nodes.length; i++) {
      nodes[i].x += Math.max(-30, Math.min(30, forces[i].fx));
      nodes[i].y += Math.max(-30, Math.min(30, forces[i].fy));
      nodes[i].x = Math.max(80, Math.min(920, nodes[i].x));
      nodes[i].y = Math.max(80, Math.min(520, nodes[i].y));
    }
  }

  const result = new Map<string, Position>();
  for (const node of nodes) result.set(node.id, { x: node.x, y: node.y });
  return result;
}
