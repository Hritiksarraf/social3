function Shimmer({ className }) {
  return (
    <div
      className={`bg-surface-2 relative overflow-hidden ${className}`}
      style={{
        backgroundImage:
          "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
        backgroundSize: "400px 100%",
      }}
    >
      <div className="absolute inset-0 animate-yv-shimmer" style={{
        backgroundImage: "linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)",
        backgroundSize: "400px 100%",
      }} />
    </div>
  );
}

export default function SkeletonCard() {
  return (
    <div className="w-full max-w-xl rounded-[26px] bg-surface-1 border border-white/[0.06] overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <Shimmer className="w-11 h-11 rounded-full" />
        <div className="flex-1 flex flex-col gap-2">
          <Shimmer className="h-3 w-32 rounded" />
          <Shimmer className="h-2.5 w-20 rounded" />
        </div>
        <Shimmer className="h-7 w-16 rounded-full" />
      </div>
      <Shimmer className="h-[220px] w-full" />
      <div className="p-4 flex flex-col gap-3">
        <Shimmer className="h-9 w-full rounded-2xl" />
        <Shimmer className="h-3 w-3/4 rounded" />
      </div>
    </div>
  );
}
