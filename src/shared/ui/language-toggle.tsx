"use client";

import React from "react";

import { cn } from "@shared/lib";
import { useLocaleSwitch } from "@shared/lib/hooks";

import { BaseBtn } from "./button";

type Props = {
  variant?: "compact" | "segmented" | "buttons";
  className?: string;
};

export function LanguageToggle({ variant = "segmented", className }: Props): React.JSX.Element {
  const { locale, nextLocale, replaceLocale, toggleLocale } = useLocaleSwitch();

  if (variant === "compact") {
    return (
      <BaseBtn variant="outline" onClick={toggleLocale} className={className}>
        {nextLocale.toUpperCase()}
      </BaseBtn>
    );
  }

  if (variant === "buttons") {
    return (
      <div className={cn("flex flex-wrap gap-3", className)}>
        <BaseBtn
          variant={locale === "en" ? "primary" : "outline"}
          className="w-auto max-w-none min-w-[90px] px-4 py-2 text-sm"
          onClick={() => replaceLocale("en")}
        >
          EN
        </BaseBtn>

        <BaseBtn
          variant={locale === "ru" ? "primary" : "outline"}
          className="w-auto max-w-none min-w-[90px] px-4 py-2 text-sm"
          onClick={() => replaceLocale("ru")}
        >
          RU
        </BaseBtn>
      </div>
    );
  }

  return (
    <div
      className={cn("inline-flex items-center rounded-[22px] border p-1", className)}
      style={{
        borderColor: "var(--card-border)",
        background: "var(--input-bg)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <button
        type="button"
        onClick={() => replaceLocale("ru")}
        className={cn(
          "min-w-[56px] cursor-pointer rounded-[16px] px-4 py-2 text-sm font-semibold transition-all duration-200",
          locale === "ru" ? "opacity-100" : "opacity-70 hover:opacity-100",
        )}
        style={{
          background: locale === "ru" ? "var(--text-main)" : "transparent",
          color: locale === "ru" ? "var(--bg-main)" : "var(--text-muted)",
          boxShadow: locale === "ru" ? "0 4px 14px rgba(0,0,0,0.12)" : "none",
        }}
      >
        RU
      </button>

      <button
        type="button"
        onClick={() => replaceLocale("en")}
        className={cn(
          "min-w-[56px] cursor-pointer rounded-[16px] px-4 py-2 text-sm font-semibold transition-all duration-200",
          locale === "en" ? "opacity-100" : "opacity-70 hover:opacity-100",
        )}
        style={{
          background: locale === "en" ? "var(--text-main)" : "transparent",
          color: locale === "en" ? "var(--bg-main)" : "var(--text-muted)",
          boxShadow: locale === "en" ? "0 4px 14px rgba(0,0,0,0.12)" : "none",
        }}
      >
        EN
      </button>
    </div>
  );
}
