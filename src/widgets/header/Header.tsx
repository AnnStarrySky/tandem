"use client";

import { useState } from "react";

import { useTranslations } from "next-intl";

import { cn } from "@shared/lib";
import { UserName } from "@shared/ui";
import { Icon, IconLogoMain } from "@shared/ui/icon";
import { LevelImage } from "@shared/ui/mainImage";

import { Link } from "../../i18n";

type HeaderProps = {
  className?: string;
};

const navItemClass =
  "flex w-full items-center rounded-xl border px-4 py-2 shadow-sm transition-all duration-200 hover:shadow-none border-[var(--card-border)] bg-[var(--input-bg)] text-[var(--text-main)]";

export const Header = ({ className }: HeaderProps) => {
  const t = useTranslations("Header");
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  const navLinks = (
    <nav className="flex w-full flex-col items-center justify-start gap-2">
      <Link href="/dashboard" onClick={close} className={navItemClass}>
        <Icon name="home" size={18} className="mr-2 text-[var(--sidebar-text)]" />
        <span>{t("home")}</span>
      </Link>

      <Link href="/glossary" onClick={close} className={navItemClass}>
        <Icon name="glossary" size={18} className="mr-2 text-[var(--sidebar-text)]" />
        <span>{t("glossary")}</span>
      </Link>

      <Link href="/practice" onClick={close} className={navItemClass}>
        <Icon name="practice" size={18} className="mr-2 text-[var(--sidebar-text)]" />
        <span>{t("practice")}</span>
      </Link>

      <Link href="/levels" onClick={close} className={navItemClass}>
        <Icon name="levels" size={18} className="mr-2 text-[var(--sidebar-text)]" />
        <span>{t("levels")}</span>
      </Link>

      <Link href="/settings" onClick={close} className={navItemClass}>
        <Icon name="settings" size={18} className="mr-2 text-[var(--sidebar-text)]" />
        <span>{t("settings")}</span>
      </Link>
    </nav>
  );

  return (
    <>
      <header
        className={cn(
          "hidden min-h-screen w-[280px] flex-col items-start gap-3 rounded-l-lg p-4 md:flex",
          "border-r border-[var(--card-border)] bg-[var(--sidebar-bg)]",
          className,
        )}
      >
        <IconLogoMain />

        <UserName
          userName="Anna"
          className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-4 py-2 text-center tracking-wider text-[var(--text-main)] shadow-sm"
        />

        {navLinks}
      </header>

      <div className="relative md:hidden">
        <div
          onClick={close}
          className={cn(
            "fixed inset-0 z-40 bg-black/40 transition-opacity duration-300",
            isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
          )}
        />

        <header className="relative z-50 flex items-center justify-between bg-[var(--sidebar-bg)] p-3">
          <IconLogoMain />

          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            className="flex h-10 w-10 flex-col items-center justify-center gap-[5px] rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)]"
          >
            <span
              className={cn(
                "block h-0.5 w-5 rounded bg-[var(--text-main)] transition-all duration-300",
                isOpen && "translate-y-[7px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 rounded bg-[var(--text-main)] transition-all duration-300",
                isOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 rounded bg-[var(--text-main)] transition-all duration-300",
                isOpen && "-translate-y-[7px] -rotate-45",
              )}
            />
          </button>
        </header>

        <div
          className={cn(
            "absolute right-0 left-0 z-50 overflow-hidden bg-[var(--sidebar-bg)] transition-all duration-300",
            isOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0",
          )}
        >
          <div className="flex flex-col items-center gap-4 p-5 pb-8">
            <UserName
              userName="Anna"
              className="w-full rounded-xl border border-[var(--card-border)] bg-[var(--input-bg)] px-4 py-2 text-center tracking-wider text-[var(--text-main)] shadow-sm"
            />

            {navLinks}

            <div className="mt-2">
              <LevelImage typeCat="newbie" alt="newbie" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
