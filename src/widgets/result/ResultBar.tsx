"use client";

import { useEffect, useState } from "react";

import { cn } from "@/shared/lib";

import { CompletedTasks } from "./CompletedTasks";
import { RatingScore } from "./RatingScore";
import { TotalScore } from "./TotalScore";

type Props = {
  className?: string;
};

export const ResultBar = ({ className }: Props) => {
  const [completedCount, setCompletedCount] = useState(0);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch("/api/statistics/task");
      const result = await response.json();

      if (response.ok && Array.isArray(result)) {
        const count = result.filter((t: { correctAnswers: number; wrongAnswers: number }) => {
          const total = t.correctAnswers + t.wrongAnswers;
          return total > 0 && t.correctAnswers / total >= 0.7;
        }).length;
        setCompletedCount(count);
      }
    }
    fetchData();
  }, []);

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-between rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)] lg:flex-row",
        className,
      )}
    >
      <TotalScore score={0} />
      <RatingScore rating={1} />
      <CompletedTasks tasks={completedCount} />
    </div>
  );
};
