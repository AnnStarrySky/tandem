import React from "react";
import { cn } from "../../lib";

type Props = {
  progress: number;
  className?: string;
};

export const ProgressBar = ({ progress, className }: Props) => {
  return (
    <div className={cn("w-full", className)}>
      <div className="mb-2 h-3 w-full rounded-full bg-[#f4f3f8] shadow-lg">
        <div
          className="h-3 rounded-full bg-gradient-to-r from-[#13b2f6] to-[#84f59b]"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <span>{progress} % completed</span>
    </div>
  );
};
