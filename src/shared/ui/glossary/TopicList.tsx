import { cn } from "../../lib";
import { Topic } from "../../types/TopicType";

type Props = {
  topics: Topic[];
  lang: "en" | "ru";
  onSelect: (topic: Topic) => void;
  className?: string;
};

export const TopicList = ({ topics, lang, onSelect, className }: Props) => {
  return (
    <ul className={cn("flex flex-col", className)}>
      {topics.map((topic) => (
        <li
          key={topic.id}
          className={cn(
            "cursor-pointer rounded-lg border-[1px] border-[#f4f3f8] p-2 shadow-lg hover:shadow-none",
          )}
          onClick={() => onSelect(topic)}
        >
          {topic.title[lang]}
        </li>
      ))}
    </ul>
  );
};
