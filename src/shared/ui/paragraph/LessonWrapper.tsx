import React from "react";
import { cn } from "../../lib";

type Props = {
  lessonNumber: number;
  topic: string;
  className?: string;
};

export const LessonWrapper = ({ lessonNumber, topic, className }: Props) => {
  return (
    <div className={cn("flex gap-1", className)}>
      <p className="">Lesson {lessonNumber}.</p>
      <p className="">{topic}</p>
    </div>
  );
};
