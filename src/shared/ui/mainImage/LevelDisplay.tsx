import { useTranslations } from "next-intl";

import { cn } from "../../lib";
import { IconLogo } from "../icon";

type Props = {
  levelNumber: number;
  className?: string;
};

export const LevelDisplay = ({ levelNumber, className }: Props) => {
  const translation = useTranslations("Dashboard");
  return (
    <div
      className={cn(
        "absolute top-[40%] right-[-10%] flex items-center justify-center rounded-full bg-[#fefefe] px-2 py-1 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      <IconLogo size={23} />
      <span>
        {translation("levelcat")}
        {levelNumber}
      </span>
    </div>
  );
};
