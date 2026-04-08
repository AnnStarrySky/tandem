let activeAudio: HTMLAudioElement | null = null;

export function stopUiSound(): void {
  if (!activeAudio) {
    return;
  }

  activeAudio.pause();
  activeAudio.currentTime = 0;
  activeAudio = null;
}

export function playUiSound(src = "/sounds/meowl.mp3", volume = 0.35): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    stopUiSound();

    const audio = new Audio(src);
    audio.volume = volume;
    activeAudio = audio;

    audio.addEventListener(
      "ended",
      () => {
        if (activeAudio === audio) {
          activeAudio = null;
        }
      },
      { once: true },
    );

    void audio.play().catch(() => {
      if (activeAudio === audio) {
        activeAudio = null;
      }
    });
  } catch {
    activeAudio = null;
  }
}
