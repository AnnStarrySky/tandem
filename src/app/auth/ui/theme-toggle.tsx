"use client";

import React from "react";

import { useTheme } from "../../providers/theme-provider";

function SunIcon(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.75v2.5" />
      <path d="M12 18.75v2.5" />
      <path d="M21.25 12h-2.5" />
      <path d="M5.25 12h-2.5" />
      <path d="M18.54 5.46l-1.77 1.77" />
      <path d="M7.23 16.77l-1.77 1.77" />
      <path d="M18.54 18.54l-1.77-1.77" />
      <path d="M7.23 7.23L5.46 5.46" />
    </svg>
  );
}

function MoonIcon(): React.JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-5 w-5"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20.1 14.2A8.9 8.9 0 1 1 13.8 3.9a7.2 7.2 0 0 0 6.3 10.3Z" />
    </svg>
  );
}

export function ThemeToggle(): React.JSX.Element {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return (
      <button
        type="button"
        disabled
        className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border opacity-70"
        style={{
          borderColor: "var(--card-border)",
          background: "rgba(255,255,255,0.04)",
          color: "var(--text-main)",
        }}
        aria-label="Тема"
      >
        <span className="h-5 w-5 rounded-full border border-current" />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border transition hover:scale-[1.03] active:scale-[0.97]"
      style={{
        borderColor: "var(--card-border)",
        background: "rgba(255,255,255,0.04)",
        color: "var(--text-main)",
      }}
      aria-label="Переключить тему"
      title="Переключить тему"
    >
      {theme === "dark" ? <SunIcon /> : <MoonIcon />}
    </button>
  );
}
