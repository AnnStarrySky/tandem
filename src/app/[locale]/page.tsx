"use client";

import React from "react";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useTranslations, useLocale } from "next-intl";

import { ChangeLanguage, ThemeToggle } from "@/src/shared/ui";
import { BaseBtn } from "@/src/shared/ui/button";
import { IconLogoMain } from "@/src/shared/ui/icon";

export default function Home(): React.JSX.Element {
  const translation = useTranslations("HomePage");
  const router = useRouter();
  const locale = useLocale();

  const handleStart = () => {
    router.push(`/${locale}/dashboard`);
  };

  const handleRegister = () => {
    router.push(`/${locale}/auth/register`);
  };

  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-4 py-8 sm:px-6">
      <div
        className="flex w-full max-w-[980px] flex-col items-center gap-10 rounded-lg border p-6 shadow-lg sm:p-8 md:p-10"
        style={{
          background: "var(--card-bg)",
          borderColor: "var(--card-border)",
          boxShadow: "var(--card-shadow)",
        }}
      >
        <IconLogoMain />

        <p
          className="max-w-[760px] text-center text-base leading-[1.6] sm:text-lg md:text-[24px]"
          style={{ color: "var(--text-main)" }}
        >
          {translation("descriptionLine1")}
          <br />
          {translation("descriptionLine2")}
        </p>

        <div className="flex w-full flex-col items-center justify-center gap-4 lg:flex-row lg:gap-5">
          <div
            className="text-center lg:w-auto lg:min-w-[110px] lg:text-left"
            style={{ color: "var(--text-main)" }}
          >
            {translation("createdBy")}
          </div>

          <div className="flex w-full flex-wrap items-center justify-center gap-4">
            <Link
              className="creators-link rounded-lg border shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
              style={{
                background: "var(--input-bg)",
                borderColor: "var(--card-border)",
                color: "var(--text-main)",
              }}
              href="https://github.com/angelinavakkasova"
              target="_blank"
            >
              angelinavakkasova
            </Link>

            <Link
              className="creators-link rounded-lg border shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
              style={{
                background: "var(--input-bg)",
                borderColor: "var(--card-border)",
                color: "var(--text-main)",
              }}
              href="https://github.com/annstarrysky"
              target="_blank"
            >
              annstarrysky
            </Link>

            <Link
              className="creators-link rounded-lg border shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
              style={{
                background: "var(--input-bg)",
                borderColor: "var(--card-border)",
                color: "var(--text-main)",
              }}
              href="https://github.com/yuriyli"
              target="_blank"
            >
              yuriyli
            </Link>
          </div>
        </div>

        <div className="flex w-full flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <BaseBtn variant="primary" className="w-[200px]" onClick={handleStart}>
            {translation("start")}
          </BaseBtn>

          <BaseBtn variant="primary" className="w-[200px]" onClick={handleRegister}>
            {translation("register")}
          </BaseBtn>
        </div>

        <div className="flex items-center gap-3">
          <ChangeLanguage />
          <ThemeToggle />
        </div>
      </div>
    </main>
  );
}
