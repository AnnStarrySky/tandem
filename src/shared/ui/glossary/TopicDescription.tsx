import { Typography } from "antd";
import { cn } from "../../lib";
import { Topic } from "./Topic";

type Props = {
  topic: Topic;
  lang: "en" | "ru";
  className?: string;
};

export const TopicDescription = ({ topic, lang, className }: Props) => {
  return (
    <div
      className={cn(
        "mt-6 rounded-lg border-[#6a7285] p-4 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]",
        className,
      )}
    >
      <Typography.Title level={3}>{topic.title[lang]}</Typography.Title>

      <div dangerouslySetInnerHTML={{ __html: topic.description[lang] }} className="mb-4" />

      <pre className="overflow-auto rounded-lg bg-[#f4f3f8] p-4">
        <code>{topic.example[lang]}</code>
      </pre>
    </div>
  );
};
