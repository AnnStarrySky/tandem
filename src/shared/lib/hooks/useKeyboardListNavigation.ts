"use client";

import type { KeyboardEvent, RefObject } from "react";
import { useCallback } from "react";

type Params = {
  refs: RefObject<HTMLElement | null>[];
  loop?: boolean;
  orientation?: "vertical" | "horizontal" | "both";
};

export function useKeyboardListNavigation({ refs, loop = true, orientation = "vertical" }: Params) {
  return useCallback(
    (index: number, event: KeyboardEvent<HTMLElement>) => {
      const isVertical = orientation === "vertical" || orientation === "both";
      const isHorizontal = orientation === "horizontal" || orientation === "both";

      const moveTo = (nextIndex: number) => {
        refs[nextIndex]?.current?.focus();
      };

      const lastIndex = refs.length - 1;

      if (isVertical && event.key === "ArrowDown") {
        event.preventDefault();

        if (index === lastIndex) {
          if (loop) moveTo(0);
          return;
        }

        moveTo(index + 1);
      }

      if (isVertical && event.key === "ArrowUp") {
        event.preventDefault();

        if (index === 0) {
          if (loop) moveTo(lastIndex);
          return;
        }

        moveTo(index - 1);
      }

      if (isHorizontal && event.key === "ArrowRight") {
        event.preventDefault();

        if (index === lastIndex) {
          if (loop) moveTo(0);
          return;
        }

        moveTo(index + 1);
      }

      if (isHorizontal && event.key === "ArrowLeft") {
        event.preventDefault();

        if (index === 0) {
          if (loop) moveTo(lastIndex);
          return;
        }

        moveTo(index - 1);
      }
    },
    [loop, orientation, refs],
  );
}
