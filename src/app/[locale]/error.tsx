"use client";

import Image from "next/image";

function Error(statusCode?: { codeNumber: number; message?: string }) {
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
        {statusCode
          ? `An error "${statusCode.codeNumber}" occurred on server`
          : "An error occurred on client"}
      </h1>
      {statusCode && statusCode.message ? <p className="text-center">{statusCode.message}</p> : ""}
    </div>
  );
}

export default Error;
