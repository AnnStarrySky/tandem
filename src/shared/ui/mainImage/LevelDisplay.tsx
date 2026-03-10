import React from "react";
import { cn } from "../../lib";
import { IconLogo } from "../icon";

type Props = {
  levelNumber: number;
  className?: string;
};

export const LevelDisplay = ({ levelNumber, className }: Props) => {
  return (
    <div
      className={cn(
        "align-center absolute top-[30%] right-[0%] flex justify-center rounded-full px-4 py-1 shadow-xl",
        className,
      )}
    >
      <IconLogo size={23} />
      <span>lv.{levelNumber}</span>
    </div>
  );
};
