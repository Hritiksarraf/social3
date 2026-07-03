"use client";

import { useState } from "react";

export default function FormField({ label, type = "text", className = "", ...props }) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";
  const inputType = isPassword && visible ? "text" : type;

  return (
    <label
      className={`block bg-base-1 border border-white/[0.09] rounded-2xl px-4 py-2.5 focus-within:border-[1.5px] focus-within:border-purple-1 focus-within:shadow-[0_0_0_3px_rgba(120,87,255,0.18)] transition-shadow ${className}`}
    >
      <span className="block text-[10px] font-extrabold tracking-[0.12em] uppercase text-purple-1">
        {label}
      </span>
      <span className="flex items-center gap-2 mt-0.5">
        <input
          type={inputType}
          className="flex-1 min-w-0 bg-transparent outline-none text-[15px] font-semibold text-white placeholder:text-ink-4 placeholder:font-medium"
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="text-ink-3 text-xs font-extrabold shrink-0"
          >
            {visible ? "Hide" : "Show"}
          </button>
        )}
      </span>
    </label>
  );
}
