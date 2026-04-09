"use client";

import { useCallback } from "react";

import { playUiSoundIfEnabled } from "@shared/lib/sound";

type UseUiSoundReturn = {
  playClickSound: () => void;
  playCustomSound: (src: string) => void;
};

export function useUiSound(): UseUiSoundReturn {
  const playClickSound = useCallback(() => {
    playUiSoundIfEnabled();
  }, []);

  const playCustomSound = useCallback((src: string) => {
    playUiSoundIfEnabled(src);
  }, []);

  return {
    playClickSound,
    playCustomSound,
  };
}
