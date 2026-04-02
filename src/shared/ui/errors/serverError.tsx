"use client";

import Image from "next/image";

import type { ServerErrorInfo } from "@shared/types/";

export default function ServerError(serverErrorInfo: ServerErrorInfo) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-8">
      <Image
        src="/sad.png"
        alt="CodeCat"
        width={420}
        height={420}
        priority
        className="relative z-10 h-auto w-auto object-contain opacity-95 drop-shadow-[0_24px_48px_rgba(0,0,0,0.20)]"
        style={{
          maskImage: "radial-gradient(circle at center, black 70%, transparent 98%)",
          WebkitMaskImage: "radial-gradient(circle at center, black 70%, transparent 98%)",
        }}
      />
      <h1 className="text-center text-4xl font-semibold">
        {serverErrorInfo
          ? `An error "${serverErrorInfo.codeNumber}" occurred on server`
          : "An error occurred on client"}
      </h1>
      {serverErrorInfo?.errorMessage ? (
        <p className="text-center">{serverErrorInfo.errorMessage}</p>
      ) : (
        ""
      )}
    </div>
  );
}
