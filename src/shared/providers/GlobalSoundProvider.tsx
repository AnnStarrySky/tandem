"use client";

import React, { useEffect } from "react";

import { playUiSoundIfEnabled } from "@/src/shared/lib/sound-client";

export function GlobalSoundProvider(): React.JSX.Element | null {
  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as HTMLElement | null;

      if (!target) {
        return;
      }

      const ignored = target.closest('[data-sound-ignore="true"]');

      if (ignored) {
        return;
      }

      const clickable = target.closest(
        'button, a, [role="button"], summary, input[type="checkbox"], input[type="radio"], label[for]',
      ) as HTMLElement | null;

      if (!clickable) {
        return;
      }

      if ("disabled" in clickable && clickable instanceof HTMLButtonElement && clickable.disabled) {
        return;
      }

      playUiSoundIfEnabled();
    }

    function handleKeyboardActivate(event: KeyboardEvent) {
      if (event.key !== "Enter" && event.key !== " ") {
        return;
      }

      const target = event.target as HTMLElement | null;

      if (!target) {
        return;
      }

      const ignored = target.closest('[data-sound-ignore="true"]');

      if (ignored) {
        return;
      }

      const interactive = target.closest(
        'button, a, [role="button"], input, textarea, select',
      ) as HTMLElement | null;

      if (!interactive) {
        return;
      }

      if (
        "disabled" in interactive &&
        (interactive instanceof HTMLButtonElement ||
          interactive instanceof HTMLInputElement ||
          interactive instanceof HTMLTextAreaElement ||
          interactive instanceof HTMLSelectElement) &&
        interactive.disabled
      ) {
        return;
      }

      playUiSoundIfEnabled();
    }

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyboardActivate);

    return () => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyboardActivate);
    };
  }, []);

  return null;
}
