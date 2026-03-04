import React from "react";
import Image from "next/image";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

type Props = {
  src: string | StaticImport;
  alt?: string;
};

export const MainImage = ({ src, alt = "Image" }: Props) => {
  return (
    <div className="w-full">
      <Image src={src} alt={alt} style={{ width: "100%", height: "auto" }} />
    </div>
  );
};
