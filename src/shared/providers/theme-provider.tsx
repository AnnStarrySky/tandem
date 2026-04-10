"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import type { PropsWithChildren } from "react";

import { useSettingsStore } from "@shared/model/settings";

import type { AppTheme } from "@shared/types";

type ThemeContextValue = {
  theme: AppTheme;
  toggleTheme: () => void;
  setTheme: (theme: AppTheme) => void;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): AppTheme {
  if (typeof window === "undefined") {
    return "dark";
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: AppTheme) {
  if (typeof document === "undefined") {
    return;
  }

  const root = document.documentElement;
  root.dataset.theme = theme;
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: PropsWithChildren): React.JSX.Element {
  const { settings, updateSettings } = useSettingsStore();

  const theme = settings.theme ?? getSystemTheme();

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const setTheme = useCallback(
    (nextTheme: AppTheme) => {
      updateSettings({ theme: nextTheme });
      applyTheme(nextTheme);
    },
    [updateSettings],
  );

  const toggleTheme = useCallback(() => {
    const nextTheme: AppTheme = theme === "dark" ? "light" : "dark";
    updateSettings({ theme: nextTheme });
    applyTheme(nextTheme);
  }, [theme, updateSettings]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme,
      setTheme,
      mounted: true,
    }),
    [theme, toggleTheme, setTheme],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
