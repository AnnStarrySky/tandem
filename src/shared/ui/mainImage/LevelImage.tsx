import React from "react";
import Image from "next/image";
import { LevelDisplay } from "./LevelDisplay";

type Props = {
  typeCat: string;
  alt?: string;
};

export const LevelImage = ({ typeCat, alt = "Image" }: Props) => {
  const src = `/${typeCat}.png`;
  return (
    <div className="relative w-full">
      <Image
        src={src}
        alt={alt}
        width={380}
        height={380}
        style={{ width: "100%", height: "auto" }}
      />
      <LevelDisplay levelNumber={5} />
    </div>
  );
};
