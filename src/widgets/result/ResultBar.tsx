"use client";

import { useEffect, useState } from "react";

import { getTaskStats, getUserScore } from "@/entities/practice";
import { cn } from "@/shared/lib";

import { CompletedTasks } from "./CompletedTasks";
import { RatingScore } from "./RatingScore";
import { TotalScore } from "./TotalScore";

type Props = {
  className?: string;
};

export const ResultBar = ({ className }: Props) => {
  const [completedTasks, setCompletedTasks] = useState(0);
  const [score, setScore] = useState(0);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    getTaskStats()
      .then((stats) => setCompletedTasks(stats.completedTasks))
      .catch(() => {});

    getUserScore()
      .then(({ score: s, userRating }) => {
        setScore(s);
        setRating(userRating);
      })
      .catch(() => {});
  }, []);

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
