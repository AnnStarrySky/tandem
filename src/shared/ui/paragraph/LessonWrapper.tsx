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
      <Typography.Title level={3} style={{ fontSize: "20px", margin: 0 }}>
        Lesson {lessonNumber}. {topic}
      </Typography.Title>
    </div>
  );
};
