"use client";

import React from "react";

import { cn } from "@shared/lib";
import { useLocaleSwitch } from "@shared/lib/hooks";

import { BaseBtn } from "../button";

type Props = {
  variant?: "compact" | "segmented" | "buttons";
  className?: string;
};

export function LanguageToggle({ variant = "segmented", className }: Props): React.JSX.Element {
  const { locale, nextLocale, replaceLocale, toggleLocale } = useLocaleSwitch();

  if (variant === "compact") {
    return (
      <BaseBtn
        variant="outline"
        onClick={toggleLocale}
        className={cn("inline-flex h-11 items-center justify-center px-4 text-sm", className)}
      >
        {nextLocale.toUpperCase()}
      </BaseBtn>
    );
  }

  if (variant === "buttons") {
    return (
      <div className={cn("flex flex-wrap gap-3", className)}>
        <BaseBtn
          variant={locale === "en" ? "primary" : "outline"}
          className="min-w-22.5 px-4 py-2 text-sm"
          onClick={() => replaceLocale("en")}
        >
          EN
        </BaseBtn>

        <BaseBtn
          variant={locale === "ru" ? "primary" : "outline"}
          className="min-w-22.5 px-4 py-2 text-sm"
          onClick={() => replaceLocale("ru")}
        >
          RU
        </BaseBtn>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-1 rounded-2xl border border-(--card-border) bg-(--input-bg) p-1",
        className,
      )}
    >
      <BaseBtn
        variant={locale === "ru" ? "primary" : "outline"}
        className="inline-flex min-w-14 items-center justify-center px-3 py-2 text-sm shadow-none"
        onClick={() => replaceLocale("ru")}
      >
        RU
      </BaseBtn>

      <BaseBtn
        variant={locale === "en" ? "primary" : "outline"}
        className="inline-flex min-w-14 items-center justify-center px-3 py-2 text-sm shadow-none"
        onClick={() => replaceLocale("en")}
      >
        EN
      </BaseBtn>
    </div>
  );
}
