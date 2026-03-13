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
        width={300}
        height={300}
        style={{ width: "80%", height: "auto", marginLeft: "auto" }}
      />
      <LevelDisplay levelNumber={5} />
    </div>
  );
};
