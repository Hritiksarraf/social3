export default function AuthShell({ eyebrow, title, subtitle, children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-[380px]">
        <div
          className="w-14 h-14 rounded-[18px] flex items-center justify-center -rotate-3 mb-6"
          style={{
            background: "linear-gradient(135deg, #7857FF, #FF0073)",
            boxShadow: "0 16px 30px -12px rgba(120,87,255,0.8)",
          }}
        >
          <div className="flex gap-[3px] items-end h-6">
            <span className="w-1 bg-white rounded" style={{ height: 9 }} />
            <span className="w-1 bg-white rounded" style={{ height: 24 }} />
            <span className="w-1 bg-white rounded" style={{ height: 16 }} />
            <span className="w-1 bg-white rounded" style={{ height: 20 }} />
          </div>
        </div>
        {eyebrow && (
          <p className="text-[11px] font-extrabold tracking-[0.14em] uppercase text-purple-1 mb-1">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display font-extrabold text-[32px] leading-[0.95] tracking-tight mb-1">
          {title}
        </h1>
        {subtitle && <p className="text-ink-3 text-sm mb-6">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
