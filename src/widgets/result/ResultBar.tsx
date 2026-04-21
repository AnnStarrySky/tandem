"use client";

import { cn } from "@/shared/lib";

import { CompletedTasks } from "./CompletedTasks";
import { RatingScore } from "./RatingScore";
import { TotalScore } from "./TotalScore";

type Props = {
  score: number;
  rating: number;
  completedTasks: number;
  className?: string;
};

export const ResultBar = ({ score, rating, completedTasks, className = "" }: Props) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] lg:flex-row",
        className,
      )}
    >
      <TotalScore score={score} />
      <RatingScore rating={rating} />
      <CompletedTasks tasks={completedTasks} />
    </div>
  );
};
