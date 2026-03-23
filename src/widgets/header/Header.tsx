import Link from "next/link";

import { useTranslations, useLocale } from "next-intl";

import { cn } from "@/src/shared/lib";
import { Icon, IconLogoMain } from "@/src/shared/ui/icon";

type HeaderProps = {
  className?: string;
};

export const Header = ({ className }: HeaderProps) => {
  const translation = useTranslations("Header");
  const locale = useLocale();
  return (
    <header
      className={cn(
        "flex h-screen w-[300px] flex-col items-start gap-4 rounded-tl-lg bg-white p-5",
        className,
      )}
    >
      <IconLogoMain />
      <nav className="flex w-full flex-col items-center justify-start">
        <Link
          href={`/${locale}/dashboard`}
          className="flex w-full cursor-pointer items-center rounded-lg border-[2px] border-transparent bg-white px-4 py-1 transition-all duration-300 hover:border-[2px] hover:border-[#f4f3f8] hover:shadow-lg"
        >
          <Icon name="home" size={18} color="#6a7285" className="mr-2" />
          <span className="mr-2 text-[#6a7285]">{translation("home")}</span>
        </Link>
        <Link
          href={`/${locale}/glossary`}
          className="flex w-full cursor-pointer items-center rounded-lg border-[2px] border-transparent bg-white px-4 py-1 transition-all duration-300 hover:border-[2px] hover:border-[#f4f3f8] hover:shadow-lg"
        >
          <Icon name="glossary" size={18} color="#6a7285" className="mr-2" />
          <span className="mr-2 text-[#6a7285]">{translation("glossary")}</span>
        </Link>
        <Link
          href={`/${locale}/practice`}
          className="flex w-full cursor-pointer items-center rounded-lg border-[2px] border-transparent bg-white px-4 py-1 transition-all duration-300 hover:border-[2px] hover:border-[#f4f3f8] hover:shadow-lg"
        >
          <Icon name="practice" size={18} color="#6a7285" className="mr-2" />
          <span className="mr-2 text-[#6a7285]">{translation("practice")}</span>
        </Link>
        <Link
          href={`/${locale}/settings`}
          className="flex w-full cursor-pointer items-center rounded-lg border-[2px] border-transparent bg-white px-4 py-1 transition-all duration-300 hover:border-[2px] hover:border-[#f4f3f8] hover:shadow-lg"
        >
          <Icon name="settings" size={18} color="#6a7285" className="mr-2" />
          <span className="mr-2 text-[#6a7285]">{translation("settings")}</span>
        </Link>
      </nav>
    </header>
  );
};
