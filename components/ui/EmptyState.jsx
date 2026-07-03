import Button from "./Button";

export default function EmptyState({ emoji = "✦", title, subtitle, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 gap-1">
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center text-3xl mb-2 animate-yv-float"
        style={{
          background: "linear-gradient(135deg, rgba(120,87,255,0.18), rgba(255,0,115,0.14))",
          border: "1px solid rgba(120,87,255,0.3)",
        }}
      >
        {emoji}
      </div>
      <p className="font-display font-extrabold text-2xl tracking-tight -mt-1">{title}</p>
      {subtitle && <p className="text-ink-3 text-sm max-w-xs mt-1">{subtitle}</p>}
      {actionLabel && (
        <Button className="mt-6" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
