"use client";

import { useCallback, useMemo } from "react";

import { useLocale } from "next-intl";

import { usePathname, useRouter } from "@i18n";

import type { AppLanguage } from "@shared/types";

export function useLocaleSwitch() {
  const locale = useLocale() as AppLanguage;
  const pathname = usePathname();
  const router = useRouter();

  const nextLocale = useMemo<AppLanguage>(() => {
    return locale === "en" ? "ru" : "en";
  }, [locale]);

  const replaceLocale = useCallback(
    (targetLocale: AppLanguage) => {
      if (targetLocale === locale) {
        return;
      }

      router.replace(pathname, { locale: targetLocale });
    },
    [locale, pathname, router],
  );

  const toggleLocale = useCallback(() => {
    replaceLocale(nextLocale);
  }, [nextLocale, replaceLocale]);

  return {
    locale,
    nextLocale,
    replaceLocale,
    toggleLocale,
  };
}
