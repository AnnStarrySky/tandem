"use client";

import React from "react";

import { useLocale } from "next-intl";

import { cn } from "@shared/lib";

import { usePathname, useRouter } from "../../../../i18n";

export function LanguageToggle(): React.JSX.Element {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  function handleChange(nextLocale: "ru" | "en") {
    if (nextLocale === locale) {
      return;
    }

    router.replace(pathname, { locale: nextLocale });
    router.refresh();
  }

  return (
    <div
      className="inline-flex items-center rounded-[22px] border p-1"
      style={{
        borderColor: "var(--card-border)",
        background: "var(--input-bg)",
        boxShadow: "inset 0 1px 0 rgba(255,255,255,0.04)",
      }}
    >
      <button
        type="button"
        onClick={() => handleChange("ru")}
        className={cn(
          "min-w-[56px] rounded-[16px] px-4 py-2 text-sm font-semibold transition-all duration-200",
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
        onClick={() => handleChange("en")}
        className={cn(
          "min-w-[56px] rounded-[16px] px-4 py-2 text-sm font-semibold transition-all duration-200",
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
