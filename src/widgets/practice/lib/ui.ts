import { cn } from "@/src/shared/lib";

export const PRACTICE_ACTION_BUTTON_BASE_CLASS =
  "rounded-2xl px-5 py-3 text-[15px] font-semibold text-white shadow-[0_10px_22px_rgba(19,178,246,0.22)] transition-transform duration-200";

export const PRACTICE_ACTION_BUTTON_ACTIVE_CLASS =
  "bg-gradient-to-r from-[#13b2f6] to-[#84f59b] hover:translate-y-[-1px]";

export const PRACTICE_ACTION_BUTTON_DISABLED_CLASS =
  "cursor-not-allowed bg-white/10 text-white/50 shadow-none";

export function getPracticeActionButtonClass(disabled = false): string {
  return cn(
    PRACTICE_ACTION_BUTTON_BASE_CLASS,
    disabled ? PRACTICE_ACTION_BUTTON_DISABLED_CLASS : PRACTICE_ACTION_BUTTON_ACTIVE_CLASS,
  );
}

export function getPracticeWideActionButtonClass(disabled = false): string {
  return cn("w-full", getPracticeActionButtonClass(disabled));
}

export function getPracticeRetryButtonClass(): string {
  return cn("w-full max-w-[300px]", getPracticeActionButtonClass(false));
}
