"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from "@shared/config/settings";

import type { UserSettings } from "@shared/types";

function readSettings(): UserSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!raw) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(raw) as Partial<UserSettings>;

    return {
      ...DEFAULT_SETTINGS,
      ...parsed,
    };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeSettings(settings: UserSettings) {
  window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function useSettings() {
  const [settings, setSettings] = useState<UserSettings>(DEFAULT_SETTINGS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const nextSettings = readSettings();

    setSettings(nextSettings);
    setMounted(true);
  }, []);

  const updateSettings = useCallback((patch: Partial<UserSettings>) => {
    setSettings((prev) => {
      const next = {
        ...prev,
        ...patch,
      };

      writeSettings(next);

      return next;
    });
  }, []);

  const setSoundEnabled = useCallback(
    (value: boolean) => {
      updateSettings({ soundEnabled: value });
    },
    [updateSettings],
  );

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_SETTINGS);
    writeSettings(DEFAULT_SETTINGS);
  }, []);

  return useMemo(
    () => ({
      settings,
      mounted,
      updateSettings,
      setSoundEnabled,
      resetSettings,
    }),
    [mounted, resetSettings, setSoundEnabled, settings, updateSettings],
  );
}
