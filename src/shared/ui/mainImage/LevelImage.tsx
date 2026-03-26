import Image from "next/image";

import { LevelDisplay } from "./LevelDisplay";

type Props = {
  typeCat: string;
  alt?: string;
};

export const LevelImage = ({ typeCat, alt = "Image" }: Props) => {
  const src = `/${typeCat}.png`;
  return (
    <div className="relative flex h-[220px] w-[220px] items-center justify-center rounded-full border-[2px] border-[#f4f3f8] bg-[#fefefe]">
      <Image src={src} alt={alt} fill className="object-cover" />
      <LevelDisplay levelNumber={5} />
    </div>
  );
};
