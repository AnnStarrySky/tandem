"use client";

import { useSettingsStore } from "@shared/model/settings";

export function useSettings() {
  const { settings, updateSettings, resetSettings, setSettings } = useSettingsStore();

  return {
    settings,
    updateSettings,
    resetSettings,
    setSettings,
    mounted: true,
  };
}
