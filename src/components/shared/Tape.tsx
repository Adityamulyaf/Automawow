interface TapeProps {
  input: string;
  headPosition: number;
}

export default function Tape({ input, headPosition }: TapeProps) {
  if (!input) return null;
  return (
    <div className="flex items-center gap-0 font-mono text-sm overflow-x-auto py-1">
      {input.split('').map((ch, i) => (
        <div
          key={i}
          className={`w-8 h-8 flex items-center justify-center border border-[var(--color-border)] flex-shrink-0 transition-colors duration-100 ${
            i === headPosition
              ? 'bg-[var(--color-primary)] text-white border-[var(--color-primary)] font-semibold'
              : i < headPosition
              ? 'bg-[var(--color-surface)] text-[var(--color-text-muted)]'
              : 'bg-white text-[var(--color-text-primary)]'
          }`}
        >
          {ch}
        </div>
      ))}
      <div className="w-8 h-8 flex items-center justify-center border border-dashed border-[var(--color-border)] flex-shrink-0 text-[var(--color-text-muted)]">
        ⊣
      </div>
    </div>
  );
}
