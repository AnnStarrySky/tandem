"use client";

import { useEffect, useState } from "react";

import { BaseBtn } from "@shared/ui/button";
import { Typography } from "antd";
import { useTranslations, useLocale } from "next-intl";

import { TopicList, TopicDescription, Topic } from "@/src/shared/ui/glossary";
import { ServerError } from "@/src/widgets/errors";

import Loading from "../../loading";

import type { ServerErrorInfo } from "@shared/types/";

export default function GlossaryPage() {
  const translate = useTranslations("Glossary");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);

  const locale = useLocale();
  const [topics, setTopics] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState<ServerErrorInfo | null>(null);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch(`/api/${locale}/glossary`, {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
      });

      if (response.ok) {
        setTopics(await response.json());
      } else {
        setError({ codeNumber: response.status, errorMessage: response.statusText });
      }
      setLoading(false);
    }
    fetchData();
  }, [locale]);

  if (isLoading) {
    return <Loading />;
  } else if (error) {
    return <ServerError serverErrorInfo={error} />;
  }
  return (
    <div>
      <div className="flex items-center justify-between">
        <Typography.Title
          level={2}
          style={{ margin: 0, marginBottom: 20, color: "var(--text-main)" }}
        >
          {translate("title")}
        </Typography.Title>
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
