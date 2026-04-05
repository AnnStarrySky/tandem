import {
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  normalizeUserSettings,
} from "@shared/config/settings";

import { playUiSound, stopUiSound } from "./sound";

import type { UserSettings } from "@shared/types";

export type ClientAppSettings = Partial<UserSettings>;

export const APP_SETTINGS_UPDATED_EVENT = "codecat:app-settings-updated";

let cachedSettings: UserSettings | null = null;

function emitSettingsUpdated(nextSettings: UserSettings): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<UserSettings>(APP_SETTINGS_UPDATED_EVENT, {
      detail: nextSettings,
    }),
  );
}

export function getClientAppSettings(): UserSettings {
  if (typeof window === "undefined") {
    return cachedSettings ?? DEFAULT_SETTINGS;
  }

  if (cachedSettings) {
    return cachedSettings;
  }

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!raw) {
      cachedSettings = DEFAULT_SETTINGS;
      return cachedSettings;
    }

    cachedSettings = normalizeUserSettings(JSON.parse(raw) as Partial<UserSettings>);
    return cachedSettings;
  } catch {
    cachedSettings = DEFAULT_SETTINGS;
    return cachedSettings;
  }
}

export function setClientAppSettings(nextSettings: ClientAppSettings): UserSettings {
  const normalized = normalizeUserSettings(nextSettings);
  cachedSettings = normalized;

  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(normalized));
    } catch {
      // ignore
    }

    emitSettingsUpdated(normalized);
  }

  if (!normalized.soundEnabled) {
    stopUiSound();
  }

  return normalized;
}

export function updateClientAppSettings(partialSettings: Partial<UserSettings>): UserSettings {
  return setClientAppSettings({
    ...getClientAppSettings(),
    ...partialSettings,
  });
}

export function resetClientAppSettings(): UserSettings {
  return setClientAppSettings(DEFAULT_SETTINGS);
}

export function isUiSoundEnabled(): boolean {
  return getClientAppSettings().soundEnabled;
}

export function playUiSoundIfEnabled(src?: string): void {
  if (!isUiSoundEnabled()) {
    stopUiSound();
    return;
  }

  playUiSound(src);
}
