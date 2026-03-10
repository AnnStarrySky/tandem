import React from "react";
import { cn } from "../../lib";
import { Typography } from "antd";

type Props = {
  lessonNumber: number;
  topic: string;
  className?: string;
};

export const LessonWrapper = ({ lessonNumber, topic, className }: Props) => {
  return (
    <div className={cn("flex gap-1", className)}>
      <Typography></Typography>
      <p className="">Lesson {lessonNumber}.</p>
      <p className="">{topic}</p>
    </div>
  );
};
