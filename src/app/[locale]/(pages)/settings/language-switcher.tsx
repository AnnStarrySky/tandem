"use client";

import React from "react";

import { useLocale } from "next-intl";

import { BaseBtn } from "@shared/ui/button";

import { usePathname, useRouter } from "../../../../i18n";

export const LanguageSwitcher = () => {
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const handleChangeLocale = (nextLocale: "en" | "ru") => {
    if (nextLocale === locale) return;
    router.replace(pathname, { locale: nextLocale });
  };

  const getVariant = (isActive: boolean) => (isActive ? "primary" : "outline");

  return (
    <div className="flex flex-wrap gap-3">
      <BaseBtn
        variant={getVariant(locale === "en")}
        className="w-auto max-w-none min-w-[90px] px-4 py-2 text-sm"
        onClick={() => handleChangeLocale("en")}
      >
        EN
      </BaseBtn>

      <BaseBtn
        variant={getVariant(locale === "ru")}
        className="w-auto max-w-none min-w-[90px] px-4 py-2 text-sm"
        onClick={() => handleChangeLocale("ru")}
      >
        RU
      </BaseBtn>
    </div>
  );
};
