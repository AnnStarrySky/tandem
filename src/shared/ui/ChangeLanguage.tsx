"use client";

import { useLocale } from "next-intl";

import { useRouter, usePathname } from "../../i18n";

import { BaseBtn } from "./button";

export const ChangeLanguage = () => {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === "en" ? "ru" : "en";

  return (
    <BaseBtn variant="outline" onClick={() => router.replace(pathname, { locale: nextLocale })}>
      {nextLocale.toUpperCase()}
    </BaseBtn>
  );
};
