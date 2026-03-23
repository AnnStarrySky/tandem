"use client";

import { useState } from "react";
import { Typography } from "antd";
import { useTranslations, useMessages } from "next-intl";

import { TopicList, TopicDescription, Topic } from "@/src/shared/ui/glossary";

export default function GlossaryPage() {
  const t = useTranslations("Glossary");
  const messages = useMessages();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const topics: Topic[] = messages.Glossary.topics;

  return (
    <div>
      <div className="flex items-center justify-between">
        <Typography.Title level={2}>{t("title")}</Typography.Title>
      </div>

      {topics.length > 0 && <TopicList topics={topics} onSelect={setSelectedTopic} className="" />}

      {selectedTopic && <TopicDescription topic={selectedTopic} />}
    </div>
  );
}
