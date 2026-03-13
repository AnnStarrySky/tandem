"use client";
import { useTranslations } from "next-intl";
import { IconLogoMain } from "../shared/ui/icon";
import { BaseBtn } from "../shared/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const translation = useTranslations("HomePage");
  const router = useRouter();
  return (
    <div className="flex max-w-[850px] flex-col items-center justify-center gap-10 rounded-lg p-10 shadow-lg">
      <IconLogoMain />
      <p className="text-center">
        Is a platform for beginner programmers. <br></br>It offers levels from easy to advanced, a
        glossary of terms, gamified practice, and skills for real-world work.
      </p>
      <div className="flex items-center gap-5">
        Created by:
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
      <BaseBtn variant="primary" className="w-[200]" onClick={() => router.push("/dashboard")}>
        Start
      </BaseBtn>
    </div>
  );
}
