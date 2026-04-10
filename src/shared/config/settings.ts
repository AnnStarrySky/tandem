import type { UserSettings } from "@shared/types";

export const DEFAULT_SETTINGS: UserSettings = {
  theme: "dark",
  language: "en",
  soundEnabled: true,
};

export const SETTINGS_STORAGE_KEY = "codecat:user-settings";
export const PROFILE_STORAGE_KEY = "codecat:user-profile";

export function normalizeUserSettings(settings?: Partial<UserSettings> | null): UserSettings {
  return {
    theme: settings?.theme ?? DEFAULT_SETTINGS.theme,
    language: settings?.language ?? DEFAULT_SETTINGS.language,
    soundEnabled: settings?.soundEnabled ?? DEFAULT_SETTINGS.soundEnabled,
  };
}
