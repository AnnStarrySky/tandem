import { Typography } from "antd";

import { cn } from "@/src/shared/lib";

type Props = {
  score: number;
  className?: string;
};

export const TotalScore = ({ score, className }: Props) => {
  return (
    <div
      className={cn(
        "flex w-full flex-1 items-center justify-center border-b border-[var(--card-border)] p-2 lg:border-r lg:border-b-0",
        className,
      )}
    >
      <Typography.Text style={{ fontSize: "18px" }}>XP: {score}</Typography.Text>
    </div>
  );
};
