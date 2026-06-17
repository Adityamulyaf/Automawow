interface Step {
  state: string | string[];
  symbol: string;
  nextState: string | string[] | null;
  index: number;
}

interface StepLogProps {
  steps: Step[];
  currentIndex: number;
}

export default function StepLog({ steps, currentIndex }: StepLogProps) {
  const visible = steps.slice(0, currentIndex);
  if (visible.length === 0) return null;

  return (
    <div className="flex flex-col gap-0.5 font-mono text-xs overflow-y-auto max-h-40">
      {visible.map((step, i) => {
        const stateStr = Array.isArray(step.state) ? `{${step.state.join(',')}}` : step.state;
        const nextStr =
          step.nextState === null
            ? '∅ (dead)'
            : Array.isArray(step.nextState)
            ? `{${step.nextState.join(',')}}`
            : step.nextState;
        return (
          <div
            key={i}
            className={`flex items-center gap-2 px-2 py-1 rounded ${
              i === visible.length - 1
                ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)]'
            }`}
          >
            <span className="text-[var(--color-text-muted)] w-4">{i + 1}.</span>
            <span>{stateStr}</span>
            <span className="text-[var(--color-text-muted)]">→[{step.symbol}]→</span>
            <span>{nextStr}</span>
          </div>
        );
      })}
    </div>
  );
}
