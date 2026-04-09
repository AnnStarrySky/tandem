"use client";

import { useState } from "react";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

import { cn } from "@/shared/lib";
import { UserName } from "@/shared/ui";
import { Icon, IconLogoMain } from "@/shared/ui/icon";
import { LevelImage } from "@/shared/ui/mainImage";
import { Link } from "@i18n";

type HeaderProps = {
  className?: string;
};

export const Header = ({ className }: HeaderProps) => {
  const { data: session } = useSession();
  const userName = session?.user?.name || "CodeCat User";
  const translation = useTranslations("Header");
  const [isOpen, setIsOpen] = useState(false);

  const close = () => setIsOpen(false);

  const navLinks = (
    <nav className="flex w-full flex-col items-center justify-start gap-2">
      <Link
        href="/dashboard"
        onClick={close}
        className="app-sidebar-link flex w-full cursor-pointer items-center rounded-lg border-2 border-[#f4f3f8] bg-[#fefefe] px-4 py-1 shadow-lg transition-all duration-300 hover:shadow-none"
      >
        <Icon name="home" size={18} color="#6a7285" className="app-sidebar-icon mr-2" />
        <span className="app-sidebar-text mr-2 text-[#6a7285]">{translation("home")}</span>
      </Link>

      <Link
        href="/glossary"
        onClick={close}
        className="app-sidebar-link flex w-full cursor-pointer items-center rounded-lg border-2 border-[#f4f3f8] bg-[#fefefe] px-4 py-1 shadow-lg transition-all duration-300 hover:shadow-none"
      >
        <Icon name="glossary" size={18} color="#6a7285" className="app-sidebar-icon mr-2" />
        <span className="app-sidebar-text mr-2 text-[#6a7285]">{translation("glossary")}</span>
      </Link>

      <Link
        href="/practice"
        onClick={close}
        className="app-sidebar-link flex w-full cursor-pointer items-center rounded-lg border-2 border-[#f4f3f8] bg-[#fefefe] px-4 py-1 shadow-lg transition-all duration-300 hover:shadow-none"
      >
        <Icon name="practice" size={18} color="#6a7285" className="app-sidebar-icon mr-2" />
        <span className="app-sidebar-text mr-2 text-[#6a7285]">{translation("practice")}</span>
      </Link>

      <Link
        href="/levels"
        onClick={close}
        className="app-sidebar-link flex w-full cursor-pointer items-center rounded-lg border-2 border-[#f4f3f8] bg-[#fefefe] px-4 py-1 shadow-lg transition-all duration-300 hover:shadow-none"
      >
        <Icon name="levels" size={18} color="#6a7285" className="app-sidebar-icon mr-2" />
        <span className="app-sidebar-text mr-2 text-[#6a7285]">{translation("levels")}</span>
      </Link>

      <Link
        href="/settings"
        onClick={close}
        className="app-sidebar-link flex w-full cursor-pointer items-center rounded-lg border-2 border-[#f4f3f8] bg-[#fefefe] px-4 py-1 shadow-lg transition-all duration-300 hover:shadow-none"
      >
        <Icon name="settings" size={18} color="#6a7285" className="app-sidebar-icon mr-2" />
        <span className="app-sidebar-text mr-2 text-[#6a7285]">{translation("settings")}</span>
      </Link>
    </nav>
  );

  return (
    <>
      <header
        className={cn(
          "hidden min-h-screen w-[300px] flex-col items-start gap-2 rounded-tl-lg rounded-bl-lg bg-[#fefefe] p-3 sm:p-4 md:flex md:p-5",
          className,
        )}
        style={{ background: "var(--sidebar-bg)" }}
      >
        <div className="app-sidebar-logo">
          <IconLogoMain />
        </div>

        <UserName
          userName={userName}
          className="w-full rounded-lg border-2 border-[#f4f3f8] bg-[var(--input-bg)] px-4 py-1 text-center tracking-wider text-[var(--text-main)] shadow-lg"
        />

        {navLinks}
      </header>

      <div className="relative md:hidden">
        <div
          onClick={close}
          className={cn(
            "fixed inset-0 z-40 bg-black transition-opacity duration-500 ease-in-out",
            isOpen ? "pointer-events-auto opacity-40" : "pointer-events-none opacity-0",
          )}
        />

        <header
          className="relative z-50 flex items-center justify-between rounded-t-lg p-3"
          style={{ background: "var(--sidebar-bg)" }}
        >
          <IconLogoMain />

          <button
            type="button"
            onClick={() => setIsOpen((value) => !value)}
            className="flex h-8 w-8 flex-col items-center justify-center gap-[5px] p-1"
          >
            <span
              className={cn(
                "block h-0.5 w-5 rounded bg-[#6a7285] transition-all duration-300 ease-in-out",
                isOpen && "translate-y-[7px] rotate-45",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 rounded bg-[#6a7285] transition-all duration-300 ease-in-out",
                isOpen && "opacity-0",
              )}
            />
            <span
              className={cn(
                "block h-0.5 w-5 rounded bg-[#6a7285] transition-all duration-300 ease-in-out",
                isOpen && "-translate-y-[7px] -rotate-45",
              )}
            />
          </button>
        </header>

        <div
          className={cn(
            "absolute right-0 left-0 z-50 overflow-hidden rounded-b-lg transition-all duration-500 ease-in-out",
            isOpen ? "max-h-[700px] opacity-100" : "max-h-0 opacity-0",
          )}
          style={{ background: "var(--sidebar-bg)" }}
        >
          <div className="flex flex-col items-center gap-4 p-6 pb-8">
            <UserName
              userName={userName}
              className="w-full rounded-lg border-2 border-[#f4f3f8] bg-[var(--input-bg)] px-4 py-1 text-center tracking-wider text-[var(--text-main)] shadow-lg"
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
