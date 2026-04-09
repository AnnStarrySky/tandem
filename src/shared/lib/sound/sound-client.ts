import { getSettingsSnapshot } from "@shared/model/settings";

import { playUiSound, stopUiSound } from "./sound";

export function isUiSoundEnabled(): boolean {
  return getSettingsSnapshot().soundEnabled;
}

export function playUiSoundIfEnabled(src?: string): void {
  if (!isUiSoundEnabled()) {
    stopUiSound();
    return;
  }

  playUiSound(src);
}
