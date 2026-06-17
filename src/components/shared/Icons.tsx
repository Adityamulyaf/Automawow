interface IconProps {
  size?: number;
  className?: string;
}

export function IconSelect({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M4 2L4 14L7.5 10.5L10 16L12 15L9.5 9.5L14 9L4 2Z" fill="currentColor" />
    </svg>
  );
}

export function IconPan({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M8 3.5C8 2.67 8.67 2 9.5 2S11 2.67 11 3.5V9h.5C12.33 9 13 9.67 13 10.5V11h.5c.83 0 1.5.67 1.5 1.5V13h.25c.83 0 1.25.5 1.25 1.25v.25C16.5 16.5 15 18 13 18H9c-1.38 0-2.61-.7-3.32-1.76L4 13.5V11a1 1 0 0 1 2 0v1h2V3.5Z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconAddState({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="10" y1="6.5" x2="10" y2="13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="6.5" y1="10" x2="13.5" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconAddTransition({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="4.5" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15.5" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
      <path d="M7.5 10H11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M10 7.5L12.5 10L10 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconSetStart({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <line x1="2" y1="10" x2="7" y2="10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M5.5 7.5L8 10L5.5 12.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="13" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconToggleAccept({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="10" cy="10" r="7.5" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="5" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconDelete({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconLayout({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <circle cx="5" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15" cy="5" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="5" cy="15" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="15" cy="15" r="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="2" stroke="currentColor" strokeWidth="1.5" />
      <line x1="6.5" y1="6.5" x2="8.5" y2="8.5" stroke="currentColor" strokeWidth="1" />
      <line x1="13.5" y1="6.5" x2="11.5" y2="8.5" stroke="currentColor" strokeWidth="1" />
      <line x1="6.5" y1="13.5" x2="8.5" y2="11.5" stroke="currentColor" strokeWidth="1" />
      <line x1="13.5" y1="13.5" x2="11.5" y2="11.5" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

export function IconReset({ size = 20, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className}>
      <path
        d="M4.5 10a5.5 5.5 0 1 0 1.1-3.3"
        stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"
      />
      <path d="M4.5 4.5V7.5H7.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function IconZoomIn({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="7" y1="4.5" x2="7" y2="9.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="4.5" y1="7" x2="9.5" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconZoomOut({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
      <line x1="4.5" y1="7" x2="9.5" y2="7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11" y1="11" x2="14" y2="14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export function IconZoomReset({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" className={className}>
      <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
      <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

export function IconWarning({ size = 16, className }: IconProps) {
  return (
    <svg width={size} height={size} viewBox="0 0 20 20" fill="none" className={className} stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.2 2.5a.8.8 0 0 0-1.4 0L1.7 15.5a.8.8 0 0 0 .7 1.2h15.2a.8.8 0 0 0 .7-1.2L10.2 2.5z" />
      <line x1="10" y1="7.5" x2="10" y2="11.5" strokeWidth="2" />
      <circle cx="10" cy="14.5" r="0.75" fill="currentColor" stroke="none" />
    </svg>
  );
}
