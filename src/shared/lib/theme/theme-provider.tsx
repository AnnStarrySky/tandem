"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { PropsWithChildren } from "react";

import { DEFAULT_SETTINGS } from "@shared/config/settings";
import {
  APP_SETTINGS_UPDATED_EVENT,
  getClientAppSettings,
  updateClientAppSettings,
} from "@shared/lib/sound-client";

export type Theme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
  mounted: boolean;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getSystemTheme(): Theme {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS.theme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function applyTheme(theme: Theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme);
  root.style.colorScheme = theme;
}

export function ThemeProvider({ children }: PropsWithChildren): React.JSX.Element {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_SETTINGS.theme);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedSettings = getClientAppSettings();
    const nextTheme = storedSettings.theme ?? getSystemTheme();

    setThemeState(nextTheme);
    applyTheme(nextTheme);
    setMounted(true);
  }, []);

  useEffect(() => {
    function syncTheme() {
      const nextTheme = getClientAppSettings().theme ?? getSystemTheme();
      setThemeState(nextTheme);
      applyTheme(nextTheme);
    }

    window.addEventListener(APP_SETTINGS_UPDATED_EVENT, syncTheme);

    return () => {
      window.removeEventListener(APP_SETTINGS_UPDATED_EVENT, syncTheme);
    };
  }, []);

  const setTheme = useCallback((nextTheme: Theme) => {
    setThemeState(nextTheme);
    updateClientAppSettings({ theme: nextTheme });
    applyTheme(nextTheme);
  }, []);

  const toggleTheme = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      toggleTheme,
      setTheme,
      mounted,
    }),
    [mounted, setTheme, theme, toggleTheme],
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
