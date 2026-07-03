const bars = [
  { h: 18, delay: "0s" },
  { h: 46, delay: "0.15s" },
  { h: 30, delay: "0.3s" },
  { h: 38, delay: "0.45s" },
];

export default function Splash() {
  return (
    <div
      className="w-full h-screen flex flex-col items-center justify-center relative"
      style={{
        background:
          "radial-gradient(120% 80% at 50% 0%, #7857FF 0%, #4B2A9E 30%, #1D1928 62%, #14111C 100%)",
      }}
    >
      <div
        className="w-24 h-24 rounded-[30px] flex items-center justify-center -rotate-3 animate-yv-breathe"
        style={{
          background: "linear-gradient(135deg, #FF0073, #7857FF)",
          boxShadow: "0 30px 60px -18px rgba(255,0,115,0.7)",
        }}
      >
        <div className="flex gap-1.5 items-end h-10">
          {bars.map((b, i) => (
            <span
              key={i}
              className="w-2 bg-white rounded animate-yv-eq"
              style={{ height: b.h, animationDelay: b.delay }}
            />
          ))}
        </div>
      </div>
      <p className="font-display font-extrabold text-4xl tracking-tight mt-6 text-white">Yuva Vaani</p>
      <p className="text-white/70 text-sm font-semibold mt-0.5">your campus, out loud</p>

      <div className="absolute bottom-14 left-0 right-0 flex flex-col items-center gap-3.5">
        <div className="flex gap-1 items-end h-5">
          {[10, 22, 16, 20, 12].map((h, i) => (
            <span
              key={i}
              className="w-[5px] bg-white/85 rounded-sm animate-yv-eq"
              style={{ height: h, animationDelay: `${i * 0.1}s` }}
            />
          ))}
        </div>
        <span className="text-white/60 text-xs font-extrabold tracking-[0.14em] uppercase">
          Tuning in…
        </span>
      </div>
    </div>
  );
}
