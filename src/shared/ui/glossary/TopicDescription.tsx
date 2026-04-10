import { Typography } from "antd";

import { cn } from "../../lib";

import { Topic } from "./Topic";

type Props = {
  topic: Topic;
  className?: string;
};

export const TopicDescription = ({ topic, className }: Props) => {
  return (
    <div
      className={cn(
        "mt-6 rounded-xl border border-[var(--card-border)] bg-[var(--card-bg)] p-4 shadow-[var(--card-shadow)]",
        className,
      )}
    >
      <Typography.Title level={3} className="!text-[var(--text-main)]">
        {topic.title}
      </Typography.Title>

      <div
        dangerouslySetInnerHTML={{ __html: topic.description }}
        className="mb-4 text-[var(--text-main)]"
      />

      <pre className="overflow-auto rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] p-4">
        <code className="text-[var(--text-main)]">{topic.example}</code>
      </pre>
    </div>
  );
};
