import { cn } from "../../lib";

import { Topic } from "./Topic";

type Props = {
  topics: Topic[];
  onSelect: (topic: Topic) => void;
  className?: string;
};

export const TopicList = ({ topics, onSelect, className }: Props) => {
  return (
    <ul className={cn("flex flex-wrap", className)}>
      {topics.map((topic) => (
        <li
          key={topic.id}
          className={cn(
            "w-[33.3%] cursor-pointer rounded-lg border-[1px] border-[#f4f3f8] p-2 shadow-lg hover:shadow-none",
          )}
          onClick={() => onSelect(topic)}
        >
          {topic.title}
        </li>
      ))}
    </ul>
  );
};
