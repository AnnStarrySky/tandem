"use client";

import Image from "next/image";
import { useTheme } from "@shared/lib/theme";
import { LevelDisplay } from "./LevelDisplay";

type Props = {
  typeCat: string;
  alt?: string;
};

export const LevelImage = ({ typeCat, alt = "Image" }: Props) => {
  const { theme } = useTheme();
  <div className="h-[220px] w-[220px] rounded-full bg-[var(--input-bg)]" />;
  const src = theme === "dark" ? `/${typeCat}-white.png` : `/${typeCat}.png`;

  return (
    <div className="relative flex h-[220px] w-[220px] items-center justify-center rounded-full border-[2px] border-[var(--card-border)] bg-[var(--input-bg)]">
      <Image src={src} alt={alt} fill className="object-cover" />
      <LevelDisplay levelNumber={1} />
    </div>
  );
};
