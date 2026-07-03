const variants = {
  primary:
    "border-none bg-gradient-to-br from-[#7857FF] to-[#FF0073] text-white shadow-[0_16px_30px_-10px_rgba(120,87,255,0.9)]",
  secondary:
    "bg-surface-3 text-white border border-white/10",
  ghost:
    "bg-transparent text-ink-2 border-[1.5px] border-white/[0.18]",
};

const sizes = {
  md: "px-6 py-3.5 text-[15px]",
  sm: "px-4 py-2 text-[13px]",
};

export default function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}) {
  return (
    <button
      className={`rounded-full font-extrabold font-sans disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-[0.97] ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
