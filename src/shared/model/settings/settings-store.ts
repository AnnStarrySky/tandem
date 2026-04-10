"use client";

import { useSyncExternalStore } from "react";

import {
  DEFAULT_SETTINGS,
  SETTINGS_STORAGE_KEY,
  normalizeUserSettings,
} from "@shared/config/settings";

import type { UserSettings } from "@shared/types";

type Listener = () => void;

let state: UserSettings = DEFAULT_SETTINGS;
let initialized = false;
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function readStorage(): UserSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(SETTINGS_STORAGE_KEY);

    if (!raw) {
      return DEFAULT_SETTINGS;
    }

    return normalizeUserSettings(JSON.parse(raw) as Partial<UserSettings>);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeStorage(nextState: UserSettings) {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(nextState));
  } catch {
    // ignore storage write errors
  }
}

function ensureInitialized() {
  if (initialized) {
    return;
  }

  state = readStorage();
  initialized = true;

  if (typeof window !== "undefined") {
    window.addEventListener("storage", (event) => {
      if (event.key !== SETTINGS_STORAGE_KEY) {
        return;
      }

      state = readStorage();
      emit();
    });
  }
}

export function getSettingsSnapshot(): UserSettings {
  ensureInitialized();
  return state;
}

export function subscribeSettings(listener: Listener): () => void {
  ensureInitialized();
  listeners.add(listener);

  return () => {
    listeners.delete(listener);
  };
}

export function setSettingsState(nextState: UserSettings) {
  ensureInitialized();
  state = normalizeUserSettings(nextState);
  writeStorage(state);
  emit();
}

export function updateSettingsState(patch: Partial<UserSettings>) {
  setSettingsState({
    ...getSettingsSnapshot(),
    ...patch,
  });
}

export function resetSettingsState() {
  setSettingsState(DEFAULT_SETTINGS);
}

export function useSettingsStore() {
  const settings = useSyncExternalStore(
    subscribeSettings,
    getSettingsSnapshot,
    () => DEFAULT_SETTINGS,
  );

  return {
    settings,
    updateSettings: updateSettingsState,
    resetSettings: resetSettingsState,
    setSettings: setSettingsState,
  };
}
