import { cn } from "../../lib";
import { Typography } from "antd";
import { useTranslations } from "next-intl";

type Props = {
  lessonNumber: number;
  topicKey: string;
  className?: string;
};

export const LessonWrapper = ({ lessonNumber, topicKey, className }: Props) => {
  const translation = useTranslations("Dashboard");
  return (
    <div className={cn("flex gap-1", className)}>
      <Typography.Title level={3} style={{ fontSize: "20px", margin: 0 }}>
        {translation("lesson")} {lessonNumber}. {translation(`topics.${topicKey}`)}
      </Typography.Title>
    </div>
  );
};
