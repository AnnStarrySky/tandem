"use client";

import { useCallback, useEffect, useState } from "react";

import { DEFAULT_SETTINGS, SETTINGS_STORAGE_KEY } from "@shared/config/settings";
import {
  APP_SETTINGS_UPDATED_EVENT,
  getClientAppSettings,
  resetClientAppSettings,
  type ClientAppSettings,
  updateClientAppSettings,
} from "@shared/lib/sound-client";

type UseSettingsReturn = {
  settings: typeof DEFAULT_SETTINGS;
  updateSettings: (partialSettings: Partial<ClientAppSettings>) => void;
  resetSettings: () => void;
  mounted: boolean;
};

export function useSettings(): UseSettingsReturn {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  useEffect(() => {
    setSettings(getClientAppSettings());
    setMounted(true);
  }, []);

  useEffect(() => {
    function syncSettings() {
      setSettings(getClientAppSettings());
    }

    function handleStorage(event: StorageEvent) {
      if (event.key !== SETTINGS_STORAGE_KEY) {
        return;
      }

      syncSettings();
    }

    window.addEventListener("storage", handleStorage);
    window.addEventListener(APP_SETTINGS_UPDATED_EVENT, syncSettings);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(APP_SETTINGS_UPDATED_EVENT, syncSettings);
    };
  }, []);

  const updateSettings = useCallback((partialSettings: Partial<ClientAppSettings>) => {
    setSettings(updateClientAppSettings(partialSettings));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(resetClientAppSettings());
  }, []);

  return {
    settings,
    updateSettings,
    resetSettings,
    mounted,
  };
}
