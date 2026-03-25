"use client";

import { useState } from "react";
import { Typography } from "antd";
import { useTranslations, useMessages } from "next-intl";

import { TopicList, TopicDescription, Topic } from "@/src/shared/ui/glossary";
import { BaseBtn } from "@/src/shared/ui/button";

export default function GlossaryPage() {
  const translate = useTranslations("Glossary");
  const messages = useMessages();
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const topics: Topic[] = messages.Glossary.topics;

  return (
    <div>
      <div className="flex items-center justify-between">
        <Typography.Title level={2}>{translate("title")}</Typography.Title>
      </div>

      {selectedTopic ? (
        <div>
          <BaseBtn
            variant="primary"
            className="mt-4 mb-4 py-3"
            onClick={() => setSelectedTopic(null)}
          >
            {translate("btnBackTopic")}
          </BaseBtn>
          <TopicDescription topic={selectedTopic} />
        </div>
      ) : (
        <TopicList topics={topics} onSelect={setSelectedTopic} className="" />
      )}
    </div>
  );
}
