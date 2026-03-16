"use client";
import { cn } from "../../lib";
import { IconLogo } from "./IconLogo";

type Props = {
  className?: string;
};

export const IconLogoMain = ({ className }: Props) => {
  return (
    <div className={cn("flex items-center self-center", className)}>
      <IconLogo />
      <span className="text-[24px] font-bold">CodeCat</span>
    </div>
  );
};
