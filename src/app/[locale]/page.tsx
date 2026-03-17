"use client";
import { useTranslations } from "next-intl";
import { IconLogoMain } from "@/src/shared/ui/icon";
import { BaseBtn } from "@/src/shared/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ChangeLanguage from "@/src/shared/ui/СhangeLanguage";
import { useLocale } from "next-intl";

export default function Home() {
  const translation = useTranslations("HomePage");
  const router = useRouter();
  const locale = useLocale();
  const handleStart = () => {
    router.push(`/${locale}/dashboard`);
  };
  return (
    <div className="flex h-[50vh] w-[50vw] flex-col items-center justify-center gap-10 rounded-lg p-10 shadow-lg">
      <IconLogoMain />
      <p className="text-center">
        {translation("descriptionLine1")}
        <br></br>
        {translation("descriptionLine2")}
      </p>
      <div className="flex w-full items-center justify-center gap-5">
        <div className="w-[5vw]">{translation("createdBy")}</div>
        <Link
          className="creators-link rounded-lg shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
          href="https://github.com/angelinavakkasova"
          target="_blank"
        >
          angelinavakkasova
        </Link>
        <Link
          className="creators-link rounded-lg shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
          href="https://github.com/annstarrysky"
          target="_blank"
        >
          annstarrysky
        </Link>
        <Link
          className="creators-link rounded-lg shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]"
          href="https://github.com/yuriyli"
          target="_blank"
        >
          yuriyli
        </Link>
      </div>
      <BaseBtn variant="primary" className="w-[200px]" onClick={handleStart}>
        {translation("start")}
      </BaseBtn>
      <ChangeLanguage />
    </div>
  );
}
