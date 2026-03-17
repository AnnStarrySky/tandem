"use client";

import { useLocale } from "next-intl";
import { useRouter, usePathname } from "@/src/i18n/navigation";
import { BaseBtn } from "./button";

export default function СhangeLanguage() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const nextLocale = locale === "en" ? "ru" : "en";

  return (
    <BaseBtn variant="outline" onClick={() => router.replace(pathname, { locale: nextLocale })}>
      {nextLocale.toUpperCase()}
    </BaseBtn>
  );
}
