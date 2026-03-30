import { cn } from "@/src/shared/lib";

import { CompletedTasks } from "./CompletedTasks";
import { RatingScore } from "./RatingScore";
import { TotalScore } from "./TotalScore";

type Props = {
  className?: string;
};

export const ResultBar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] lg:flex-row",
        className,
      )}
    >
      <TotalScore score={0} />
      <RatingScore rating={1} />
      <CompletedTasks tasks={0} />
    </div>
  );
};
