const GRADIENTS = [
  ["#FF0073", "#7857FF"],
  ["#38C6FF", "#2A6BFF"],
  ["#8BE85A", "#28B45E"],
  ["#D6C7FF", "#9A7CFF"],
  ["#FF7A3C", "#FF2D55"],
];

function gradientFor(seed = "") {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  return GRADIENTS[hash % GRADIENTS.length];
}

const sizes = {
  xs: { box: 26, ring: 1.5, font: 11 },
  sm: { box: 34, ring: 2, font: 13 },
  md: { box: 44, ring: 2, font: 15 },
  lg: { box: 82, ring: 3, font: 30 },
  xl: { box: 104, ring: 3, font: 36 },
};

export default function Avatar({ src, name = "", size = "md", className = "" }) {
  const [from, to] = gradientFor(name || src || "yv");
  const initial = name?.trim()?.[0]?.toUpperCase() || "?";
  const { box, ring, font } = sizes[size] || sizes.md;

  return (
    <div
      className={`shrink-0 rounded-full ${className}`}
      style={{
        width: box,
        height: box,
        padding: ring,
        background: `linear-gradient(135deg, ${from}, ${to})`,
      }}
    >
      {src ? (
        <img
          src={src}
          alt={name || "avatar"}
          width={box}
          height={box}
          className="w-full h-full rounded-full object-cover bg-surface-2"
        />
      ) : (
        <div
          className="w-full h-full rounded-full bg-surface-2 flex items-center justify-center font-display font-extrabold"
          style={{ fontSize: font }}
        >
          {initial}
        </div>
      )}
    </div>
  );
}
