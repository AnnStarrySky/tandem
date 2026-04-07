import { useTranslations } from "next-intl";

import { cn } from "../../lib";

type Props = {
  lessonNumber: number;
  topicKey: string;
  className?: string;
};

export const LessonWrapper = ({ lessonNumber, topicKey, className }: Props) => {
  const translation = useTranslations("Dashboard");
  return (
    <div className={cn("flex gap-1", className)}>
      <h3 className="m-0 text-[20px] font-medium">
        {translation("lesson")} {lessonNumber}. {translation(`topics.${topicKey}`)}
      </h3>
    </div>
  );
};
