const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  strokeLinecap: "round",
  strokeLinejoin: "round",
};

export function HomeIcon({ size = 22, color = "currentColor", strokeWidth = 2.2, className }) {
  return (
    <svg width={size} height={size} className={className} {...base} stroke={color} strokeWidth={strokeWidth}>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5" />
    </svg>
  );
}

export function SearchIcon({ size = 22, color = "currentColor", strokeWidth = 2.2, className }) {
  return (
    <svg width={size} height={size} className={className} {...base} stroke={color} strokeWidth={strokeWidth}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}

export function PlusIcon({ size = 22, color = "currentColor", strokeWidth = 2.6, className }) {
  return (
    <svg width={size} height={size} className={className} {...base} stroke={color} strokeWidth={strokeWidth}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function MapIcon({ size = 22, color = "currentColor", strokeWidth = 2.2, className }) {
  return (
    <svg width={size} height={size} className={className} {...base} stroke={color} strokeWidth={strokeWidth}>
      <path d="M9 3 3 5v16l6-2 6 2 6-2V3l-6 2-6-2Z" />
      <path d="M9 3v16M15 5v16" />
    </svg>
  );
}

export function HeartIcon({ size = 22, color = "currentColor", filled = false, strokeWidth = 2, className }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth={strokeWidth}>
      <path d="M12 21s-7-4.5-9.5-9C1 8.5 3 5 6.5 5 9 5 12 8 12 8s3-3 5.5-3C21 5 23 8.5 21.5 12 19 16.5 12 21 12 21Z" />
    </svg>
  );
}

export function CommentIcon({ size = 22, color = "currentColor", strokeWidth = 2, className }) {
  return (
    <svg width={size} height={size} className={className} {...base} stroke={color} strokeWidth={strokeWidth}>
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.5 8.5 0 1 1 21 11.5z" />
    </svg>
  );
}

export function BookmarkIcon({ size = 22, color = "currentColor", filled = false, strokeWidth = 2, className }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill={filled ? color : "none"} stroke={color} strokeWidth={strokeWidth} strokeLinejoin="round">
      <path d="M6 3h12v18l-6-4-6 4V3Z" />
    </svg>
  );
}

export function PlayIcon({ size = 16, color = "currentColor", className }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill={color}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function PauseIcon({ size = 16, color = "currentColor", className }) {
  return (
    <svg width={size} height={size} className={className} viewBox="0 0 24 24" fill={color}>
      <rect x="6" y="5" width="4" height="14" rx="1" />
      <rect x="14" y="5" width="4" height="14" rx="1" />
    </svg>
  );
}

export function MicIcon({ size = 22, color = "currentColor", strokeWidth = 2.2, className }) {
  return (
    <svg width={size} height={size} className={className} {...base} stroke={color} strokeWidth={strokeWidth}>
      <rect x="9" y="2" width="6" height="12" rx="3" />
      <path d="M5 11a7 7 0 0 0 14 0" />
      <path d="M12 18v3" />
    </svg>
  );
}

export function BellIcon({ size = 18, color = "currentColor", strokeWidth = 2, className }) {
  return (
    <svg width={size} height={size} className={className} {...base} stroke={color} strokeWidth={strokeWidth}>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

export function SoundwaveIcon({ size = 15, color = "currentColor", strokeWidth = 2.4, className }) {
  return (
    <svg width={size} height={size} className={className} {...base} stroke={color} strokeWidth={strokeWidth}>
      <path d="M3 12h3l3-8 4 16 3-8h5" />
    </svg>
  );
}
