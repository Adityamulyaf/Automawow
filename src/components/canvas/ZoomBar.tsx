import { IconZoomIn, IconZoomOut } from '../shared/Icons';

interface ZoomBarProps {
  scale: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  onSetScale: (scale: number) => void;
}

export default function ZoomBar({ scale, onZoomIn, onZoomOut, onReset, onSetScale }: ZoomBarProps) {
  const pct = Math.round(scale * 100);

  return (
    <div
      className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center bg-white border border-[var(--color-border)] rounded-lg shadow-sm z-10"
      style={{ height: 32 }}
    >
      <button
        onClick={onZoomOut}
        title="Zoom out"
        className="w-8 h-full flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors duration-100 rounded-l-lg"
      >
        <IconZoomOut size={15} />
      </button>

      <div className="w-px h-4 bg-[var(--color-border)]" />

      <input
        type="range"
        min={20}
        max={400}
        step={5}
        value={pct}
        onChange={(e) => onSetScale(parseInt(e.target.value) / 100)}
        title={`Zoom: ${pct}%`}
        className="w-24 mx-2 cursor-pointer"
        style={{ accentColor: 'var(--color-primary)', height: 4 }}
      />

      <div className="w-px h-4 bg-[var(--color-border)]" />

      <button
        onClick={onReset}
        title="Reset zoom to 100%"
        className="px-2.5 h-full flex items-center font-mono text-xs text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors duration-100 tabular-nums min-w-[3rem] justify-center"
      >
        {pct}%
      </button>

      <div className="w-px h-4 bg-[var(--color-border)]" />

      <button
        onClick={onZoomIn}
        title="Zoom in"
        className="w-8 h-full flex items-center justify-center text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)] transition-colors duration-100 rounded-r-lg"
      >
        <IconZoomIn size={15} />
      </button>
    </div>
  );
}
