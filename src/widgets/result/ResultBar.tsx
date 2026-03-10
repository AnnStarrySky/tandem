import { cn } from "@/src/shared/lib";
import { RatingScore } from "./RatingScore";
import { TotalScore } from "./TotalScore";
import { CompletedTasks } from "./CompletedTasks";

type Props = {
  className?: string;
};

export const ResultBar = ({ className }: Props) => {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border-[1px] border-[#f4f3f8] shadow-lg",
        className,
      )}
    >
      <TotalScore score={520} />
      <RatingScore rating={3} />
      <CompletedTasks tasks={25} />
    </div>
  );
};
