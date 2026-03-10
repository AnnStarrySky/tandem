import React from "react";
import { cn } from "@/src/shared/lib";
import { Typography } from "antd";

type Props = {
  score: number;
  className?: string;
};

export const TotalScore = ({ score, className }: Props) => {
  return (
    <div
      className={cn(
        "flex flex-1 justify-center border-r border-r-[1px] border-[#f4f3f8] p-2",
        className,
      )}
    >
      <Typography.Text style={{ fontSize: "18px" }}>XP: {score}</Typography.Text>
    </div>
  );
};
