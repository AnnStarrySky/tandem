import Link from "next/link";

import { useTranslations, useLocale } from "next-intl";

import { cn } from "@/src/shared/lib";
import { Icon, IconLogoMain } from "@/src/shared/ui/icon";
import { UserName } from "@/src/shared/ui";

type HeaderProps = {
  className?: string;
};

export const Header = ({ className }: HeaderProps) => {
  const translation = useTranslations("Header");
  const locale = useLocale();
  return (
    <header
      className={cn(
        "flex min-h-screen w-[300px] flex-col items-start gap-2 rounded-tl-lg bg-[#fefefe] p-3 sm:p-4 md:p-5",
        className,
      )}
      style={{ background: "var(--sidebar-bg)" }}
    >
      <div className="app-sidebar-logo">
        <IconLogoMain />
      </div>
      <UserName
        userName="Anna"
        className="w-full rounded-lg border-[2px] border-[#f4f3f8] bg-[var(--input-bg)] px-4 py-1 text-center tracking-wider text-[var(--text-main)] shadow-lg"
      />
      <nav className="app-sidebar-nav flex w-full flex-col items-center justify-start gap-2">
        <Link
          href={`/${locale}/dashboard`}
          className="app-sidebar-link flex w-full cursor-pointer items-center rounded-lg border-[2px] border-[#f4f3f8] bg-[#fefefe] px-4 py-1 shadow-lg transition-all duration-300 hover:shadow-none"
        >
          <Icon name="home" size={18} color="#6a7285" className="app-sidebar-icon mr-2" />
          <span className="app-sidebar-text mr-2 text-[#6a7285]">{translation("home")}</span>
        </Link>

        <Link
          href={`/${locale}/glossary`}
          className="app-sidebar-link flex w-full cursor-pointer items-center rounded-lg border-[2px] border-[#f4f3f8] bg-[#fefefe] px-4 py-1 shadow-lg transition-all duration-300 hover:shadow-none"
        >
          <Icon name="glossary" size={18} color="#6a7285" className="app-sidebar-icon mr-2" />
          <span className="app-sidebar-text mr-2 text-[#6a7285]">{translation("glossary")}</span>
        </Link>
        <Link
          href={`/${locale}/settings`}
          className="app-sidebar-link flex w-full cursor-pointer items-center rounded-lg border-[2px] border-[#f4f3f8] bg-[#fefefe] px-4 py-1 shadow-lg transition-all duration-300 hover:shadow-none"
        >
          <Icon name="settings" size={18} color="#6a7285" className="app-sidebar-icon mr-2" />
          <span className="app-sidebar-text mr-2 text-[#6a7285]">{translation("settings")}</span>
        </Link>
      </nav>
    </header>
  );
};
