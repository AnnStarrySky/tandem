import React from "react";
import Image from "next/image";

type Props = {
  typeCat: string;
  alt?: string;
};

export const MainImage = ({ typeCat, alt = "Image" }: Props) => {
  const src = `/${typeCat}.png`;
  return (
    <div className="relative w-full">
      <Image
        src={src}
        alt={alt}
        width={500}
        height={500}
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
};
