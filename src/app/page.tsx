"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { BaseBtn } from "@shared/ui/button";
import { IconLogoMain } from "@shared/ui/icon";

export default function Home(): React.JSX.Element {
  const router = useRouter();

  return (
    <main className="flex min-h-[100dvh] items-center justify-center px-4 py-8">
      <div className="flex max-w-[850px] flex-col items-center justify-center gap-10 rounded-lg p-10 shadow-lg">
        <IconLogoMain />

        <p className="text-center">
          Is a platform for beginner programmers. <br />
          It offers levels from easy to advanced, a glossary of terms, gamified practice, and skills
          for real-world work.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-5 text-center">
          <span>Created by:</span>

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

        <div className="flex flex-col items-center gap-4 sm:flex-row">
          <BaseBtn
            variant="primary"
            className="w-[200px]"
            onClick={() => router.push("/auth/login")}
          >
            Start
          </BaseBtn>

          <BaseBtn
            variant="outline"
            className="w-[200px]"
            onClick={() => router.push("/auth/register")}
          >
            Register
          </BaseBtn>
        </div>
      </div>
    </main>
  );
}
