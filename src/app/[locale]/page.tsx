"use client";

import React from "react";

import { useTranslations } from "next-intl";

import { useRouter } from "@i18n";
import { BaseBtn } from "@shared/ui/button";
import { LanguageToggle, ThemeToggle } from "@shared/ui/controls";
import { IconLogoMain } from "@shared/ui/icon";

export default function Home(): React.JSX.Element {
  const t = useTranslations("HomePage");
  const router = useRouter();

  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-4 py-8 sm:px-6">
      <div className="flex w-full max-w-[980px] flex-col items-center gap-10 rounded-2xl border border-(--card-border) bg-(--card-bg) p-6 shadow-[var(--card-shadow)] sm:p-8 md:p-10">
        <IconLogoMain />

        <p className="max-w-[760px] text-center text-base leading-[1.6] text-(--text-main) sm:text-lg md:text-[20px]">
          {t("descriptionLine1")}
          <br />
          {t("descriptionLine2")}
        </p>

        <div className="flex w-full flex-col items-center gap-4">
          <div className="text-center text-[20px] font-normal text-(--text-main) sm:text-[22px] md:text-[20px]">
            {t("createdBy")}
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-3">
            <a
              className="flex h-[42px] w-[200px] items-center justify-center rounded-lg border border-(--card-border) bg-(--input-bg) px-4 text-center text-[14px] text-(--text-main) shadow-sm sm:text-[16px]"
              href="https://github.com/angelinavakkasova"
              target="_blank"
              rel="noreferrer"
            >
              angelinavakkasova
            </a>

            <a
              className="flex h-[42px] w-[200px] items-center justify-center rounded-lg border border-(--card-border) bg-(--input-bg) px-4 text-center text-[14px] text-(--text-main) shadow-sm sm:text-[16px]"
              href="https://github.com/annstarrysky"
              target="_blank"
              rel="noreferrer"
            >
              annstarrysky
            </a>

            <a
              className="flex h-[42px] w-[200px] items-center justify-center rounded-lg border border-(--card-border) bg-(--input-bg) px-4 text-center text-[14px] text-(--text-main) shadow-sm sm:text-[16px]"
              href="https://github.com/yuriyli"
              target="_blank"
              rel="noreferrer"
            >
              yuriyli
            </a>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <BaseBtn
            variant="primary"
            className="w-[200px]"
            onClick={() => router.push("/dashboard")}
          >
            {t("start")}
          </BaseBtn>

          <BaseBtn
            variant="primary"
            className="w-[200px]"
            onClick={() => router.push("/auth/register")}
          >
            {t("register")}
          </BaseBtn>
        </div>

        <div className="flex items-center gap-2">
          <LanguageToggle variant="segmented" />
          <ThemeToggle />
        </div>
      </div>
    </main>
  );
}
