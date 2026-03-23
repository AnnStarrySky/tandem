"use client";

import React from "react";

import { useTheme } from "@shared/lib/theme";
import { cn } from "@shared/lib";

export function ThemeToggle(): React.JSX.Element {
  const { theme, toggleTheme, mounted } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={cn(
        "inline-flex h-[44px] min-w-[44px] items-center justify-center rounded-[16px] border px-4 text-sm font-semibold transition-all duration-200",
        "hover:scale-[1.02] active:scale-[0.98]",
      )}
      style={{
        borderColor: "var(--card-border)",
        background: "var(--input-bg)",
        color: "var(--text-main)",
        boxShadow: mounted ? "0 4px 14px rgba(0,0,0,0.08)" : "none",
      }}
      aria-label={theme === "dark" ? "Switch to light theme" : "Switch to dark theme"}
      title={theme === "dark" ? "Light mode" : "Dark mode"}
    >
      {mounted ? (theme === "dark" ? "☀" : "☾") : "◐"}
    </button>
  );
}
