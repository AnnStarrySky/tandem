import { cn } from "../../lib";

import { Topic } from "./Topic";

type Props = {
  topics: Topic[];
  onSelect: (topic: Topic) => void;
  className?: string;
};

export const TopicList = ({ topics, onSelect, className }: Props) => {
  return (
    <ul className={cn("grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3", className)}>
      {topics.map((topic) => (
        <li
          key={topic.id}
          className={cn(
            "cursor-pointer rounded-lg border border-[var(--card-border)] bg-[var(--input-bg)] p-4 shadow-[0px_0px_20px_0px_rgba(0,0,0,0.1)]",
            "transition-all duration-300 ease-in-out hover:border-[var(--text-main)] hover:shadow-none",
          )}
          onClick={() => onSelect(topic)}
        >
          <div className="text-sm font-medium text-[var(--text-main)]">{topic.title}</div>
        </li>
      ))}
    </ul>
  );
};
