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
      <Typography.Text style={{ fontSize: "20px" }}>Lesson {lessonNumber}.</Typography.Text>
      <Typography.Text style={{ fontSize: "20px" }}>{topic}</Typography.Text>
    </div>
  );
};
