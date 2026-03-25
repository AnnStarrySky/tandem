"use client";

import { useState } from "react";
import { Typography } from "antd";
import { useMessages } from "next-intl";
import { cn } from "@/src/shared/lib";
import { LessonCard } from "./LessonCard";
import { BaseBtn } from "@/src/shared/ui/button";
import { Icon } from "@/src/shared/ui/button";

const PAGE_SIZE = 9;

type Topic = {
  id: number;
  title: string;
  completed?: boolean;
};

export const LessonBoard = ({ className }: { className?: string }) => {
  const [page, setPage] = useState(1);
  const messages = useMessages();

  const completedLessonIds = [1, 3, 5];

  const topics: Topic[] = (messages.Glossary.topics as Topic[]).map((topic) => ({
    ...topic,
    completed: completedLessonIds.includes(topic.id),
  }));

  const totalPages = Math.ceil(topics.length / PAGE_SIZE);
  const start = (page - 1) * PAGE_SIZE;
  const currentTopics = topics.slice(start, start + PAGE_SIZE);

  return (
    <div className={cn("flex flex-col gap-10", className)}>
      <Typography.Title level={3} style={{ margin: 0, color: "var(--text-main)" }}>
        Study Plan
      </Typography.Title>

      <div className="grid grid-cols-3 gap-6">
        {currentTopics.map((topic) => (
          <LessonCard
            key={topic.id}
            lessonNumber={topic.id}
            title={topic.title}
            completed={topic.completed}
          />
        ))}
      </div>

      <div className="mt-4 flex items-center justify-center gap-3">
        <BaseBtn
          variant="primary"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="flex h-8 w-8 items-center justify-center border border-[#f4f3f8] bg-[#fefefe] p-0 text-[#6a7285]"
        >
          <Icon name="leftArrow" size={12} color="#6a7285" />
        </BaseBtn>

        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <BaseBtn
            key={p}
            variant="primary"
            onClick={() => setPage(p)}
            className={cn(
              "h-8 w-8 p-0 text-sm",
              p === page
                ? "border-transparent bg-gradient-to-r from-[#13b2f6] to-[#84f59b] text-white"
                : "border border-[#f4f3f8] bg-[#fefefe] text-[#6a7285]",
            )}
          >
            {p}
          </BaseBtn>
        ))}

        <BaseBtn
          variant="primary"
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="flex h-8 w-8 items-center justify-center border border-[#f4f3f8] bg-[#fefefe] p-0 text-[#6a7285]"
        >
          <Icon name="rightArrow" size={12} color="#6a7285" />
        </BaseBtn>
      </div>
    </div>
  );
};
