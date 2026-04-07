"use client";

import { useLocaleSwitch, useSettings, useUiSound } from "@shared/lib/hooks";
import { useTheme } from "@shared/providers";

import type { AppLanguage } from "@shared/types";

export function usePreferencesForm() {
  const { settings, updateSettings, resetSettings, mounted } = useSettings();
  const { theme, setTheme } = useTheme();
  const { replaceLocale } = useLocaleSwitch();
  const { playClickSound } = useUiSound();

  function handleThemeChange(nextTheme: "light" | "dark") {
    playClickSound();
    setTheme(nextTheme);
    updateSettings({ theme: nextTheme });
  }

  function handleLanguageChange(nextLanguage: AppLanguage) {
    playClickSound();
    updateSettings({ language: nextLanguage });
    replaceLocale(nextLanguage);
  }

  function handleSoundChange(nextValue: boolean) {
    if (nextValue) {
      updateSettings({ soundEnabled: true });
      playClickSound();
      return;
    }

    updateSettings({ soundEnabled: false });
  }

  function handleReset() {
    playClickSound();
    resetSettings();
  }

  return {
    mounted,
    settings,
    theme,
    handleThemeChange,
    handleLanguageChange,
    handleSoundChange,
    handleReset,
  };
}
