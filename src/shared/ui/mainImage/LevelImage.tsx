"use client";

import Image from "next/image";
import { useTheme } from "@shared/lib/theme";
import { LevelDisplay } from "./LevelDisplay";

type Props = {
  typeCat: string;
  alt?: string;
  levelNumber?: number;
  size?: number;
  translateY?: number;
};

export const LevelImage = ({
  typeCat,
  alt = "Image",
  levelNumber,
  size = 220,
  translateY = 0,
}: Props) => {
  const { theme } = useTheme();
  const src = theme === "dark" ? `/${typeCat}-white.png` : `/${typeCat}.png`;

  return (
    <div
      className="relative flex items-center justify-center rounded-full border-[2px] border-[var(--card-border)] bg-[var(--input-bg)]"
      style={{ width: size, height: size }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 150px, 220px"
        className="object-cover"
        style={{ transform: `translateY(${translateY}px)` }}
      />
      {levelNumber !== undefined && <LevelDisplay levelNumber={levelNumber} />}
    </div>
  );
};
