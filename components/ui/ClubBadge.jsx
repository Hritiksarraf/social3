export const CLUBS = {
  fire: { emoji: "🔥", label: "Fire", from: "#FF7A3C", to: "#FF2D55", ink: "#FFFFFF" },
  water: { emoji: "💧", label: "Water", from: "#38C6FF", to: "#2A6BFF", ink: "#FFFFFF" },
  ice: { emoji: "❄️", label: "Ice", from: "#A8F0FF", to: "#5AD1E6", ink: "#0C3A40" },
  earth: { emoji: "🌿", label: "Earth", from: "#8BE85A", to: "#28B45E", ink: "#08320F" },
  cloud: { emoji: "☁️", label: "Cloud", from: "#D6C7FF", to: "#9A7CFF", ink: "#2A1B55" },
};

export const CLUB_KEYS = Object.keys(CLUBS);

/**
 * The signature tilted "sticker" chip used for club tags across the app.
 */
export default function ClubBadge({ club, size = "md", tilt = true, className = "", onClick }) {
  const c = CLUBS[club];
  if (!c) return null;

  const sizes = {
    sm: "px-2.5 py-1.5 text-[11px] gap-1",
    md: "px-3.5 py-2 text-[13px] gap-1.5",
    lg: "px-4 py-2.5 text-sm gap-2",
  };

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center font-extrabold rounded-full whitespace-nowrap ${
        tilt ? "-rotate-3" : ""
      } ${sizes[size]} ${onClick ? "cursor-pointer" : ""} ${className}`}
      style={{
        background: `linear-gradient(135deg, ${c.from}, ${c.to})`,
        color: c.ink,
        boxShadow: `0 10px 22px -8px ${c.to}E6, 0 0 0 2px rgba(255,255,255,0.9)`,
      }}
    >
      <span>{c.emoji}</span>
      <span>{c.label}</span>
    </span>
  );
}
