"use client";

import { Typography } from "antd";
import { cn } from "@/src/shared/lib";

type Props = {
  lessonNumber: number;
  title: string;
  completed?: boolean;
  className?: string;
};

export const LessonCard = ({ lessonNumber, title, completed, className }: Props) => {
  return (
    <div
      className={cn(
        "relative flex flex-col gap-2 rounded-lg border border-[#f4f3f8] bg-[#fefefe] p-4 shadow-[0px_0px_10px_0px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      <Typography.Text style={{ fontSize: "12px", color: "#6a7285" }}>
        Lesson {lessonNumber}
      </Typography.Text>
      <Typography.Text style={{ fontSize: "15px", color: "var(--text-main)", fontWeight: 500 }}>
        {title}
      </Typography.Text>

      {completed && (
        <div
          className="absolute top-0 right-0 h-full"
          style={{
            width: "5%",
            backgroundColor: "#A7F3D0",
          }}
        />
      )}
    </div>
  );
};
