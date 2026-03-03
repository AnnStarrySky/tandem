import React from "react";
import { cn } from "../../lib";

type Props = {
  children: string;
  className?: string;
};

export const SectionTitle = ({ children, className }: Props) => (
  <div className={cn("flex items-center", className)}>
    <h2 className="text-[24px] uppercase">{children}</h2>
  </div>
);
