import type { UserSettings } from "@shared/types";

export const DEFAULT_SETTINGS: UserSettings = {
  theme: "dark",
  language: "en",
  soundEnabled: true,
};

export const SETTINGS_STORAGE_KEY = "codecat:user-settings";
export const PROFILE_STORAGE_KEY = "codecat:user-profile";
